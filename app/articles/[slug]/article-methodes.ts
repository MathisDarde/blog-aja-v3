import getAllMethodes from "@/actions/method/get-all-methodes";
import { getTeamLogoResolver, withPeriodClubLogos } from "@/lib/team-logos";
import { linkMethodes, methodeAnchors } from "@/lib/methodes";
import { citedMethodes, CitedMethodes } from "@/lib/methode-pages";
import type { Methodes } from "@/contexts/Interfaces";

/**
 * Contenu d'un article prêt à afficher : joueurs, coachs et saisons surlignés automatiquement
 * (lib/methodes), mentions changées en liens vers les fiches, et cartes des seules méthodes citées
 * (ce qui part au navigateur). null si les méthodes n'ont pas pu être chargées.
 */
export async function withArticleMethodes(
  content: string
): Promise<{ content: string; cited: CitedMethodes } | null> {
  // Logos des clubs des parcours selon l'époque (lib/team-logos)
  const [rawMethodes, resolver] = await Promise.all([getAllMethodes(), getTeamLogoResolver()]);
  if (!rawMethodes) return null;
  const methodes = rawMethodes.map((m) => withPeriodClubLogos(m, resolver)) as Methodes[];

  const linked = linkMethodes(content, methodes);
  return {
    content: methodeAnchors(linked, methodes),
    cited: citedMethodes(linked, methodes, resolver),
  };
}
