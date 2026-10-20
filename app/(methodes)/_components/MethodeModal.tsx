import { notFound } from "next/navigation";
import { getMethodePage } from "@/lib/methode-pages";
import { MethodeType } from "@/lib/methodes";
import AdminEditButton from "./AdminEditButton";
import { Crossings } from "./Crossings";
import MethodeOverlay, { OverlayHeader, OverlayKind } from "./MethodeOverlay";
import { CoachView, JoueurView, MatchView, SaisonView } from "./MethodeViews";

const VIEWS = { joueur: JoueurView, coach: CoachView, match: MatchView, saison: SaisonView };

// Joueurs et coachs : panneau latéral ; matchs et saisons : grande fenêtre (le terrain)
export const OVERLAY_KINDS: Record<MethodeType, OverlayKind> = {
  joueur: "side",
  coach: "side",
  match: "center",
  saison: "center",
};

const LABELS: Record<MethodeType, string> = {
  joueur: "Fiche du joueur",
  coach: "Fiche du coach",
  match: "Fiche du match",
  saison: "Fiche de la saison",
};

/** Cadre des fiches ouvertes par-dessus un article (layout des routes interceptées). */
export function MethodeModalFrame({ type, children }: { type: MethodeType; children: React.ReactNode }) {
  return (
    <MethodeOverlay kind={OVERLAY_KINDS[type]} label={LABELS[type]}>
      {children}
    </MethodeOverlay>
  );
}

/** Contenu d'une fiche ouverte par-dessus un article. */
export async function MethodeModal({ type, slug }: { type: MethodeType; slug: string }) {
  const page = await getMethodePage(type, slug);
  if (!page) notFound();

  const View = VIEWS[type];
  const side = OVERLAY_KINDS[type] === "side";

  return (
    <>
      <OverlayHeader title={page.title} href={page.url} />
      <div className="p-3 sm:p-5">
        <div className="flex justify-end mb-2 empty:hidden">
          <AdminEditButton id={page.methode.id_methode} />
        </div>
        <View page={page} compact />
        {!side && <p className="text-sm text-gray-600 mt-4 max-w-4xl">{page.intro}</p>}
        <Crossings page={page} compact={side} />
      </div>
    </>
  );
}
