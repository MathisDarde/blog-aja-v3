"use client";

import submitMethodeSaisonForm from "@/actions/method/methode-saison-form";
import { MethodeSaisonSchema } from "@/app/schema";
import { MethodeSaisonSchemaType } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  WholeWord,
  Plus,
  Trash,
  ImageIcon,
  BookCheck,
  ChartBarBig,
  Clock4,
  ArrowLeftRight,
  FileQuestion,
} from "lucide-react";
import { redirect } from "next/navigation";
import React, { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { getFlags } from "@/actions/method/get-flags-files";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { useFormErrorToasts } from "@/components/FormErrorsHook";
import FlagSelectorModal from "@/components/FlagSelector";
import Button from "@/components/BlueButton";

const IMAGE_PATHS = {
  clubs: "/_assets/teamlogos/",
  drapeaux: "/_assets/flags/",
};

export default function SaisonForm() {
  const { user_id } = useGlobalContext();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<MethodeSaisonSchemaType>({
    resolver: zodResolver(MethodeSaisonSchema),
    defaultValues: {
      keywords: [{ value: "" }],
      remplacants: [[""]],
      saison: "",
      coach: "",
      systeme: "",
    },
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [fileList, setFileList] = useState<string[]>([]);
  const [activeFlagIndex, setActiveFlagIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    fields: keywordsfield,
    append: appendkeywords,
    remove: removekeywords,
  } = useFieldArray<MethodeSaisonSchemaType, "keywords">({
    control,
    name: "keywords",
  });
  const {
    fields: remplacantsfield,
    append: appendremplacants,
    remove: removeremplacants,
  } = useFieldArray<MethodeSaisonSchemaType, "remplacants">({
    control,
    name: "remplacants",
  });

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const result = await getFlags();

      if (result.success) {
        setFileList(result.files);
      } else {
        toast.error(result.message || "Erreur lors du chargement des fichiers");
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
      setValue(`remplacants.${activeFlagIndex}.1`, filename);
      setModal(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  // Fonction pour compléter automatiquement les chemins d'images
  const processImagePaths = (
    data: MethodeSaisonSchemaType
  ): MethodeSaisonSchemaType => {
    // Crée une copie profonde des données pour éviter de modifier l'original
    const processedData = JSON.parse(
      JSON.stringify(data)
    ) as MethodeSaisonSchemaType;

    // Traitement des logos de clubs
    if (processedData.remplacants) {
      processedData.remplacants = processedData.remplacants.map((remp) => {
        if (
          remp[1] &&
          !remp[1].startsWith("http") &&
          !remp[1].startsWith("/")
        ) {
          remp[1] = `${IMAGE_PATHS.drapeaux}${remp[1]}`;
        }
        return remp;
      });
    }

    return processedData;
  };

  const handleSubmitForm = async (data: MethodeSaisonSchemaType) => {
    if (!selectedFile) {
      toast.error("Veuillez sélectionner une image !");
      return;
    }

    const processedData = processImagePaths(data);

    const formData = new FormData();
    formData.append("image", selectedFile);

    Object.entries(processedData).forEach(([key, value]) => {
      formData.append(
        key,
        Array.isArray(value) ? JSON.stringify(value) : value
      );
    });

    const response = await submitMethodeSaisonForm(
      processedData,
      selectedFile,
      user_id || ""
    );

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
        className="max-w-[600px] mx-auto"
        onSubmit={handleSubmit(handleSubmitForm)}
      >
        <div className="relative w-full">
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
            className="mx-auto flex items-center justify-center gap-2 font-Montserrat text-aja-blue text-sm sm:text-base hover:text-orange-third hover:underline"
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
            <ImageIcon className="mr-4" />
            Image du terrain :
          </span>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full py-3 sm:py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-xs sm:text-sm"
            accept="image/*"
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
                {...register(`remplacants.${index}.0`)}
                placeholder="Nom (ex: Gaëtan Perrin)"
                className="py-2 px-4 border rounded w-full md:w-2/5 text-xs sm:text-sm"
              />
              <div className="relative w-full md:w-2/5 flex">
                <input
                  type="text"
                  {...register(`remplacants.${index}.1`)}
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
                {...register(`remplacants.${index}.2`)}
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
            onClick={() => appendremplacants([""])}
            className="mx-auto flex items-center justify-center gap-2 font-Montserrat text-aja-blue text-sm sm:text-base hover:text-orange-third hover:underline"
          >
            <Plus size={18} />
            Ajouter un remplaçant
          </button>
        </div>

        <Button
          type="submit"
          size="default"
          >
          Je publie cette méthode
        </Button>
      </form>
    </div>
  );
}
