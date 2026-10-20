import { methodeSlugs } from "@/lib/methode-pages";
import { MethodePage, methodeMetadata } from "../../_components/MethodePage";

// Régénérée au plus toutes les 60 s, comme /methodes-expert
export const revalidate = 60;

export function generateStaticParams() {
  return methodeSlugs("joueur");
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params) {
  return methodeMetadata("joueur", (await params).slug);
}

export default async function Page({ params }: Params) {
  return <MethodePage type="joueur" slug={(await params).slug} />;
}
