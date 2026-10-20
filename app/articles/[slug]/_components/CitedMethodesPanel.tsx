"use client";

import Link from "next/link";
import MethodeOverlay, { OverlayHeader } from "@/app/(methodes)/_components/MethodeOverlay";
import { Block } from "@/app/(methodes)/_components/CrossingCards";
import type { CitedMethodes } from "@/lib/methode-pages";

/** Bouton flottant : méthodes expert citées dans l'article, en cartes comme sur les fiches. */
export default function CitedMethodesPanel({ cited, onClose }: { cited: CitedMethodes; onClose: () => void }) {
  return (
    <MethodeOverlay kind="side" label="Méthodes expert de l'article" onClose={onClose}>
      <OverlayHeader title="Méthodes expert de l'article" onClose={onClose} />
      {/* Une carte ouvre sa fiche par-dessus l'article : la liste se ferme d'abord */}
      <div
        className="space-y-6 p-3 sm:p-5"
        onClickCapture={(e) => (e.target as HTMLElement).closest("a") && onClose()}
      >
        <p className="text-sm text-gray-600">
          Plongez au cœur des méthodes expert pour revivre ou découvrir les matchs, saisons et carrières cités dans cet
          article.
        </p>
        <Block compact title="Joueurs" kind="person" items={cited.joueurs} />
        <Block compact title="Coachs" kind="person" items={cited.coachs} />
        <Block compact title="Matchs" kind="match" items={cited.matchs} />
        <Block compact title="Saisons" kind="season" items={cited.saisons} />
        <Link href="/methodes-expert" className="inline-block text-sm text-gray-600 hover:text-aja-blue hover:underline">
          Toutes les méthodes expert →
        </Link>
      </div>
    </MethodeOverlay>
  );
}
