// Pagination de la liste des articles : découpage et numéros de page à afficher.

export const ARTICLES_PER_PAGE = 12;

// Lit `?page=` : tout ce qui n'est pas un entier ≥ 1 renvoie à la page 1
export function parsePage(value: string | null | undefined): number {
  const page = Number(value);
  return Number.isInteger(page) && page >= 1 ? page : 1;
}

export type Paginated<T> = {
  items: T[];
  page: number;
  totalPages: number;
};

// Une page trop grande (ex. après un filtre) est ramenée à la dernière page existante
export function paginate<T>(items: T[], page: number, perPage = ARTICLES_PER_PAGE): Paginated<T> {
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const current = Math.min(Math.max(1, page), totalPages);
  const start = (current - 1) * perPage;
  return { items: items.slice(start, start + perPage), page: current, totalPages };
}

// Première, dernière et voisines de la page courante ; "…" pour les trous
// de plus d'une page (un trou d'une seule page affiche directement son numéro)
export function pageNumbers(page: number, totalPages: number, siblings = 1): (number | "…")[] {
  const shown = new Set([1, totalPages]);
  for (let p = page - siblings; p <= page + siblings; p++) {
    if (p >= 1 && p <= totalPages) shown.add(p);
  }

  const sorted = [...shown].sort((a, b) => a - b);
  const result: (number | "…")[] = [];
  sorted.forEach((p, i) => {
    const previous = sorted[i - 1];
    if (previous !== undefined) {
      if (p - previous === 2) result.push(previous + 1);
      else if (p - previous > 2) result.push("…");
    }
    result.push(p);
  });
  return result;
}
