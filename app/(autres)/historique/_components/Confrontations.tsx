"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { HistoMatch } from "@/lib/scraped-data";
import { normalizeText } from "@/lib/normalize-text";

type Outcome = "V" | "N" | "D";

const outcome = (m: HistoMatch): Outcome | null => {
  if (m.buts_aja === null || m.buts_adversaire === null) return null;
  if (m.buts_aja > m.buts_adversaire) return "V";
  return m.buts_aja === m.buts_adversaire ? "N" : "D";
};

const OUTCOME_STYLE: Record<Outcome, string> = {
  V: "bg-green-100 text-green-800",
  N: "bg-gray-100 text-gray-700",
  D: "bg-red-100 text-red-800",
};

function bilan(matchs: HistoMatch[]) {
  const played = matchs.filter((m) => outcome(m));
  return {
    joues: played.length,
    V: played.filter((m) => outcome(m) === "V").length,
    N: played.filter((m) => outcome(m) === "N").length,
    D: played.filter((m) => outcome(m) === "D").length,
    pour: played.reduce((n, m) => n + (m.buts_aja ?? 0), 0),
    contre: played.reduce((n, m) => n + (m.buts_adversaire ?? 0), 0),
  };
}

export default function Confrontations({ matchs }: { matchs: HistoMatch[] }) {
  // Adversaires du plus affronté au moins affronté
  const adversaires = useMemo(() => {
    const counts = new Map<string, number>();
    for (const m of matchs) counts.set(m.adversaire, (counts.get(m.adversaire) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "fr"));
  }, [matchs]);

  const [selected, setSelected] = useState<string>(adversaires[0]?.[0] ?? "");
  const [query, setQuery] = useState("");

  const suggestions = useMemo(() => {
    const q = normalizeText(query);
    return q ? adversaires.filter(([name]) => normalizeText(name).includes(q)).slice(0, 8) : [];
  }, [adversaires, query]);

  const face = useMemo(
    () =>
      matchs
        .filter((m) => m.adversaire === selected)
        .sort((a, b) => b.seasonId - a.seasonId || Number(b.journee) - Number(a.journee)),
    [matchs, selected]
  );
  const b = bilan(face);

  return (
    <div className="font-Montserrat text-left">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Choix de l'adversaire */}
        <div className="lg:w-72 shrink-0">
          <div className="relative">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Chercher un club…"
              aria-label="Chercher un adversaire"
              className="w-full h-10 rounded-full px-4 text-sm border border-gray-300"
            />
            {suggestions.length > 0 && (
              <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg text-sm">
                {suggestions.map(([name, count]) => (
                  <li key={name}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelected(name);
                        setQuery("");
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 flex justify-between"
                    >
                      {name} <span className="text-gray-400">{count}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <p className="mt-4 mb-2 text-xs uppercase tracking-wider text-gray-500 font-semibold">Les plus affrontés</p>
          <ul className="space-y-1 text-sm">
            {adversaires.slice(0, 10).map(([name, count]) => (
              <li key={name}>
                <button
                  type="button"
                  onClick={() => setSelected(name)}
                  className={`w-full flex justify-between px-3 py-1.5 rounded-md transition-colors ${
                    name === selected ? "bg-aja-blue text-white" : "hover:bg-gray-100"
                  }`}
                >
                  <span className="truncate">{name}</span>
                  <span className={name === selected ? "text-white/80" : "text-gray-400"}>{count}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Bilan et matchs face à l'adversaire choisi */}
        <div className="flex-1 min-w-0">
          <h3 className="font-Bai_Jamjuree text-2xl font-bold">AJA – {selected}</h3>
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              ["Matchs", b.joues],
              ["Victoires", b.V],
              ["Nuls", b.N],
              ["Défaites", b.D],
              ["Buts", `${b.pour}-${b.contre}`],
            ].map(([label, value]) => (
              <div key={label} className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">{label}</p>
                <p className="font-Bai_Jamjuree text-2xl font-bold">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 max-h-[420px] overflow-y-auto border border-gray-200 rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr className="text-left text-xs text-gray-500">
                  <th className="px-3 py-2 font-semibold">Saison</th>
                  <th className="px-3 py-2 font-semibold">Date</th>
                  <th className="px-3 py-2 font-semibold">Lieu</th>
                  <th className="px-3 py-2 font-semibold text-right">Score AJA</th>
                </tr>
              </thead>
              <tbody>
                {face.map((m) => {
                  const o = outcome(m);
                  return (
                    <tr key={`${m.seasonId}-${m.journee}`} className="border-t border-gray-100">
                      <td className="px-3 py-2">
                        <Link href={`/calendrier?saison=${m.seasonId}`} className="hover:underline text-aja-blue">
                          {m.seasonId}-{String(m.seasonId + 1).slice(2)}
                        </Link>
                      </td>
                      <td className="px-3 py-2 text-gray-600">{m.date}</td>
                      <td className="px-3 py-2">{m.dom_ext === "D" ? "Domicile" : "Extérieur"}</td>
                      <td className="px-3 py-2 text-right tabular-nums">
                        {o ? (
                          <span className={`inline-block px-2 py-0.5 rounded-md font-semibold ${OUTCOME_STYLE[o]}`}>
                            {m.buts_aja}-{m.buts_adversaire}
                          </span>
                        ) : (
                          <span className="text-gray-400">à venir</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
