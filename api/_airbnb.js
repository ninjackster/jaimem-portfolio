// Shared logic for Airbnb iCal proxy + Notion sync.

const NOTION_VERSION = '2025-09-03';

export const LISTINGS = [
  { code: 'BDM', name: 'Baja Del Mar', envKey: 'AIRBNB_BDM_ICS_URL' },
  { code: 'SJDG', name: 'Jalisco', envKey: 'AIRBNB_JAL_ICS_URL' },
];

export async function fetchListingEvents(listing) {
  const url = process.env[listing.envKey];
  if (!url) throw new Error(`Missing env var: ${listing.envKey}`);
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Airbnb ${listing.code} feed ${res.status}`);
  const text = await res.text();
  return parseIcs(text).map((e) => ({ ...e, listing: listing.code, listingName: listing.name }));
}

export function parseIcs(text) {
  const unfolded = text.replace(/\r\n/g, '\n').replace(/\n[ \t]/g, '');
  const events = [];
  const re = /BEGIN:VEVENT([\s\S]*?)END:VEVENT/g;
  let m;
  while ((m = re.exec(unfolded))) {
    const block = m[1];
    const get = (k) => {
      const r = new RegExp(`${k}(?:;[^:]*)?:(.+)`).exec(block);
      return r ? r[1].trim() : null;
    };
    const start = get('DTSTART');
    const end = get('DTEND');
    if (!start || !end) continue;
    const summary = get('SUMMARY') || '';
    const description = (() => {
      const r = /DESCRIPTION:([\s\S]*?)(?=\n[A-Z-]+[:;]|$)/.exec(block);
      return r ? r[1].replace(/\n/g, '').trim() : '';
    })();
    const codeMatch = /\/details\/([A-Z0-9]+)/.exec(description);
    const phoneMatch = /Last 4 Digits\)?:\s*(\d+)/.exec(description);
    events.push({
      dtStart: start.replace(/[^0-9]/g, '').slice(0, 8),
      dtEnd: end.replace(/[^0-9]/g, '').slice(0, 8),
      summary,
      reservationCode: codeMatch ? codeMatch[1] : null,
      phoneLast4: phoneMatch ? phoneMatch[1] : null,
      uid: (get('UID') || `${start}-${end}@local`).trim(),
    });
  }
  return events;
}

export function ymdToDate(ymd) {
  return new Date(`${ymd.slice(0, 4)}-${ymd.slice(4, 6)}-${ymd.slice(6, 8)}T00:00:00Z`);
}

export function nightsBetween(start, end) {
  return Math.round((ymdToDate(end) - ymdToDate(start)) / 86400000);
}

export function isReserved(e) {
  return /^Reserved/i.test(e.summary);
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
    if (e.url) lines.push(foldLine(`URL:${e.url}`));
    if (e.alarmDaysBefore) {
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
  const m = /\b([A-Z0-9]{8,})\b/.exec(title || '');
  return m ? m[1] : null;
}

export async function createNotionRow(reservation) {
  const dsId = process.env.NOTION_DATA_SOURCE_ID;
  const { listing, listingCode, checkIn, checkOut, nights, phone, code } = reservation;
  const title = `${code} — ${listingCode} ${formatRange(checkIn, checkOut)}`;
  await notion('/pages', {
    method: 'POST',
    body: JSON.stringify({
      parent: { type: 'data_source_id', data_source_id: dsId },
      properties: {
        Reservation: { title: [{ text: { content: title } }] },
        Listing: { select: { name: listing } },
        Status: { select: { name: 'Reserved' } },
        'Check-in': { date: { start: checkIn } },
        'Check-out': { date: { start: checkOut } },
        Nights: { number: nights },
        'Phone Last 4': { rich_text: [{ text: { content: phone || '' } }] },
        'Reservation URL': { url: `https://www.airbnb.com/hosting/reservations/details/${code}` },
      },
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

  for (const e of liveEvents) {
    const isRes = isReserved(e);
    const nights = nightsBetween(e.dtStart, e.dtEnd);
    if (isRes) {
      const code = e.reservationCode || '';
      const phone = e.phoneLast4 ? `…${e.phoneLast4}` : '';
      const summary = `Airbnb · ${e.listing}${phone ? ' · ' + phone : ''} · ${nights}n`;
      out.push({
        uid: `res-${code}@jaimem.com`,
        dtStart: e.dtStart,
        dtEnd: e.dtEnd,
        summary,
        description: `${e.listingName}\nCode: ${code}\nPhone: ${phone || 'n/a'}\nNights: ${nights}\nhttps://www.airbnb.com/hosting/reservations/details/${code}`,
        url: code ? `https://www.airbnb.com/hosting/reservations/details/${code}` : undefined,
        alarmDaysBefore: 1,
      });
      // Cleaning event on checkout day
      out.push({
        uid: `clean-${code}@jaimem.com`,
        dtStart: e.dtEnd,
        dtEnd: dayAfter(e.dtEnd),
        summary: `🧹 Cleaning · ${e.listing}`,
        description: `Cleaning after ${code} (${nights}n stay)`,
        transparent: true,
      });
    } else {
      // Turnover / Not available — low-key, transparent
      out.push({
        uid: `block-${e.uid}`,
        dtStart: e.dtStart,
        dtEnd: e.dtEnd,
        summary: `Turnover · ${e.listing}`,
        transparent: true,
      });
    }
  }

  // Add past reservations from Notion that the live feed dropped
  const liveCodes = new Set(liveEvents.filter(isReserved).map((e) => e.reservationCode).filter(Boolean));
  for (const row of notionRows) {
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
