"use client";

import { getTeamLogos } from "@/actions/method/get-logos-files";
import submitMethodeJoueurForm from "@/actions/method/methode-joueur-form";
import { MethodeJoueurSchema } from "@/app/schema";
import Button from "@/components/BlueButton";
import LogoSelectorModal from "@/components/ClubLogoSelector";
import { useFormErrorToasts } from "@/components/FormErrorsHook";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { MethodeJoueurSchemaType } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  WholeWord,
  Plus,
  Trash,
  ImageIcon,
  FolderPen,
  Drama,
  Ruler,
  Footprints,
  ShieldHalf,
  Sword,
  Volleyball,
  Handshake,
  FileQuestion,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";
import React, { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

const IMAGE_PATHS = {
  clubs: "/_assets/teamlogos/",
  drapeaux: "/_assets/flags/",
};

export default function JoueurForm() {
  const { user_id } = useGlobalContext();

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<MethodeJoueurSchemaType>({
    resolver: zodResolver(MethodeJoueurSchema),
    defaultValues: {
      keywords: [{ value: "" }],
      clubs: [[""]],
      joueurnom: "",
      poste: "",
      taille: "",
      piedfort: "",
      matchs: "",
      buts: "",
      passesd: "",
    },
  });

  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [modal, setModal] = useState(false);
  const [fileList, setFileList] = useState<string[]>([]);
  const [activeClubIndex, setActiveClubIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    fields: keywordsfield,
    append: appendkeywords,
    remove: removekeywords,
  } = useFieldArray<MethodeJoueurSchemaType, "keywords">({
    control,
    name: "keywords",
  });
  const {
    fields: clubsfield,
    append: appendclubs,
    remove: removeclubs,
  } = useFieldArray<MethodeJoueurSchemaType, "clubs">({
    control,
    name: "clubs",
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
      setValue(`clubs.${activeClubIndex}.0`, filename);
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

        setValue("imagejoueur", url, { shouldValidate: true });
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
    data: MethodeJoueurSchemaType
  ): MethodeJoueurSchemaType => {
    // Crée une copie profonde des données pour éviter de modifier l'original
    const processedData = JSON.parse(
      JSON.stringify(data)
    ) as MethodeJoueurSchemaType;

    // Traitement des logos de clubs
    if (processedData.clubs) {
      processedData.clubs = processedData.clubs.map((club) => {
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

  const handleSubmitForm = async (data: MethodeJoueurSchemaType) => {
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

    const response = await submitMethodeJoueurForm(finalData, user_id);

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
        <div className="relative w-full">
          <span className="font-semibold font-Montserrat text-sm sm:text-base flex items-center text-gray-600 mb-2">
            <WholeWord className="mr-4" />
            Mots-clés :
          </span>

          {keywordsfield.map((field, index) => (
            <div key={field.id} className="flex items-center mb-2 gap-2">
              <input
                type="text"
                placeholder={`Mot clé ${index + 1} (ex: Djibril Cissé)`}
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
            <FolderPen className="mr-4" />
            Nom du joueur :
          </span>
          <input
            type="text"
            {...register("joueurnom")}
            className="w-full py-3 sm:py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-xs sm:text-sm"
            placeholder="Nom du joueur (ex: Djibril Cissé)"
          />
        </div>

        <div className="relative w-full my-4">
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
            <Drama className="mr-4" />
            Poste :
          </span>
          <input
            type="text"
            {...register("poste")}
            className="w-full py-3 sm:py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-xs sm:text-sm"
            placeholder="Poste (ex: Attaquant de pointe)"
          />
        </div>

        <div className="relative w-full my-4">
          <span className="font-semibold font-Montserrat text-sm sm:text-base flex items-center text-gray-600 mb-2">
            <Ruler className="mr-4" />
            Taille :
          </span>
          <input
            type="text"
            {...register("taille")}
            className="w-full py-3 sm:py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-xs sm:text-sm"
            placeholder="Taille du joueur (ex: 1m84)"
          />
        </div>

        <div className="relative w-full my-4">
          <span className="font-semibold font-Montserrat text-sm sm:text-base flex items-center text-gray-600 mb-2">
            <Footprints className="mr-4" />
            Pied Fort :
          </span>
          <input
            type="text"
            {...register("piedfort")}
            className="w-full py-3 sm:py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-xs sm:text-sm"
            placeholder="Pied fort (ex: Droit)"
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
              className="flex flex-col md:flex-row gap-2 mb-2 w-full font-Montserrat"
            >
              <div className="relative w-full md:w-1/3 flex">
                <input
                  type="text"
                  {...register(`clubs.${index}.0`)}
                  placeholder="Logo (ex: auxerre)"
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
                {...register(`clubs.${index}.1`)}
                placeholder="Nom du club (ex: AJ Auxerre)"
                className="py-2 px-4 border rounded w-full md:w-1/3 text-xs sm:text-sm"
              />
              <input
                type="text"
                {...register(`clubs.${index}.2`)}
                placeholder="Années (ex: (1999-2004))"
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
            onClick={() => appendclubs([""])}
            className="mx-auto flex items-center justify-center gap-2 font-Montserrat text-aja-blue text-sm sm:text-base hover:text-orange-third hover:underline"
          >
            <Plus size={18} />
            Ajouter un club
          </button>
        </div>

        <div className="relative w-full my-4">
          <span className="font-semibold font-Montserrat text-sm sm:text-base flex items-center text-gray-600 mb-2">
            <Sword className="mr-4" />
            Nombre de matchs :
          </span>
          <input
            type="number"
            {...register("matchs")}
            className="w-full py-3 sm:py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-xs sm:text-sm"
            placeholder="Nombre de matchs (ex: 354)"
          />
        </div>

        <div className="relative w-full my-4">
          <span className="font-semibold font-Montserrat text-sm sm:text-base flex items-center text-gray-600 mb-2">
            <Volleyball className="mr-4" />
            Nombre de buts marqués :
          </span>
          <input
            type="number"
            {...register("buts")}
            className="w-full py-3 sm:py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-xs sm:text-sm"
            placeholder="Nombre de buts marqués (ex: 116)"
          />
        </div>

        <div className="relative w-full my-4">
          <span className="font-semibold font-Montserrat text-sm sm:text-base flex items-center text-gray-600 mb-2">
            <Handshake className="mr-4" />
            Nombre de passes décisives :
          </span>
          <input
            type="number"
            {...register("passesd")}
            className="w-full py-3 sm:py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-xs sm:text-sm"
            placeholder="Nombre de passes décisives (ex: 38)"
          />
        </div>

        <Button type="submit" size="default">
          Je publie cette méthode
        </Button>
      </form>
    </div>
  );
}
