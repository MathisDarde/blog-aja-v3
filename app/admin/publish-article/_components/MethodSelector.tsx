"use client";

import React, { useEffect, useState } from "react";
import getAllMethodes from "@/actions/dashboard/get-methodes-infos";
import { Methode } from "@/contexts/Interfaces";
import Button from "@/components/BlueButton";
import { Editor } from "@tiptap/react";

export const MethodSelect = ({
  editor,
  onSuccess,
}: {
  editor: Editor | null;
  onSuccess: () => void;
}) => {
  const [methods, setMethods] = useState<Methode[]>([]);
  const [loading, setLoading] = useState(true);

  // États pour le formulaire
  const [label, setLabel] = useState("");
  const [selectedMethodId, setSelectedMethodId] = useState<string | number>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllMethodes();
        setMethods(data);
        // On sélectionne la première méthode par défaut si elle existe
        if (data.length > 0) {
          setSelectedMethodId(data[0].id_methode);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération :", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleInsert = () => {
    if (!editor) return;

    // On définit le texte à afficher : soit le label saisi, soit un fallback
    const textToInsert = label.trim() !== "" ? label : "Méthode";

    // Insertion dans Tiptap
    // Note : On ajoute l'ID en attribut si tu veux plus tard rendre ça cliquable
    editor
      .chain()
      .focus()
      .insertContent([
        {
          type: "mention",
          attrs: {
            id: selectedMethodId,
            label: textToInsert,
          },
        },
        {
          type: "text",
          text: " ",
        },
      ])
      .run();

    onSuccess(); // Ferme la modal
  };

  if (loading)
    return (
      <div className="p-4 text-center text-sm text-slate-500 animate-pulse">
        Chargement des méthodes...
      </div>
    );

  return (
    <div className="space-y-6">
      {/* 1. INPUT POUR LE LABEL */}
      <div className="flex flex-col items-start gap-2">
        <label className="font-Bai_Jamjuree font-bold text-[10px] text-gray-400 uppercase ml-1">
          Label affiché dans le texte
        </label>
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Ex: Gaëtan Perrin"
          className="rounded-md font-Montserrat px-4 py-2 w-full outline-none border-gray-300 border focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
        />
      </div>

      {/* 2. SELECT POUR LA MÉTHODE */}
      <div className="flex flex-col items-start gap-2">
        <label className="font-Bai_Jamjuree font-bold text-[10px] text-gray-400 uppercase ml-1">
          Sélectionner la méthode source
        </label>
        <select
          value={selectedMethodId}
          onChange={(e) => setSelectedMethodId(e.target.value)}
          className="rounded-md font-Montserrat px-3 py-2 w-full outline-none border-gray-300 border bg-white focus:border-blue-500"
        >
          {methods.map((method) => (
            <option key={method.id_methode} value={method.id_methode}>
              {method.joueurnom ||
                method.nomcoach ||
                method.saison ||
                method.titrematch ||
                `Méthode #${method.id_methode}`}
            </option>
          ))}
        </select>
      </div>

      {/* 3. BOUTON D'ACTION */}
      <div className="pt-2">
        <Button
          onClick={handleInsert}
          disabled={methods.length === 0 || label.trim() === ""}
          className="w-full m-0"
        >
          Insérer la mention
        </Button>
      </div>

      {methods.length === 0 && (
        <div className="text-center text-xs text-red-400">
          Aucune donnée disponible pour créer une mention.
        </div>
      )}
    </div>
  );
};
