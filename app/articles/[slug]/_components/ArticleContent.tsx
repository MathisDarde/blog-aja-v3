"use client";

import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArticleContentProps } from "@/contexts/Interfaces";

const ArticleContent: React.FC<ArticleContentProps> = ({ text }) => {
  const router = useRouter();
  const displayText = text?.trim()
    ? text
    : "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>";

  // Lien vers la fiche d'une méthode : navigation côté client, pour que la fiche s'ouvre
  // par-dessus l'article (routes interceptées @modal). Ctrl/Cmd-clic : nouvel onglet.
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const link = (e.target as HTMLElement).closest<HTMLAnchorElement>("a.methode-expert");
      const href = link?.getAttribute("href");
      if (!href || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      router.push(href, { scroll: false });
    },
    [router],
  );

  // Fiche préparée dès le survol : le cadre s'ouvre sans attendre au clic
  const handlePointerOver = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const href = (e.target as HTMLElement).closest("a.methode-expert")?.getAttribute("href");
      if (href) router.prefetch(href);
    },
    [router],
  );

  return (
    <div
      onPointerOver={handlePointerOver}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: content trusted from DB
      dangerouslySetInnerHTML={{ __html: displayText }}
      onClick={handleClick}
      className="article-content"
    />
  );
};

export default ArticleContent;
