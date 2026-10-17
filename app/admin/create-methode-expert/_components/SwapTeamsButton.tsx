"use client";

import { ArrowUpDown } from "lucide-react";

/** Inverse l'équipe à domicile et l'équipe à l'extérieur du formulaire match. */
export default function SwapTeamsButton({ onSwap }: { onSwap: () => void }) {
  return (
    <button
      type="button"
      onClick={onSwap}
      title="Inverser domicile et extérieur"
      className="mx-auto flex items-center justify-center gap-2 py-2 px-4 rounded-full border border-gray-400 bg-white font-Montserrat text-xs sm:text-sm text-gray-700 hover:border-aja-blue hover:text-aja-blue transition-colors"
    >
      <ArrowUpDown size={16} />
      Inverser domicile et extérieur
    </button>
  );
}
