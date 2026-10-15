// Méthodes expert citées dans un article (spans insérés par l'éditeur).
import { describe, expect, it } from "vitest";
import { mentionedMethodes } from "@/lib/methodes";

describe("mentionedMethodes", () => {
  it("lit l'identifiant et le type, quel que soit l'ordre des attributs", () => {
    const html = [
      '<span class="methode-expert" data-id="a1" data-type="joueur">Cissé</span>',
      '<span data-type="match" data-id="m2" class="mention methode-expert">AJA-Ajax</span>',
      '<span class="autre" data-id="x" data-type="joueur">pas une méthode</span>',
    ].join(" ");
    expect([...mentionedMethodes(html)]).toEqual(["joueur:a1", "match:m2"]);
  });
});
