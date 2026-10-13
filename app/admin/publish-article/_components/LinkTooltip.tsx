"use client";

import { ExternalLink, Pencil, Trash2 } from "lucide-react";

interface LinkTooltipProps {
  show: boolean;
  top: number;
  left: number;
  href: string;
  onEdit: () => void;
  onRemove: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export const LinkTooltip = ({
  show,
  top,
  left,
  href,
  onEdit,
  onRemove,
  onMouseEnter,
  onMouseLeave,
}: LinkTooltipProps) => {
  if (!show) return null;

  const displayHref = href.length > 50 ? href.slice(0, 47) + "…" : href;

  return (
    <div
      className="link-tooltip menu-container absolute z-50 flex items-center gap-2 bg-slate-900 text-white rounded-xl shadow-xl border border-slate-700 px-3 py-2"
      style={{ top: `${top}px`, left: `${left}px` }}
      onMouseDown={(e) => e.preventDefault()}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 text-sm font-Montserrat hover:underline max-w-[260px] truncate"
        title={href}
        onMouseDown={(e) => e.preventDefault()}
        onClick={(e) => e.preventDefault()}
      >
        {displayHref}
      </a>

      <div className="w-[1px] h-5 bg-slate-700 mx-1" />

      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={onEdit}
        className="p-2 hover:bg-slate-700 rounded-lg text-gray-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-Montserrat"
        title="Modifier l'URL"
      >
        <Pencil size={13} />
        <span>Modifier</span>
      </button>

      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={onRemove}
        className="p-2 hover:bg-slate-700 rounded-lg text-gray-300 hover:text-red-400 transition-colors flex items-center gap-1.5 text-xs font-Montserrat"
        title="Supprimer le lien"
      >
        <Trash2 size={13} />
        <span>Supprimer</span>
      </button>

      <div className="w-[1px] h-5 bg-slate-700 mx-1" />

      <span className="text-[10px] text-slate-500 font-Montserrat flex items-center gap-1 whitespace-nowrap">
        <ExternalLink size={10} />
        Ctrl+Clic
      </span>
    </div>
  );
};
