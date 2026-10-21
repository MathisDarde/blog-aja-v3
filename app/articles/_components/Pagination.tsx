import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { pageNumbers } from "@/lib/pagination";

type PaginationProps = {
  page: number;
  totalPages: number;
  pageHref: (page: number) => string;
};

const itemClass =
  "inline-flex items-center justify-center min-w-9 h-9 px-2 text-sm font-semibold";

// Liens plutôt que boutons : chaque page a son URL (partage, retour arrière)
export default function Pagination({ page, totalPages, pageHref }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label="Pagination des articles"
      className="flex flex-wrap items-center justify-center gap-1 sm:gap-2 mt-6 mb-2 font-Montserrat"
    >
      {page > 1 ? (
        <Link
          href={pageHref(page - 1)}
          className={`${itemClass} bg-white hover:bg-orange-third hover:text-white`}
          aria-label="Page précédente"
        >
          <ChevronLeft size={18} />
        </Link>
      ) : (
        <span className={`${itemClass} bg-white text-gray-300`} aria-hidden="true">
          <ChevronLeft size={18} />
        </span>
      )}

      {pageNumbers(page, totalPages).map((p, i) =>
        p === "…" ? (
          <span key={`gap-${i}`} className={`${itemClass} text-gray-500`}>
            …
          </span>
        ) : p === page ? (
          <span
            key={p}
            className={`${itemClass} bg-orange-third text-white`}
            aria-current="page"
          >
            {p}
          </span>
        ) : (
          <Link
            key={p}
            href={pageHref(p)}
            className={`${itemClass} bg-white hover:bg-orange-third hover:text-white`}
            aria-label={`Page ${p}`}
          >
            {p}
          </Link>
        )
      )}

      {page < totalPages ? (
        <Link
          href={pageHref(page + 1)}
          className={`${itemClass} bg-white hover:bg-orange-third hover:text-white`}
          aria-label="Page suivante"
        >
          <ChevronRight size={18} />
        </Link>
      ) : (
        <span className={`${itemClass} bg-white text-gray-300`} aria-hidden="true">
          <ChevronRight size={18} />
        </span>
      )}
    </nav>
  );
}
