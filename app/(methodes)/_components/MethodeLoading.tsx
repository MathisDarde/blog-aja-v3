import { Loader2 } from "lucide-react";
import { OverlayHeader } from "./MethodeOverlay";

/** Contenu du cadre le temps de charger la fiche (le cadre, lui, est déjà ouvert). */
export function MethodeLoading() {
  return (
    <>
      <OverlayHeader title="Chargement de la fiche…" />
      <div className="flex min-h-[60svh] items-center justify-center text-gray-400">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    </>
  );
}
