// Effectifs des saisons (Wikipédia FR et EN) et dates de saison.
import { describe, expect, it } from "vitest";
import { parseEnglishSquad, parseSeason, parseSquad, seasonFromDate, squadTemplateName } from "@/lib/saison-aja";
import { findSquadPlayer } from "@/lib/squad";
import { wikitext } from "./helpers";

describe("effectif Wikipédia FR", () => {
  it("trouve le modèle d'effectif inclus par la page de saison", () => {
    expect(parseSquad(wikitext("fr-saison-2021-2022"))).toEqual([]);
    expect(squadTemplateName(wikitext("fr-saison-2021-2022"))).toBe("Effectif de l'AJ Auxerre 2021-2022");
  });

  it("lit les joueurs du modèle d'effectif", () => {
    const squad = parseSquad(wikitext("fr-modele-effectif-2021-2022"));
    expect(squad.length).toBe(35);
    expect(squad[0]).toMatchObject({ nom: "Donovan Léon", numero: "16", poste: "Gardien" });
  });
});

describe("effectif Wikipédia EN", () => {
  const squad = parseEnglishSquad(wikitext("en-season-2021-22"));

  it("lit l'effectif avec postes et nationalités traduits", () => {
    expect(squad.length).toBe(30);
    expect(squad[0]).toEqual({ nom: "Carlens Arcus", numero: "2", poste: "Défenseur", nationalite: "HAI" });
  });

  it("retrouve un joueur par un nom approché", () => {
    expect(findSquadPlayer(squad, "Jubal")?.nom).toBe("Jubal Jr.");
    expect(findSquadPlayer(squad, "inconnu")).toBeNull();
  });
});

describe("saisons", () => {
  it("lit une saison écrite de plusieurs façons", () => {
    expect(parseSeason("saison 2021-2022")).toEqual({ from: 2021, to: 2022 });
    expect(parseSeason("1995/96")).toEqual({ from: 1995, to: 1996 });
  });

  it("déduit la saison d'une date de match (bascule en juillet)", () => {
    expect(seasonFromDate("samedi 15 mai 2010")).toBe("2009-2010");
    expect(seasonFromDate("mercredi 15 septembre 2010")).toBe("2010-2011");
  });
});
