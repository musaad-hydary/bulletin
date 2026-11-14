// Two sources:
//   source=new    → MusicBrainz + Cover Art Archive (actual recent drops, free, no auth)
//   source=charts → Deezer chart (mainstream top albums)
const UA = 'frame-dashboard/1.0 (musaadhydary@gmail.com)';

// MusicBrainz tags that actually return results
const mbTagMap = {
  hiphop: 'hip-hop',
  pop:    'indie-pop',
  rnb:    'rhythm-and-blues',
};

// Deezer genre IDs for chart mode
const deezerGenreMap = { hiphop: 116, pop: 132, rnb: 165 };

function dateFloor(daysBack) {
  const d = new Date();
  d.setDate(d.getDate() - daysBack);
  return d.toISOString().slice(0, 10);
}

async function fetchNew(genre) {
  const tag = mbTagMap[genre];
  const since = dateFloor(45);
  const today = new Date().toISOString().slice(0, 10);
  const query = encodeURIComponent(
    `date:[${since} TO ${today}] AND primarytype:Album AND status:Official AND tag:${tag}`
  );
  const r = await fetch(
    `https://musicbrainz.org/ws/2/release?query=${query}&limit=10&fmt=json`,
    { headers: { 'User-Agent': UA } }
  );
  if (!r.ok) throw new Error(`MusicBrainz ${r.status}`);
  const { releases = [] } = await r.json();

  // Return CAA URLs directly — browser follows the redirect when loading the img
  return releases.slice(0, 3).map(rel => {
    const rgId = rel['release-group']?.id;
    const artwork = rgId
      ? `https://coverartarchive.org/release-group/${rgId}/front-250`
      : `https://coverartarchive.org/release/${rel.id}/front-250`;
    return {
      title:   rel.title,
      artist:  rel['artist-credit']?.[0]?.name || 'Unknown',
      artwork,
    };
  });
}

async function fetchCharts(genre) {
  const genreId = deezerGenreMap[genre];
  const r = await fetch(`https://api.deezer.com/chart/${genreId}/albums?limit=3`);
  if (!r.ok) throw new Error(`Deezer ${r.status}`);
  const { data = [] } = await r.json();
  return data.slice(0, 3).map(a => ({
    title:   a.title,
    artist:  a.artist?.name || 'Unknown',
    artwork: a.cover_big || a.cover_medium || a.cover || '',
  }));
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=10800, stale-while-revalidate=86400');

  const { genre, source = 'new' } = req.query;
  if (!mbTagMap[genre]) {
    return res.status(400).json({ error: 'Invalid genre. Use: hiphop, pop, rnb' });
  }

  try {
    const albums = source === 'charts' ? await fetchCharts(genre) : await fetchNew(genre);
    return res.json({ albums });
  } catch (err) {
    console.error('Music fetch error:', err.message);
    return res.status(500).json({ error: 'Failed to fetch music data', albums: [] });
  }
};
