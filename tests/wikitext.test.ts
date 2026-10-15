// Lecture des infobox et palmarès Wikipédia FR (import des méthodes expert), sur de vraies pages.
import { describe, expect, it } from "vitest";
import {
  findTemplate,
  parseAppearances,
  parseCareerColumns,
  parseCareerTotal,
  parsePalmares,
  parseRecord,
  templateParam,
} from "@/lib/wikitext";
import { wikitext } from "./helpers";

const infobox = (page: string) => findTemplate(wikitext(page), ["Infobox[^|}]*"])!;
const PLAYER_PARAMS = ["parcours senior", "parcours pro"];
const COACH_PARAMS = ["carrière entraîneur", "parcours entraîneur"];

describe("parcours de joueur (Djibril Cissé)", () => {
  const value = templateParam(infobox("fr-djibril-cisse"), PLAYER_PARAMS) ?? "";
  const rows = parseCareerColumns(value);

  it("lit chaque passage en club avec ses années et ses stats", () => {
    expect(rows.length).toBe(14);
    expect(rows[0]).toMatchObject({ start: 1999, end: 2004, clubName: "AJ Auxerre", note: null });
    expect(parseAppearances(rows[0].stats)).toEqual({ matchs: 169, buts: 90 });
  });

  it("repère les prêts", () => {
    expect(rows[2]).toMatchObject({ start: 2006, end: 2007, clubName: "Olympique de Marseille", note: "prêt" });
  });

  it("lit la ligne Total", () => {
    expect(parseCareerTotal(value)).toBe("612 (273)");
  });
});

describe("parcours d'entraîneur (Guy Roux)", () => {
  const rows = parseCareerColumns(templateParam(infobox("fr-guy-roux"), COACH_PARAMS) ?? "");

  it("lit les clubs et le bilan victoires-nuls-défaites", () => {
    expect(rows.map((r) => [r.start, r.end, r.clubName])).toEqual([
      [1961, 2005, "AJ Auxerre"],
      [2007, 2007, "RC Lens"],
    ]);
    expect(parseRecord(rows[0].stats)).toEqual({ v: 810, n: 418, d: 511 });
  });
});

describe("palmarès", () => {
  const page = wikitext("fr-guy-roux");
  const start = page.search(/==\s*Palmar/);
  const section = page.slice(start, page.indexOf("\n== ", start + 5));

  it("compte les titres d'après les années", () => {
    const titles = Object.fromEntries(parsePalmares(section));
    expect(titles["Champion de France de Division 1"]).toBe("1");
    expect(titles["Vainqueur de la Coupe de France"]).toBe("4");
    expect(titles["Champion de France de Division 2"]).toBe("1");
  });

  it("garde le palmarès quand la sous-partie « entraîneur » n'est qu'un tableau de statistiques", () => {
    // Régression : « Statistiques d'entraîneur » était prise pour le palmarès d'entraîneur
    expect(parsePalmares(section, /entra[iî]neur/i)).toEqual(parsePalmares(section));
  });

  it("lit seulement la sous-partie demandée quand elle contient des titres", () => {
    const text = [
      "== Palmarès ==",
      "=== Joueur ===",
      "* Champion de France en 1990",
      "=== Entraîneur ===",
      "* Vainqueur de la Coupe de France en 2003 et 2005",
    ].join("\n");
    expect(parsePalmares(text, /entra[iî]neur/i)).toEqual([["Vainqueur de la Coupe de France", "2"]]);
  });
});
