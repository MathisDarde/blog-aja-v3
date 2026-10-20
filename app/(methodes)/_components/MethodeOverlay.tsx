"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Maximize2, X } from "lucide-react";

export type OverlayKind = "side" | "center";

// Sans `onClose`, fermer revient à l'article : retour de l'historique, l'adresse de la
// fiche ayant remplacé celle de l'article
function useClose(onClose?: () => void) {
  const router = useRouter();
  return useCallback(() => (onClose ? onClose() : router.back()), [onClose, router]);
}

/**
 * Cadre d'une fiche ouverte par-dessus un article : panneau à droite (joueurs, coachs) ou
 * grande fenêtre (matchs, saisons), plein écran sur mobile. Fermeture : fond, Échap ou la
 * croix de l'en-tête (OverlayHeader). Placé dans le layout des routes interceptées, il
 * reste en place pendant le chargement de la fiche : il n'apparaît qu'une fois.
 */
export default function MethodeOverlay({
  kind,
  label,
  onClose,
  children,
}: {
  kind: OverlayKind;
  label: string;
  onClose?: () => void;
  children: React.ReactNode;
}) {
  const close = useClose(onClose);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && close();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [close]);

  const panel =
    kind === "side"
      ? "ml-auto h-full w-full sm:max-w-[620px] animate-overlay-side motion-reduce:animate-none"
      : "sm:m-auto h-full w-full sm:h-[94svh] sm:w-[min(1240px,96vw)] sm:rounded-2xl animate-overlay-center motion-reduce:animate-none";

  return (
    <div role="dialog" aria-modal="true" aria-label={label} className="fixed inset-0 z-[100] flex font-Montserrat">
      <div className="absolute inset-0 bg-black/50 animate-overlay-fade motion-reduce:animate-none" onClick={close} aria-hidden />
      <div className={`relative overflow-y-auto overscroll-contain bg-gray-100 shadow-2xl ${panel}`}>{children}</div>
    </div>
  );
}

/** En-tête collant de la fiche : titre, lien vers la page complète, fermeture. */
export function OverlayHeader({ title, href, onClose }: { title: string; href?: string; onClose?: () => void }) {
  const close = useClose(onClose);

  return (
    <div className="sticky top-0 z-20 flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-2.5">
      <p className="min-w-0 flex-1 truncate font-Bai_Jamjuree font-bold">{title}</p>
      {href && (
        // Lien classique : la page complète remplace l'article
        <a href={href} className="flex shrink-0 items-center gap-1.5 text-sm font-semibold text-aja-blue hover:text-orange-third">
          <Maximize2 size={14} /> <span className="hidden min-[400px]:inline">Fiche complète</span>
        </a>
      )}
      <button
        type="button"
        onClick={close}
        aria-label="Fermer"
        className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
      >
        <X size={22} />
      </button>
    </div>
  );
}
