import UpdateContent from "./_components/UpdateContent";

export default async function UpdateArticle({
  params,
}: {
  params: { id_article: string };
}) {
  const id_article = params.id_article;

  return <UpdateContent id_article={id_article} />;
}
