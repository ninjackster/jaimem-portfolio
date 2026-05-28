import { LISTINGS, fetchListingEvents, queryAllNotion, composeFeedEvents, buildIcs } from './_airbnb.js';

export default async function handler(req, res) {
  const key = (req.query && req.query.key) || (req.url.match(/[?&]key=([^&]+)/) || [])[1];
  if (!process.env.FEED_TOKEN || key !== process.env.FEED_TOKEN) {
    res.status(404).send('Not found');
    return;
  }

  try {
    // Tolerate any individual listing feed being missing/empty (e.g. SJDG not yet listed).
    const fetchSafe = (l) =>
      fetchListingEvents(l).catch((err) => {
        console.error(`feed ${l.code} failed:`, err.message);
        return [];
      });
    const [liveBdm, liveSjdg, notionRows] = await Promise.all([
      fetchSafe(LISTINGS[0]),
      fetchSafe(LISTINGS[1]),
      process.env.NOTION_TOKEN ? queryAllNotion().catch(() => []) : Promise.resolve([]),
    ]);

    const feedEvents = composeFeedEvents([...liveBdm, ...liveSjdg], notionRows);
    const ics = buildIcs(feedEvents);

    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=600, s-maxage=600');
    res.status(200).send(ics);
  } catch (err) {
    res.status(500).send(`Error: ${err.message}`);
  }
}
