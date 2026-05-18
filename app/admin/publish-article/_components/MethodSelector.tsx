"use client";

import React, { useEffect, useMemo, useState } from "react";
import getAllMethodes from "@/actions/dashboard/get-methodes-infos";
import { BaseMethodeData, Methode } from "@/contexts/Interfaces";
import Button from "@/components/BlueButton";
import { Editor } from "@tiptap/react";
import { Trash2, Search, Check } from "lucide-react";

interface EditMentionData {
  pos: number;
  id: string;
  label: string;
  type: string;
}

export const MethodSelect = ({
  editor,
  onSuccess,
  editMention,
  initialLabel = "",
}: {
  editor: Editor | null;
  onSuccess: () => void;
  editMention?: EditMentionData | null;
  initialLabel?: string;
}) => {
  const [methods, setMethods] = useState<Methode[]>([]);
  const [loading, setLoading] = useState(true);

  const [label, setLabel] = useState(editMention?.label || initialLabel);
  const [selectedMethod, setSelectedMethod] = useState<BaseMethodeData | null>(
    null,
  );
  const [typeFilter, setTypeFilter] = useState<string>(editMention?.type || "all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllMethodes();
        if (data && data.length > 0) {
          setMethods(data as unknown as Methode[]);
          // En mode édition, pré-sélectionner la méthode existante
          if (editMention) {
            const found = data.find((m) => m.id_methode === editMention.id);
            setSelectedMethod((found || data[0]) as BaseMethodeData);
            // Filtrer par le type de la méthode éditée
            if (found) setTypeFilter(found.typemethode);
          } else {
            setSelectedMethod(data[0] as BaseMethodeData);
          }
        } else {
          setMethods([]);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération :", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [editMention]);

  const handleInsert = () => {
    if (!editor) return;

    if (editMention) {
      // Mode édition : remplacer la mention existante
      const { pos } = editMention;
      const node = editor.state.doc.nodeAt(pos);
      if (node) {
        editor
          .chain()
          .focus()
          .insertContentAt(
            { from: pos, to: pos + node.nodeSize },
            {
              type: "mention",
              attrs: {
                id: selectedMethod?.id_methode,
                label: label,
                type: selectedMethod?.typemethode,
              },
            },
          )
          .run();
      }
    } else {
      // Mode insertion : si du texte est sélectionné, le remplacer par la mention
      const { from, to } = editor.state.selection;
      const hasSelection = from !== to;
      const chain = editor.chain().focus();
      if (hasSelection) {
        chain.deleteRange({ from, to });
      }
      const content: Array<Record<string, unknown>> = [
        {
          type: "mention",
          attrs: {
            id: selectedMethod?.id_methode,
            label: label,
            type: selectedMethod?.typemethode,
          },
        },
      ];
      // Espace après seulement si insertion libre (pas de remplacement de sélection)
      if (!hasSelection) {
        content.push({ type: "text", text: " " });
      }
      chain.insertContent(content).run();
    }

    onSuccess();
  };

  const handleDelete = () => {
    if (!editor || !editMention) return;
    const { pos } = editMention;
    const node = editor.state.doc.nodeAt(pos);
    if (node) {
      editor.chain().focus().deleteRange({ from: pos, to: pos + node.nodeSize }).run();
    }
    onSuccess();
  };

  const getMethodName = (m: Methode) =>
    m.joueurnom || m.nomcoach || m.saison || m.titrematch || `Méthode #${m.id_methode}`;

  const typeLabels: Record<string, string> = {
    all: "Tous",
    joueur: "Joueur",
    coach: "Coach",
    match: "Match",
    saison: "Saison",
  };

  const filteredMethods = useMemo(() => {
    let list = methods;
    if (typeFilter !== "all") {
      list = list.filter((m) => m.typemethode === typeFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((m) => getMethodName(m).toLowerCase().includes(q));
    }
    // En mode édition, placer la méthode sélectionnée en premier
    if (selectedMethod) {
      list = [...list].sort((a, b) => {
        if (a.id_methode === selectedMethod.id_methode) return -1;
        if (b.id_methode === selectedMethod.id_methode) return 1;
        return 0;
      });
    }
    return list;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [methods, typeFilter, search, selectedMethod]);

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

      {/* 2. MÉTHODE ACTIVE (mode édition) + FILTRE + RECHERCHE */}
      <div className="flex flex-col items-start gap-2">
        <label className="font-Bai_Jamjuree font-bold text-[10px] text-gray-400 uppercase ml-1">
          {editMention ? "Méthode source actuelle" : "Sélectionner la méthode source"}
        </label>

        {/* Carte méthode active en mode édition */}
        {editMention && selectedMethod && (
          <div className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg bg-blue-50 border border-blue-200">
            <Check size={14} className="text-aja-blue shrink-0" />
            <span className="text-sm font-Montserrat font-semibold text-aja-blue truncate">
              {methods.find(m => m.id_methode === selectedMethod.id_methode)
                ? getMethodName(methods.find(m => m.id_methode === selectedMethod.id_methode)!)
                : editMention.id}
            </span>
            <span className={`ml-auto text-[10px] uppercase px-1.5 py-0.5 rounded font-medium shrink-0 ${
              selectedMethod.typemethode === "joueur" ? "bg-green-100 text-green-600" :
              selectedMethod.typemethode === "coach" ? "bg-purple-100 text-purple-600" :
              selectedMethod.typemethode === "match" ? "bg-orange-100 text-orange-600" :
              "bg-sky-100 text-sky-600"
            }`}>
              {selectedMethod.typemethode}
            </span>
          </div>
        )}

        {/* Onglets type */}
        <div className="flex flex-wrap gap-1 w-full">
          {Object.entries(typeLabels).map(([key, lbl]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTypeFilter(key)}
              className={`px-3 py-1 rounded-full text-xs font-Montserrat font-medium transition-colors ${
                typeFilter === key
                  ? "bg-aja-blue text-white"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
            >
              {lbl}
            </button>
          ))}
        </div>

        {/* Barre de recherche */}
        <div className="relative w-full">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher une méthode…"
            className="rounded-md font-Montserrat pl-9 pr-4 py-2 w-full outline-none border-gray-300 border text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>

        {/* Liste scrollable */}
        <div className="w-full max-h-[200px] overflow-y-auto border border-gray-200 rounded-lg">
          {filteredMethods.length === 0 ? (
            <div className="p-3 text-center text-xs text-slate-400 font-Montserrat">
              Aucun résultat
            </div>
          ) : (
            filteredMethods.map((method) => {
              const name = getMethodName(method);
              const isSelected = selectedMethod?.id_methode === method.id_methode;
              return (
                <button
                  key={method.id_methode}
                  type="button"
                  onClick={() => setSelectedMethod(method as unknown as BaseMethodeData)}
                  className={`w-full text-left px-3 py-2 text-sm font-Montserrat flex items-center justify-between transition-colors ${
                    isSelected
                      ? "bg-blue-50 text-aja-blue font-semibold"
                      : "hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <span className="truncate">{name}</span>
                  <span className={`text-[10px] uppercase px-1.5 py-0.5 rounded font-medium ${
                    method.typemethode === "joueur" ? "bg-green-100 text-green-600" :
                    method.typemethode === "coach" ? "bg-purple-100 text-purple-600" :
                    method.typemethode === "match" ? "bg-orange-100 text-orange-600" :
                    "bg-sky-100 text-sky-600"
                  }`}>
                    {method.typemethode}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* 3. BOUTONS D'ACTION */}
      <div className="pt-2 space-y-2">
        <Button
          type="button"
          onClick={handleInsert}
          disabled={methods.length === 0 || label.trim() === ""}
          className="w-full m-0"
        >
          {editMention ? "Modifier la mention" : "Insérer la mention"}
        </Button>

        {editMention && (
          <button
            type="button"
            onClick={handleDelete}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors text-sm font-Montserrat"
          >
            <Trash2 size={14} />
            Supprimer la mention
          </button>
        )}
      </div>

      {methods.length === 0 && (
        <div className="text-center text-xs text-red-400">
          Aucune donnée disponible pour créer une mention.
        </div>
      )}
    </div>
  );
};
