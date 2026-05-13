import { LISTINGS, fetchListingEvents, queryAllNotion, createNotionRow, markPast, isReserved, nightsBetween } from './_airbnb.js';

export default async function handler(req, res) {
  // Vercel Cron sends Authorization: Bearer <CRON_SECRET>; allow manual calls with ?key=
  const auth = req.headers.authorization || '';
  const key = req.query?.key;
  const cronOk = auth === `Bearer ${process.env.CRON_SECRET}`;
  const manualOk = key && key === process.env.CRON_SECRET;
  if (!cronOk && !manualOk) {
    res.status(401).send('Unauthorized');
    return;
  }

  try {
    const [liveBdm, liveSjdg, notionRows] = await Promise.all([
      fetchListingEvents(LISTINGS[0]),
      fetchListingEvents(LISTINGS[1]),
      queryAllNotion(),
    ]);
    const live = [...liveBdm, ...liveSjdg];

    const notionByCode = new Map(notionRows.filter((r) => r.reservationCode).map((r) => [r.reservationCode, r]));
    const created = [];
    for (const e of live) {
      if (!isReserved(e)) continue;
      if (!e.reservationCode) continue;
      if (notionByCode.has(e.reservationCode)) continue;
      const checkIn = ymdToIso(e.dtStart);
      const checkOut = ymdToIso(e.dtEnd);
      const nights = nightsBetween(e.dtStart, e.dtEnd);
      await createNotionRow({
        listing: e.listingName,
        listingCode: e.listing,
        checkIn,
        checkOut,
        nights,
        phone: e.phoneLast4,
        code: e.reservationCode,
      });
      created.push(e.reservationCode);
    }

    // Mark past
    const today = new Date().toISOString().slice(0, 10);
    const pasted = [];
    for (const row of notionRows) {
      if (row.status === 'Reserved' && row.checkOut && row.checkOut < today) {
        await markPast(row.id);
        pasted.push(row.reservationCode);
      }
    }

    res.status(200).json({ ok: true, created, marked_past: pasted, live: live.length, notion: notionRows.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

function ymdToIso(ymd) {
  return `${ymd.slice(0, 4)}-${ymd.slice(4, 6)}-${ymd.slice(6, 8)}`;
}
