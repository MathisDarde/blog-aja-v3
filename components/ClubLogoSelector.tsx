"use client";

import React, { useState } from "react";
import { X, Loader2, Upload } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import type { LogoOption } from "@/actions/method/get-logos-files";

interface LogoSelectorModalProps {
  open: boolean;
  onClose: () => void;
  files: LogoOption[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  loading: boolean;
  // Chemin local ou URL Cloudinary du logo choisi
  onSelect: (src: string) => void;
}

export default function LogoSelectorModal({
  open,
  onClose,
  files,
  searchTerm,
  setSearchTerm,
  loading,
  onSelect,
}: LogoSelectorModalProps) {
  const [uploading, setUploading] = useState(false);

  if (!open) return null;

  const filteredFiles = files.filter((file) =>
    file.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Logo absent de la liste : envoyé sur Cloudinary, utilisable aussitôt.
  // Il rejoint la bibliothèque à l'enregistrement de la méthode.
  const uploadLogo = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "clubs");

    setUploading(true);
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error(`Upload refusé (${response.status})`);

      const { secure_url } = await response.json();
      onSelect(secure_url);
      toast.success("Logo importé !");
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de l'import du logo");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

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
            Sélection d&apos;un logo de club
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-4 flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Rechercher un logo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border rounded text-sm sm:text-base"
          />
          <label
            className={`shrink-0 flex items-center justify-center gap-2 px-3 py-2 rounded bg-aja-blue text-white text-sm cursor-pointer ${
              uploading ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            {uploading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Upload size={16} />
            )}
            Importer un logo
            <input
              type="file"
              accept="image/*"
              onChange={uploadLogo}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filteredFiles.map((file) => (
              <div
                key={file.src}
                className="border rounded p-2 cursor-pointer hover:bg-gray-100 flex flex-col items-center"
                onClick={() => onSelect(file.src)}
              >
                <Image
                  width={100}
                  height={100}
                  src={file.src}
                  alt={file.label}
                  className="h-12 object-contain mb-2"
                />
                <span className="text-xs text-center truncate w-full">
                  {file.label}
                </span>
              </div>
            ))}
            {filteredFiles.length === 0 && (
              <div className="col-span-3 text-center py-4 text-gray-500">
                Aucun logo trouvé : importe-le avec le bouton ci-dessus
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
