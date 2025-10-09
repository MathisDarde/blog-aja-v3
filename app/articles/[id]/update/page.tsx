import UpdateContent from "./_components/UpdateContent";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <UpdateContent id_article={id} />;
}
