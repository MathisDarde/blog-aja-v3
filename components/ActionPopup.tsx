"use client";

import { X } from "lucide-react";
import { createPortal } from "react-dom";
import { useEffect, useMemo } from "react";

type Action = {
  label: string;
  onClick: () => void;
  theme?: "delete" | "update" | "confirm" | "discard";
};

export default function ActionPopup({
  onClose,
  title,
  description,
  actions,
}: {
  onClose: () => void;
  title: string;
  description?: string;
  actions: Action[];
}) {
  const getButtonClass = (theme: Action["theme"]) => {
    switch (theme) {
      case "delete":
        return "bg-red-600 text-white hover:bg-red-700 transition-colors";
      case "update":
        return "bg-orange-third text-white hover:bg-amber-700 transition-colors";
      case "confirm":
        return "bg-aja-blue text-white hover:bg-sky-700 transition-colors";
      default:
        return "bg-gray-200 text-black hover:bg-gray-300 transition-colors";
    }
  };

  // Création du container pour le portal
  const portalContainer = useMemo(() => {
    const el = document.createElement("div");
    document.body.appendChild(el);
    return el;
  }, []);

  // Bloquer le scroll du body et restaurer au démontage
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // JSX de la popup
  const popupContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-hidden">
      <div className="bg-white rounded-2xl shadow-lg max-w-[400px] p-6 relative m-4 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Contenu */}
        <h2 className="text-xl sm:text-2xl font-semibold text-center font-Bai_Jamjuree mb-2">
          {title}
        </h2>
        {description && (
          <p className="text-gray-600 mb-4 font-Montserrat text-sm sm:text-base text-center">
            {description}
          </p>
        )}

        {/* Boutons dynamiques */}
        <div className="flex flex-wrap justify-center font-Montserrat gap-3">
          {actions.map((action, idx) => (
            <button
              key={idx}
              onClick={action.onClick}
              className={`px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition cursor-pointer ${getButtonClass(
                action.theme
              )}`}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return createPortal(popupContent, portalContainer);
}
