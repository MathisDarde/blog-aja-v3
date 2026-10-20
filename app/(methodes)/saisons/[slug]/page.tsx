import { methodeSlugs } from "@/lib/methode-pages";
import { MethodePage, methodeMetadata } from "../../_components/MethodePage";

// Régénérée au plus toutes les 60 s, comme /methodes-expert
export const revalidate = 60;

export function generateStaticParams() {
  return methodeSlugs("saison");
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params) {
  return methodeMetadata("saison", (await params).slug);
}

export default async function Page({ params }: Params) {
  return <MethodePage type="saison" slug={(await params).slug} />;
}
