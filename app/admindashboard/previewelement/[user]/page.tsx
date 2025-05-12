"use client";

import { useEffect } from "react";
import UserPreview from "./_components/PreviewUser";

export default function UserPreviewPage() {
  useEffect(() => {
    document.title = "User Preview - Mémoire d'Auxerrois";

    if (!document.getElementById("favicon")) {
      const link = document.createElement("link");
      link.id = "favicon";
      link.rel = "icon";
      link.href = "/_assets/teamlogos/logoauxerre.svg";
      document.head.appendChild(link);
    }
  }, []);

  return <UserPreview />;
}
