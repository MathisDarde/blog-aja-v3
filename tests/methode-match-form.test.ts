// Formulaire de méthode match : reprise d'une méthode, inversion des équipes, match retour.
import { describe, expect, it } from "vitest";
import {
  buildMatchTitle,
  emptyMatchFormValues,
  matchFormToRecord,
  methodeMatchToFormValues,
  parseMatchTitle,
  splitCoach,
  swapMatchTeams,
  toReturnLeg,
  withFlagPaths,
} from "@/lib/methode-match-form";

const aller = () => ({
  ...emptyMatchFormValues(),
  abreviationequipe1: "AJA",
  abreviationequipe2: "AJAX",
  scoreequipe1: "2",
  scoreequipe2: "1",
  logoequipe1: "/aja.png",
  logoequipe2: "/ajax.png",
  coachequipe1: { nom: "Guy Roux", drapeau: "/_assets/flags/france.png", poste: "Coach" },
  coachequipe2: { nom: "Louis van Gaal", drapeau: "", poste: "Coach" },
  nomequipe1: "AJ Auxerre",
  couleur1equipe1: "#0000ff",
  couleur2equipe1: "#ffffff",
  systemeequipe1: "4-4-2" as const,
  titulairesequipe1: [
    { nom: "Cissé", numero: "9", poste: "BU", sortie: "80'", buts: "2", cartonJaune: true, cartonRouge: false },
  ],
  remplacantsequipe1: [
    { nom: "Kapo", drapeau: "/_assets/flags/france.png", poste: "M", entree: "80'", buts: "", cartonJaune: false, cartonRouge: true },
  ],
  nomequipe2: "Ajax",
  couleur1equipe2: "#ff0000",
  couleur2equipe2: "#ffffff",
  systemeequipe2: "4-3-3 Offensif" as const,
  stade: "Stade de l'Abbé Deschamps",
  date: "mardi 2 octobre 2002, 20h45",
});

describe("swapMatchTeams", () => {
  it("échange noms, couleurs, systèmes, joueurs, score, logos et coachs", () => {
    const swapped = swapMatchTeams(aller());
    expect(swapped.nomequipe1).toBe("Ajax");
    expect(swapped.couleur1equipe1).toBe("#ff0000");
    expect(swapped.systemeequipe1).toBe("4-3-3 Offensif");
    expect(swapped.nomequipe2).toBe("AJ Auxerre");
    expect(swapped.systemeequipe2).toBe("4-4-2");
    expect(swapped.titulairesequipe2[0].nom).toBe("Cissé");
    expect(swapped.remplacantsequipe2[0].nom).toBe("Kapo");
    expect(buildMatchTitle(swapped)).toBe("AJAX 1 - 2 AJA");
    expect(swapped.logoequipe1).toBe("/ajax.png");
    expect(swapped.coachequipe2.nom).toBe("Guy Roux");
    expect(swapped.stade).toBe("Stade de l'Abbé Deschamps");
  });

  it("deux inversions redonnent le formulaire d'origine", () => {
    expect(swapMatchTeams(swapMatchTeams(aller()))).toEqual(aller());
  });
});

describe("toReturnLeg", () => {
  it("inverse les équipes, garde les compositions et vide la feuille de match", () => {
    const retour = toReturnLeg(aller());
    expect(retour.nomequipe1).toBe("Ajax");
    expect(retour.stade).toBe("");
    expect(retour.date).toBe("");
    expect(retour.scoreequipe1).toBe("");
    expect(retour.abreviationequipe1).toBe("AJAX");
    expect(retour.coachequipe1.nom).toBe("Louis van Gaal");
    expect(retour.titulairesequipe2[0]).toEqual({
      nom: "Cissé", numero: "9", poste: "BU", sortie: "", buts: "", cartonJaune: false, cartonRouge: false,
    });
    expect(retour.remplacantsequipe2[0]).toEqual({
      nom: "Kapo", drapeau: "/_assets/flags/france.png", poste: "M", entree: "", buts: "", cartonJaune: false, cartonRouge: false,
    });
  });
});

describe("methodeMatchToFormValues", () => {
  it("convertit les joueurs de l'ancien format en tableaux", () => {
    const values = methodeMatchToFormValues({
      ...aller(),
      titulairesequipe1: [["Cissé", "9", "BU", "80'", "2", "true", false]],
      remplacantsequipe1: [["Kapo", "france.png", "M"]],
    });
    expect(values.titulairesequipe1[0]).toEqual({
      nom: "Cissé", numero: "9", poste: "BU", sortie: "80'", buts: "2", cartonJaune: true, cartonRouge: false,
    });
    expect(values.remplacantsequipe1[0]).toMatchObject({ nom: "Kapo", drapeau: "france.png", entree: "", cartonRouge: false });
  });

  it("ignore les champs en trop d'une méthode enregistrée", () => {
    const values = methodeMatchToFormValues({ ...aller(), id_methode: "x", userId: "u" } as never);
    expect(values).not.toHaveProperty("id_methode");
    expect(values).not.toHaveProperty("userId");
  });
});

describe("buildMatchTitle", () => {
  const score = { abreviationequipe1: "AJA", abreviationequipe2: "BVB", scoreequipe1: 2, scoreequipe2: 0 };

  it("construit le titre au format unique", () => {
    expect(buildMatchTitle(score)).toBe("AJA 2 - 0 BVB");
  });

  it("ajoute prolongation et tirs au but", () => {
    expect(buildMatchTitle({ ...score, prolongation: true, tabequipe1: 5, tabequipe2: 6 })).toBe(
      "AJA 2 - 0 BVB (a.p., 5 - 6 tab)",
    );
    expect(buildMatchTitle({ ...score, tabequipe1: "4", tabequipe2: "5" })).toBe("AJA 2 - 0 BVB (4 - 5 tab)");
  });

  it("ignore des tirs au but incomplets", () => {
    expect(buildMatchTitle({ ...score, tabequipe1: "4", tabequipe2: "" })).toBe("AJA 2 - 0 BVB");
  });
});

describe("parseMatchTitle", () => {
  it("lit les titres saisis à la main", () => {
    expect(parseMatchTitle("AJA 0 - 1 Real Madrid")).toMatchObject({
      abreviationequipe1: "AJA", scoreequipe1: "0", scoreequipe2: "1", abreviationequipe2: "Real Madrid",
      tabequipe1: "", tabequipe2: "", prolongation: false,
    });
    expect(parseMatchTitle("ASSE 0 - 0 AJA (4 à 5 tab)")).toMatchObject({ tabequipe1: "4", tabequipe2: "5" });
    expect(parseMatchTitle("ASSE 1 - 1 AJA (4 - 5 tab)")).toMatchObject({ tabequipe1: "4", tabequipe2: "5" });
  });

  it("relit les titres qu'il construit", () => {
    expect(parseMatchTitle("AJA 2 - 0 BVB (a.p., 5 - 6 tab)")).toMatchObject({
      abreviationequipe2: "BVB", tabequipe1: "5", tabequipe2: "6", prolongation: true,
    });
  });

  it("renvoie null pour un titre sans score", () => {
    expect(parseMatchTitle("Le choc européen")).toBeNull();
  });
});

describe("coach", () => {
  it("sépare le coach des remplaçants", () => {
    const { coach, remplacants } = splitCoach([
      { nom: "Kapo", drapeau: "", poste: "M" },
      { nom: "Guy Roux", drapeau: "/_assets/flags/france.png", poste: "Coach" },
    ]);
    expect(coach).toEqual({ nom: "Guy Roux", drapeau: "/_assets/flags/france.png", poste: "Coach" });
    expect(remplacants.map((p) => p.nom)).toEqual(["Kapo"]);
  });

  it("enregistre le coach à la fin des remplaçants, sans doublon", () => {
    const record = matchFormToRecord(aller());
    expect(record.remplacantsequipe1.map((p) => [p.nom, p.poste])).toEqual([
      ["Kapo", "M"],
      ["Guy Roux", "Coach"],
    ]);
    expect(record).not.toHaveProperty("coachequipe1");
    expect(matchFormToRecord(methodeMatchToFormValues(record)).remplacantsequipe1).toHaveLength(2);
  });

  it("préfixe le drapeau du coach choisi par nom de fichier", () => {
    const values = withFlagPaths({ ...aller(), coachequipe2: { nom: "Van Gaal", drapeau: "paysbas.png", poste: "Coach" } });
    expect(values.coachequipe2.drapeau).toBe("/_assets/flags/paysbas.png");
  });
});

describe("matchFormToRecord", () => {
  it("convertit le score et construit le titre", () => {
    const record = matchFormToRecord({ ...aller(), tabequipe1: "", tabequipe2: "" });
    expect(record).toMatchObject({
      titrematch: "AJA 2 - 1 AJAX",
      scoreequipe1: 2,
      scoreequipe2: 1,
      tabequipe1: null,
      tabequipe2: null,
    });
  });
});

describe("methodeMatchToFormValues (score)", () => {
  it("lit le score dans le titre d'une méthode non convertie", () => {
    const values = methodeMatchToFormValues({
      ...aller(),
      abreviationequipe1: "",
      titrematch: "AJA 2 - 0 BVB (5 à 6 tab)",
    } as never);
    expect(values).toMatchObject({
      abreviationequipe1: "AJA",
      abreviationequipe2: "BVB",
      scoreequipe1: "2",
      tabequipe2: "6",
    });
  });

  it("reprend les champs de score enregistrés", () => {
    const values = methodeMatchToFormValues({
      ...matchFormToRecord(aller()),
      tabequipe1: 3,
      tabequipe2: 4,
    } as never);
    expect(values).toMatchObject({ scoreequipe1: "2", tabequipe1: "3", tabequipe2: "4" });
    expect(values.coachequipe1.nom).toBe("Guy Roux");
  });
});
