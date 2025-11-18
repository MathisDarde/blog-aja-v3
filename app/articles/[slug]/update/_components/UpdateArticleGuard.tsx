"use client";

import { useEffect } from "react";

export default function UpdateArticleGuard() {
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Affiche le popup natif du navigateur
      e.preventDefault();
      e.returnValue = ""; // obligatoire pour Chrome/Firefox
    };

    const handlePopState = () => {
      // Empêche le back immédiat et affiche le popup navigateur
      history.pushState(null, "", window.location.href);
    };

    // Bloque fermeture/reload onglet
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Bloque bouton retour navigateur
    history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return null; // rien à afficher, tout est géré par le navigateur
}
