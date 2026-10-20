import { notFound } from "next/navigation";
import { getMethodePage } from "@/lib/methode-pages";
import { MethodeType } from "@/lib/methodes";
import AdminEditButton from "./AdminEditButton";
import { Crossings } from "./Crossings";
import MethodeOverlay, { OverlayKind } from "./MethodeOverlay";
import { CoachView, JoueurView, MatchView, SaisonView } from "./MethodeViews";

const VIEWS = { joueur: JoueurView, coach: CoachView, match: MatchView, saison: SaisonView };

// Joueurs et coachs : panneau latéral ; matchs et saisons : grande fenêtre (le terrain)
export const OVERLAY_KINDS: Record<MethodeType, OverlayKind> = {
  joueur: "side",
  coach: "side",
  match: "center",
  saison: "center",
};

/** Fiche d'une méthode ouverte par-dessus un article (routes interceptées de /articles/[slug]). */
export async function MethodeModal({ type, slug }: { type: MethodeType; slug: string }) {
  const page = await getMethodePage(type, slug);
  if (!page) notFound();

  const View = VIEWS[type];
  const kind = OVERLAY_KINDS[type];

  return (
    <MethodeOverlay kind={kind} title={page.title} href={page.url}>
      <div className="flex justify-end mb-2 empty:hidden">
        <AdminEditButton id={page.methode.id_methode} />
      </div>
      <View page={page} compact />
      {(type === "match" || type === "saison") && (
        <p className="text-sm text-gray-600 mt-4 max-w-4xl">{page.intro}</p>
      )}
      <Crossings page={page} compact={kind === "side"} />
    </MethodeOverlay>
  );
}
