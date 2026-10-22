import { describe, expect, it, vi } from "vitest";

// Seule la fonction de classement est testée : pas de base
vi.mock("@/controllers/ArticlesController", () => ({}));
vi.mock("@/lib/methode-pages", () => ({}));
const { rankRelated } = await import("@/lib/related-articles");

const article = (slug: string, tags: string[], methodes: string[], day: number) => ({
  slug,
  tags,
  methodes: new Set(methodes),
  createdAt: new Date(2026, 0, day),
});

describe("articles liés", () => {
  const current = { slug: "uefa-1993", tags: ["1991-2000", "coupedeurope"], methodes: new Set(["joueur:cocard", "match:dortmund"]) };

  it("classe par méthodes citées en commun, puis par tags, puis du plus récent au plus ancien", () => {
    const ranked = rankRelated(current, [
      article("uefa-1993", ["1991-2000"], ["joueur:cocard"], 1),
      article("tags-seuls", ["1991-2000", "coupedeurope"], [], 2),
      article("une-methode", [], ["joueur:cocard"], 3),
      article("rien-recent", [], [], 9),
      article("rien-ancien", [], [], 4),
    ]);
    // une méthode (2 points) = deux tags (2 points) : le plus récent d'abord
    expect(ranked).toEqual(["une-methode", "tags-seuls", "rien-recent"]);
  });

  it("ne propose jamais l'article lui-même", () => {
    expect(rankRelated(current, [article("uefa-1993", [], [], 1)])).toEqual([]);
  });
});
