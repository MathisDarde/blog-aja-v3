import React, { useCallback } from "react";

interface Keyword {
  id_methode: string;
  typemethode: string;
  keyword: string[];
}

interface Props {
  text: string;
  keywords: Keyword[];
  onKeywordClick: (id: string, type: string) => void;
}

const KeywordHighlighter: React.FC<Props> = ({
  text,
  keywords,
  onKeywordClick,
}) => {
  // Process text for headings and line breaks
  const processText = (text: string) => {
    const lines = text.split("\n");
    const processedLines = lines.map((line) => {
      if (line.startsWith("# ")) {
        return `<h2 class="font-Montserrat font-extrabold text-3xl text-aja-blue mt-6 mb-3">${line.substring(
          2
        )}</h2>`;
      } else if (line.startsWith("## ")) {
        return `<h3 class="font-Montserrat font-bold text-2xl text-aja-blue mt-5 mb-2">${line.substring(
          3
        )}</h3>`;
      } else if (line.trim() === "") {
        return "<br />";
      }
      return line;
    });

    return processedLines.join("<br />");
  };

  // Improved click handler with more specific targeting
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains("highlightedtext")) {
        const id = target.getAttribute("data-id");
        const type = target.getAttribute("data-type");

        console.log("Click detected on keyword:", { id, type });

        if (id && type) {
          e.stopPropagation(); // Prevent event bubbling
          onKeywordClick(id, type);
        }
      }
    },
    [onKeywordClick]
  );

  // Process the text
  const processedText = processText(text);
  let highlightedText = processedText;

  // Apply keyword highlighting
  keywords.forEach((keyword) => {
    const keywordArray = Array.isArray(keyword.keyword)
      ? keyword.keyword
      : [keyword.keyword];

    keywordArray.forEach((kw) => {
      // Make sure keyword is a string before processing
      if (typeof kw !== "string") {
        console.warn("Invalid keyword type:", kw);
        return;
      }

      const escapedKeyword = kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`(${escapedKeyword})`, "gi");

      // Use a more distinctive class and add data attributes
      highlightedText = highlightedText.replace(
        regex,
        `<span class="highlightedtext cursor-pointer text-aja-blue font-bold underline" data-id="${keyword.id_methode}" data-type="${keyword.typemethode}">$1</span>`
      );
    });
  });

  return (
    <>
      <div
        dangerouslySetInnerHTML={{ __html: highlightedText }}
        onClick={handleClick}
      />
    </>
  );
};

export default KeywordHighlighter;
