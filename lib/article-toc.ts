import { htmlToText } from "@/lib/article-search";
import { normalizeText } from "@/lib/normalize-text";

export interface TocEntry {
  id: string;
  text: string;
  level: 2 | 3;
}

// Un sommaire à moins de trois intertitres n'aide pas à s'orienter
export const MIN_TOC_ENTRIES = 3;

/**
 * Intertitres (h2, h3) d'un article avec une ancre chacun, pour le sommaire.
 * Un intertitre qui a déjà un id le garde.
 */
export function withHeadingAnchors(html: string): { html: string; toc: TocEntry[] } {
  const toc: TocEntry[] = [];
  const used = new Set<string>();

  const anchored = html.replace(/<h([23])([^>]*)>([\s\S]*?)<\/h\1>/g, (match, level, attrs: string, inner: string) => {
    const text = htmlToText(inner).replace(/\s+/g, " ").trim();
    if (!text) return match;

    const existing = attrs.match(/\sid="([^"]+)"/)?.[1];
    let id = existing ?? (normalizeText(text).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "partie");
    if (!existing) {
      const base = id;
      for (let n = 2; used.has(id); n++) id = `${base}-${n}`;
    }
    used.add(id);
    toc.push({ id, text, level: Number(level) as 2 | 3 });

    return existing ? match : `<h${level} id="${id}"${attrs}>${inner}</h${level}>`;
  });

  return { html: anchored, toc };
}
