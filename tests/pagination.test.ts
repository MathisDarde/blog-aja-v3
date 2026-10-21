// Pagination de /articles : lecture de ?page=, découpage, numéros affichés.
import { describe, expect, it } from "vitest";
import { pageNumbers, paginate, parsePage } from "@/lib/pagination";

describe("parsePage", () => {
  it("lit un entier positif", () => {
    expect(parsePage("3")).toBe(3);
  });

  it("renvoie à la page 1 pour une valeur absente ou invalide", () => {
    for (const value of [null, undefined, "", "0", "-2", "1.5", "abc"]) {
      expect(parsePage(value)).toBe(1);
    }
  });
});

describe("paginate", () => {
  const items = Array.from({ length: 25 }, (_, i) => i + 1);

  it("découpe par pages", () => {
    expect(paginate(items, 1, 10)).toEqual({ items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], page: 1, totalPages: 3 });
    expect(paginate(items, 3, 10)).toEqual({ items: [21, 22, 23, 24, 25], page: 3, totalPages: 3 });
  });

  it("ramène une page trop grande à la dernière", () => {
    expect(paginate(items, 9, 10).page).toBe(3);
  });

  it("garde une page (vide) quand il n'y a rien", () => {
    expect(paginate([], 2, 10)).toEqual({ items: [], page: 1, totalPages: 1 });
  });
});

describe("pageNumbers", () => {
  it("affiche tout quand il y a peu de pages", () => {
    expect(pageNumbers(1, 1)).toEqual([1]);
    expect(pageNumbers(2, 4)).toEqual([1, 2, 3, 4]);
  });

  it("met des points de suspension pour les trous", () => {
    expect(pageNumbers(1, 10)).toEqual([1, 2, "…", 10]);
    expect(pageNumbers(5, 10)).toEqual([1, "…", 4, 5, 6, "…", 10]);
    expect(pageNumbers(10, 10)).toEqual([1, "…", 9, 10]);
  });

  it("affiche le numéro plutôt que « … » pour un trou d'une seule page", () => {
    expect(pageNumbers(4, 10)).toEqual([1, 2, 3, 4, 5, "…", 10]);
  });
});
