import { getMethodePage, shortDate } from "@/lib/methode-pages";
import { OG_SIZE, renderMethodeOgImage } from "@/lib/og-image";
import { SITE_URL } from "@/lib/seo";
import { getTeamLogoResolver } from "@/lib/team-logos";

export const alt = "Match de l'AJ Auxerre – Mémoire d'Auxerrois";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const [page, resolver] = await Promise.all([getMethodePage("match", (await params).slug), getTeamLogoResolver()]);
  const match = page?.methode.typemethode === "match" ? page.methode : null;
  const hasScore = match?.abreviationequipe1 && match.scoreequipe1 != null && match.scoreequipe2 != null;

  return renderMethodeOgImage({
    // Logo d'époque, sinon logo actuel (le moteur de rendu ne lit pas les GIF)
    logos: [
      [match?.logoequipe1, match && resolver.currentLogo({ name: match.nomequipe1 })],
      [match?.logoequipe2, match && resolver.currentLogo({ name: match.nomequipe2 })],
    ],
    center: hasScore ? `${match.scoreequipe1} - ${match.scoreequipe2}` : "VS",
    caption: match ? shortDate(match.date) : "",
    siteUrl: SITE_URL,
  });
}
