"use client";

import { getTeamLogos } from "@/actions/method/get-logos-files";
import updateMethodeCoachForm from "@/actions/method/update-coach-form";
import { UpdateMethodeCoachSchema } from "@/app/schema";
import Button from "@/components/BlueButton";
import LogoSelectorModal from "@/components/ClubLogoSelector";
import { useFormErrorToasts } from "@/components/FormErrorsHook";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { UpdateMethodeCoachFromProps } from "@/contexts/Interfaces";
import { UpdateMethodeCoachSchemaType } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChartBarIncreasing,
  FileQuestion,
  FolderPen,
  Loader2,
  Plus,
  ShieldHalf,
  Trash,
  Trophy,
  WholeWord,
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

export default function CoachForm({
  selectedMethode,
}: UpdateMethodeCoachFromProps) {
  const { user_id } = useGlobalContext();

  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<UpdateMethodeCoachSchemaType>({
    resolver: zodResolver(UpdateMethodeCoachSchema),
    defaultValues: async () => {
      if (!selectedMethode) {
        return {
          keywords: [],
          nomcoach: "",
          imagecoach: "",
          clubscoach: [],
          palmares: [],
          statistiques: "",
        };
      }

      return {
        keywords: selectedMethode.keywords?.map((k) => ({ value: k })) || [],
        nomcoach: selectedMethode.nomcoach || "",
        imagecoach: selectedMethode.imagecoach || "",
        clubscoach: selectedMethode.clubscoach || [],
        palmares: selectedMethode.palmares || [],
        statistiques: selectedMethode.statistiques || "",
      };
    },
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState<string>(
    selectedMethode.imagecoach || "/_assets/img/pdpdebase.png"
  );
  const [modal, setModal] = useState(false);
  const [fileList, setFileList] = useState<string[]>([]);
  const [activeClubIndex, setActiveClubIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    fields: keywordsfield,
    append: appendkeywords,
    remove: removekeywords,
  } = useFieldArray<UpdateMethodeCoachSchemaType, "keywords">({
    control,
    name: "keywords",
  });
  const {
    fields: clubsfield,
    append: appendclubs,
    remove: removeclubs,
  } = useFieldArray<UpdateMethodeCoachSchemaType, "clubscoach">({
    control,
    name: "clubscoach",
  });
  const {
    fields: palmaresfield,
    append: appendpalmares,
    remove: removepalmares,
  } = useFieldArray<UpdateMethodeCoachSchemaType, "palmares">({
    control,
    name: "palmares",
  });

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const result = await getTeamLogos();

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
    setActiveClubIndex(index);
    setModal(true);
    fetchFiles();
  };

  // Sélectionner un fichier et le mettre dans le champ correspondant
  const selectFile = (filename: string) => {
    if (activeClubIndex !== null) {
      setValue(`clubscoach.${activeClubIndex}.0`, filename);
      setModal(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setPreviewPhoto(URL.createObjectURL(event.target.files[0]));
    } else {
      setSelectedFile(null);
      setPreviewPhoto("/_assets/img/pdpdebase.png");
    }
  };

  // Fonction pour compléter automatiquement les chemins d'images
  const processImagePaths = (
    data: UpdateMethodeCoachSchemaType
  ): UpdateMethodeCoachSchemaType => {
    // Crée une copie profonde des données pour éviter de modifier l'original
    const processedData = JSON.parse(
      JSON.stringify(data)
    ) as UpdateMethodeCoachSchemaType;

    // Traitement des logos de clubs
    if (processedData.clubscoach) {
      processedData.clubscoach = processedData.clubscoach.map((club) => {
        if (
          club[0] &&
          !club[0].startsWith("http") &&
          !club[0].startsWith("/")
        ) {
          club[0] = `${IMAGE_PATHS.clubs}${club[0]}`;
        }
        return club;
      });
    }

    return processedData;
  };

  const handleSubmitForm = async (data: UpdateMethodeCoachSchemaType) => {
    // Traiter les chemins d'images avant l'envoi
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

    const response = await updateMethodeCoachForm(
      selectedMethode.id_methode,
      processedData,
      user_id || "",
      selectedFile ?? undefined
    );

    if (response.success) {
      toast.success(response.message);
      router.push("/admin/dashboard");
    } else {
      toast.error(
        response.message || response.errors?.[0]?.message || "Erreur inconnue"
      );
    }
  };

  useFormErrorToasts(errors);

  if (!selectedMethode)
    return (
      <div>
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );

  return (
    <div className="w-full mx-auto">
      {modal && (
        <LogoSelectorModal
          open={modal}
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
            <div className="w-fit mb-4 relative mx-auto">
              <Image
                width={1024}
                height={1024}
                src={previewPhoto || "/_assets/img/pdpdebase.png"}
                alt="Photo du coach"
                className="w-full aspect-video object-cover mr-4"
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
            Modifier la photo du coach ?
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
                placeholder={`Mot clé ${index + 1} (ex: Guy Roux)`}
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
            <FolderPen className="mr-4" />
            Nom du coach :
          </span>
          <input
            type="text"
            {...register("nomcoach")}
            className="w-full py-3 sm:py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-xs sm:text-sm"
            placeholder="Nom du joueur (ex: Guy Roux)"
          />
        </div>

        <div className="relative w-full my-4">
          <span className="font-semibold font-Montserrat text-sm sm:text-base flex items-center text-gray-600 mb-2">
            <ShieldHalf className="mr-4" />
            Clubs :
          </span>

          {clubsfield.map((field, index) => (
            <div
              key={field.id}
              className="flex flex-col md:flex-row gap-2 mb-2 w-full font-Montserrat text-sm"
            >
              <div className="relative w-full md:w-1/3 flex">
                <input
                  type="text"
                  {...register(`clubscoach.${index}.0`)}
                  placeholder="(choisir dans la l"
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
                {...register(`clubscoach.${index}.1`)}
                placeholder="Nom du club (ex: AJ Auxerre)"
                className="py-2 px-4 border rounded w-full md:w-1/3 text-xs sm:text-sm"
              />
              <input
                type="text"
                {...register(`clubscoach.${index}.2`)}
                placeholder="Années (ex: (1963-2006))"
                className="py-2 px-4 border rounded w-full md:w-1/3 text-xs sm:text-sm"
              />
              <button
                type="button"
                onClick={() => removeclubs(index)}
                className="text-white md:text-red-500 bg-red-500 md:bg-transparent p-2 md:p-0 rounded-full mx-auto"
              >
                <Trash size={18} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => appendclubs(["", "", ""])}
            className="mx-auto flex items-center justify-center gap-2 text-aja-blue text-sm sm:text-base font-Montserrat"
          >
            <Plus size={18} />
            Ajouter un club
          </button>
        </div>

        <div className="relative w-full my-4">
          <span className="font-semibold font-Montserrat text-sm sm:text-base flex items-center text-gray-600 mb-2">
            <Trophy className="mr-4" />
            Palmarès :
          </span>

          {palmaresfield.map((field, index) => (
            <div
              key={field.id}
              className="flex flex-col md:flex-row gap-2 mb-2 w-full font-Montserrat text-sm"
            >
              <input
                type="text"
                {...register(`palmares.${index}.0`)}
                placeholder="Intitulé (ex: Champion de Ligue 2)"
                className="py-2 px-4 border rounded w-full md:w-1/2 text-xs sm:text-sm"
              />
              <input
                type="text"
                {...register(`palmares.${index}.1`)}
                placeholder="Nombre associé (ex: 3)"
                className="py-2 px-4 border rounded w-full md:w-1/2 text-xs sm:text-sm"
              />
              <button
                type="button"
                onClick={() => removepalmares(index)}
                className="text-white md:text-red-500 bg-red-500 md:bg-transparent p-2 md:p-0 rounded-full mx-auto"
              >
                <Trash size={18} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => appendpalmares(["", ""])}
            className="mx-auto flex items-center justify-center gap-2 text-aja-blue text-sm sm:text-base font-Montserrat"
          >
            <Plus size={18} />
            Ajouter une ligne au palmarès
          </button>
        </div>

        <div className="relative w-full my-4">
          <span className="font-semibold font-Montserrat text-sm sm:text-base flex items-center text-gray-600 mb-2">
            <ChartBarIncreasing className="mr-4" />
            Statistiques :
          </span>
          <input
            type="text"
            {...register("statistiques")}
            className="w-full py-3 sm:py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-xs sm:text-sm"
            placeholder="Stats (ex: 512v - 30n - 85d)"
          />
        </div>

        <Button type="submit" size="default">
          Je modifie cette méthode
        </Button>
      </form>
    </div>
  );
}
