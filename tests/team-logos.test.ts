// Choix du logo d'un club selon la saison (registre et logos d'époque publiés par les scrapers).
import { beforeEach, describe, expect, it, vi } from "vitest";

const registry = {
  "290": { nom: "AJ Auxerre", noms: ["AJ Auxerre", "Auxerre", "AJA"], logo: "logos/290.png" },
  "244": { nom: "Marseille", noms: ["Marseille", "Olympique de Marseille"], logo: "logos/244.png" },
  "30626": { nom: "SC Hazebrouck", noms: ["SC Hazebrouck"], logo: "logos/30626.png" },
};
const periods = {
  "290": [
    { de: null, a: 1991, logo: "logos/historique/290-avant.png" },
    { de: 1992, a: 1996, logo: "logos/historique/290-1992.png" },
  ],
  "244": [
    { de: 1993, a: 2003, logo: "logos/historique/244-1993.png" },
    // Une saison seule l'emporte sur une période plus longue
    { de: 1998, a: 1998, logo: "https://exemple.fr/om-1998.png" },
  ],
};

vi.mock("@/lib/scraped-data", () => ({
  SCRAPERS_URL: "https://data.test",
  fetchScrapedData: async (file: string, fallback: unknown) =>
    file === "clubs.json" ? registry : file === "logos-historiques.json" ? periods : fallback,
}));
// cache() de React (mémoïsation par requête) est neutre hors du serveur Next
vi.mock("react", () => ({ cache: <T,>(fn: T) => fn }));

const { getTeamLogoResolver, seasonOfFrenchDate, withPeriodClubLogos } = await import("@/lib/team-logos");

describe("logo selon la saison", () => {
  let resolver: Awaited<ReturnType<typeof getTeamLogoResolver>>;
  beforeEach(async () => {
    resolver = await getTeamLogoResolver();
  });

  it("prend le logo d'époque de la saison", () => {
    expect(resolver.logo({ id: "290", season: 1995 })).toBe("https://data.test/logos/historique/290-1992.png");
    expect(resolver.logo({ id: "290", season: 1980 })).toBe("https://data.test/logos/historique/290-avant.png");
  });

  it("garde le logo actuel du site hors des périodes connues", () => {
    expect(resolver.logo({ id: "290", season: 2010 })).toBe("/_assets/teamlogos/logoauxerre.svg");
    expect(resolver.logo({ id: "290" })).toBe("/_assets/teamlogos/logoauxerre.svg");
  });

  it("préfère la période la plus précise", () => {
    expect(resolver.logo({ id: "244", season: 1998 })).toBe("https://exemple.fr/om-1998.png");
    expect(resolver.logo({ id: "244", season: 1999 })).toBe("https://data.test/logos/historique/244-1993.png");
  });

  it("retrouve le club par un de ses noms", () => {
    expect(resolver.logo({ name: "Olympique de Marseille", season: 1995 })).toBe(
      "https://data.test/logos/historique/244-1993.png",
    );
  });

  it("retombe sur le logo Transfermarkt, puis sur l'écusson neutre", () => {
    expect(resolver.logo({ id: "30626", name: "SC Hazebrouck", season: 1974 })).toBe("https://data.test/logos/30626.png");
    expect(resolver.logo({ name: "Club inconnu" })).toBe("/_assets/teamlogos/logodefault.png");
  });

  it("ne renvoie un logo d'époque que dans une période connue", () => {
    expect(resolver.periodLogo({ id: "290", season: 2010 })).toBeNull();
    expect(resolver.periodLogo({ id: "290", season: null })).toBeNull();
  });

  it("met à jour les parcours des méthodes expert selon l'année d'arrivée", () => {
    const joueur = {
      typemethode: "joueur",
      clubs: [
        ["/logo-choisi.png", "AJ Auxerre", "1994-1997"],
        ["/logo-choisi.png", "AJ Auxerre", "2004-2006"],
      ] as [string, string, string][],
    };
    expect(withPeriodClubLogos(joueur, resolver).clubs.map((c) => c[0])).toEqual([
      "https://data.test/logos/historique/290-1992.png",
      "/logo-choisi.png",
    ]);
  });
});

describe("seasonOfFrenchDate", () => {
  it("bascule en juillet", () => {
    expect(seasonOfFrenchDate("Samedi 20 mars 1999, 20h00")).toBe(1998);
    expect(seasonOfFrenchDate("mercredi 15 septembre 2010, 20h45")).toBe(2010);
    expect(seasonOfFrenchDate("date inconnue")).toBeNull();
  });
});
