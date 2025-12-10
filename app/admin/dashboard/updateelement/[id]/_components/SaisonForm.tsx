"use client";

import { getFlags } from "@/actions/method/get-flags-files";
import updateMethodeSaisonForm from "@/actions/method/update-saison-form";
import { UpdateMethodeSaisonSchema } from "@/app/schema";
import Button from "@/components/BlueButton";
import { Dispositifs } from "@/components/Dispositifs";
import FlagSelectorModal from "@/components/FlagSelector";
import { useFormErrorToasts } from "@/components/FormErrorsHook";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { UpdateMethodeSaisonFromProps } from "@/contexts/Interfaces";
import { UpdateMethodeSaisonSchemaType } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeftRight,
  BookCheck,
  ChartBarBig,
  Clock4,
  FileQuestion,
  Plus,
  Trash,
  WholeWord,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

const IMAGE_PATHS = {
  clubs: "/_assets/teamlogos/",
  drapeaux: "/_assets/flags/",
};

export default function SaisonForm({
  selectedMethode,
}: UpdateMethodeSaisonFromProps) {
  const { user_id } = useGlobalContext();

  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const emptyTitulaire = {
    nom: "",
    numero: "",
    poste: "",
    sortie: "",
    buts: "",
    cartonJaune: false,
    cartonRouge: false,
  };
  const emptyRemplacant = {
    nom: "",
    drapeau: "",
    poste: "",
    entree: "",
    buts: "",
    cartonJaune: false,
    cartonRouge: false,
  };

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UpdateMethodeSaisonSchemaType>({
    resolver: zodResolver(UpdateMethodeSaisonSchema),
    defaultValues: async () => {
      if (!selectedMethode) {
        return {
          keywords: [],
          coach: "",
          saison: "",
          systeme: "4-3-3 Offensif",
          titulaires: Array.from({ length: 11 }).map(() => ({
            ...emptyTitulaire,
          })),
          remplacants: [{ ...emptyRemplacant }],
        };
      }

      return {
        keywords: selectedMethode.keywords?.map((k) => ({ value: k })) || [],
        coach: selectedMethode.coach || "",
        titulaires: selectedMethode.titulaires || [],
        remplacants: selectedMethode.remplacants || [],
        systeme: selectedMethode.systeme || "4-3-3 Offensif",
        saison: selectedMethode.saison || "",
      };
    },
  });

  const [modal, setModal] = useState(false);
  const [fileList, setFileList] = useState<string[]>([]);
  const [activeFlagIndex, setActiveFlagIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    fields: keywordsfield,
    append: appendkeywords,
    remove: removekeywords,
  } = useFieldArray<UpdateMethodeSaisonSchemaType, "keywords">({
    control,
    name: "keywords",
  });
  const { fields: fieldsTitulaires } = useFieldArray({
    control,
    name: "titulaires",
  });
  const {
    fields: remplacantsfield,
    append: appendremplacants,
    remove: removeremplacants,
  } = useFieldArray<UpdateMethodeSaisonSchemaType, "remplacants">({
    control,
    name: "remplacants",
  });

  const selectedSystem = watch("systeme") as string;
  const currentDispositif = Dispositifs.find((d) => d.name === selectedSystem);
  const positionsDisponibles = currentDispositif?.postes || [];

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

  // Sélectionner un fichier et le mettre dans le champ correspondant
  const selectFile = (filename: string) => {
    if (activeFlagIndex !== null) {
      setValue(`remplacants.${activeFlagIndex}.drapeau`, filename);
      setModal(false);
    }
  };

  // Fonction pour compléter automatiquement les chemins d'images
  const processImagePaths = (
    data: UpdateMethodeSaisonSchemaType
  ): UpdateMethodeSaisonSchemaType => {
    // Crée une copie profonde des données pour éviter de modifier l'original
    const processedData = JSON.parse(
      JSON.stringify(data)
    ) as UpdateMethodeSaisonSchemaType;

    // Traitement des logos de clubs
    if (processedData.remplacants) {
      processedData.remplacants = processedData.remplacants.map((remp) => {
        if (
          remp.drapeau &&
          !remp.drapeau.startsWith("http") &&
          !remp.drapeau.startsWith("/")
        ) {
          remp.drapeau = `${IMAGE_PATHS.drapeaux}${remp.drapeau}`;
        }
        return remp;
      });
    }

    return processedData;
  };

  const handleSubmitForm = async (data: UpdateMethodeSaisonSchemaType) => {
    if (!user_id) {
      toast.error(
        "L'ID de l'utilisateur n'est pas défini. Veuillez vous connecter."
      );
      return;
    }

    // Compléter automatiquement les chemins d'images (logos, flags, etc.)
    const processedData = processImagePaths(data);

    const finalData = {
      ...processedData,
    };

    const response = await updateMethodeSaisonForm(
      selectedMethode.id_methode,
      finalData,
      user_id
    );

    if (response.success) {
      router.push("/");
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
        className="max-w-[600px] mx-auto"
        onSubmit={handleSubmit(handleSubmitForm)}
      >
        <div className="relative w-full my-4">
          <span className="font-semibold font-Montserrat text-sm sm:text-base flex items-center text-gray-600 mb-2">
            <WholeWord className="mr-4" />
            Mots-clés :
          </span>

          {keywordsfield.map((field, index) => (
            <div key={field.id} className="flex items-center mb-2 gap-2">
              <input
                type="text"
                placeholder={`Mot clé ${index + 1} (ex: saison 2020-2021)`}
                {...register(`keywords.${index}.value`)}
                className="w-full py-3 sm:py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-xs sm:text-sm"
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
            className="mx-auto flex items-center justify-center gap-2 text-aja-blue text-sm sm:text-base font-Montserrat"
          >
            <Plus size={18} />
            Ajouter un mot-clé
          </button>
        </div>

        <div className="relative w-full my-4">
          <span className="font-semibold font-Montserrat text-sm sm:text-base flex items-center text-gray-600 mb-2">
            <Clock4 className="mr-4" />
            Saison :
          </span>
          <input
            type="text"
            {...register("saison")}
            className="w-full py-3 sm:py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-xs sm:text-sm"
            placeholder="Saison (ex: 2020-2021)"
          />
        </div>

        <div className="relative w-full my-4">
          <span className="font-semibold font-Montserrat text-sm sm:text-base flex items-center text-gray-600 mb-2">
            <BookCheck className="mr-4" />
            Coach :
          </span>
          <input
            type="text"
            {...register("coach")}
            className="w-full py-3 sm:py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-xs sm:text-sm"
            placeholder="Coach (ex: Jean-Marc Furlan)"
          />
        </div>

        <div className="relative w-full my-4">
          <span className="font-semibold font-Montserrat text-sm sm:text-base flex items-center text-gray-600 mb-2">
            <ChartBarBig className="mr-4" />
            Système :
          </span>
          <input
            type="text"
            {...register("systeme")}
            className="w-full py-3 sm:py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-xs sm:text-sm"
            placeholder="Système (ex: 4-3-3)"
          />
        </div>

        {/* --- TITULAIRES --- */}
        <div className="relative w-auto my-4">
          <span className="font-semibold text-left font-Montserrat text-sm sm:text-base flex items-center text-gray-600 mb-2">
            <ArrowLeftRight className="mr-4" />
            Titulaires :
          </span>

          {fieldsTitulaires.map((field, index) => {
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
                      className={`py-2 px-4 border rounded-md w-full text-xs sm:text-sm bg-white focus:ring-2 focus:ring-aja-blue focus:outline-none`}
                    >
                      <option value="">Choisir...</option>
                      {positionsDisponibles.length > 0 &&
                        positionsDisponibles.map((poste, pIndex) => (
                          <option key={pIndex} value={poste.name}>
                            {poste.name}
                          </option>
                        ))}
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

        <div className="relative w-full my-4">
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
                  placeholder="Drapeau (ex: france)"
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
                placeholder="Poste (ex: G ou Gardien)"
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
            className="mx-auto flex items-center justify-center gap-2 text-aja-blue text-sm sm:text-base font-Montserrat"
          >
            <Plus size={18} />
            Ajouter un remplaçant
          </button>
        </div>

        <Button type="submit" size="default">
          Je modifie cette méthode
        </Button>
      </form>
    </div>
  );
}
