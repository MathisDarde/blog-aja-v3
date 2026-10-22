// Vues des articles lues dans PostHog (pages vues « $pageview » envoyées par
// instrumentation-client.ts). Côté serveur uniquement : la clé personnelle donne accès au projet.

export interface ArticleStats {
  views: number;
  // Personnes distinctes
  visitors: number;
}

// API de PostHog : l'hôte d'envoi des événements sans son « .i » (eu.i.posthog.com → eu.posthog.com)
function apiHost() {
  if (process.env.POSTHOG_API_HOST) return process.env.POSTHOG_API_HOST.replace(/\/$/, "");
  const ingest = process.env.NEXT_PUBLIC_POSTHOG_HOST;
  return ingest ? ingest.replace(/\/$/, "").replace(".i.posthog.com", ".posthog.com") : null;
}

const QUERY = `
  select properties.$pathname as path, count() as views, count(distinct person_id) as visitors
  from events
  where event = '$pageview' and properties.$pathname like '/articles/%'
  group by path
  limit 10000`;

/** Vues par slug d'article depuis le début, ou null si PostHog n'est pas configuré ou ne répond pas. */
export async function fetchArticleStats(): Promise<Record<string, ArticleStats> | null> {
  const key = process.env.POSTHOG_PERSONAL_API_KEY;
  const project = process.env.POSTHOG_PROJECT_ID;
  const host = apiHost();
  if (!key || !project || !host) return null;

  try {
    const res = await fetch(`${host}/api/projects/${project}/query/`, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ query: { kind: "HogQLQuery", query: QUERY } }),
      cache: "no-store",
    });
    if (!res.ok) {
      console.error("Stats PostHog :", res.status, await res.text());
      return null;
    }
    const { results } = (await res.json()) as { results: [string, number, number][] };

    // /articles/<slug>, sans les pages de modification ; « /articles/x/ » compte pour « /articles/x »
    const stats: Record<string, ArticleStats> = {};
    for (const [path, views, visitors] of results) {
      const [, , slug, rest] = path.split("/");
      if (!slug || rest) continue;
      const current = stats[slug] ?? { views: 0, visitors: 0 };
      stats[slug] = { views: current.views + views, visitors: current.visitors + visitors };
    }
    return stats;
  } catch (error) {
    console.error("Stats PostHog :", error);
    return null;
  }
}
