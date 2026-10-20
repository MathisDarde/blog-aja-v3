// Adresses des pages des méthodes : lisibles, stables et uniques par type.
import { describe, expect, it } from "vitest";
import { baseMethodeSlug, clubSlug, slugify, uniqueSlug } from "@/lib/methode-slug";

describe("slugify", () => {
  it("retire accents, apostrophes et ponctuation", () => {
    expect(slugify("Stéphane Guivarc'h")).toBe("stephane-guivarch");
    expect(slugify("Delvin N'Dinga")).toBe("delvin-ndinga");
    expect(slugify("Jean-Marc Furlan")).toBe("jean-marc-furlan");
    expect(slugify("  Ireneusz Jeleń ")).toBe("ireneusz-jelen");
  });
});

describe("clubSlug", () => {
  it("retire les formes juridiques des noms de clubs", () => {
    expect(clubSlug("AJ Auxerre")).toBe("auxerre");
    expect(clubSlug("AS Saint-Étienne")).toBe("saint-etienne");
    expect(clubSlug("Real Madrid CF")).toBe("real-madrid");
    expect(clubSlug("Borussia Dortmund")).toBe("borussia-dortmund");
  });
});

describe("baseMethodeSlug", () => {
  it("construit l'adresse selon le type", () => {
    expect(baseMethodeSlug({ typemethode: "joueur", joueurnom: "Djibril Cissé" })).toBe("djibril-cisse");
    expect(baseMethodeSlug({ typemethode: "coach", nomcoach: "Guy Roux" })).toBe("guy-roux");
    expect(baseMethodeSlug({ typemethode: "saison", saison: "1995-1996" })).toBe("1995-1996");
    expect(
      baseMethodeSlug({
        typemethode: "match",
        nomequipe1: "AJ Auxerre",
        nomequipe2: "Borussia Dortmund",
        date: "Mardi 20 avril 1993, 20h45",
      }),
    ).toBe("auxerre-borussia-dortmund-1993");
  });
});

describe("uniqueSlug", () => {
  it("ajoute un suffixe quand l'adresse est prise", () => {
    expect(uniqueSlug("auxerre-ajax-1993", new Set())).toBe("auxerre-ajax-1993");
    expect(uniqueSlug("auxerre-ajax-1993", new Set(["auxerre-ajax-1993", "auxerre-ajax-1993-2"]))).toBe(
      "auxerre-ajax-1993-3",
    );
    expect(uniqueSlug("", new Set())).toBe("methode");
  });
});
