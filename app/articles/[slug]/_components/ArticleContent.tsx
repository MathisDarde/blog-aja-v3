"use client";

import React, { useCallback } from "react";
import { ArticleContentProps } from "@/contexts/Interfaces";

const ArticleContent: React.FC<ArticleContentProps> = ({
  text,
  onMethodClick,
}) => {
  const displayText = text?.trim()
    ? text
    : "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>";

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains("methode-expert")) {
        const id = target.getAttribute("data-id");
        const type = target.getAttribute("data-type");
        if (id && type) {
          e.stopPropagation();
          onMethodClick(id, type);
        }
      }
    },
    [onMethodClick],
  );

  return (
    <div
      // biome-ignore lint/security/noDangerouslySetInnerHtml: content trusted from DB
      dangerouslySetInnerHTML={{ __html: displayText }}
      onClick={handleClick}
      className="article-content"
    />
  );
};

export default ArticleContent;
