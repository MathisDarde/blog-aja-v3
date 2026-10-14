"use client";

import { getTeamLogos, type LogoOption } from "@/actions/method/get-logos-files";
import submitMethodeCoachForm from "@/actions/method/methode-coach-form";
import { MethodeCoachSchema } from "@/app/schema";
import Button from "@/components/BlueButton";
import LogoSelectorModal from "@/components/ClubLogoSelector";
import WikidataImport from "@/components/WikidataImport";
import {
  type ImportedCoach,
  importCoachFromWikidata,
} from "@/actions/method/wikidata-import";
import { useFormErrorToasts } from "@/components/FormErrorsHook";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { MethodeCoachSchemaType } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Plus,
  Trash,
  ImageIcon,
  FolderPen,
  ShieldHalf,
  Trophy,
  ChartBarIncreasing,
  FileQuestion,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";
import React, { useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

const IMAGE_PATHS = {
  clubs: "/_assets/teamlogos/",
  drapeaux: "/_assets/flags/",
};

export default function CoachForm() {
  const { user_id } = useGlobalContext();

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<MethodeCoachSchemaType>({
    resolver: zodResolver(MethodeCoachSchema),
    defaultValues: {
      clubscoach: [[""]],
      palmares: [[""]],
      nomcoach: "",
      statistiques: "",
    },
  });

  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [modal, setModal] = useState(false);
  const [fileList, setFileList] = useState<LogoOption[]>([]);
  const [activeClubIndex, setActiveClubIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    fields: clubsfield,
    append: appendclubs,
    remove: removeclubs,
    replace: replaceclubs,
  } = useFieldArray<MethodeCoachSchemaType, "clubscoach">({
    control,
    name: "clubscoach",
  });
  const clubsValues = useWatch({ control, name: "clubscoach" });

  // Préremplissage depuis Wikidata (les champs restent modifiables)
  const handleWikidataImport = (coach: ImportedCoach) => {
    setValue("nomcoach", coach.nomcoach);
    if (coach.clubs.length > 0) replaceclubs(coach.clubs);
    // Bilan et palmarès : seulement si ces champs sont encore vides
    if (coach.statistiques && !getValues("statistiques")) {
      setValue("statistiques", coach.statistiques);
    }
    const palmaresVide = getValues("palmares").every((ligne) => !ligne.join(""));
    if (coach.palmares.length > 0 && palmaresVide) replacepalmares(coach.palmares);
  };

  const clubLogoSrc = (logo?: string) => {
    if (!logo) return null;
    return logo.startsWith("http") || logo.startsWith("/")
      ? logo
      : `${IMAGE_PATHS.clubs}${logo}`;
  };
  const {
    fields: palmaresfield,
    append: appendpalmares,
    remove: removepalmares,
    replace: replacepalmares,
  } = useFieldArray<MethodeCoachSchemaType, "palmares">({
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

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      throw error;
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setPreviewPhoto(URL.createObjectURL(file));

      // Upload immédiatement vers Cloudinary
      setIsUploading(true);
      try {
        const url = await uploadToCloudinary(file);
        setUploadedUrl(url);

        setValue("imagecoach", url, { shouldValidate: true });
        toast.success("Image uploadée avec succès !");
      } catch (error) {
        console.error(error);
        toast.error("Erreur lors de l'upload de l'image");
        setPreviewPhoto(null);
      } finally {
        setIsUploading(false);
      }
    } else {
      setPreviewPhoto(null);
      setUploadedUrl("");
    }
  };

  // Fonction pour compléter automatiquement les chemins d'images
  const processImagePaths = (
    data: MethodeCoachSchemaType
  ): MethodeCoachSchemaType => {
    // Crée une copie profonde des données pour éviter de modifier l'original
    const processedData = JSON.parse(
      JSON.stringify(data)
    ) as MethodeCoachSchemaType;

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

  const handleSubmitForm = async (data: MethodeCoachSchemaType) => {
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
      image: uploadedUrl, // URL cloudinary déjà traitée avant
    };

    const response = await submitMethodeCoachForm(finalData, user_id);

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
        <WikidataImport
          importer={importCoachFromWikidata}
          onImport={handleWikidataImport}
          placeholder="Nom de l'entraîneur (ex: Guy Roux)"
          hint="Remplit le nom, les clubs entraînés, le bilan et le palmarès d'après Wikipédia. Vérifie avant de publier : le bilan additionne les clubs de l'infobox."
        />


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

        <div className="relative w-full">
          {/* SI PAS DE PHOTO → afficher l'input */}
          {!previewPhoto ? (
            <div>
              <span className="font-semibold font-Montserrat text-sm sm:text-base flex items-center text-gray-600">
                <ImageIcon className="mr-4" />
                Image :
              </span>
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full my-3 sm:my-4 py-3 sm:py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-xs sm:text-sm"
                accept="image/*"
                disabled={isUploading}
              />
            </div>
          ) : (
            <>
              {/* SI PHOTO → l'afficher */}
              <div className="w-fit mb-4 relative mx-auto">
                <Image
                  width={1024}
                  height={1024}
                  src={previewPhoto}
                  alt="Photo de l'article"
                  className="w-full aspect-video object-cover rounded-xl"
                />
                {isUploading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-xl">
                    <Loader2 className="w-12 h-12 text-white animate-spin" />
                  </div>
                )}
              </div>

              {/* input hidden permanent */}
              <input
                type="file"
                id="fileInput"
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
                disabled={isUploading}
              />

              {/* Bouton pour changer l'image */}
              <label
                htmlFor="fileInput"
                className={`cursor-pointer underline inline-flex items-center justify-center gap-2 font-Montserrat text-aja-blue text-sm sm:text-base hover:text-orange-third hover:underline mx-auto ${
                  isUploading ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                {isUploading
                  ? "Upload en cours..."
                  : "Modifier l'image de bannière"}
              </label>
            </>
          )}
        </div>

        <div className="relative w-full my-4">
          <span className="font-semibold font-Montserrat text-sm sm:text-base flex items-center text-gray-600 mb-2">
            <ShieldHalf className="mr-4" />
            Clubs :
          </span>

          {clubsfield.map((field, index) => (
            <div
              key={field.id}
              className="flex flex-col md:flex-row gap-2 mb-2 w-full font-Montserrat"
            >
              <div className="relative w-full md:w-1/3 flex items-center">
                {clubLogoSrc(clubsValues?.[index]?.[0]) && (
                  <Image
                    src={clubLogoSrc(clubsValues?.[index]?.[0])!}
                    width={24}
                    height={24}
                    alt=""
                    className="w-6 h-6 object-contain mr-2 shrink-0"
                  />
                )}
                <input
                  type="text"
                  {...register(`clubscoach.${index}.0`)}
                  placeholder="Logo (ex: auxerre)"
                  className="py-2 px-4 border rounded w-full text-xs md:text-sm"
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
                className="py-2 px-4 border rounded w-full md:w-1/3 text-xs md:text-sm"
              />
              <input
                type="text"
                {...register(`clubscoach.${index}.2`)}
                placeholder="Années (ex: 1963-2006)"
                className="py-2 px-4 border rounded w-full md:w-1/3 text-xs md:text-sm"
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
            onClick={() => appendclubs([""])}
            className="mx-auto flex items-center justify-center gap-2 font-Montserrat text-aja-blue text-sm sm:text-base hover:text-orange-third hover:underline"
          >
            <Plus size={18} />
            Ajouter un club
          </button>
        </div>

        <div className="relative w-full mb-4">
          <span className="font-semibold font-Montserrat text-sm sm:text-base flex items-center text-gray-600 mb-2">
            <Trophy className="mr-4" />
            Palmarès :
          </span>

          {palmaresfield.map((field, index) => (
            <div
              key={field.id}
              className="flex flex-col md:flex-row gap-2 mb-2 w-full font-Montserrat"
            >
              <input
                type="text"
                {...register(`palmares.${index}.0`)}
                placeholder="Intitulé (ex: Champion de Ligue 2)"
                className="py-2 px-4 border rounded w-full md:w-1/2 text-xs md:text-sm"
              />
              <input
                type="text"
                {...register(`palmares.${index}.1`)}
                placeholder="Nombre associé (ex: 3)"
                className="py-2 px-4 border rounded w-full md:w-1/2 text-xs md:text-sm"
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
            onClick={() => appendpalmares([""])}
            className="mx-auto flex items-center justify-center gap-2 font-Montserrat text-aja-blue text-sm sm:text-base hover:text-orange-third hover:underline"
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
          Je publie cette méthode
        </Button>
      </form>
    </div>
  );
}
