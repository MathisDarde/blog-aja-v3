import { getMethodePage } from "@/lib/methode-pages";
import { OG_SIZE, renderMethodeOgImage } from "@/lib/og-image";
import { SITE_URL } from "@/lib/seo";
import { AJA_CLUB_ID, ajaLogo, getTeamLogoResolver } from "@/lib/team-logos";

export const alt = "Saison de l'AJ Auxerre – Mémoire d'Auxerrois";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const [page, resolver] = await Promise.all([getMethodePage("saison", (await params).slug), getTeamLogoResolver()]);
  const saison = page?.methode.typemethode === "saison" ? page.methode : null;
  const season = Number(saison?.saison.match(/\d{4}/)?.[0]) || null;

  return renderMethodeOgImage({
    // Logo de l'AJA à l'époque, sinon logo actuel
    logos: [[ajaLogo(season, resolver), resolver.currentLogo({ id: AJA_CLUB_ID, name: "AJ Auxerre" })]],
    center: saison?.saison ?? "",
    caption: saison ? `AJ Auxerre · ${saison.coach}` : "AJ Auxerre",
    siteUrl: SITE_URL,
  });
}
