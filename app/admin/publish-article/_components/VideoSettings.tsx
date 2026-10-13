// VideoSettings.tsx
import { Editor } from "@tiptap/react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Trash2,
  MoveVertical,
  MoveHorizontal,
  Square,
} from "lucide-react";

interface Props {
  editor: Editor;
  onClose: () => void;
}

export const VideoSettings = ({ editor, onClose }: Props) => {
  const attrs = editor.getAttributes("youtube");

  const updateAttr = (newAttrs: Partial<Record<string, string | number>>) => {
    editor
      .chain()
      .focus(undefined, { scrollIntoView: false })
      .updateAttributes("youtube", newAttrs)
      .run();
  };

  const preventBlur = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <>
      {/* LARGEUR */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-[11px] font-bold text-slate-400 uppercase">
            Largeur
          </label>
          <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
            {attrs.width || "100%"}
          </span>
        </div>
        <input
          type="range"
          min="10"
          max="100"
          step="1"
          value={parseInt(attrs.width) || 100}
          onPointerDown={(e) => e.stopPropagation()}
          onChange={(e) => updateAttr({ width: `${e.target.value}%` })}
          className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
      </div>

      {/* PADDING Y (VERTICAL) */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-[11px] font-bold text-slate-400 uppercase flex items-center gap-1">
            <MoveVertical size={10} /> Espacement Vertical (Y)
          </label>
          <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
            {attrs.paddingY || "32px"}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="120"
          step="4"
          value={parseInt(attrs.paddingY) || 32}
          onPointerDown={(e) => e.stopPropagation()}
          onChange={(e) => updateAttr({ paddingY: `${e.target.value}px` })}
          className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
      </div>

      {/* PADDING X (HORIZONTAL) */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-[11px] font-bold text-slate-400 uppercase flex items-center gap-1">
            <MoveHorizontal size={10} /> Espacement Horizontal (X)
          </label>
          <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
            {attrs.paddingX || "0px"}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          step="4"
          value={parseInt(attrs.paddingX) || 0}
          onPointerDown={(e) => e.stopPropagation()}
          onChange={(e) => updateAttr({ paddingX: `${e.target.value}px` })}
          className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
      </div>

      {/* ASPECT RATIO */}
      <div className="space-y-2">
        <label className="text-[11px] font-bold text-slate-400 uppercase">
          Aspect Ratio
        </label>
        <div className="grid grid-cols-4 gap-1">
          {["auto", "1 / 1", "16 / 9", "4 / 3"].map((ratio) => (
            <button
              key={ratio}
              type="button"
              onMouseDown={preventBlur}
              onClick={() => updateAttr({ aspectRatio: ratio })}
              className={`text-[9px] py-1 border rounded transition-all ${
                attrs.aspectRatio === ratio
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
            >
              {ratio === "auto" ? "Libre" : ratio}
            </button>
          ))}
        </div>
      </div>

      {/* ALIGNEMENT */}
      <div className="space-y-2">
        <label className="text-[11px] font-bold text-slate-400 uppercase">
          Alignement
        </label>
        <div className="flex bg-slate-100 p-0.5 rounded-lg">
          {["left", "center", "right"].map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => updateAttr({ textAlign: id })}
              className={`flex-1 flex justify-center py-1.5 rounded transition-all ${
                attrs.textAlign === id
                  ? "bg-white shadow-sm text-blue-600"
                  : "text-slate-400"
              }`}
            >
              {id === "left" && <AlignLeft size={14} />}
              {id === "center" && <AlignCenter size={14} />}
              {id === "right" && <AlignRight size={14} />}
            </button>
          ))}
        </div>
      </div>

      {/* ARRONDI */}
      <div className="space-y-2">
        <label className="text-[11px] font-bold text-slate-400 uppercase flex items-center gap-1">
          <Square size={10} /> Coins arrondis
        </label>
        <div className="flex gap-2">
          {[0, 8, 12, 24].map((val) => (
            <button
              key={val}
              type="button"
              onMouseDown={preventBlur}
              onClick={() => updateAttr({ borderRadius: `${val}px` })}
              className={`flex-1 text-[10px] py-1 border rounded transition-all ${
                parseInt(attrs.borderRadius) === val
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-slate-600 border-slate-200"
              }`}
            >
              {val}px
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onMouseDown={preventBlur}
        onClick={() => {
          editor.chain().focus().deleteSelection().run();
          onClose();
        }}
        className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-lg transition-all"
      >
        <Trash2 size={14} /> Supprimer la vidéo
      </button>
    </>
  );
};
