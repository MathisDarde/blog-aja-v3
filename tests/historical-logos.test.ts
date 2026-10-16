// Logos d'époque lus dans les galeries Wikipédia FR des clubs (clubs hors championnat).
import { describe, expect, it } from "vitest";
import { cleanCaption, logosFromWikitext, parsePeriod, sinceMinSeason } from "@/lib/historical-logos";
import { wikitext } from "./helpers";

const periods = (name: string) => logosFromWikitext(wikitext(name)).map((l) => [l.de, l.a]);

describe("logos d'époque Wikipédia", () => {
  it("lit une galerie italienne et écarte le logo du centenaire (Milan)", () => {
    const text = `== Simboli ==
=== Stemma ===
<gallery>
Escudo ac milan 1946.svg|Stemma utilizzato dal 1946 fino al 1979
AC Milan Diavoletto (1979-1986).svg|Stemma del ''Diavoletto'' usato dal 1979 al 1986
AC Milan logo (1986-1998).png|Stemma del Milan utilizzato dal 1986 al 1997.
100 Milan.png|Il logo per ''CentoMilan'', il centenario rossonero del 1999.
Logo of AC Milan.svg|Stemma del Milan in uso dal 1997.
</gallery>`;
    expect(logosFromWikitext(text).map((l) => [l.de, l.a])).toEqual([
      [1946, 1978],
      [1979, 1985],
      [1986, 1996],
      [1997, null],
    ]);
  });

  it.each([
    ["{{Centrer|Avant 1992.}}", [null, 1991]],
    ["{{Centrer|1992-1997.}}", [1992, 1996]],
    ["{{Centrer|Depuis 1997.}}", [1997, null]],
    ["<center>Années 1960.</center>", [1960, 1969]],
    ["alt=Ecu rectangulaire blanc et vert|1978-1980.", [1978, 1979]],
    ["<center>Jusqu'en 1967</center>", [null, 1966]],
    ["Logo actuel{{,}}(2026-)", [2026, null]],
    ["<center>1921 à 1934<ref>source</ref></center>", [1921, 1933]],
    // Galeries des clubs étrangers, dans leur langue
    ["Stemma utilizzato dal 1946 fino al 1979, con piccole variazioni", [1946, 1978]],
    ["Stemma del Milan in uso dal 1997.", [1997, null]],
    ["Milan logo used between 1936 and 1945", [1936, 1944]],
    ["Milan logo used since 1998", [1998, null]],
    ["seit 2026", [2026, null]],
    ["1905–1952", [1905, 1951]],
    ["Escudo desde 2001", [2001, null]],
    ["Badge used in the 1970s", [1970, 1979]],
  ])("lit la période de « %s »", (caption, period) => {
    expect(parsePeriod(cleanCaption(caption))).toEqual(period);
  });

  it("lit une galerie sans préfixe « Fichier: » sous « Historique du logo » (Zénith)", () => {
    expect(periods("fr-zenit")).toEqual(
      expect.arrayContaining([[1978, 1986], [1998, 2012], [2015, 2022], [2023, null]]),
    );
  });

  it("écarte les logos d'anniversaire et garde « OM (1935-72).svg » (Marseille)", () => {
    const logos = logosFromWikitext(wikitext("fr-marseille"));
    expect(logos.some((l) => /anniversaire/i.test(l.caption))).toBe(false);
    expect(logos.map((l) => [l.de, l.a])).toEqual(expect.arrayContaining([[1935, 1971], [2004, 2025], [2026, null]]));
  });

  it("enchaîne les périodes (Toulouse)", () => {
    expect(periods("fr-toulouse").slice(0, 3)).toEqual([[1970, 1978], [1979, 1983], [1984, 1989]]);
  });

  it("ne garde rien d'avant 1970", () => {
    const kept = sinceMinSeason(logosFromWikitext(wikitext("fr-zenit")));
    expect(kept.every((l) => l.a === null || l.a >= 1970)).toBe(true);
    expect(kept.map((l) => [l.de, l.a])).toContainEqual([1940, 1976]);
  });
});
