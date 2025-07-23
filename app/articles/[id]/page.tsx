import ArticleClient from "./_components/ArticleClient";

export default async function ArticlePage({ params }: { params: { id: string } }) {
  return <ArticleClient id_article={params.id} />;
}