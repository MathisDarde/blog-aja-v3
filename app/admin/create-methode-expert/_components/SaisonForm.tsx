"use client";

import submitMethodeSaisonForm from "@/actions/method/methode-saison-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  WholeWord,
  Plus,
  Trash,
  BookCheck,
  ChartBarBig,
  Clock4,
  ArrowLeftRight,
  FileQuestion,
} from "lucide-react";
import { redirect } from "next/navigation";
import React, { useState, useEffect } from "react"; // Ajout de useEffect
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { getFlags } from "@/actions/method/get-flags-files";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { useFormErrorToasts } from "@/components/FormErrorsHook";
import FlagSelectorModal from "@/components/FlagSelector";
import Button from "@/components/BlueButton";
import { MethodeSaisonSchemaType } from "@/types/forms";
import { MethodeSaisonSchema } from "@/app/schema";
import { LightRempPlayerType } from "@/contexts/Interfaces";
import { GameSystems } from "@/components/GameSystems";
import { Dispositifs } from "@/components/Dispositifs";

const IMAGE_PATHS = {
  clubs: "/_assets/teamlogos/",
  drapeaux: "/_assets/flags/",
};

export default function SaisonForm() {
  const { user_id } = useGlobalContext();
  const [loading, setLoading] = useState(false);

  const emptyTitulaire = {
    nom: "",
    numero: "",
    poste: "",
  };
  const emptyRemplacant = {
    nom: "",
    drapeau: "",
    poste: "",
  };

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch, // On récupère watch pour surveiller les changements
    formState: { errors },
  } = useForm<MethodeSaisonSchemaType>({
    resolver: zodResolver(MethodeSaisonSchema),
    defaultValues: {
      keywords: [{ value: "" }],
      titulaires: Array.from({ length: 11 }).map(() => ({
        ...emptyTitulaire,
      })),
      remplacants: [{ ...emptyRemplacant }],
      saison: "",
      coach: "",
      systeme: "4-2-3-1",
    },
  });

  // On surveille la valeur du système en temps réel
  const selectedSystem = watch("systeme");

  const [modal, setModal] = useState(false);
  const [fileList, setFileList] = useState<string[]>([]);
  const [activeFlagIndex, setActiveFlagIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // FieldArrays
  const {
    fields: keywordsfield,
    append: appendkeywords,
    remove: removekeywords,
  } = useFieldArray({ control, name: "keywords" });

  const {
    fields: remplacantsfield,
    append: appendremplacants,
    remove: removeremplacants,
  } = useFieldArray({ control, name: "remplacants" });

  const { fields: titulairesFields } = useFieldArray({
    control,
    name: "titulaires",
  });

  // Calcul des positions disponibles basé sur le système surveillé par watch
  const currentDispositif = Dispositifs.find((d) => d.name === selectedSystem);
  const positionsDisponibles = currentDispositif?.postes || [];

  // --- EFFET POUR REMPLIR AUTOMATIQUEMENT LES POSTES ---
  useEffect(() => {
    if (positionsDisponibles.length > 0) {
      // On boucle sur les positions du dispositif (ex: G, DD, DC...)
      positionsDisponibles.forEach((pos, index) => {
        // On s'assure de ne pas dépasser le nombre de champs titulaires (11)
        if (index < 11) {
          setValue(`titulaires.${index}.poste`, pos.name, {
            shouldValidate: true, // Valide le champ
            shouldDirty: true, // Marque le champ comme modifié
          });
        }
      });
    }
  }, [selectedSystem, positionsDisponibles, setValue]);
  // -----------------------------------------------------

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const result = await getFlags();
      if (result.success) {
        setFileList(result.files);
      } else {
        toast.error(result.success || "Erreur lors du chargement des fichiers");
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Impossible de charger la liste des fichiers");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (index: number) => {
    setActiveFlagIndex(index);
    setModal(true);
    fetchFiles();
  };

  const selectFile = (filename: string) => {
    if (modal && typeof modal !== "boolean") {
      if (activeFlagIndex !== null) {
        setValue(`remplacants.${activeFlagIndex}.drapeau`, filename, {
          shouldDirty: true,
        });
        setModal(false);
      }
    }
  };

  const processImagePaths = (
    data: MethodeSaisonSchemaType
  ): MethodeSaisonSchemaType => {
    const processedData = JSON.parse(
      JSON.stringify(data)
    ) as MethodeSaisonSchemaType;

    const processRemplacants = (remplacants: LightRempPlayerType[]) => {
      return remplacants.map((remp) => {
        if (
          remp.drapeau &&
          typeof remp.drapeau === "string" &&
          !remp.drapeau.startsWith("http") &&
          !remp.drapeau.startsWith("/")
        ) {
          remp.drapeau = `${IMAGE_PATHS.drapeaux}${remp.drapeau}`;
        }
        return remp;
      });
    };
    if (processedData.remplacants) {
      processedData.remplacants = processRemplacants(processedData.remplacants);
    }

    return processedData;
  };

  const handleSubmitForm = async (data: MethodeSaisonSchemaType) => {
    if (!user_id) {
      toast.error("Veuillez vous connecter.");
      return;
    }
    const processedData = processImagePaths(data);
    const finalData = {
      ...processedData,
    };
    const response = await submitMethodeSaisonForm(finalData, user_id);
    if (response.success) {
      redirect("/");
    } else {
      toast.error(
        response.message || response.errors?.[0]?.message || "Erreur inconnue"
      );
    }
  };

  useFormErrorToasts(errors);

  return (
    <div className="w-full mx-auto">
      {modal && (
        <FlagSelectorModal
          open={!!modal}
          onClose={() => setModal(false)}
          files={fileList}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          loading={loading}
          onSelect={selectFile}
        />
      )}

      <form
        method="POST"
        id="methodesaisonform"
        className="max-w-[700px] mx-auto"
        onSubmit={handleSubmit(handleSubmitForm)}
      >
        {/* --- SECTION MOTS CLES --- */}
        <div className="relative w-full">
          <span className="font-semibold font-Montserrat text-sm sm:text-base flex items-center text-gray-600 mb-2">
            <WholeWord className="mr-4" />
            Mots-clés :
          </span>
          {keywordsfield.map((field, index) => (
            <div key={field.id} className="flex items-center mb-2 gap-2">
              <input
                type="text"
                placeholder={`Mot clé ${index + 1}`}
                {...register(`keywords.${index}.value`)}
                className="w-full py-3 px-6 rounded-full border border-gray-600 font-Montserrat text-xs sm:text-sm"
              />
              {keywordsfield.length > 1 && (
                <button
                  type="button"
                  onClick={() => removekeywords(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash size={18} />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => appendkeywords({ value: "" })}
            className="mx-auto flex items-center justify-center gap-2 font-Montserrat text-aja-blue text-sm hover:underline"
          >
            <Plus size={18} />
            Ajouter un mot-clé
          </button>
        </div>

        {/* --- SECTION SAISON --- */}
        <div className="relative w-full my-4">
          <span className="font-semibold text-left font-Montserrat text-sm sm:text-base flex items-center text-gray-600 mb-2">
            <Clock4 className="mr-4" />
            Saison :
          </span>
          <input
            type="text"
            {...register("saison")}
            className="w-full py-3 px-6 rounded-full border border-gray-600 font-Montserrat text-xs sm:text-sm"
            placeholder="Ex: 2020-2021"
          />
        </div>

        {/* --- SECTION COACH & SYSTEME --- */}
        <div className="relative w-auto my-4">
          <span className="font-semibold text-left font-Montserrat text-sm sm:text-base flex items-center text-gray-600 mb-2">
            <BookCheck className="mr-4" />
            Coach :
          </span>
          <input
            type="text"
            {...register("coach")}
            className="w-full py-3 px-6 rounded-full border border-gray-600 font-Montserrat text-xs sm:text-sm"
            placeholder="Ex: Jean-Marc Furlan"
          />
        </div>

        {/* --- SYSTEME DE JEU --- */}
        <div className="relative w-auto my-4">
          <span className="font-semibold text-left font-Montserrat text-sm sm:text-base flex items-center text-gray-600 mb-2">
            <ChartBarBig className="mr-4" />
            Système de jeu :
          </span>
          <select
            {...register("systeme")}
            className={`w-full py-3 sm:py-4 px-6 rounded-full border font-Montserrat text-xs sm:text-sm bg-white border-gray-600 cursor-pointer`}
          >
            <option value="">Sélectionner un système...</option>
            {GameSystems.map((system, index) => (
              <option key={index} value={system}>
                {system}
              </option>
            ))}
          </select>
        </div>

        {/* --- TITULAIRES --- */}
        <div className="relative w-auto my-4">
          <span className="font-semibold text-left font-Montserrat text-sm sm:text-base flex items-center text-gray-600 mb-2">
            <ArrowLeftRight className="mr-4" />
            Titulaires :
          </span>

          {titulairesFields.map((field, index) => {
            return (
              <React.Fragment key={field.id}>
                <div className="flex flex-col md:flex-row items-start md:items-center gap-3 w-full font-Montserrat">
                  {/* NOM */}
                  <div className="w-full md:w-5/12">
                    <label className="text-xs text-left text-gray-500 font-semibold ml-1 mb-1 block">
                      Nom du joueur
                    </label>
                    <input
                      type="text"
                      {...register(`titulaires.${index}.nom`)}
                      placeholder="Nom (ex: Gaëtan Perrin)"
                      className="py-2 px-4 border rounded w-full text-xs sm:text-sm"
                    />
                  </div>

                  {/* POSTE */}
                  <div className="w-full md:w-5/12">
                    <label className="text-xs text-left text-gray-500 font-semibold ml-1 mb-1 block">
                      Poste
                    </label>
                    <select
                      {...register(`titulaires.${index}.poste`)}
                      className={`py-2 px-4 border rounded-md w-full text-xs sm:text-sm bg-white focus:ring-2 focus:ring-aja-blue focus:outline-none border-gray-300"
                      `}
                    >
                      <option value="">Choisir...</option>
                      {/* On affiche tous les postes du dispositif sélectionné comme options, 
                          ou une liste générique si besoin */}
                      {positionsDisponibles.length > 0 ? (
                        positionsDisponibles.map((poste, pIndex) => (
                          <option key={pIndex} value={poste.name}>
                            {poste.name}
                          </option>
                        ))
                      ) : (
                        <option disabled>
                          Sélectionnez un système d&apos;abord
                        </option>
                      )}
                    </select>
                  </div>

                  {/* NUMERO */}
                  <div className="w-full md:w-2/12 relative">
                    <label className="text-xs text-left text-gray-500 font-semibold ml-1 mb-1 block">
                      Numéro
                    </label>
                    <input
                      type="text"
                      {...register(`titulaires.${index}.numero`)}
                      placeholder="N°"
                      className="py-2 px-4 border rounded w-full text-xs sm:text-sm"
                    />
                  </div>
                </div>
                <hr className="border-gray-300 my-4 w-full" />
              </React.Fragment>
            );
          })}
        </div>

        {/* --- SECTION REMPLACANTS --- */}
        <div className="relative w-full mb-4">
          <span className="font-semibold font-Montserrat text-sm sm:text-base flex items-center text-gray-600 mb-2">
            <ArrowLeftRight className="mr-4" />
            Remplaçants :
          </span>

          {remplacantsfield.map((field, index) => (
            <div
              key={field.id}
              className="flex flex-col md:flex-row gap-2 mb-2 w-full font-Montserrat"
            >
              <input
                type="text"
                {...register(`remplacants.${index}.nom`)}
                placeholder="Nom (ex: Gaëtan Perrin)"
                className="py-2 px-4 border rounded w-full md:w-2/5 text-xs sm:text-sm"
              />
              <div className="relative w-full md:w-2/5 flex">
                <input
                  type="text"
                  {...register(`remplacants.${index}.drapeau`)}
                  placeholder="Drapeau"
                  className="py-2 px-4 border rounded w-full text-xs sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => openModal(index)}
                  className="ml-1 text-aja-blue"
                >
                  <FileQuestion size={20} />
                </button>
              </div>
              <input
                type="text"
                {...register(`remplacants.${index}.poste`)}
                placeholder="Poste"
                className="py-2 px-4 border rounded w-full md:w-1/5 text-xs sm:text-sm"
              />
              <button
                type="button"
                onClick={() => removeremplacants(index)}
                className="text-white md:text-red-500 bg-red-500 md:bg-transparent p-2 md:p-0 rounded-full mx-auto"
              >
                <Trash size={18} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => appendremplacants(emptyRemplacant)}
            className="mx-auto flex items-center justify-center gap-2 font-Montserrat text-aja-blue text-sm hover:underline"
          >
            <Plus size={18} />
            Ajouter un remplaçant
          </button>
        </div>

        <Button type="submit" size="default">
          Je publie cette méthode
        </Button>
      </form>
    </div>
  );
}
