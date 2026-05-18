import { Editor } from "@tiptap/react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Maximize,
  Target,
  Trash2,
} from "lucide-react";

interface Props {
  editor: Editor;
  onClose: () => void;
}

export const ImageSettings = ({ editor, onClose }: Props) => {
  const attrs = editor.getAttributes("image");

  const updateAttr = (newAttrs: Record<string, string | number>) => {
    editor
      .chain()
      .focus(undefined, { scrollIntoView: false })
      .updateAttributes("image", newAttrs)
      .run();
  };

  const preventBlur = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <>
      {/* HAUTEUR */}
      <div className="space-y-2">
        <label className="text-[11px] font-bold text-slate-400 uppercase">
          Hauteur
        </label>
        <div className="grid grid-cols-5 gap-1">
          {(["auto", "200px", "300px", "400px", "500px"] as const).map((value) => (
            <button
              key={value}
              type="button"
              onMouseDown={preventBlur}
              onClick={() =>
                updateAttr({
                  height: value,
                  width: value === "auto" ? "100%" : "auto",
                })
              }
              className={`text-[9px] py-1 border rounded transition-all ${
                (attrs.height || "auto") === value
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
            >
              {value === "auto" ? "Libre" : value}
            </button>
          ))}
        </div>
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
              onMouseDown={preventBlur}
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

      {/* FORMAT ET FOCUS */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-slate-400 uppercase flex items-center gap-1">
            <Maximize size={10} /> Format
          </label>
          <select
            value={attrs.objectFit || "cover"}
            onChange={(e) => updateAttr({ objectFit: e.target.value })}
            className="w-full text-[10px] bg-slate-50 border border-slate-200 rounded px-2 py-1.5 outline-none"
          >
            <option value="cover">Cover</option>
            <option value="contain">Contain</option>
            <option value="fill">Stretch</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-bold text-slate-400 uppercase flex items-center gap-1">
            <Target size={10} /> Focus
          </label>
          <select
            value={attrs.objectPosition || "center"}
            onChange={(e) => updateAttr({ objectPosition: e.target.value })}
            className="w-full text-[10px] bg-slate-50 border border-slate-200 rounded px-2 py-1.5 outline-none"
          >
            <option value="top">Haut</option>
            <option value="center">Centre</option>
            <option value="bottom">Bas</option>
          </select>
        </div>
      </div>

      {/* SUPPRIMER */}
      <button
        type="button"
        onMouseDown={preventBlur}
        onClick={() => {
          editor.chain().focus().deleteSelection().run();
          onClose();
        }}
        className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-lg transition-all"
      >
        <Trash2 size={14} /> Supprimer l&apos;image
      </button>
    </>
  );
};
