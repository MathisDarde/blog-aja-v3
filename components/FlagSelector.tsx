"use client";

import React from "react";
import { X, Loader2 } from "lucide-react";
import Image from "next/image";

const IMAGE_PATHS = {
  drapeaux: "/_assets/flags/",
};

interface FlagSelectorModalProps {
  open: boolean;
  onClose: () => void;
  files: string[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  loading: boolean;
  onSelect: (filename: string) => void;
}

export default function FlagSelectorModal({
  open,
  onClose,
  files,
  searchTerm,
  setSearchTerm,
  loading,
  onSelect,
}: FlagSelectorModalProps) {
  if (!open) return null;

  const filteredFiles = files.filter((file) =>
    file.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white font-Montserrat rounded-lg p-6 w-[500px] max-h-[80vh] overflow-auto mx-6 sm:mx-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-left text-base sm:text-lg font-bold">
            Sélection d&apos;un drapeau
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Rechercher un drapeau..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border rounded text-sm sm:text-base"
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filteredFiles.map((file, index) => (
              <div
                key={index}
                className="border rounded p-2 cursor-pointer hover:bg-gray-100 flex flex-col items-center"
                onClick={() => onSelect(file)}
              >
                <Image
                  width={100}
                  height={100}
                  src={`${IMAGE_PATHS.drapeaux}${file}`}
                  alt={file}
                  className="h-12 object-contain mb-2"
                />
                <span className="text-xs text-center truncate w-full">
                  {file.split(".")[0]}
                </span>
              </div>
            ))}
            {filteredFiles.length === 0 && (
              <div className="col-span-3 text-center py-4 text-gray-500">
                Aucun fichier trouvé
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
