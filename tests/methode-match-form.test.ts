// Formulaire de méthode match : reprise d'une méthode, inversion des équipes, match retour.
import { describe, expect, it } from "vitest";
import {
  emptyMatchFormValues,
  methodeMatchToFormValues,
  swapMatchTeams,
  toReturnLeg,
} from "@/lib/methode-match-form";

const aller = () => ({
  ...emptyMatchFormValues(),
  titrematch: "AJ Auxerre 2-1 Ajax",
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
  it("échange noms, couleurs, systèmes et joueurs, et les noms dans le titre", () => {
    const swapped = swapMatchTeams(aller());
    expect(swapped.nomequipe1).toBe("Ajax");
    expect(swapped.couleur1equipe1).toBe("#ff0000");
    expect(swapped.systemeequipe1).toBe("4-3-3 Offensif");
    expect(swapped.nomequipe2).toBe("AJ Auxerre");
    expect(swapped.systemeequipe2).toBe("4-4-2");
    expect(swapped.titulairesequipe2[0].nom).toBe("Cissé");
    expect(swapped.remplacantsequipe2[0].nom).toBe("Kapo");
    expect(swapped.titrematch).toBe("Ajax 2-1 AJ Auxerre");
    expect(swapped.stade).toBe("Stade de l'Abbé Deschamps");
  });

  it("deux inversions redonnent le formulaire d'origine", () => {
    expect(swapMatchTeams(swapMatchTeams(aller()))).toEqual(aller());
  });

  it("ne touche pas au titre s'il ne cite pas les deux équipes", () => {
    expect(swapMatchTeams({ ...aller(), titrematch: "Le choc européen" }).titrematch).toBe(
      "Le choc européen",
    );
  });

  it("gère un nom d'équipe contenu dans l'autre", () => {
    const values = { ...aller(), titrematch: "Lyon - Olympique Lyon B", nomequipe1: "Lyon", nomequipe2: "Olympique Lyon B" };
    expect(swapMatchTeams(values).titrematch).toBe("Olympique Lyon B - Lyon");
  });
});

describe("toReturnLeg", () => {
  it("inverse les équipes, garde les compositions et vide la feuille de match", () => {
    const retour = toReturnLeg(aller());
    expect(retour.nomequipe1).toBe("Ajax");
    expect(retour.stade).toBe("");
    expect(retour.date).toBe("");
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
