"use client";

import React, { useState, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Highlight from "@tiptap/extension-highlight";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import { CustomYoutube } from "./CustomVideo";
import SlashPopupContent from "./SlashPopupContent";
import FloatingMenuContent from "./FloatingMenuContent";
import { ImageSettings } from "./ImageSettings";
import { CustomImage } from "./CustomImage";
import EditorModal from "./EditorModal";
import { MethodSelect } from "./MethodSelector";
import { ColorPicker } from "./ColorPicker";
import { LinkForm } from "./LinkForm";
import { TextColorPicker } from "./TextColor";
import VideoUrlPopup from "./VideoPopup";
import BaseNodeSettings from "./BaseNodeSettings";
import { VideoSettings } from "./VideoSettings";
import { CustomMention } from "./CustomMention";

interface ArticleEditorProps {
  onChange: (html: string) => void;
  initialContent?: string;
}

export const ArticleEditor = ({
  onChange,
  initialContent,
}: ArticleEditorProps) => {
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0, show: false });
  const [activePopup, setActivePopup] = useState<
    "link" | "color" | "method" | "text-color" | "youtube" | null
  >(null);
  const [slashMenu, setSlashMenu] = useState({
    show: false,
    top: 0,
    left: 0,
    selectedParent: null as string | null,
  });

  const containerRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      CustomImage,
      CustomMention,
      Underline,
      Highlight.configure({ multicolor: true }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "my-custom-link-class" },
      }),
      TextStyle,
      Color,
      TextAlign.configure({
        types: ["heading", "paragraph", "image"],
      }),
      HorizontalRule,
      CustomYoutube.configure({ inline: false }),
    ],
    content:
      initialContent || `<h2>Titre H2</h2><p>Voici un exemple de texte.</p>`,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      handleUpdate();
      onChange(editor.getHTML());
    },
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
    const { from, to } = state.selection;
    const containerRect = containerRef.current.getBoundingClientRect();

    if (editor.isActive("image")) {
      const node = view.nodeDOM(from) as HTMLElement;
      if (node) {
        const nodeRect = node.getBoundingClientRect();
        setMenuPos({
          top: nodeRect.top - containerRect.top - 120,

          left: containerRect.width / 2 - 144,

          show: true,
        });
        return;
      }
    }

    if (editor.isActive("youtube")) {
      const node = view.nodeDOM(from) as HTMLElement;
      if (node) {
        const nodeRect = node.getBoundingClientRect();
        setMenuPos({
          top: nodeRect.top - containerRect.top - 120,
          left: containerRect.width / 2 - 144,
          show: true,
        });
        return;
      }
    }

    // B. LOGIQUE SLASH
    const $from = state.selection.$from;
    const textBefore = $from.nodeBefore?.textContent || "";
    if (from === to && textBefore.endsWith("/")) {
      const coords = view.coordsAtPos(from);
      setSlashMenu({
        show: true,
        top: coords.top - containerRect.top + 30,
        left: coords.left - containerRect.left,
        selectedParent: null,
      });
      setMenuPos((p) => ({ ...p, show: false }));
      return;
    }

    // C. LOGIQUE TEXTE
    if (from !== to && view.hasFocus()) {
      const start = view.coordsAtPos(from);
      setMenuPos({
        top: start.top - containerRect.top - 55,
        left: start.left - containerRect.left,
        show: true,
      });
    } else {
      // On ne ferme le menu que si on n'est pas déjà sur un slash menu
      setMenuPos((p) => (p.show ? { ...p, show: false } : p));
      setSlashMenu((p) => (p.show ? { ...p, show: false } : p));
    }
  };

  const onOpenPopup = (type: "link" | "color" | "method" | "text-color") => {
    setActivePopup(type);
    setMenuPos((prev) => ({ ...prev, show: false }));
  };

  return (
    <div className="max-w-[1000px] w-full mx-auto">
      <div
        ref={containerRef}
        className="relative border border-gray-300 rounded-xl bg-white shadow-sm"
      >
        {/* MENU FLOTTANT (Texte) */}
        {editor && !editor.isActive("image") && !editor.isActive("youtube") && (
          <FloatingMenuContent
            menuPos={menuPos}
            editor={editor}
            onOpenPopup={onOpenPopup}
          />
        )}

        {/* MENU RÉGLAGES IMAGE (Celui que tu viens de créer) */}
        <BaseNodeSettings
          show={(menuPos.show && editor?.isActive("image")) ?? false}
          menuPos={menuPos}
          title="Inspecteur Image"
          onClose={() => setMenuPos((p) => ({ ...p, show: false }))}
        >
          {editor && (
            <ImageSettings
              editor={editor}
              onClose={() => setMenuPos((p) => ({ ...p, show: false }))}
            />
          )}
        </BaseNodeSettings>

        <BaseNodeSettings
          show={menuPos.show && (editor?.isActive("youtube") ?? false)}
          menuPos={menuPos}
          title="Réglages Vidéo"
          onClose={() => setMenuPos((p) => ({ ...p, show: false }))}
        >
          {editor && (
            <VideoSettings
              editor={editor}
              onClose={() => setMenuPos((p) => ({ ...p, show: false }))}
            />
          )}
        </BaseNodeSettings>

        {/* MENU SLASH */}
        {slashMenu.show && (
          <SlashPopupContent
            slashMenu={slashMenu}
            setSlashMenu={setSlashMenu}
            editor={editor}
            setActivePopup={setActivePopup}
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

        <EditorModal
          isOpen={activePopup === "youtube"}
          onClose={() => setActivePopup(null)}
          title="Ajouter une vidéo YouTube"
        >
          <VideoUrlPopup
            editor={editor}
            onSuccess={() => setActivePopup(null)}
          />
        </EditorModal>
      </div>
    </div>
  );
};
