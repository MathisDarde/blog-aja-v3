import { Editor } from "@tiptap/react";

interface Props {
  menuPos: { top: number; left: number; show: boolean };
  editor: Editor | null;
  onOpenPopup: (type: "link" | "color" | "method" | "text-color") => void; // Ajout de text-color
}

export default function FloatingMenuContent({
  menuPos,
  editor,
  onOpenPopup,
}: Props) {
  return (
    <>
      <div
        onMouseDown={(e) => e.preventDefault()}
        style={{
          position: "absolute",
          top: `${menuPos.top}px`,
          left: `${menuPos.left}px`,
          visibility: menuPos.show ? "visible" : "hidden",
          opacity: menuPos.show ? 1 : 0,
          transform: `translateY(${menuPos.show ? 0 : 10}px)`,
          transition: "all 0.2s",
          zIndex: 100,
        }}
        className="menu-container flex items-center bg-slate-900 text-white p-1 rounded-lg shadow-xl border border-slate-700 whitespace-nowrap gap-0.5"
      >
        {/* --- FORMATAGE DE BASE --- */}
        <button
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={`p-2 hover:bg-slate-700 rounded ${editor?.isActive("bold") ? "text-blue-400" : ""}`}
        >
          <span className="font-bold">B</span>
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={`p-2 hover:bg-slate-700 rounded font-serif ${editor?.isActive("italic") ? "text-blue-400" : ""}`}
        >
          <span className="italic">I</span>
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
          className={`p-2 hover:bg-slate-700 rounded ${editor?.isActive("underline") ? "text-blue-400" : ""}`}
        >
          <span className="underline">U</span>
        </button>

        <div className="w-[1px] h-4 bg-slate-700 mx-1" />

        {/* --- ALIGNEMENT --- */}
        <button
          onClick={() => editor?.chain().focus().setTextAlign("left").run()}
          className={`p-2 hover:bg-slate-700 rounded ${editor?.isActive({ textAlign: "left" }) ? "text-blue-400 bg-slate-800" : ""}`}
        >
          <AlignLeft size={16} />
        </button>
        <button
          onClick={() => editor?.chain().focus().setTextAlign("center").run()}
          className={`p-2 hover:bg-slate-700 rounded ${editor?.isActive({ textAlign: "center" }) ? "text-blue-400 bg-slate-800" : ""}`}
        >
          <AlignCenter size={16} />
        </button>
        <button
          onClick={() => editor?.chain().focus().setTextAlign("right").run()}
          className={`p-2 hover:bg-slate-700 rounded ${editor?.isActive({ textAlign: "right" }) ? "text-blue-400 bg-slate-800" : ""}`}
        >
          <AlignRight size={16} />
        </button>

        <div className="w-[1px] h-4 bg-slate-700 mx-1" />

        {/* --- ALIGNEMENT --- */}
        <button
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`p-2 hover:bg-slate-700 rounded ${editor?.isActive({ textAlign: "left" }) ? "text-blue-400 bg-slate-800" : ""}`}
        >
          <span className="font-Montserrat">H2</span>
        </button>
        <button
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={`p-2 hover:bg-slate-700 rounded ${editor?.isActive({ textAlign: "center" }) ? "text-blue-400 bg-slate-800" : ""}`}
        >
          <span className="font-Montserrat">H3</span>
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().setParagraph().run()}
          className={`p-2 hover:bg-slate-700 rounded transition-colors ${
            editor?.isActive("paragraph")
              ? "text-blue-400 bg-slate-800"
              : "text-white"
          }`}
          title="Texte normal"
        >
          <span className="font-Montserrat font-bold">P</span>
        </button>

        <div className="w-[1px] h-4 bg-slate-700 mx-1" />

        {/* --- COULEURS & LIENS --- */}
        <button
          type="button"
          onClick={() => onOpenPopup("text-color")}
          className={`p-2 hover:bg-slate-700 rounded flex items-center gap-1`}
        >
          <span className="font-bold text-xs text-white">A</span>
          <div className="w-2 h-2 rounded-full bg-white" />
        </button>

        <button
          type="button"
          onClick={() => onOpenPopup("color")}
          className={`p-2 hover:bg-slate-700 rounded ${editor?.isActive("highlight") ? "text-yellow-400 bg-slate-800" : ""}`}
        >
          ✨
        </button>

        <button
          type="button"
          onClick={() => {
            if (editor?.isActive("link")) {
              editor.chain().focus().unsetLink().run();
            } else {
              onOpenPopup("link");
            }
          }}
          className={`p-2 hover:bg-slate-700 rounded ${editor?.isActive("link") ? "text-blue-400" : ""}`}
        >
          🔗
        </button>

        <div className="w-[1px] h-4 bg-slate-700 mx-1" />

        {/* --- MENTIONS --- */}
        <button
          type="button"
          onClick={() => onOpenPopup("method")}
          className="px-2 py-1 hover:bg-slate-700 rounded text-[10px] font-bold uppercase tracking-tighter"
        >
          @ Méthode
        </button>
      </div>
    </>
  );
}

// Composants Icones simples (ou utilise Lucide-react)
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
