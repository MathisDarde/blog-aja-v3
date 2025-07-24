import ArticleClient from "./_components/ArticleClient";

export default async function ArticlePage({ params }: { params: { id: string } }) {
  const id_article = params.id;

  return <ArticleClient id_article={id_article} />;
}
