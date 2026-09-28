// Vercel serverless function: GET /api/minted -> {"minted": N}
// Set OPENSEA_KEY and COLLECTION_SLUG in Vercel -> Project -> Settings -> Environment Variables.
export default async function handler(req, res) {
  try {
    const r = await fetch(`https://api.opensea.io/api/v2/collections/${process.env.COLLECTION_SLUG}`, {
      headers: { "X-API-KEY": process.env.OPENSEA_KEY, accept: "application/json" },
    });
    if (!r.ok) throw new Error(`OpenSea returned ${r.status}`);
    const j = await r.json();
    // Vercel's edge caches this for 15s, so OpenSea is hit at most ~4 times a minute
    res.setHeader("Cache-Control", "s-maxage=15, stale-while-revalidate=30");
    res.status(200).json({ minted: Number(j.total_supply ?? 0) });
  } catch (e) {
    res.status(502).json({ error: String(e.message || e) });
  }
}
