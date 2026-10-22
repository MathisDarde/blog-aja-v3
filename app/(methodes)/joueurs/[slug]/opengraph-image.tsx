import { getMethodePage } from "@/lib/methode-pages";
import { OG_SIZE, renderPersonOgImage } from "@/lib/og-image";
import { SITE_URL } from "@/lib/seo";
import { getTeamLogoResolver } from "@/lib/team-logos";

export const alt = "Joueur de l'AJ Auxerre – Mémoire d'Auxerrois";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const [page, resolver] = await Promise.all([getMethodePage("joueur", (await params).slug), getTeamLogoResolver()]);
  const methode = page?.methode.typemethode === "joueur" ? page.methode : null;

  return renderPersonOgImage({
    kind: "joueur",
    name: methode?.joueurnom ?? "",
    subtitle: methode?.poste ?? "",
    portrait: methode?.imagejoueur,
    // Logo d'époque du parcours, sinon logo actuel du club
    clubs: (methode?.clubs ?? []).map(([logo, name, years]) => ({
      logos: [logo, resolver.currentLogo({ name })],
      name,
      years,
    })),
    siteUrl: SITE_URL,
  });
}
