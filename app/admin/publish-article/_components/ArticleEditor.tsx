"use client";

import React, { useState, useRef, useEffect } from "react";
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
import { LinkTooltip } from "./LinkTooltip";
import { TextColorPicker } from "./TextColor";
import VideoUrlPopup from "./VideoPopup";
import BaseNodeSettings from "./BaseNodeSettings";
import { VideoSettings } from "./VideoSettings";
import { CustomMention } from "./CustomMention";
import { Column, Columns } from "./CustomColumns";
import { GridSettings } from "./ColumnsSettings";

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
  const [linkTooltip, setLinkTooltip] = useState({ show: false, top: 0, left: 0, href: "" });
  const [slashMenu, setSlashMenu] = useState({
    show: false,
    top: 0,
    left: 0,
    selectedParent: null as string | null,
  });

  const [editLinkHref, setEditLinkHref] = useState("");
  const [linkFormKey, setLinkFormKey] = useState(0);
  const [editMention, setEditMention] = useState<{ pos: number; id: string; label: string; type: string } | null>(null);
  const [methodFormKey, setMethodFormKey] = useState(0);
  const [initialMethodLabel, setInitialMethodLabel] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const linkPosRef = useRef<number | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      CustomImage,
      CustomMention,
      Columns,
      Column,
      Underline,
      Highlight.configure({ multicolor: true }),
      Link.extend({
        addAttributes() {
          return {
            ...this.parent?.(),
            target: { default: "_blank" },
            rel: { default: "noopener noreferrer" },
          };
        },
      }).configure({
        openOnClick: false,
        HTMLAttributes: { class: "editor-link" },
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

    // A. LOGIQUE SLASH — prioritaire pour fonctionner dans les colonnes
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

    // B. COLUMNS — panneau de réglages (seulement sans sélection de texte)
    if (from === to && editor.isActive("columns")) {
      let depth = $from.depth;
      let nodePos = $from.before(depth);
      while (depth > 0 && state.doc.nodeAt(nodePos)?.type.name !== 'columns') {
        depth--;
        nodePos = $from.before(depth);
      }
      const node = view.nodeDOM(nodePos) as HTMLElement;
      if (node) {
        const nodeRect = node.getBoundingClientRect();
        setMenuPos({
          top: nodeRect.top - containerRect.top - 80,
          left: containerRect.width / 2 - 160,
          show: true,
        });
        return;
      }
    }

    // C. LIEN : curseur posé dans un lien sans sélection → afficher le tooltip
    if (from === to && editor.isActive("link")) {
      const href = editor.getAttributes("link").href || "";
      linkPosRef.current = from;
      const coords = view.coordsAtPos(from);
      const maxLeft = containerRect.width - 400;
      setLinkTooltip({
        show: true,
        top: coords.top - containerRect.top + 22,
        left: Math.max(0, Math.min(coords.left - containerRect.left, maxLeft)),
        href,
      });
      setMenuPos((p) => ({ ...p, show: false }));
      setSlashMenu((p) => ({ ...p, show: false }));
      return;
    }
    setLinkTooltip((p) => (p.show ? { ...p, show: false } : p));

    // D. LOGIQUE TEXTE (fonctionne aussi dans les colonnes)
    if (from !== to && view.hasFocus()) {
      const start = view.coordsAtPos(from);
      setMenuPos({
        top: start.top - 55,
        left: start.left,
        show: true,
      });
    } else {
      setMenuPos((p) => (p.show ? { ...p, show: false } : p));
      setSlashMenu((p) => (p.show ? { ...p, show: false } : p));
    }
  };

  const onOpenPopup = (type: "link" | "color" | "method" | "text-color") => {
    if (type === "link") {
      setEditLinkHref(editor?.getAttributes("link").href ?? "");
      setLinkFormKey((k) => k + 1);
    }
    if (type === "method" && editor) {
      const { from, to } = editor.state.selection;
      setInitialMethodLabel(from !== to ? editor.state.doc.textBetween(from, to) : "");
      setMethodFormKey((k) => k + 1);
    }
    setActivePopup(type);
    setMenuPos((prev) => ({ ...prev, show: false }));
    setLinkTooltip((prev) => ({ ...prev, show: false }));
  };

  const showLinkTooltip = (anchor: HTMLElement, href: string) => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    const container = containerRef.current;
    if (!container || !editor) return;
    // Store PM position for edit/delete operations
    try {
      linkPosRef.current = editor.view.posAtDOM(anchor, 0);
    } catch {
      linkPosRef.current = null;
    }
    const containerRect = container.getBoundingClientRect();
    const anchorRect = anchor.getBoundingClientRect();
    setLinkTooltip({
      show: true,
      top: anchorRect.bottom - containerRect.top + 6,
      left: Math.max(0, Math.min(anchorRect.left - containerRect.left, containerRect.width - 460)),
      href,
    });
    setMenuPos((p) => ({ ...p, show: false }));
    setSlashMenu((p) => ({ ...p, show: false }));
  };

  const scheduleLinkTooltipHide = () => {
    hideTimerRef.current = setTimeout(() => {
      setLinkTooltip((p) => ({ ...p, show: false }));
    }, 200);
  };

  // Interception native des événements sur les <a> dans l'éditeur
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseOver = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href") || "";
      showLinkTooltip(anchor as HTMLElement, href);
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target?.closest?.("a");
      if (!anchor) return;
      const related = e.relatedTarget as HTMLElement | null;
      // Don't hide if mouse moved to the tooltip or stayed within the same anchor
      if (related?.closest?.(".link-tooltip") || related?.closest?.("a") === anchor) return;
      scheduleLinkTooltipHide();
    };

    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      if (anchor) {
        e.preventDefault();
        e.stopPropagation();
        if (e.ctrlKey || e.metaKey) {
          const href = anchor.getAttribute("href") || "";
          window.open(href, "_blank", "noopener,noreferrer");
        }
        return;
      }

      // Clic sur une méthode → ouvrir popup d'édition préremplie
      const mention = (e.target as HTMLElement).closest(".methode-expert") as HTMLElement;
      if (mention && editor) {
        e.preventDefault();
        e.stopPropagation();
        try {
          const pos = editor.view.posAtDOM(mention, 0);
          const node = editor.state.doc.nodeAt(pos);
          if (node?.type.name === "mention") {
            setEditMention({
              pos,
              id: node.attrs.id || "",
              label: node.attrs.label || mention.textContent || "",
              type: node.attrs.type || "",
            });
            setMethodFormKey((k) => k + 1);
            setActivePopup("method");
          }
        } catch (err) {
          console.error("Could not get mention position", err);
        }
      }
    };

    container.addEventListener("mouseover", handleMouseOver, true);
    container.addEventListener("mouseout", handleMouseOut, true);
    container.addEventListener("click", handleClick, true);
    return () => {
      container.removeEventListener("mouseover", handleMouseOver, true);
      container.removeEventListener("mouseout", handleMouseOut, true);
      container.removeEventListener("click", handleClick, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  return (
    <div className="max-w-[1000px] w-full mx-auto">
      <div
        ref={containerRef}
        className="relative border border-gray-300 rounded-xl bg-white shadow-sm"
      >
        {/* TOOLTIP LIEN INLINE */}
        <LinkTooltip
          {...linkTooltip}
          onEdit={() => {
            // Select the link text so edit applies correctly
            if (editor && linkPosRef.current !== null) {
              editor.chain().focus().setTextSelection(linkPosRef.current).extendMarkRange("link").run();
            }
            setEditLinkHref(linkTooltip.href);
            setLinkFormKey((k) => k + 1);
            setActivePopup("link");
            setLinkTooltip((p) => ({ ...p, show: false }));
          }}
          onRemove={() => {
            if (editor && linkPosRef.current !== null) {
              editor.chain().focus().setTextSelection(linkPosRef.current).extendMarkRange("link").unsetLink().run();
            }
            setLinkTooltip((p) => ({ ...p, show: false }));
          }}
          onMouseEnter={() => {
            if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
          }}
          onMouseLeave={scheduleLinkTooltipHide}
        />
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

        <BaseNodeSettings
          show={menuPos.show && !!editor && editor.isActive("columns") && editor.state.selection.from === editor.state.selection.to}
          menuPos={menuPos}
          title="Mise en page"
          onClose={() => setMenuPos((p) => ({ ...p, show: false }))}
        >
          {editor && (
            <GridSettings
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
          <LinkForm
            key={linkFormKey}
            editor={editor}
            onSuccess={() => setActivePopup(null)}
            currentHref={editLinkHref}
          />
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
          onClose={() => { setActivePopup(null); setEditMention(null); setInitialMethodLabel(""); }}
          title={editMention ? "Modifier la méthode" : "Ajouter une méthode"}
        >
          <MethodSelect
            key={methodFormKey}
            editor={editor}
            onSuccess={() => { setActivePopup(null); setEditMention(null); setInitialMethodLabel(""); }}
            editMention={editMention}
            initialLabel={initialMethodLabel}
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
