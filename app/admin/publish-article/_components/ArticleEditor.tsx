"use client";

import React, { useState, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Mention from "@tiptap/extension-mention";
import SlashPopupContent from "./SlashPopupContent";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Highlight from "@tiptap/extension-highlight";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";
import FloatingMenuContent from "./FloatingMenuContent";
import EditorModal from "./EditorModal";
import { MethodSelect } from "./MethodSelector";
import { ColorPicker } from "./ColorPicker";
import { LinkForm } from "./LinkForm";
import { TextColorPicker } from "./TextColor";

export const ArticleEditor = () => {
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0, show: false });
  const [activePopup, setActivePopup] = useState<
    "link" | "color" | "method" | "text-color" | null
  >(null);
  const [slashMenu, setSlashMenu] = useState({
    show: false,
    top: 0,
    left: 0,
    selectedParent: null as string | null,
  });

  const onOpenPopup = (type: "link" | "color" | "method" | "text-color") => {
    setActivePopup(type);
    setMenuPos((prev) => ({ ...prev, show: false }));
  };

  const containerRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Image,
      Mention,
      Underline, // Ajouté
      Highlight.configure({ multicolor: true }), // Ajouté
      Link.configure({
        openOnClick: false, // Empêche d'ouvrir le lien en éditant
        HTMLAttributes: {
          class: "my-custom-link-class",
        },
      }),
      TextStyle,
      Color,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: `
      <h2>Titre H2</h2>
      <p>Voici le paragraphe suivant.</p>
    `,
    immediatelyRender: false,
    onUpdate: () => handleUpdate(),
    onSelectionUpdate: () => handleUpdate(),
    onBlur: () => {
      setTimeout(() => {
        if (!document.activeElement?.closest(".menu-container")) {
          setMenuPos((prev) => ({ ...prev, show: false }));
          setSlashMenu((prev) => ({ ...prev, show: false }));
        }
      }, 150);
    },
  });

  const handleUpdate = () => {
    if (!editor || !containerRef.current) return;

    const { state, view } = editor;
    const { from, to, $from } = state.selection;
    const containerRect = containerRef.current.getBoundingClientRect();

    // 1. LOGIQUE MENU SLASH (Détection du /)
    const textBefore = $from.nodeBefore?.textContent || "";
    if (from === to && textBefore.endsWith("/")) {
      const coords = view.coordsAtPos(from);
      setSlashMenu({
        show: true,
        top: coords.top - containerRect.top + 30,
        left: coords.left - containerRect.left,
        selectedParent: null,
      });
      setMenuPos((prev) => ({ ...prev, show: false }));
      return;
    } else {
      setSlashMenu((prev) => ({ ...prev, show: false }));
    }

    // 2. LOGIQUE MENU FORMATAGE (Sélection)
    if (from !== to && view.hasFocus()) {
      const start = view.coordsAtPos(from);
      setMenuPos({
        top: start.top - containerRect.top - 55,
        left: start.left - containerRect.left,
        show: true,
      });
    } else {
      setMenuPos((prev) => ({ ...prev, show: false }));
    }
  };

  return (
    <div className="max-w-[1000px] w-full mx-auto">
      <div
        ref={containerRef}
        className="relative border border-gray-300 rounded-xl bg-white shadow-sm"
      >
        <FloatingMenuContent
          menuPos={menuPos}
          editor={editor}
          onOpenPopup={onOpenPopup}
        />

        {/* --- MENU SLASH (BASÉ SUR POPUPOPTIONS) --- */}
        {slashMenu.show && (
          <SlashPopupContent
            slashMenu={slashMenu}
            setSlashMenu={setSlashMenu}
            editor={editor}
          />
        )}

        <EditorContent
          editor={editor}
          className="prose prose-slate w-full p-8 min-h-[500px] text-left"
        />

        <EditorModal
          isOpen={activePopup === "link"}
          onClose={() => setActivePopup(null)}
          title="Insérer un lien"
        >
          <LinkForm editor={editor} onSuccess={() => setActivePopup(null)} />
        </EditorModal>

        <EditorModal
          isOpen={activePopup === "color"}
          onClose={() => setActivePopup(null)}
          title="Couleur du surlignage"
        >
          <ColorPicker editor={editor} onSuccess={() => setActivePopup(null)} />
        </EditorModal>

        <EditorModal
          isOpen={activePopup === "method"}
          onClose={() => setActivePopup(null)}
          title="Ajouter une méthode"
        >
          <MethodSelect
            editor={editor}
            onSuccess={() => setActivePopup(null)}
          />
        </EditorModal>

        <EditorModal
          isOpen={activePopup === "text-color"}
          onClose={() => setActivePopup(null)}
          title="Changer la couleur"
        >
          <TextColorPicker
            editor={editor}
            onSuccess={() => setActivePopup(null)}
          />
        </EditorModal>
      </div>
    </div>
  );
};
