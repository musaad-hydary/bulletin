// Fetches and parses ICS calendar feeds from CALENDAR_URLS env var
// Set CALENDAR_URLS to a comma-separated list of .ics URLs in Vercel env vars
const ical = require('node-ical');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');

  const calendarUrls = process.env.CALENDAR_URLS;

  if (!calendarUrls) {
    return res.json({ events: [], configured: false });
  }

  const urls = calendarUrls.split(',').map(u => u.trim()).filter(Boolean);
  const now = new Date();
  const thirtyDaysOut = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const allEvents = [];

  for (const url of urls) {
    try {
      const data = await ical.async.fromURL(url);

      for (const event of Object.values(data)) {
        if (event.type !== 'VEVENT') continue;

        const start = event.start;
        if (!start) continue;

        // Handle recurring events: use the base start date for RRULE events
        const startDate = start instanceof Date ? start : new Date(start);
        if (isNaN(startDate) || startDate < now || startDate > thirtyDaysOut) continue;

        const isAllDay = event.datetype === 'date';

        allEvents.push({
          id: event.uid || `${event.summary}-${startDate.toISOString()}`,
          title: event.summary || 'Untitled Event',
          start: startDate.toISOString(),
          end: event.end ? new Date(event.end).toISOString() : null,
          allDay: isAllDay,
          location: event.location || null,
        });
      }
    } catch (err) {
      console.error(`Calendar fetch failed for ${url.substring(0, 60)}:`, err.message);
    }
  }

  allEvents.sort((a, b) => new Date(a.start) - new Date(b.start));

  return res.json({ events: allEvents.slice(0, 8), configured: true });
};
