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

export const emptyMatchFormValues = (): MethodeMatchSchemaType => ({
  titrematch: "",
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

type StoredMethodeMatch = { [K in keyof MethodeMatchSchemaType]?: unknown };

/** Méthode match enregistrée (anciens formats compris) → valeurs du formulaire. */
export function methodeMatchToFormValues(methode: StoredMethodeMatch): MethodeMatchSchemaType {
  const empty = emptyMatchFormValues();
  const text = (key: keyof MethodeMatchSchemaType) =>
    typeof methode[key] === "string" && methode[key] ? (methode[key] as string) : (empty[key] as string);
  const list = <T>(value: unknown, map: (item: unknown) => T, fallback: T[]) =>
    Array.isArray(value) ? value.map(map) : fallback;

  return {
    titrematch: text("titrematch"),
    couleur1equipe1: text("couleur1equipe1"),
    couleur2equipe1: text("couleur2equipe1"),
    nomequipe1: text("nomequipe1"),
    systemeequipe1: text("systemeequipe1") as MethodeMatchSchemaType["systemeequipe1"],
    titulairesequipe1: list(methode.titulairesequipe1, toTitulaire, empty.titulairesequipe1),
    remplacantsequipe1: list(methode.remplacantsequipe1, toRemplacant, empty.remplacantsequipe1),
    couleur1equipe2: text("couleur1equipe2"),
    couleur2equipe2: text("couleur2equipe2"),
    nomequipe2: text("nomequipe2"),
    systemeequipe2: text("systemeequipe2") as MethodeMatchSchemaType["systemeequipe2"],
    titulairesequipe2: list(methode.titulairesequipe2, toTitulaire, empty.titulairesequipe2),
    remplacantsequipe2: list(methode.remplacantsequipe2, toRemplacant, empty.remplacantsequipe2),
    stade: text("stade"),
    date: text("date"),
  };
}

const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Échange les noms des deux équipes dans le titre (« AJA - Ajax » → « Ajax - AJA »). */
function swapNamesInTitle(title: string, team1: string, team2: string) {
  const a = team1.trim();
  const b = team2.trim();
  if (!a || !b || a === b || !title.includes(a) || !title.includes(b)) return title;
  // Le nom le plus long d'abord, pour « Lyon » face à « Olympique Lyonnais »
  const pattern = new RegExp([a, b].sort((x, y) => y.length - x.length).map(escapeRegExp).join("|"), "g");
  return title.replace(pattern, (name) => (name === a ? b : a));
}

/** Inverse l'équipe à domicile et l'équipe à l'extérieur (noms, couleurs, systèmes, joueurs). */
export function swapMatchTeams<T extends MethodeMatchSchemaType>(values: T): T {
  return {
    ...values,
    titrematch: swapNamesInTitle(values.titrematch, values.nomequipe1, values.nomequipe2),
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
 * Base du match retour : équipes inversées, compositions gardées, mais date, stade,
 * minutes, buts et cartons vidés puisqu'ils changent d'un match à l'autre.
 */
export function toReturnLeg(values: MethodeMatchSchemaType): MethodeMatchSchemaType {
  const swapped = swapMatchTeams(values);
  return {
    ...swapped,
    stade: "",
    date: "",
    titulairesequipe1: swapped.titulairesequipe1.map(clearTitulaire),
    titulairesequipe2: swapped.titulairesequipe2.map(clearTitulaire),
    remplacantsequipe1: swapped.remplacantsequipe1.map(clearRemplacant),
    remplacantsequipe2: swapped.remplacantsequipe2.map(clearRemplacant),
  };
}
