"use client";

import { ChevronDown, ListOrdered } from "lucide-react";
import { useEffect, useState } from "react";
import type { TocEntry } from "@/lib/article-toc";

/** Sommaire cliquable de l'article : ouvert sur grand écran, replié sur mobile. */
export default function ArticleToc({ toc }: { toc: TocEntry[] }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(window.matchMedia("(min-width: 1024px)").matches);
  }, []);

  let part = 0;

  return (
    <nav aria-label="Sommaire" className="bg-white rounded-xl font-Montserrat text-left">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-3 p-4 sm:px-8 sm:py-5"
      >
        <span className="flex items-center gap-2 font-Bai_Jamjuree font-bold uppercase text-lg sm:text-xl">
          <ListOrdered size={22} className="text-aja-blue" />
          Sommaire
          <span className="text-gray-500 text-sm sm:text-base font-semibold normal-case">
            ({toc.filter((entry) => entry.level === 2).length} parties)
          </span>
        </span>
        <ChevronDown size={20} className={`text-gray-500 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <ol className="px-4 pb-5 sm:px-8 sm:pb-6 lg:columns-2 lg:gap-10 text-sm sm:text-base">
          {toc.map((entry) => {
            if (entry.level === 2) part++;
            return (
              <li key={entry.id} className={`break-inside-avoid ${entry.level === 3 ? "pl-8" : "mt-2 first:mt-0"}`}>
                <a
                  href={`#${entry.id}`}
                  className={`flex gap-2 py-0.5 hover:text-aja-blue transition-colors ${
                    entry.level === 2 ? "font-semibold text-gray-900" : "text-gray-600"
                  }`}
                >
                  {entry.level === 2 && <span className="text-orange-third tabular-nums w-6 shrink-0">{part}.</span>}
                  <span>{entry.text}</span>
                </a>
              </li>
            );
          })}
        </ol>
      )}
    </nav>
  );
}
