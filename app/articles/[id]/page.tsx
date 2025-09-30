import ArticleClient from "./_components/ArticleClient";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  return <ArticleClient id_article={id} />;
}