import UpdateContent from "./_components/UpdateContent";

export default async function ArticlePage({
  params,
}: {
  params: { id: string };
}) {
  return <UpdateContent id_article={params.id} />;
}
