"use client";

import { getFlags } from "@/actions/method/get-flags-files";
import updateMethodeSaisonForm from "@/actions/method/update-saison-form";
import { UpdateMethodeSaisonSchema } from "@/app/schema";
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
  X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
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

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<UpdateMethodeSaisonSchemaType>({
    resolver: zodResolver(UpdateMethodeSaisonSchema),
    defaultValues: async () => {
      if (!selectedMethode) {
        return {
          keywords: [],
          coach: "",
          remplacants: [],
          saison: "",
          systeme: "",
          imgterrain: "",
        };
      }

      return {
        keywords: selectedMethode.keywords?.map((k) => ({ value: k })) || [],
        coach: selectedMethode.coach || "",
        imgterrain: selectedMethode.imgterrain || "",
        remplacants: selectedMethode.remplacants || [],
        systeme: selectedMethode.systeme || "",
        saison: selectedMethode.saison || "",
      };
    },
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState<string>(
    selectedMethode.imgterrain || "/_assets/terrain/demiterrain.png"
  );
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
  const {
    fields: remplacantsfield,
    append: appendremplacants,
    remove: removeremplacants,
  } = useFieldArray<UpdateMethodeSaisonSchemaType, "remplacants">({
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
      setPreviewPhoto(URL.createObjectURL(event.target.files[0]));
    } else {
      setSelectedFile(null);
      setPreviewPhoto("/_assets/terrain/demiterrain.png");
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

  const handleSubmitForm = async (data: UpdateMethodeSaisonSchemaType) => {
    const processedData = processImagePaths(data);

    const formData = new FormData();

    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    Object.entries(processedData).forEach(([key, value]) => {
      formData.append(
        key,
        Array.isArray(value) ? JSON.stringify(value) : value
      );
    });

    const response = await updateMethodeSaisonForm(
      selectedMethode.id_methode,
      processedData,
      user_id || "",
      selectedFile ?? undefined
    );

    if (response.success) {
      toast.success(response.message, {
        icon: <X className="text-white" />,
        className: "bg-green-500 border border-green-200 text-white text-base",
      });
      router.push("/admin/dashboard");
    } else {
      toast.error(
        response.message || response.errors?.[0]?.message || "Erreur inconnue",
        {
          icon: <X className="text-white" />,
          className: "bg-red-500 border border-red-200 text-white text-base",
        }
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
        {/* Image coach */}
        <div className="relative w-full mx-auto">
          {previewPhoto && (
            <div className="mb-4 relative mx-auto">
              <Image
                width={1024}
                height={1024}
                src={previewPhoto || "/_assets/terrain/demiterrain.png"}
                alt="Image du terrain"
                className="aspect-video object-contain mr-4"
              />
            </div>
          )}
          <input
            type="file"
            id="fileInput"
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />
          <label
            htmlFor="fileInput"
            className="underline text-aja-blue font-Montserrat text-sm sm:text-base cursor-pointer"
          >
            Modifier l&apos;image du terrain ?
          </label>
        </div>

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

        <div className="relative w-full my-4">
        <span className="font-semibold font-Montserrat text-sm sm:text-base flex items-center text-gray-600 mb-2">
            <ArrowLeftRight className="mr-4" />
            Remplaçants :
          </span>

          {remplacantsfield.map((field, index) => (
            <div key={field.id} className="flex flex-col md:flex-row gap-2 mb-2 w-full font-Montserrat">
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
            className="mx-auto flex items-center justify-center gap-2 text-aja-blue text-sm sm:text-base font-Montserrat"
          >
            <Plus size={18} />
            Ajouter un remplaçant
          </button>
        </div>

        <button
          type="submit"
          className="justify-center items-center bg-aja-blue inline-flex px-6 py-3 rounded-full font-Montserrat text-white text-sm sm:text-base"
        >
          Je modifie cette méthode
        </button>
      </form>
    </div>
  );
}
