// Shared logic for Airbnb/Hospitable iCal proxy + Notion sync.
//
// Supports two feed shapes:
//   1. Hospitable per-property feeds (current): UID is a UUID @reservations.hospitable.com,
//      SUMMARY is "Guest Name (HMCODE)", DESCRIPTION carries structured fields
//      (Name, Reservation Code, Property, Phone, Email, Profile URL, Adults, Children).
//      DTSTART/DTEND are TZID-bound local times (America/Tijuana).
//   2. Raw Airbnb/VRBO/Booking ICS feeds (legacy fallback): SUMMARY "Reserved" /
//      "Not available", DESCRIPTION has /details/<CODE> URL, etc.
//
// We collapse times to date-only (YYYYMMDD) for calendar display — host workflow is
// per-day granularity and that keeps cross-channel formatting consistent.

const NOTION_VERSION = '2025-09-03';

export const LISTINGS = [
  { code: 'BDM', name: 'Baja Del Mar', envKey: 'AIRBNB_BDM_ICS_URL' },
  { code: 'SJDG', name: 'Jalisco', envKey: 'AIRBNB_JAL_ICS_URL' },
];

export async function fetchListingEvents(listing) {
  const url = process.env[listing.envKey];
  if (!url) throw new Error(`Missing env var: ${listing.envKey}`);
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Feed ${listing.code} ${res.status}`);
  const text = await res.text();
  return parseIcs(text).map((e) => ({ ...e, listing: listing.code, listingName: listing.name }));
}

// Detect channel from a Profile URL or freeform text. Returns lowercase token.
function detectChannel({ description, summary, uid }) {
  const profileMatch = /Profile:\s*https?:\/\/(?:www\.)?([a-z0-9.-]+)/i.exec(description || '');
  if (profileMatch) {
    const host = profileMatch[1].toLowerCase();
    if (host.includes('airbnb')) return 'airbnb';
    if (host.includes('vrbo') || host.includes('homeaway')) return 'vrbo';
    if (host.includes('booking')) return 'booking';
    if (host.includes('expedia')) return 'expedia';
  }
  // Reservation code heuristics (Airbnb codes start with H; VRBO numeric; Booking 10-digit)
  const code = /Reservation Code:\s*([A-Z0-9-]+)/i.exec(description || '');
  if (code) {
    if (/^H[A-Z0-9]{6,}$/i.test(code[1])) return 'airbnb';
  }
  // Freeform keyword scan as last resort (raw Airbnb/VRBO/Booking feeds)
  const blob = `${summary || ''} ${description || ''} ${uid || ''}`;
  const kw = /\b(airbnb|vrbo|booking\.com|booking|homeaway|expedia)\b/i.exec(blob);
  if (kw) return kw[1].toLowerCase().replace('.com', '').replace('homeaway', 'vrbo');
  return 'direct';
}

// Parse a multiline DESCRIPTION value (already unfolded + \\n decoded).
function parseDescriptionFields(desc) {
  const fields = {};
  if (!desc) return fields;
  // Hospitable encodes newlines as literal \n in the source ICS; after unfolding we
  // still have the escape sequence. Convert to real newlines for line-by-line parsing.
  const normalized = desc.replace(/\\n/g, '\n').replace(/\\,/g, ',').replace(/\\;/g, ';');
  for (const rawLine of normalized.split('\n')) {
    const line = rawLine.trim();
    if (!line) continue;
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const k = line.slice(0, idx).trim().toLowerCase();
    const v = line.slice(idx + 1).trim();
    if (!fields[k]) fields[k] = v;
  }
  return fields;
}

export function parseIcs(text) {
  const unfolded = (text || '').replace(/\r\n/g, '\n').replace(/\n[ \t]/g, '');
  const events = [];
  const re = /BEGIN:VEVENT([\s\S]*?)END:VEVENT/g;
  let m;
  while ((m = re.exec(unfolded))) {
    const block = m[1];
    try {
      const ev = parseEventBlock(block);
      if (ev) events.push(ev);
    } catch (err) {
      // Don't let one bad event tank the whole feed; surface via stderr for logs.
      console.error('parseIcs: skipping malformed VEVENT', err && err.message);
    }
  }
  return events;
}

function unescapeIcs(s) {
  if (!s) return s;
  return s
    .replace(/\\n/gi, '\n')
    .replace(/\\,/g, ',')
    .replace(/\\;/g, ';')
    .replace(/\\\\/g, '\\');
}

function parseEventBlock(block) {
  const get = (k) => {
    const r = new RegExp(`^${k}(?:;[^:\\n]*)?:(.+)$`, 'm').exec(block);
    return r ? r[1].trim() : null;
  };
  const start = get('DTSTART');
  const end = get('DTEND');
  if (!start || !end) return null;
  const summary = unescapeIcs(get('SUMMARY')) || '';
  const location = unescapeIcs(get('LOCATION')) || '';
  const uid = (get('UID') || `${start}-${end}@local`).trim();

  // DESCRIPTION can span folded lines; grab everything until the next top-level prop.
  const descRaw = (() => {
    const r = /^DESCRIPTION(?:;[^:\n]*)?:([\s\S]*?)(?=\n[A-Z][A-Z0-9-]*[:;]|\nEND:VEVENT)/m.exec(block);
    return r ? r[1].trim() : '';
  })();
  const fields = parseDescriptionFields(descRaw);

  // Reservation code: prefer DESCRIPTION, then SUMMARY paren, then /details/CODE URL.
  let reservationCode = fields['reservation code'] || null;
  if (!reservationCode) {
    const parenMatch = /\(([A-Z0-9]{6,})\)\s*$/.exec(summary);
    if (parenMatch) reservationCode = parenMatch[1];
  }
  if (!reservationCode) {
    const detailsMatch = /\/details\/([A-Z0-9]+)/.exec(descRaw);
    if (detailsMatch) reservationCode = detailsMatch[1];
  }

  // Guest name: DESCRIPTION "Name:" wins; fall back to SUMMARY prefix before "(".
  let guestName = fields['name'] || null;
  if (!guestName) {
    const beforeParen = /^(.+?)\s*\(/.exec(summary);
    if (beforeParen && !/reserved|not available|blocked/i.test(beforeParen[1])) {
      guestName = beforeParen[1].trim();
    }
  }
  if (!guestName) {
    const legacyGuest = /Guest(?:\s*name)?:\s*([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ .'-]+)/i.exec(descRaw);
    if (legacyGuest) guestName = legacyGuest[1].trim();
  }

  const phoneFull = fields['phone'] ? fields['phone'].replace(/[^\d]/g, '') : null;
  let phoneLast4 = phoneFull ? phoneFull.slice(-4) : null;
  if (!phoneLast4) {
    const legacyLast4 = /Last 4 Digits\)?:\s*(\d+)/.exec(descRaw);
    if (legacyLast4) phoneLast4 = legacyLast4[1];
  }

  const email = fields['email'] || null;
  const profileUrl = fields['profile'] || null;
  const propertyName = fields['property'] || null;
  const adults = fields['adults'] ? parseInt(fields['adults'], 10) : null;
  const children = fields['children'] ? parseInt(fields['children'], 10) : null;
  const infants = fields['infants'] ? parseInt(fields['infants'], 10) : null;

  const channel = detectChannel({ description: descRaw, summary, uid });

  // DTSTART/DTEND are TZID-bound local times when present (e.g. America/Tijuana).
  // We deliberately strip the time component — host workflow only cares about
  // calendar dates, and dropping HHMMSS keeps DST math out of scope.
  const dtStart = start.replace(/[^0-9]/g, '').slice(0, 8);
  const dtEnd = end.replace(/[^0-9]/g, '').slice(0, 8);
  if (!/^\d{8}$/.test(dtStart) || !/^\d{8}$/.test(dtEnd)) return null;

  return {
    dtStart,
    dtEnd,
    summary,
    description: descRaw,
    reservationCode: reservationCode ? String(reservationCode).toUpperCase() : null,
    guestName,
    phoneFull,
    phoneLast4,
    email,
    profileUrl,
    propertyName,
    adults: Number.isFinite(adults) ? adults : null,
    children: Number.isFinite(children) ? children : null,
    infants: Number.isFinite(infants) ? infants : null,
    location,
    channel,
    uid,
  };
}

export function ymdToDate(ymd) {
  return new Date(`${ymd.slice(0, 4)}-${ymd.slice(4, 6)}-${ymd.slice(6, 8)}T00:00:00Z`);
}

export function nightsBetween(start, end) {
  return Math.round((ymdToDate(end) - ymdToDate(start)) / 86400000);
}

export function isReserved(e) {
  if (!e) return false;
  // Explicit blocks/unavailable patterns first
  if (/not available|blocked|airbnb \(not available\)/i.test(e.summary || '')) return false;
  // If we extracted a reservation code or guest name, it's a real booking
  if (e.reservationCode || e.guestName) return true;
  return /reserved|airbnb|vrbo|booking|direct|confirmed/i.test(e.summary || '');
}

const CHANNEL_LABEL = {
  airbnb: 'Airbnb',
  vrbo: 'VRBO',
  booking: 'Booking',
  expedia: 'Expedia',
  direct: 'Direct',
  hospitable: 'Hospitable',
};
function channelLabel(ch) {
  return CHANNEL_LABEL[ch] || 'Booking';
}

// --- ICS builder ---

function foldLine(line) {
  if (line.length <= 75) return line;
  const out = [];
  let i = 0;
  while (i < line.length) {
    out.push((i === 0 ? '' : ' ') + line.slice(i, i + 73));
    i += 73;
  }
  return out.join('\r\n');
}

function esc(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

function nowStamp() {
  return new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

export function buildIcs(events) {
  const lines = [
    'BEGIN:VCALENDAR',
    'PRODID:-//jaimem.com//Airbnb Proxy//EN',
    'CALSCALE:GREGORIAN',
    'VERSION:2.0',
    'X-WR-CALNAME:Airbnb Bookings',
    'X-WR-TIMEZONE:UTC',
    'METHOD:PUBLISH',
  ];
  const stamp = nowStamp();
  for (const e of events) {
    lines.push('BEGIN:VEVENT');
    lines.push(`UID:${e.uid}`);
    lines.push(`DTSTAMP:${stamp}`);
    lines.push(`DTSTART;VALUE=DATE:${e.dtStart}`);
    lines.push(`DTEND;VALUE=DATE:${e.dtEnd}`);
    lines.push(foldLine(`SUMMARY:${esc(e.summary)}`));
    if (e.description) lines.push(foldLine(`DESCRIPTION:${esc(e.description)}`));
    if (e.location) lines.push(foldLine(`LOCATION:${esc(e.location)}`));
    if (e.url) lines.push(foldLine(`URL:${e.url}`));
    if (Array.isArray(e.alarms)) {
      for (const a of e.alarms) {
        lines.push('BEGIN:VALARM');
        lines.push('ACTION:DISPLAY');
        lines.push(`TRIGGER:${a.trigger}`);
        lines.push(`DESCRIPTION:${esc(a.description || e.summary)}`);
        lines.push('END:VALARM');
      }
    } else if (e.alarmDaysBefore) {
      lines.push('BEGIN:VALARM');
      lines.push('ACTION:DISPLAY');
      lines.push(`TRIGGER:-P${e.alarmDaysBefore}D`);
      lines.push(`DESCRIPTION:${esc(e.summary)}`);
      lines.push('END:VALARM');
    }
    if (e.transparent) lines.push('TRANSP:TRANSPARENT');
    lines.push('END:VEVENT');
  }
  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

// --- Notion ---

async function notion(path, init = {}) {
  const res = await fetch(`https://api.notion.com/v1${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
      'Notion-Version': NOTION_VERSION,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });
  if (!res.ok) throw new Error(`Notion ${res.status}: ${await res.text()}`);
  return res.json();
}

export async function queryAllNotion() {
  const dsId = process.env.NOTION_DATA_SOURCE_ID;
  const rows = [];
  let cursor;
  do {
    const body = { page_size: 100, ...(cursor ? { start_cursor: cursor } : {}) };
    const data = await notion(`/data_sources/${dsId}/query`, { method: 'POST', body: JSON.stringify(body) });
    rows.push(...data.results);
    cursor = data.has_more ? data.next_cursor : null;
  } while (cursor);
  return rows.map(extractNotionRow);
}

function plain(prop) {
  if (!prop) return '';
  const arr = prop.rich_text || prop.title || [];
  return arr.map((t) => t.plain_text || '').join('');
}

function extractNotionRow(page) {
  const p = page.properties;
  return {
    id: page.id,
    title: plain(p['Reservation']),
    listing: p['Listing']?.select?.name || '',
    status: p['Status']?.select?.name || '',
    checkIn: p['Check-in']?.date?.start || '',
    checkOut: p['Check-out']?.date?.start || '',
    nights: p['Nights']?.number ?? null,
    phone: plain(p['Phone Last 4']),
    guestName: plain(p['Guest Name']),
    url: p['Reservation URL']?.url || '',
    reservationCode: extractCodeFromUrl(p['Reservation URL']?.url || '') || extractCodeFromTitle(plain(p['Reservation'])),
  };
}

function extractCodeFromUrl(url) {
  const m = /\/details\/([A-Z0-9]+)/.exec(url || '');
  return m ? m[1] : null;
}

function extractCodeFromTitle(title) {
  // Title formatted as "<CODE> — <LISTING> <RANGE>"; first token is the code.
  const m = /^([A-Z0-9]{6,})\b/.exec((title || '').trim());
  return m ? m[1] : null;
}

export async function createNotionRow(reservation) {
  const dsId = process.env.NOTION_DATA_SOURCE_ID;
  const { listing, listingCode, checkIn, checkOut, nights, phone, code, channel, guestName } = reservation;
  const title = `${code} — ${listingCode} ${formatRange(checkIn, checkOut)}`;
  const props = {
    Reservation: { title: [{ text: { content: title } }] },
    Listing: { select: { name: listing } },
    Status: { select: { name: 'Reserved' } },
    'Check-in': { date: { start: checkIn } },
    'Check-out': { date: { start: checkOut } },
    Nights: { number: nights },
    'Phone Last 4': { rich_text: [{ text: { content: phone || '' } }] },
    'Guest Name': { rich_text: [{ text: { content: guestName || '' } }] },
  };
  // Only set Reservation URL when channel is Airbnb (other channels have no public reservation URL pattern)
  if (channel === 'airbnb' && code) {
    props['Reservation URL'] = { url: `https://www.airbnb.com/hosting/reservations/details/${code}` };
  }
  await notion('/pages', {
    method: 'POST',
    body: JSON.stringify({
      parent: { type: 'data_source_id', data_source_id: dsId },
      properties: props,
    }),
  });
}

export async function markPast(pageId) {
  await notion(`/pages/${pageId}`, {
    method: 'PATCH',
    body: JSON.stringify({ properties: { Status: { select: { name: 'Past' } } } }),
  });
}

function formatRange(start, end) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const [, sm, sd] = start.split('-');
  const [, em, ed] = end.split('-');
  return sm === em ? `${months[+sm - 1]} ${+sd}-${+ed}` : `${months[+sm - 1]} ${+sd}–${months[+em - 1]} ${+ed}`;
}

// --- Event composition ---

export function composeFeedEvents(liveEvents, notionRows) {
  const out = [];
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');

  // Sort live events by check-in so we can detect back-to-back vs gap turnover.
  const sorted = [...(liveEvents || [])].sort((a, b) => (a.dtStart || '').localeCompare(b.dtStart || ''));
  // Group reservations by listing so we can find each event's next check-in.
  const reservedByListing = new Map();
  for (const e of sorted) {
    if (!isReserved(e)) continue;
    const arr = reservedByListing.get(e.listing) || [];
    arr.push(e);
    reservedByListing.set(e.listing, arr);
  }
  const findNextCheckin = (e) => {
    const arr = reservedByListing.get(e.listing) || [];
    const next = arr.find((x) => x !== e && x.dtStart >= e.dtEnd);
    return next ? next.dtStart : null;
  };

  for (const e of sorted) {
    if (!e || !e.dtStart || !e.dtEnd) continue;
    const isRes = isReserved(e);
    const nights = nightsBetween(e.dtStart, e.dtEnd);
    if (isRes) {
      const code = e.reservationCode || '';
      const label = channelLabel(e.channel);
      const firstName = e.guestName ? e.guestName.split(/\s+/)[0] : '';
      const phoneTag = e.phoneLast4 ? `…${e.phoneLast4}` : '';
      const guestSuffix = firstName ? ` · ${firstName}` : (phoneTag ? ` · ${phoneTag}` : '');
      const summary = `${label} · ${e.listing}${guestSuffix} · ${nights}n`;
      const reservationUrl = e.channel === 'airbnb' && code
        ? `https://www.airbnb.com/hosting/reservations/details/${code}`
        : undefined;

      const descLines = [];
      if (e.listingName) descLines.push(e.listingName);
      descLines.push(`Channel: ${label}`);
      descLines.push(`Guest: ${e.guestName || 'n/a'}`);
      descLines.push(`Code: ${code || 'n/a'}`);
      if (e.adults != null || e.children != null) {
        const guestCount = [
          e.adults != null ? `Adults: ${e.adults}` : null,
          e.children != null ? `Children: ${e.children}` : null,
          e.infants ? `Infants: ${e.infants}` : null,
        ].filter(Boolean).join(', ');
        if (guestCount) descLines.push(guestCount);
      }
      descLines.push(`Phone: ${e.phoneFull || (e.phoneLast4 ? `…${e.phoneLast4}` : 'n/a')}`);
      if (e.email) descLines.push(`Email: ${e.email}`);
      descLines.push(`Nights: ${nights}`);
      if (e.profileUrl) descLines.push(`Profile: ${e.profileUrl}`);
      if (reservationUrl) descLines.push(reservationUrl);

      out.push({
        uid: `res-${code || e.uid}@jaimem.com`,
        dtStart: e.dtStart,
        dtEnd: e.dtEnd,
        summary,
        description: descLines.join('\n'),
        location: e.location || undefined,
        url: reservationUrl,
        // T-24h reminder + same-day morning ping for arrival prep
        alarms: [
          { trigger: '-P1D', description: `Tomorrow: ${summary}` },
          { trigger: '-PT0H', description: `Arriving today: ${summary}` },
        ],
      });

      // Cleaning event on checkout day. Tag turnover vs deep clean based on next stay.
      const nextStart = findNextCheckin(e);
      const gapDays = nextStart ? nightsBetween(e.dtEnd, nextStart) : null;
      const cleaningTag = gapDays === 0
        ? 'Turnover'
        : (gapDays !== null && gapDays >= 2 ? 'Deep clean' : 'Cleaning');
      out.push({
        uid: `clean-${code || e.uid}@jaimem.com`,
        dtStart: e.dtEnd,
        dtEnd: dayAfter(e.dtEnd),
        summary: `${cleaningTag} · ${e.listing}${label !== 'Booking' ? ` (${label})` : ''}`,
        description: `${cleaningTag} after ${code || 'reservation'} (${nights}n stay)${gapDays != null ? ` · gap ${gapDays}d` : ''}`,
        transparent: true,
      });
    } else {
      // Manual block / host block — show low-key on calendar so Jaime sees it but no alarm.
      out.push({
        uid: `block-${e.uid}`,
        dtStart: e.dtStart,
        dtEnd: e.dtEnd,
        summary: `Block · ${e.listing}`,
        description: e.summary || 'Manual block',
        transparent: true,
      });
    }
  }

  // Add past reservations from Notion that the live feed dropped
  const liveCodes = new Set((liveEvents || []).filter(isReserved).map((e) => e.reservationCode).filter(Boolean));
  for (const row of (notionRows || [])) {
    if (!row.reservationCode || liveCodes.has(row.reservationCode)) continue;
    if (!row.checkIn || !row.checkOut) continue;
    const ds = row.checkIn.replace(/-/g, '');
    const de = row.checkOut.replace(/-/g, '');
    if (ds >= today) continue; // future reservation should be in live feed
    const phone = row.phone ? `…${row.phone}` : '';
    out.push({
      uid: `past-${row.reservationCode}@jaimem.com`,
      dtStart: ds,
      dtEnd: de,
      summary: `Airbnb · ${row.listing === 'Jalisco' ? 'SJDG' : 'BDM'}${phone ? ' · ' + phone : ''} · ${row.nights || nightsBetween(ds, de)}n · past`,
      description: row.guestName || row.url || '',
      url: row.url || undefined,
      transparent: true,
    });
  }
  return out;
}

function dayAfter(ymd) {
  const d = ymdToDate(ymd);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10).replace(/-/g, '');
}
