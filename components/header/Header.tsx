"use client";

import { useEffect, useState } from "react";
import HeaderLarge from "./HeaderLG";
import RespHeader from "./RespHeader";
import { User } from "@/contexts/Interfaces";

export default function Header({ user }: { user?: User }) {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Fonction pour vérifier la largeur
    const checkWidth = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    // Vérif initiale
    checkWidth();

    // Listener pour les redimensionnements
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  // Côté serveur on ne rend rien
  if (!mounted) return null;

  return isMobile ? <RespHeader user={user} /> : <HeaderLarge user={user} />;
}
