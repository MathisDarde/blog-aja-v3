"use client";

import { usePathname, useRouter } from "next/navigation";

export interface SeasonOption {
  seasonId: number;
  season: string;
  competitionName: string;
}

/** Liste déroulante des saisons archivées ; la saison choisie passe dans l'URL (?saison=1995). */
export default function SeasonSelector({
  seasons,
  selected,
}: {
  seasons: SeasonOption[];
  selected: number;
}) {
  const router = useRouter();
  const pathname = usePathname();

  if (seasons.length < 2) return null;
  const latest = seasons[0].seasonId;

  return (
    <label className="inline-flex items-center gap-2 font-Montserrat text-sm">
      <span className="font-semibold">Saison</span>
      <select
        value={selected}
        onChange={(e) => {
          const seasonId = Number(e.target.value);
          router.push(seasonId === latest ? pathname : `${pathname}?saison=${seasonId}`, { scroll: false });
        }}
        className="border border-gray-300 rounded-full px-3 py-1.5 bg-white cursor-pointer"
      >
        {seasons.map((s) => (
          <option key={s.seasonId} value={s.seasonId}>
            {s.season} · {s.competitionName}
          </option>
        ))}
      </select>
    </label>
  );
}
