import { describe, expect, it } from "vitest";
import { withHeadingAnchors } from "@/lib/article-toc";
import { readingMinutes } from "@/lib/reading-time";

describe("sommaire des articles", () => {
  it("donne une ancre lisible et unique à chaque intertitre", () => {
    const { html, toc } = withHeadingAnchors(
      '<h2 style="text-align: justify;">L’Ajax, tenant du titre</h2><p>…</p>' +
        '<h3>La loterie des <a class="methode-expert" href="/matchs/x">tirs au but</a></h3>' +
        "<h2>L'Ajax, tenant du titre</h2>",
    );
    expect(toc).toEqual([
      { id: "l-ajax-tenant-du-titre", text: "L’Ajax, tenant du titre", level: 2 },
      { id: "la-loterie-des-tirs-au-but", text: "La loterie des tirs au but", level: 3 },
      { id: "l-ajax-tenant-du-titre-2", text: "L'Ajax, tenant du titre", level: 2 },
    ]);
    expect(html).toContain('<h2 id="l-ajax-tenant-du-titre" style="text-align: justify;">');
    expect(html).toContain('<h2 id="l-ajax-tenant-du-titre-2">');
  });

  it("garde l'id existant et ignore les intertitres vides", () => {
    const { html, toc } = withHeadingAnchors('<h2 id="debut">Début</h2><h2></h2><h4>Pas au sommaire</h4>');
    expect(toc).toEqual([{ id: "debut", text: "Début", level: 2 }]);
    expect(html).toBe('<h2 id="debut">Début</h2><h2></h2><h4>Pas au sommaire</h4>');
  });
});

describe("temps de lecture", () => {
  it("compte les mots du texte, sans les balises, au moins une minute", () => {
    expect(readingMinutes(`<p>${"mot ".repeat(2200)}</p>`)).toBe(10);
    expect(readingMinutes('<p class="x">Court</p>')).toBe(1);
  });
});
