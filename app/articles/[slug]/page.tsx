import type { Metadata } from "next";
import ArticleClient from "./_components/ArticleClient";
import { getArticleBySlug } from "@/controllers/ArticlesController";
import { SITE_NAME, socialImageUrl, tagLabels } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return { title: "Article introuvable", robots: { index: false } };
  }

  const tags = tagLabels(article.tags);
  const image = {
    url: socialImageUrl(article.imageUrl),
    width: 1200,
    height: 630,
    alt: article.title,
  };

  return {
    // absolute : le title "Articles" du layout parent empêche le template du root
    title: { absolute: `${article.title} | ${SITE_NAME}` },
    description: article.teaser,
    keywords: tags,
    authors: article.author ? [{ name: article.author }] : undefined,
    alternates: { canonical: `/articles/${article.slug}` },
    // Un brouillon prévisualisé par un admin ne doit jamais être indexé
    ...(article.state !== "published" && {
      robots: { index: false, follow: false },
    }),
    openGraph: {
      type: "article",
      title: `${article.title} | ${SITE_NAME}`,
      description: article.teaser,
      url: `/articles/${article.slug}`,
      siteName: SITE_NAME,
      locale: "fr_FR",
      images: [image],
      publishedTime: new Date(article.createdAt).toISOString(),
      modifiedTime: new Date(article.updatedAt ?? article.createdAt).toISOString(),
      authors: article.author ? [article.author] : undefined,
      tags,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.teaser,
      images: [image.url],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <ArticleClient slug={slug} />;
}
