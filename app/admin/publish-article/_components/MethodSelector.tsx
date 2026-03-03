"use client";

import React, { useEffect, useState } from "react";
import getAllMethodes from "@/actions/dashboard/get-methodes-infos";
import { BaseMethodeData, Methode } from "@/contexts/Interfaces";
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

  const [label, setLabel] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<BaseMethodeData | null>(
    null,
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllMethodes();
        setMethods(data);
        if (data.length > 0) {
          setSelectedMethod(data[0].id_methode);
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

    const textToInsert = label;

    editor
      .chain()
      .focus()
      .insertContent([
        {
          type: "mention",
          attrs: {
            id: selectedMethod?.id_methode,
            label: textToInsert,
            type: selectedMethod?.typemethode,
          },
        },
        {
          type: "text",
          text: " ",
        },
      ])
      .run();

    onSuccess();
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
          value={selectedMethod?.id_methode || ""}
          onChange={(e) => {
            const selected = methods.find(
              (m) => m.id_methode === e.target.value,
            );
            setSelectedMethod(selected || null);
          }}
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
          type="button"
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
