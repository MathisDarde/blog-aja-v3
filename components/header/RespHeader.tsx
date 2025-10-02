"use client";

import { User } from "@/contexts/Interfaces";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function RespHeader({ user }: { user?: User }) {
  const [isOpen, setIsOpen] = useState(false);

  // swipe gestion

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
      if (touchStartX.current === null || touchEndX.current === null) return;

      const diff = touchStartX.current - touchEndX.current;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          // Swipe gauche => ouvrir
          setIsOpen(false);
        } else {
          // Swipe droite => fermer
          setIsOpen(true);
        }
      }

      touchStartX.current = null;
      touchEndX.current = null;
    };

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  // end of swipe gestion

  return (
    <>
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className="px-6 py-3 inline-block cursor-pointer"
      >
        <Menu size={35} />
      </div>

      <div
        className={`fixed inset-0 bg-black/50 z-10 transition-opacity duration-300 
          ${
            isOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <div
        className={`fixed left-0 p-4 top-0 h-screen w-[250px] bg-white z-20 transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      ></div>
    </>
  );
}
