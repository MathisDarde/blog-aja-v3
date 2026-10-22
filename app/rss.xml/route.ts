import { getArticles } from "@/controllers/ArticlesController";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, socialImageUrl } from "@/lib/seo";

// Comme le sitemap : régénéré au plus toutes les 60 s, et dès qu'un article change
// (revalidateArticlePages)
export const revalidate = 60;

const MAX_ITEMS = 30;

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

/** Flux RSS des derniers articles publiés. */
export async function GET() {
  const articles = (await getArticles())
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, MAX_ITEMS);

  const items = articles
    .map((article) => {
      const url = `${SITE_URL}/articles/${article.slug}`;
      return `    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(article.teaser)}</description>
      <pubDate>${article.createdAt.toUTCString()}</pubDate>
      ${article.author ? `<dc:creator>${escapeXml(article.author)}</dc:creator>` : ""}
      <enclosure url="${escapeXml(socialImageUrl(article.imageUrl))}" type="image/jpeg" length="0" />
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>fr-FR</language>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    ${articles[0] ? `<lastBuildDate>${articles[0].createdAt.toUTCString()}</lastBuildDate>` : ""}
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
