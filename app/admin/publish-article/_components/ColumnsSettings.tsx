import { useState } from "react";
import { Editor } from "@tiptap/react";
import {
  Columns,
  Box,
  Trash2,
  Plus,
  Smartphone,
  Minus,
  AlignVerticalSpaceAround as AlignVerticalTop,
  AlignVerticalSpaceBetween as AlignVerticalBottom,
  AlignVerticalJustifyCenter,
  StretchVertical,
  ChevronRight,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Palette,
  SunDim,
} from "lucide-react";

interface Props {
  editor: Editor;
  onClose: () => void;
}

type Tab = "grid" | "cell";

export const GridSettings = ({ editor, onClose }: Props) => {
  const [activeTab, setActiveTab] = useState<Tab>("grid");
  const colAttrs = editor.getAttributes("column");
  const gridAttrs = editor.getAttributes("columns");

  const updateGrid = (attrs: Record<string, unknown>) =>
    editor.chain().updateAttributes("columns", attrs).run();
  const updateCell = (attrs: Record<string, unknown>) =>
    editor.chain().updateAttributes("column", attrs).run();

  const preventBlur = (e: React.MouseEvent) => {
    const tag = (e.target as HTMLElement).tagName;
    if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") return;
    e.preventDefault();
    e.stopPropagation();
  };

  const countColumns = () => {
    const { state } = editor;
    const $from = state.selection.$from;
    let depth = $from.depth;
    while (depth > 0) {
      if (state.doc.nodeAt($from.before(depth))?.type.name === "columns") break;
      depth--;
    }
    if (depth <= 0) return 0;
    return state.doc.nodeAt($from.before(depth))?.childCount ?? 0;
  };

  return (
    <div className="space-y-4" onMouseDown={preventBlur}>
      {/* ─── TAB BAR ─── */}
      <div className="flex bg-slate-100 rounded-lg p-0.5 gap-0.5">
        <button
          type="button"
          onClick={() => setActiveTab("grid")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wide transition-all ${
            activeTab === "grid"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <Columns size={12} /> Grille
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("cell")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wide transition-all ${
            activeTab === "cell"
              ? "bg-white text-purple-600 shadow-sm"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <Box size={12} /> Cellule
        </button>
      </div>

      {/* ─── GRID TAB ─── */}
      {activeTab === "grid" && (
        <div className="space-y-3 animate-in fade-in duration-200">
          {/* Info bar */}
          <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
            <span className="text-[10px] font-bold text-blue-600 flex items-center gap-1.5">
              <Columns size={12} /> {countColumns()} colonne
              {countColumns() > 1 ? "s" : ""}
            </span>
            <button
              type="button"
              onClick={() => setActiveTab("cell")}
              className="text-[9px] font-bold text-blue-500 hover:text-blue-700 flex items-center gap-0.5"
            >
              Voir cellule <ChevronRight size={10} />
            </button>
          </div>

          {/* Gap & Padding */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <span className="text-[9px] text-slate-400 uppercase font-bold">
                Gap
              </span>
              <input
                type="text"
                value={gridAttrs.gap ?? ""}
                onChange={(e) => updateGrid({ gap: e.target.value })}
                className="w-full text-xs p-1.5 border rounded-lg bg-slate-50 focus:ring-1 focus:ring-blue-300 outline-none"
                placeholder="1rem"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[9px] text-slate-400 uppercase font-bold">
                Padding
              </span>
              <input
                type="text"
                value={gridAttrs.padding ?? ""}
                onChange={(e) => updateGrid({ padding: e.target.value })}
                className="w-full text-xs p-1.5 border rounded-lg bg-slate-50 focus:ring-1 focus:ring-blue-300 outline-none"
                placeholder="0px"
              />
            </div>
          </div>

          {/* Margins */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <span className="text-[9px] text-slate-400 uppercase font-bold">
                Marge haut
              </span>
              <input
                type="text"
                value={gridAttrs.marginTop ?? ""}
                onChange={(e) => updateGrid({ marginTop: e.target.value })}
                className="w-full text-xs p-1.5 border rounded-lg bg-slate-50 focus:ring-1 focus:ring-blue-300 outline-none"
                placeholder="5px"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[9px] text-slate-400 uppercase font-bold">
                Marge bas
              </span>
              <input
                type="text"
                value={gridAttrs.marginBottom ?? ""}
                onChange={(e) => updateGrid({ marginBottom: e.target.value })}
                className="w-full text-xs p-1.5 border rounded-lg bg-slate-50 focus:ring-1 focus:ring-blue-300 outline-none"
                placeholder="5px"
              />
            </div>
          </div>

          {/* Border */}
          <div className="space-y-2">
            <span className="text-[9px] text-slate-400 uppercase font-bold block">
              Bordure
            </span>
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <span className="text-[8px] text-slate-300 uppercase">
                  Taille
                </span>
                <input
                  type="text"
                  value={gridAttrs.borderWidth ?? ""}
                  onChange={(e) => updateGrid({ borderWidth: e.target.value })}
                  className="w-full text-xs p-1 border rounded bg-slate-50 outline-none"
                  placeholder="0px"
                />
              </div>
              <div className="space-y-1">
                <span className="text-[8px] text-slate-300 uppercase">
                  Style
                </span>
                <select
                  value={gridAttrs.borderStyle ?? "solid"}
                  onChange={(e) => updateGrid({ borderStyle: e.target.value })}
                  className="w-full text-xs p-1 border rounded bg-slate-50 outline-none"
                >
                  <option value="solid">Plein</option>
                  <option value="dashed">Tirets</option>
                  <option value="dotted">Points</option>
                  <option value="none">Aucune</option>
                </select>
              </div>
              <div className="space-y-1">
                <span className="text-[8px] text-slate-300 uppercase">
                  Couleur
                </span>
                <input
                  type="color"
                  value={gridAttrs.borderColor ?? "#e2e8f0"}
                  onChange={(e) => updateGrid({ borderColor: e.target.value })}
                  className="w-full h-7 rounded border cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Border Radius */}
          <div className="space-y-1">
            <span className="text-[9px] text-slate-400 uppercase font-bold">
              Rayon bordure
            </span>
            <input
              type="text"
              value={gridAttrs.borderRadius ?? ""}
              onChange={(e) => updateGrid({ borderRadius: e.target.value })}
              className="w-full text-xs p-1.5 border rounded-lg bg-slate-50 focus:ring-1 focus:ring-blue-300 outline-none"
              placeholder="0.5rem"
            />
          </div>

          {/* Background */}
          <div className="space-y-1">
            <span className="text-[9px] text-slate-400 uppercase font-bold flex items-center gap-1">
              <Palette size={10} /> Fond
            </span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={
                  gridAttrs.backgroundColor === "transparent"
                    ? "#ffffff"
                    : (gridAttrs.backgroundColor ?? "#ffffff")
                }
                onChange={(e) =>
                  updateGrid({ backgroundColor: e.target.value })
                }
                className="w-8 h-8 rounded border cursor-pointer"
              />
              <input
                type="text"
                value={gridAttrs.backgroundColor ?? ""}
                onChange={(e) =>
                  updateGrid({ backgroundColor: e.target.value })
                }
                className="flex-1 text-xs p-1.5 border rounded-lg bg-slate-50 outline-none"
                placeholder="transparent"
              />
            </div>
          </div>

          {/* Shadow */}
          <div className="space-y-1">
            <span className="text-[9px] text-slate-400 uppercase font-bold flex items-center gap-1">
              <SunDim size={10} /> Ombre
            </span>
            <div className="grid grid-cols-4 gap-1 bg-slate-100 p-1 rounded-lg">
              {(["none", "sm", "md", "lg"] as const).map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => updateGrid({ shadow: s })}
                  className={`py-1.5 text-[10px] font-bold rounded ${
                    gridAttrs.shadow === s
                      ? "bg-white shadow-sm text-blue-600"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {s === "none" ? "—" : s.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Stack on mobile */}
          <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600">
              <Smartphone size={12} /> Empiler sur mobile
            </div>
            <input
              type="checkbox"
              checked={gridAttrs.stackOnMobile ?? true}
              onChange={(e) => updateGrid({ stackOnMobile: e.target.checked })}
              className="w-4 h-4 accent-blue-600"
            />
          </div>

          {/* Actions */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => editor.commands.addRow()}
              className="w-full py-2 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold border border-blue-100 hover:bg-blue-100 transition-colors flex items-center justify-center gap-2 uppercase"
            >
              <Plus size={12} /> Ajouter une ligne en dessous
            </button>
            <button
              type="button"
              onClick={() => {
                editor.chain().focus().deleteNode("columns").run();
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 py-2 text-[10px] font-bold text-red-500 hover:bg-red-50 rounded-lg transition-all uppercase"
            >
              <Trash2 size={12} /> Supprimer la grille
            </button>
          </div>
        </div>
      )}

      {/* ─── CELL TAB ─── */}
      {activeTab === "cell" && (
        <div className="space-y-3 animate-in fade-in duration-200">
          {/* Link back to grid */}
          <button
            type="button"
            onClick={() => setActiveTab("grid")}
            className="w-full flex items-center gap-1.5 p-2 bg-purple-50 rounded-lg text-[10px] font-bold text-purple-600 hover:bg-purple-100 transition-colors"
          >
            <Columns size={10} /> ← Retour aux réglages grille
          </button>

          {/* Flex ratio */}
          <div className="space-y-2">
            <span className="text-[9px] text-slate-400 uppercase font-bold text-center block">
              Largeur relative (Ratio)
            </span>
            <div className="flex items-center justify-between bg-white border rounded-xl p-1">
              <button
                type="button"
                onClick={() =>
                  updateCell({ flex: Math.max(1, (colAttrs.flex || 1) - 1) })
                }
                className="p-1.5 hover:bg-slate-100 rounded text-slate-400"
              >
                <Minus size={14} />
              </button>
              <span className="text-sm font-black text-purple-600">
                x{colAttrs.flex || 1}
              </span>
              <button
                type="button"
                onClick={() => updateCell({ flex: (colAttrs.flex || 1) + 1 })}
                className="p-1.5 hover:bg-slate-100 rounded text-slate-400"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Vertical Alignment */}
          <div className="space-y-1.5">
            <span className="text-[9px] text-slate-400 uppercase font-bold block">
              Alignement vertical
            </span>
            <div className="grid grid-cols-4 gap-1 bg-slate-100 p-1 rounded-lg">
              {[
                {
                  id: "flex-start",
                  icon: <AlignVerticalTop size={14} />,
                  label: "Haut",
                },
                {
                  id: "center",
                  icon: <AlignVerticalJustifyCenter size={14} />,
                  label: "Centre",
                },
                {
                  id: "flex-end",
                  icon: <AlignVerticalBottom size={14} />,
                  label: "Bas",
                },
                {
                  id: "stretch",
                  icon: <StretchVertical size={14} />,
                  label: "Étirer",
                },
              ].map((opt) => (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => updateCell({ verticalAlign: opt.id })}
                  title={opt.label}
                  className={`flex justify-center py-1.5 rounded transition-all ${
                    colAttrs.verticalAlign === opt.id
                      ? "bg-white shadow-sm text-purple-600"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {opt.icon}
                </button>
              ))}
            </div>
          </div>

          {/* Text Alignment */}
          <div className="space-y-1.5">
            <span className="text-[9px] text-slate-400 uppercase font-bold block">
              Alignement texte
            </span>
            <div className="grid grid-cols-4 gap-1 bg-slate-100 p-1 rounded-lg">
              {[
                { id: "left", icon: <AlignLeft size={14} /> },
                { id: "center", icon: <AlignCenter size={14} /> },
                { id: "right", icon: <AlignRight size={14} /> },
                { id: "justify", icon: <AlignJustify size={14} /> },
              ].map((opt) => (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => updateCell({ textAlign: opt.id })}
                  className={`flex justify-center py-1.5 rounded transition-all ${
                    colAttrs.textAlign === opt.id
                      ? "bg-white shadow-sm text-purple-600"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {opt.icon}
                </button>
              ))}
            </div>
          </div>

          {/* Cell Padding */}
          <div className="space-y-1">
            <span className="text-[9px] text-slate-400 uppercase font-bold">
              Padding cellule
            </span>
            <input
              type="text"
              value={colAttrs.padding ?? ""}
              onChange={(e) => updateCell({ padding: e.target.value })}
              className="w-full text-xs p-1.5 border rounded-lg bg-slate-50 focus:ring-1 focus:ring-purple-300 outline-none"
              placeholder="0.75rem"
            />
          </div>

          {/* Cell Background */}
          <div className="space-y-1">
            <span className="text-[9px] text-slate-400 uppercase font-bold flex items-center gap-1">
              <Palette size={10} /> Fond cellule
            </span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={
                  colAttrs.backgroundColor === "transparent"
                    ? "#ffffff"
                    : (colAttrs.backgroundColor ?? "#ffffff")
                }
                onChange={(e) =>
                  updateCell({ backgroundColor: e.target.value })
                }
                className="w-8 h-8 rounded border cursor-pointer"
              />
              <input
                type="text"
                value={colAttrs.backgroundColor ?? ""}
                onChange={(e) =>
                  updateCell({ backgroundColor: e.target.value })
                }
                className="flex-1 text-xs p-1.5 border rounded-lg bg-slate-50 outline-none"
                placeholder="transparent"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => editor.commands.addColumn()}
              className="w-full py-2 bg-purple-50 text-purple-600 rounded-lg text-[10px] font-bold border border-purple-100 hover:bg-purple-100 transition-colors flex items-center justify-center gap-2 uppercase"
            >
              <Plus size={12} /> Ajouter une colonne
            </button>
            <button
              type="button"
              onClick={() => editor.commands.deleteColumn()}
              className="w-full flex items-center justify-center gap-2 py-2 text-[10px] font-bold text-red-500 hover:bg-red-50 rounded-lg transition-all uppercase"
            >
              <Trash2 size={12} /> Supprimer cette cellule
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
