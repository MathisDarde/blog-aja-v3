import { getArticleBySlug } from "@/controllers/ArticlesController";
import UpdateContent from "./_components/UpdateContent";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const article = await getArticleBySlug(slug);
  if (!article) return;

  return <UpdateContent id_article={article?.id_article} />;
}
