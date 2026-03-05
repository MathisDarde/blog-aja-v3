import { Editor } from "@tiptap/react";
import { useRef, useState, useLayoutEffect } from "react";

interface Props {
  menuPos: { top: number; left: number; show: boolean };
  editor: Editor | null;
  onOpenPopup: (type: "link" | "color" | "method" | "text-color") => void;
}

export default function FloatingMenuContent({
  menuPos,
  editor,
  onOpenPopup,
}: Props) {
  const barRef = useRef<HTMLDivElement>(null);
  const [adjusted, setAdjusted] = useState({ top: 0, left: 0 });

  useLayoutEffect(() => {
    if (!menuPos.show || !barRef.current) {
      setAdjusted({ top: menuPos.top, left: menuPos.left });
      return;
    }
    const rect = barRef.current.getBoundingClientRect();
    const pad = 8;
    let left = menuPos.left;
    let top = menuPos.top;

    // Dépasse à droite → caler à droite
    if (left + rect.width > window.innerWidth - pad) {
      left = window.innerWidth - rect.width - pad;
    }
    // Dépasse à gauche → caler à gauche
    if (left < pad) {
      left = pad;
    }
    // Dépasse en haut → passer en dessous du texte
    if (top < pad) {
      top = menuPos.top + 80; // sous le texte
    }
    // Dépasse en bas (rare)
    if (top + rect.height > window.innerHeight - pad) {
      top = window.innerHeight - rect.height - pad;
    }

    setAdjusted({ top, left });
  }, [menuPos]);

  if (!editor) return null;

  if (editor.isActive("image")) return null;
  // Hide text toolbar when columns settings panel is active (no text selection)
  const { from: selFrom, to: selTo } = editor.state.selection;
  if (selFrom === selTo && editor.isActive("columns")) return null;

  return (
    <div
      ref={barRef}
      onMouseDown={(e) => e.preventDefault()}
      style={{
        position: "fixed",
        top: `${adjusted.top}px`,
        left: `${adjusted.left}px`,
        visibility: menuPos.show ? "visible" : "hidden",
        opacity: menuPos.show ? 1 : 0,
        transform: `translateY(${menuPos.show ? 0 : 10}px)`,
        transition: "all 0.2s",
        zIndex: 9999,
      }}
      className="menu-container flex items-center bg-slate-900 text-white p-1 rounded-lg shadow-xl border border-slate-700 whitespace-nowrap gap-0.5"
    >
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 hover:bg-slate-700 rounded ${editor.isActive("bold") ? "text-blue-400 bg-slate-800" : ""}`}
      >
        <span className="font-bold">B</span>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 hover:bg-slate-700 rounded font-serif ${editor.isActive("italic") ? "text-blue-400 bg-slate-800" : ""}`}
      >
        <span className="italic">I</span>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`p-2 hover:bg-slate-700 rounded ${editor.isActive("underline") ? "text-blue-400 bg-slate-800" : ""}`}
      >
        <span className="underline">U</span>
      </button>

      <div className="w-[1px] h-4 bg-slate-700 mx-1" />

      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={`p-2 hover:bg-slate-700 rounded ${editor.isActive({ textAlign: "left" }) ? "text-blue-400 bg-slate-800" : ""}`}
      >
        <AlignLeft size={16} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={`p-2 hover:bg-slate-700 rounded ${editor.isActive({ textAlign: "center" }) ? "text-blue-400 bg-slate-800" : ""}`}
      >
        <AlignCenter size={16} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={`p-2 hover:bg-slate-700 rounded ${editor.isActive({ textAlign: "right" }) ? "text-blue-400 bg-slate-800" : ""}`}
      >
        <AlignRight size={16} />
      </button>

      <div className="w-[1px] h-4 bg-slate-700 mx-1" />

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 hover:bg-slate-700 rounded ${editor.isActive("heading", { level: 2 }) ? "text-blue-400 bg-slate-800" : ""}`}
      >
        <span className="font-Montserrat font-bold text-xs">H2</span>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`p-2 hover:bg-slate-700 rounded ${editor.isActive("heading", { level: 3 }) ? "text-blue-400 bg-slate-800" : ""}`}
      >
        <span className="font-Montserrat font-bold text-xs">H3</span>
      </button>

      <div className="w-[1px] h-4 bg-slate-700 mx-1" />

      <button
        type="button"
        onClick={() => onOpenPopup("text-color")}
        className="p-2 hover:bg-slate-700 rounded flex flex-col items-center gap-[1px]"
      >
        <span className="font-bold text-[10px] leading-none">A</span>
        <div
          className="w-3 h-[2px] rounded-full bg-white"
          style={{
            backgroundColor: editor.getAttributes("textStyle").color || "white",
          }}
        />
      </button>

      <button
        type="button"
        onClick={() => onOpenPopup("color")}
        className={`p-2 hover:bg-slate-700 rounded ${editor.isActive("highlight") ? "text-yellow-400 bg-slate-800" : ""}`}
      >
        ✨
      </button>

      <button
        type="button"
        onClick={() =>
          editor.isActive("link")
            ? editor.chain().focus().unsetLink().run()
            : onOpenPopup("link")
        }
        className={`p-2 hover:bg-slate-700 rounded ${editor.isActive("link") ? "text-blue-400 bg-slate-800" : ""}`}
      >
        🔗
      </button>

      <div className="w-[1px] h-4 bg-slate-700 mx-1" />

      <button
        type="button"
        onClick={() => onOpenPopup("method")}
        className="px-2 py-1 hover:bg-slate-700 rounded text-[10px] font-bold uppercase tracking-tighter"
      >
        @ Méthode
      </button>
    </div>
  );
}

// --- ICONES ---
const AlignLeft = ({ size }: { size: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="17" y1="10" x2="3" y2="10"></line>
    <line x1="21" y1="6" x2="3" y2="6"></line>
    <line x1="21" y1="14" x2="3" y2="14"></line>
    <line x1="17" y1="18" x2="3" y2="18"></line>
  </svg>
);
const AlignCenter = ({ size }: { size: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="10" x2="6" y2="10"></line>
    <line x1="21" y1="6" x2="3" y2="6"></line>
    <line x1="21" y1="14" x2="3" y2="14"></line>
    <line x1="18" y1="18" x2="6" y2="18"></line>
  </svg>
);
const AlignRight = ({ size }: { size: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="21" y1="10" x2="7" y2="10"></line>
    <line x1="21" y1="6" x2="3" y2="6"></line>
    <line x1="21" y1="14" x2="3" y2="14"></line>
    <line x1="21" y1="18" x2="7" y2="18"></line>
  </svg>
);
