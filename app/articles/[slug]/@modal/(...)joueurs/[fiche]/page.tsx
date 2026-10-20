import { MethodeModal } from "@/app/(methodes)/_components/MethodeModal";

// Fiche ouverte depuis un article : par-dessus l'article, à l'adresse de la fiche
export default async function Page({ params }: { params: Promise<{ fiche: string }> }) {
  return <MethodeModal type="joueur" slug={(await params).fiche} />;
}
