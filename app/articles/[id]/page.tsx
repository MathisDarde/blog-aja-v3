"use client";

import { useEffect } from "react";
import ArticleClient from "./_components/ArticleClient";

export default function ArticlePage() {
  useEffect(() => {
    document.title = "Lire un article - Mémoire d'Auxerrois";

    if (!document.getElementById("favicon")) {
      const link = document.createElement("link");
      link.id = "favicon";
      link.rel = "icon";
      link.href = "/_assets/teamlogos/logoauxerre.svg";
      document.head.appendChild(link);
    }
  }, []);

  return <ArticleClient />;
}
