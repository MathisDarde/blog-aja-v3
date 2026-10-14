"use client";

import { useCallback, useRef, useState } from "react";
import {
  FieldValues,
  Path,
  PathValue,
  UseFormGetValues,
  UseFormSetValue,
} from "react-hook-form";
import { toast } from "sonner";
import { lookupPlayerCard } from "@/actions/method/wikidata-import";

const AUTOFILLED_FIELDS = ["drapeau", "poste"] as const;

/**
 * Complète le drapeau et le poste d'une ligne de joueur dès que son nom est saisi.
 * Ne touche jamais à une valeur entrée à la main : seuls les champs vides, ou encore
 * égaux à ce que l'autocomplétion y avait mis, sont remplacés.
 *
 * `row` est le chemin de la ligne (ex. « remplacants.3 »), `periodField` le champ
 * qui situe la méthode dans le temps (saison ou date du match).
 */
export function usePlayerAutofill<T extends FieldValues>({
  getValues,
  setValue,
  periodField,
}: {
  getValues: UseFormGetValues<T>;
  setValue: UseFormSetValue<T>;
  periodField: Path<T>;
}) {
  const autofilled = useRef(new Map<string, string>());
  const lastLookup = useRef(new Map<string, string>());
  const [pendingRows, setPendingRows] = useState<Set<string>>(new Set());

  const setPending = (row: string, pending: boolean) =>
    setPendingRows((rows) => {
      const next = new Set(rows);
      if (pending) next.add(row);
      else next.delete(row);
      return next;
    });

  const autofill = useCallback(
    async (row: string) => {
      const name = String(getValues(`${row}.nom` as Path<T>) ?? "").trim();
      if (name.length < 3 || lastLookup.current.get(row) === name) return;
      lastLookup.current.set(row, name);

      setPending(row, true);
      const response = await lookupPlayerCard(
        name,
        String(getValues(periodField) ?? ""),
      );
      setPending(row, false);

      if (!response.success) {
        lastLookup.current.delete(row); // nouvel essai au prochain passage
        toast.error(response.message);
        return;
      }
      if (!response.data) return;
      // Résultat obsolète : le nom a changé pendant la recherche
      if (String(getValues(`${row}.nom` as Path<T>) ?? "").trim() !== name) return;

      for (const field of AUTOFILLED_FIELDS) {
        const path = `${row}.${field}` as Path<T>;
        const value = response.data[field];
        const current = String(getValues(path) ?? "");
        if (!value || (current && current !== autofilled.current.get(path))) continue;

        setValue(path, value as PathValue<T, Path<T>>, { shouldDirty: true });
        autofilled.current.set(path, value);
      }
    },
    [getValues, setValue, periodField],
  );

  return {
    autofill,
    isPending: (row: string) => pendingRows.has(row),
  };
}
