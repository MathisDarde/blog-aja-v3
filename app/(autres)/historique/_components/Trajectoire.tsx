"use client";

import { useEffect, useRef, useState } from "react";
import { SaisonIndexEntry } from "@/lib/scraped-data";

// Rang « continu » sur la pyramide : Ligue 1 de 1 à 20, puis Ligue 2 de 21 à 40
const DIVISION_SPAN = 20;
const DIVISIONS = [
  { id: "FR1", label: "Ligue 1", offset: 0, band: "#e8f0f9" },
  { id: "FR2", label: "Ligue 2", offset: DIVISION_SPAN, band: "#f4f4f3" },
];

const HEIGHT = 340;
const MARGIN = { top: 24, right: 16, bottom: 32, left: 40 };
const LINE = "#3c77b4"; // bleu AJA, validé (contraste, luminosité) avec scripts/validate_palette.js
const INK_MUTED = "#6b7280";
const GRID = "#e5e7eb";

type Point = SaisonIndexEntry & { aja: NonNullable<SaisonIndexEntry["aja"]>; level: number };

export default function Trajectoire({ saisons }: { saisons: SaisonIndexEntry[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(900);
  const [active, setActive] = useState<Point | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const points: Point[] = saisons
    .filter((s): s is SaisonIndexEntry & { aja: NonNullable<SaisonIndexEntry["aja"]> } => !!s.aja)
    .map((s) => ({
      ...s,
      level: (DIVISIONS.find((d) => d.id === s.competition.id)?.offset ?? DIVISION_SPAN) + s.aja.position,
    }))
    .sort((a, b) => a.seasonId - b.seasonId);

  if (points.length === 0) return null;

  const plotW = Math.max(width - MARGIN.left - MARGIN.right, 100);
  const plotH = HEIGHT - MARGIN.top - MARGIN.bottom;
  const first = points[0].seasonId;
  const last = points[points.length - 1].seasonId;
  const step = plotW / Math.max(last - first, 1);
  const x = (seasonId: number) => MARGIN.left + (seasonId - first) * step;
  const y = (level: number) => MARGIN.top + ((level - 0.5) / (2 * DIVISION_SPAN)) * plotH;

  // La ligne est coupée là où une saison manque à l'archive
  const path = points
    .map((p, i) => `${i === 0 || p.seasonId !== points[i - 1].seasonId + 1 ? "M" : "L"}${x(p.seasonId)},${y(p.level)}`)
    .join(" ");
  const decades = Array.from({ length: 10 }, (_, i) => Math.ceil(first / 10) * 10 + i * 10).filter((d) => d <= last);
  const titles = points.filter((p) => p.aja.position === 1);

  return (
    <div ref={containerRef} className="relative w-full font-Montserrat">
      <svg width={width} height={HEIGHT} role="img" aria-label="Classement de l'AJA saison par saison, en Ligue 1 et en Ligue 2">
        {/* Bandes de division, nommées directement */}
        {DIVISIONS.map((d) => (
          <g key={d.id}>
            <rect
              x={MARGIN.left}
              y={y(d.offset + 0.5)}
              width={plotW}
              height={y(d.offset + DIVISION_SPAN + 0.5) - y(d.offset + 0.5)}
              fill={d.band}
            />
            <text x={MARGIN.left + 8} y={y(d.offset + 0.5) + 16} fontSize={12} fontWeight={700} fill="#111827">
              {d.label}
            </text>
            {/* 1er et 10e par division ; 20e seulement en bas, pour ne pas toucher le 1er de la division suivante */}
            {[1, 10, ...(d.offset === DIVISION_SPAN ? [20] : [])].map((rank) => (
              <text key={rank} x={MARGIN.left - 6} y={y(d.offset + rank)} textAnchor="end" dominantBaseline="middle" fontSize={11} fill={INK_MUTED} className="tabular-nums">
                {rank === 1 ? "1er" : `${rank}e`}
              </text>
            ))}
          </g>
        ))}

        {/* Axe des saisons */}
        <line x1={MARGIN.left} x2={MARGIN.left + plotW} y1={HEIGHT - MARGIN.bottom} y2={HEIGHT - MARGIN.bottom} stroke={GRID} />
        {decades.map((d) => (
          <g key={d}>
            <line x1={x(d)} x2={x(d)} y1={MARGIN.top} y2={HEIGHT - MARGIN.bottom} stroke={GRID} />
            <text x={x(d)} y={HEIGHT - MARGIN.bottom + 18} textAnchor="middle" fontSize={11} fill={INK_MUTED} className="tabular-nums">
              {d}
            </text>
          </g>
        ))}

        <path d={path} fill="none" stroke={LINE} strokeWidth={2} strokeLinejoin="round" />

        {points.map((p) => (
          <circle
            key={p.seasonId}
            cx={x(p.seasonId)}
            cy={y(p.level)}
            r={active?.seasonId === p.seasonId ? 6 : 4}
            fill={LINE}
            stroke="#ffffff"
            strokeWidth={2}
          />
        ))}

        {/* Titres de champion, annotés directement */}
        {titles.map((p) => (
          <text key={p.seasonId} x={x(p.seasonId)} y={y(p.level) - 12} textAnchor="middle" fontSize={11} fontWeight={700} fill="#111827">
            🏆 {p.season.slice(0, 5)}{p.season.slice(7)}
          </text>
        ))}

        {/* Zones de survol : une colonne par saison, plus large que le point */}
        {points.map((p) => (
          <rect
            key={p.seasonId}
            x={x(p.seasonId) - Math.max(step, 12) / 2}
            y={MARGIN.top}
            width={Math.max(step, 12)}
            height={plotH}
            fill="transparent"
            tabIndex={0}
            aria-label={`${p.season}, ${p.competition.name}, ${p.aja.position}e sur ${p.equipes}`}
            onMouseEnter={() => setActive(p)}
            onFocus={() => setActive(p)}
            onMouseLeave={() => setActive(null)}
            onBlur={() => setActive(null)}
            className="outline-none cursor-default"
          />
        ))}
      </svg>

      {active && (
        <div
          className="pointer-events-none absolute z-10 bg-white border border-gray-200 shadow-lg rounded-lg px-3 py-2 text-xs text-left"
          style={{
            left: Math.min(Math.max(x(active.seasonId) - 90, 0), width - 180),
            top: Math.max(y(active.level) - 92, 0),
            width: 180,
          }}
        >
          <p className="font-semibold text-sm">{active.season}</p>
          <p className="text-gray-600">{active.competition.name}</p>
          <p className="mt-1">
            <span className="font-semibold">{active.aja.position}e</span> sur {active.equipes} · {active.aja.points} pts
          </p>
          <p className="text-gray-600 tabular-nums">
            {active.aja.gagnes} V · {active.aja.nuls} N · {active.aja.perdus} D · {active.aja.buts_marques}-{active.aja.buts_encaisses}
          </p>
        </div>
      )}
    </div>
  );
}
