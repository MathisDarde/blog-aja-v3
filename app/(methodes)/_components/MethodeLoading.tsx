import { Loader2 } from "lucide-react";
import { MethodeType } from "@/lib/methodes";
import MethodeOverlay from "./MethodeOverlay";
import { OVERLAY_KINDS } from "./MethodeModal";

/** Fenêtre ouverte immédiatement au clic, le temps de charger la fiche. */
export function MethodeLoading({ type }: { type: MethodeType }) {
  return (
    <MethodeOverlay kind={OVERLAY_KINDS[type]} title="Chargement de la fiche…">
      <div className="flex h-full min-h-[200px] items-center justify-center text-gray-400">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    </MethodeOverlay>
  );
}
