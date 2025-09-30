import UpdateContent from "./_components/UpdateContent";

interface PageProps {
  params: {
    id_article: string;
  };
}

export default async function UpdateArticle({ params }: PageProps) {
  const id_article = params.id_article;

  return <UpdateContent id_article={id_article} />;
}
