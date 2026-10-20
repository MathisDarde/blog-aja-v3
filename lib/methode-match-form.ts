// Valeurs du formulaire de méthode match : chargement d'une méthode existante,
// inversion domicile / extérieur et préparation du match retour.
import type { RempPlayerType, TituPlayerType } from "@/contexts/Interfaces";
import type { MethodeMatchSchemaType } from "@/types/forms";

export const emptyTitulaire = (): TituPlayerType => ({
  nom: "",
  numero: "",
  poste: "",
  sortie: "",
  buts: "",
  cartonJaune: false,
  cartonRouge: false,
});

export const emptyRemplacant = (): RempPlayerType => ({
  nom: "",
  drapeau: "",
  poste: "",
  entree: "",
  buts: "",
  cartonJaune: false,
  cartonRouge: false,
});

export type MatchCoach = MethodeMatchSchemaType["coachequipe1"];

export const emptyCoach = (): MatchCoach => ({ nom: "", drapeau: "", poste: "Coach" });

export const emptyMatchFormValues = (): MethodeMatchSchemaType => ({
  abreviationequipe1: "",
  abreviationequipe2: "",
  scoreequipe1: "",
  scoreequipe2: "",
  tabequipe1: "",
  tabequipe2: "",
  prolongation: false,
  logoequipe1: "",
  logoequipe2: "",
  coachequipe1: emptyCoach(),
  coachequipe2: emptyCoach(),
  couleur1equipe1: "#000000",
  couleur2equipe1: "#000000",
  nomequipe1: "",
  systemeequipe1: "4-3-3 Offensif",
  titulairesequipe1: Array.from({ length: 11 }, emptyTitulaire),
  remplacantsequipe1: [emptyRemplacant()],
  couleur1equipe2: "#000000",
  couleur2equipe2: "#000000",
  nomequipe2: "",
  systemeequipe2: "4-3-3 Offensif",
  titulairesequipe2: Array.from({ length: 11 }, emptyTitulaire),
  remplacantsequipe2: [emptyRemplacant()],
  stade: "",
  date: "",
});

const isTrue = (value: unknown) => value === true || value === "true";

// Les anciennes méthodes stockent les joueurs en tableaux :
// titulaire [nom, numero, poste, sortie, buts, jaune, rouge],
// remplaçant [nom, drapeau, poste, entree, buts, jaune, rouge]
const toTitulaire = (data: unknown): TituPlayerType => {
  if (Array.isArray(data)) {
    return {
      nom: data[0] || "",
      numero: data[1] || "",
      poste: data[2] || "",
      sortie: data[3] || "",
      buts: data[4] || "",
      cartonJaune: isTrue(data[5]),
      cartonRouge: isTrue(data[6]),
    };
  }
  return data ? { ...emptyTitulaire(), ...(data as TituPlayerType) } : emptyTitulaire();
};

const toRemplacant = (data: unknown): RempPlayerType => {
  if (Array.isArray(data)) {
    return {
      nom: data[0] || "",
      drapeau: data[1] || "",
      poste: data[2] || "",
      entree: data[3] || "",
      buts: data[4] || "",
      cartonJaune: isTrue(data[5]),
      cartonRouge: isTrue(data[6]),
    };
  }
  return data ? { ...emptyRemplacant(), ...(data as RempPlayerType) } : emptyRemplacant();
};

// --- Titre du match ---

export interface MatchScore {
  abreviationequipe1: string;
  abreviationequipe2: string;
  scoreequipe1: string | number;
  scoreequipe2: string | number;
  tabequipe1?: string | number | null;
  tabequipe2?: string | number | null;
  prolongation?: boolean;
}

const filled = (value: unknown) => value !== null && value !== undefined && String(value).trim() !== "";

/** « AJA 2 - 0 BVB (a.p., 5 - 6 tab) » : même règle que la migration 0024. */
export function buildMatchTitle(score: MatchScore) {
  const details = [
    score.prolongation ? "a.p." : "",
    filled(score.tabequipe1) && filled(score.tabequipe2)
      ? `${score.tabequipe1} - ${score.tabequipe2} tab`
      : "",
  ].filter(Boolean);
  const title = `${score.abreviationequipe1.trim()} ${score.scoreequipe1} - ${score.scoreequipe2} ${score.abreviationequipe2.trim()}`;
  return details.length ? `${title} (${details.join(", ")})` : title;
}

/** Titre saisi à la main avant les champs séparés (« ASSE 1 - 1 AJA (4 à 5 tab) »). */
export function parseMatchTitle(title: string): Omit<MatchScore, "prolongation"> & { prolongation: boolean } | null {
  const core = title.replace(/\s*\(.*\)\s*$/, "").match(/^\s*(.*\S)\s+(\d+)\s*-\s*(\d+)\s+(\S.*\S|\S)\s*$/);
  if (!core) return null;
  const tab = title.match(/\((?:.*?)(\d+)\s*(?:-|à)\s*(\d+)\s*tab\)/);
  return {
    abreviationequipe1: core[1],
    scoreequipe1: core[2],
    scoreequipe2: core[3],
    abreviationequipe2: core[4],
    tabequipe1: tab?.[1] ?? "",
    tabequipe2: tab?.[2] ?? "",
    prolongation: /\ba\.?p\b/i.test(title.replace(/^[^(]*/, "")),
  };
}

// --- Coach : champ à part dans le formulaire, rangé dans les remplaçants en base ---

const isCoach = (player: { poste?: string }) => /^(coach|entra[iî]neur)$/i.test((player.poste ?? "").trim());

/** Sépare le coach (poste « Coach ») des autres remplaçants. */
export function splitCoach(remplacants: RempPlayerType[]): { coach: MatchCoach; remplacants: RempPlayerType[] } {
  const coach = remplacants.find(isCoach);
  return {
    coach: coach ? { nom: coach.nom, drapeau: coach.drapeau, poste: "Coach" } : emptyCoach(),
    remplacants: remplacants.filter((player) => player !== coach),
  };
}

/** Remplaçants enregistrés : la liste du formulaire, puis le coach. */
export function withCoach(remplacants: RempPlayerType[], coach: MatchCoach): RempPlayerType[] {
  return [
    ...remplacants.filter((player) => !isCoach(player)),
    { ...emptyRemplacant(), nom: coach.nom.trim(), drapeau: coach.drapeau, poste: "Coach" },
  ];
}

type StoredMethodeMatch = { [K in keyof MethodeMatchSchemaType]?: unknown } & {
  titrematch?: unknown;
  scoreequipe1?: unknown;
  scoreequipe2?: unknown;
  tabequipe1?: unknown;
  tabequipe2?: unknown;
};

/** Méthode match enregistrée (anciens formats compris) → valeurs du formulaire. */
export function methodeMatchToFormValues(methode: StoredMethodeMatch): MethodeMatchSchemaType {
  const empty = emptyMatchFormValues();
  const text = (key: keyof MethodeMatchSchemaType) =>
    typeof methode[key] === "string" && methode[key] ? (methode[key] as string) : (empty[key] as string);
  const list = <T>(value: unknown, map: (item: unknown) => T, fallback: T[]) =>
    Array.isArray(value) ? value.map(map) : fallback;
  const number = (value: unknown) => (value === null || value === undefined ? "" : String(value));

  // Score : champs séparés, sinon lu dans l'ancien titre
  const legacy =
    !methode.abreviationequipe1 && typeof methode.titrematch === "string"
      ? parseMatchTitle(methode.titrematch)
      : null;
  const score = legacy
    ? {
        abreviationequipe1: legacy.abreviationequipe1,
        abreviationequipe2: legacy.abreviationequipe2,
        scoreequipe1: String(legacy.scoreequipe1),
        scoreequipe2: String(legacy.scoreequipe2),
        tabequipe1: String(legacy.tabequipe1 ?? ""),
        tabequipe2: String(legacy.tabequipe2 ?? ""),
        prolongation: legacy.prolongation,
      }
    : {
        abreviationequipe1: text("abreviationequipe1"),
        abreviationequipe2: text("abreviationequipe2"),
        scoreequipe1: number(methode.scoreequipe1),
        scoreequipe2: number(methode.scoreequipe2),
        tabequipe1: number(methode.tabequipe1),
        tabequipe2: number(methode.tabequipe2),
        prolongation: methode.prolongation === true,
      };

  const team1 = splitCoach(list(methode.remplacantsequipe1, toRemplacant, []));
  const team2 = splitCoach(list(methode.remplacantsequipe2, toRemplacant, []));

  return {
    ...score,
    logoequipe1: text("logoequipe1"),
    logoequipe2: text("logoequipe2"),
    coachequipe1: team1.coach,
    coachequipe2: team2.coach,
    couleur1equipe1: text("couleur1equipe1"),
    couleur2equipe1: text("couleur2equipe1"),
    nomequipe1: text("nomequipe1"),
    systemeequipe1: text("systemeequipe1") as MethodeMatchSchemaType["systemeequipe1"],
    titulairesequipe1: list(methode.titulairesequipe1, toTitulaire, empty.titulairesequipe1),
    remplacantsequipe1: team1.remplacants.length ? team1.remplacants : empty.remplacantsequipe1,
    couleur1equipe2: text("couleur1equipe2"),
    couleur2equipe2: text("couleur2equipe2"),
    nomequipe2: text("nomequipe2"),
    systemeequipe2: text("systemeequipe2") as MethodeMatchSchemaType["systemeequipe2"],
    titulairesequipe2: list(methode.titulairesequipe2, toTitulaire, empty.titulairesequipe2),
    remplacantsequipe2: team2.remplacants.length ? team2.remplacants : empty.remplacantsequipe2,
    stade: text("stade"),
    date: text("date"),
  };
}

/** Inverse l'équipe à domicile et l'équipe à l'extérieur (score, logos, coachs, joueurs…). */
export function swapMatchTeams<T extends MethodeMatchSchemaType>(values: T): T {
  return {
    ...values,
    abreviationequipe1: values.abreviationequipe2,
    abreviationequipe2: values.abreviationequipe1,
    scoreequipe1: values.scoreequipe2,
    scoreequipe2: values.scoreequipe1,
    tabequipe1: values.tabequipe2,
    tabequipe2: values.tabequipe1,
    logoequipe1: values.logoequipe2,
    logoequipe2: values.logoequipe1,
    coachequipe1: values.coachequipe2,
    coachequipe2: values.coachequipe1,
    couleur1equipe1: values.couleur1equipe2,
    couleur2equipe1: values.couleur2equipe2,
    nomequipe1: values.nomequipe2,
    systemeequipe1: values.systemeequipe2,
    titulairesequipe1: values.titulairesequipe2,
    remplacantsequipe1: values.remplacantsequipe2,
    couleur1equipe2: values.couleur1equipe1,
    couleur2equipe2: values.couleur2equipe1,
    nomequipe2: values.nomequipe1,
    systemeequipe2: values.systemeequipe1,
    titulairesequipe2: values.titulairesequipe1,
    remplacantsequipe2: values.remplacantsequipe1,
  };
}

const clearTitulaire = (p: TituPlayerType): TituPlayerType => ({
  ...p,
  sortie: "",
  buts: "",
  cartonJaune: false,
  cartonRouge: false,
});

const clearRemplacant = (p: RempPlayerType): RempPlayerType => ({
  ...p,
  entree: "",
  buts: "",
  cartonJaune: false,
  cartonRouge: false,
});

/**
 * Base du match retour : équipes inversées, compositions et coachs gardés, mais date, stade,
 * score, minutes, buts et cartons vidés puisqu'ils changent d'un match à l'autre.
 */
export function toReturnLeg(values: MethodeMatchSchemaType): MethodeMatchSchemaType {
  const swapped = swapMatchTeams(values);
  return {
    ...swapped,
    stade: "",
    date: "",
    scoreequipe1: "",
    scoreequipe2: "",
    tabequipe1: "",
    tabequipe2: "",
    prolongation: false,
    titulairesequipe1: swapped.titulairesequipe1.map(clearTitulaire),
    titulairesequipe2: swapped.titulairesequipe2.map(clearTitulaire),
    remplacantsequipe1: swapped.remplacantsequipe1.map(clearRemplacant),
    remplacantsequipe2: swapped.remplacantsequipe2.map(clearRemplacant),
  };
}

const toNumberOrNull = (value: string) => (value.trim() === "" ? null : Number(value));

/** Valeurs du formulaire → colonnes de la méthode en base (titre construit, coach rangé). */
export function matchFormToRecord(values: MethodeMatchSchemaType) {
  const { coachequipe1, coachequipe2, ...fields } = values;
  return {
    ...fields,
    titrematch: buildMatchTitle(values),
    abreviationequipe1: values.abreviationequipe1.trim(),
    abreviationequipe2: values.abreviationequipe2.trim(),
    scoreequipe1: Number(values.scoreequipe1),
    scoreequipe2: Number(values.scoreequipe2),
    tabequipe1: toNumberOrNull(values.tabequipe1),
    tabequipe2: toNumberOrNull(values.tabequipe2),
    remplacantsequipe1: withCoach(values.remplacantsequipe1, coachequipe1),
    remplacantsequipe2: withCoach(values.remplacantsequipe2, coachequipe2),
  };
}

const FLAGS_PATH = "/_assets/flags/";
const flagPath = (flag: string) =>
  flag && !flag.startsWith("http") && !flag.startsWith("/") ? `${FLAGS_PATH}${flag}` : flag;

/** Drapeaux choisis par nom de fichier (« france.png ») → chemin servi par le site. */
export function withFlagPaths<T extends MethodeMatchSchemaType>(values: T): T {
  const remplacants = (list: RempPlayerType[]) => list.map((p) => ({ ...p, drapeau: flagPath(p.drapeau) }));
  return {
    ...values,
    remplacantsequipe1: remplacants(values.remplacantsequipe1),
    remplacantsequipe2: remplacants(values.remplacantsequipe2),
    coachequipe1: { ...values.coachequipe1, drapeau: flagPath(values.coachequipe1.drapeau) },
    coachequipe2: { ...values.coachequipe2, drapeau: flagPath(values.coachequipe2.drapeau) },
  };
}
