"use server";

import getAllMethodes from "@/actions/method/get-all-methodes";
import { Methodes } from "@/contexts/Interfaces";
import { methodeName } from "@/lib/methodes";
import { normalizeText } from "@/lib/normalize-text";
import { getTeamLogoResolver, withPeriodClubLogos } from "@/lib/team-logos";

export interface MethodeOption {
  id_methode: string;
  typemethode: Methodes["typemethode"];
  name: string;
  // Ce qui distingue deux méthodes au nom proche : date et stade d'un match, poste d'un joueur…
  details: string;
  // Logos des deux équipes d'un match
  logos: [string, string] | null;
  year: number | null;
  search: string;
}

const WEEKDAYS = /^(lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)\s+/i;

/** « Mardi 20 avril 1993, 20h45 » → « 20 avril 1993 » */
const shortDate = (date: string) => date.split(",")[0].replace(WEEKDAYS, "").trim();

const firstYear = (text: string) => {
  const match = text.match(/\b(19|20)\d{2}\b/);
  return match ? Number(match[0]) : null;
};

function describe(methode: Methodes): Pick<MethodeOption, "details" | "logos" | "year"> & { keywords: string[] } {
  switch (methode.typemethode) {
    case "joueur":
      return { details: methode.poste, logos: null, year: null, keywords: [methode.poste] };
    case "coach": {
      const clubs = methode.clubscoach.map((club) => club[1]);
      return { details: clubs.slice(0, 3).join(", "), logos: null, year: null, keywords: clubs };
    }
    case "match":
      return {
        details: [shortDate(methode.date), methode.stade].filter(Boolean).join(" · "),
        logos: [methode.logoequipe1 ?? "", methode.logoequipe2 ?? ""],
        year: firstYear(methode.date),
        keywords: [methode.nomequipe1, methode.nomequipe2, methode.date, methode.stade],
      };
    case "saison":
      return {
        details: [methode.coach, methode.systeme].filter(Boolean).join(" · "),
        logos: null,
        year: firstYear(methode.saison),
        keywords: [methode.coach],
      };
  }
}

/** Méthodes proposées dans l'éditeur d'article, avec de quoi les reconnaître et les chercher. */
export async function getMethodeOptions(): Promise<MethodeOption[]> {
  const [methodes, resolver] = await Promise.all([getAllMethodes(), getTeamLogoResolver()]);

  return (methodes as Methodes[])
    .map((raw) => withPeriodClubLogos(raw, resolver))
    .map((methode) => {
      const { keywords, ...rest } = describe(methode);
      const name = methodeName(methode);
      return {
        id_methode: methode.id_methode,
        typemethode: methode.typemethode,
        name,
        ...rest,
        search: normalizeText([name, ...keywords].join(" ")),
      };
    });
}
