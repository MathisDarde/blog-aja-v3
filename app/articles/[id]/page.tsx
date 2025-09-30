import ArticleClient from "./_components/ArticleClient";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function ArticlePage({ params }: PageProps) {
  return <ArticleClient id_article={params.id} />;
}
