"use client";

import React, { useState } from "react";
import { Copy, Loader2, Repeat } from "lucide-react";
import { toast } from "sonner";
import { getMatchMethodes } from "@/controllers/MethodeMatchController";
import { SelectMatchMethode } from "@/db/schema";
import { MethodeMatchSchemaType } from "@/types/forms";
import { methodeMatchToFormValues, toReturnLeg } from "@/lib/methode-match-form";

/**
 * Remplit le formulaire à partir d'une méthode match déjà publiée : telle quelle,
 * ou comme base du match retour (équipes inversées, feuille de match vidée).
 */
export default function MatchTemplatePicker({
  onApply,
}: {
  onApply: (values: MethodeMatchSchemaType) => void;
}) {
  const [methodes, setMethodes] = useState<SelectMatchMethode[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState("");

  // Liste chargée au premier clic, pour ne pas ralentir l'ouverture du formulaire
  const loadMethodes = async () => {
    if (methodes || loading) return;
    setLoading(true);
    try {
      const list = await getMatchMethodes();
      setMethodes(
        [...list].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
      );
    } catch (error) {
      console.error(error);
      toast.error("Impossible de charger les méthodes match");
    } finally {
      setLoading(false);
    }
  };

  const apply = (returnLeg: boolean) => {
    const methode = methodes?.find((m) => m.id_methode === selectedId);
    if (!methode) return;
    const values = methodeMatchToFormValues(methode);
    onApply(returnLeg ? toReturnLeg(values) : values);
    toast.success(
      returnLeg
        ? "Match retour préparé : renseigne la date, le stade et le déroulé du match"
        : "Méthode reprise : pense à modifier ce qui change",
    );
  };

  return (
    <div className="w-full my-4 p-4 border border-dashed border-gray-400 rounded-lg font-Montserrat text-left">
      <span className="font-semibold text-sm sm:text-base flex items-center text-gray-600 mb-2">
        <Copy className="mr-4" />
        Partir d&apos;une méthode existante (facultatif) :
      </span>
      <div className="relative">
        <select
          value={selectedId}
          onFocus={loadMethodes}
          onMouseDown={loadMethodes}
          onChange={(e) => setSelectedId(e.target.value)}
          className="w-full py-3 px-6 rounded-full border border-gray-600 text-xs sm:text-sm bg-white"
        >
          <option value="">{loading ? "Chargement…" : "Choisir une méthode match…"}</option>
          {methodes?.map((m) => (
            <option key={m.id_methode} value={m.id_methode}>
              {[m.titrematch, m.date].filter(Boolean).join(" · ")}
            </option>
          ))}
        </select>
        {loading && (
          <Loader2
            size={16}
            className="absolute right-8 top-1/2 -translate-y-1/2 animate-spin text-aja-blue"
          />
        )}
      </div>
      <div className="flex flex-col sm:flex-row gap-2 mt-3">
        <button
          type="button"
          disabled={!selectedId}
          onClick={() => apply(false)}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-full border border-aja-blue text-aja-blue text-xs sm:text-sm hover:bg-aja-blue hover:text-white transition-colors disabled:opacity-40 disabled:pointer-events-none"
        >
          <Copy size={16} />
          Reprendre telle quelle
        </button>
        <button
          type="button"
          disabled={!selectedId}
          onClick={() => apply(true)}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-full border border-aja-blue text-aja-blue text-xs sm:text-sm hover:bg-aja-blue hover:text-white transition-colors disabled:opacity-40 disabled:pointer-events-none"
        >
          <Repeat size={16} />
          Préparer le match retour
        </button>
      </div>
      <p className="mt-2 text-[11px] text-gray-500">
        Le match retour inverse domicile et extérieur, garde les compositions et vide la date,
        le stade, les minutes, les buts et les cartons.
      </p>
    </div>
  );
}
