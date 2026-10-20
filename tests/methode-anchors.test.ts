// Mentions des méthodes dans les articles changées en liens vers leur page.
import { describe, expect, it } from "vitest";
import { methodeAnchors } from "@/lib/methodes";

const methodes = [
  { typemethode: "joueur" as const, id_methode: "j1", slug: "djibril-cisse" },
  { typemethode: "match" as const, id_methode: "m1", slug: "auxerre-borussia-dortmund-1993" },
  { typemethode: "coach" as const, id_methode: "c1", slug: null },
];

describe("methodeAnchors", () => {
  it("change une mention de l'éditeur en lien, attributs conservés", () => {
    const html = '<p>But de <span class="methode-expert" data-id="j1" data-type="joueur">Djibril Cissé</span> !</p>';
    expect(methodeAnchors(html, methodes)).toBe(
      '<p>But de <a class="methode-expert" data-id="j1" data-type="joueur" href="/joueurs/djibril-cisse">Djibril Cissé</a> !</p>',
    );
  });

  it("accepte les attributs dans un autre ordre", () => {
    const html = '<span data-type="match" data-id="m1" class="methode-expert">AJA-BVB</span>';
    expect(methodeAnchors(html, methodes)).toContain('href="/matchs/auxerre-borussia-dortmund-1993">AJA-BVB</a>');
  });

  it("laisse une méthode sans page ou inconnue en simple surlignage", () => {
    const html =
      '<span class="methode-expert" data-id="c1" data-type="coach">Guy Roux</span> <span class="methode-expert" data-id="x" data-type="joueur">X</span>';
    expect(methodeAnchors(html, methodes)).toBe(html);
  });

  it("ne touche pas aux autres spans", () => {
    const html = '<span class="highlight">Djibril Cissé</span>';
    expect(methodeAnchors(html, methodes)).toBe(html);
  });
});
