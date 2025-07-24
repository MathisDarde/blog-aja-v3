"use client";

import React, { useState } from "react";
import {
  Drama,
  FileQuestion,
  FolderPen,
  Footprints,
  Handshake,
  Loader2,
  Plus,
  Ruler,
  ShieldHalf,
  Sword,
  Trash,
  Volleyball,
  WholeWord,
  X,
} from "lucide-react";
import Button from "@/components/BlueButton";
import { useFieldArray, useForm } from "react-hook-form";
import { UpdateMethodeJoueurSchemaType } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateMethodeJoueurSchema } from "@/app/schema";
import { toast } from "sonner";
import { useGlobalContext } from "@/contexts/GlobalContext";
import Image from "next/image";
import { getTeamLogos } from "@/actions/method/get-logos-files";
import updateMethodeJoueurForm from "@/actions/method/update-joueur-form";
import { UpdateMethodeJoueurFromProps } from "@/contexts/Interfaces";
import { useRouter } from "next/navigation";
import { useFormErrorToasts } from "@/components/FormErrorsHook";

const IMAGE_PATHS = {
  clubs: "/_assets/teamlogos/",
  drapeaux: "/_assets/flags/",
};

export default function JoueurForm({
  selectedMethode,
}: UpdateMethodeJoueurFromProps) {
  const { user_id } = useGlobalContext();

  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<UpdateMethodeJoueurSchemaType>({
    resolver: zodResolver(UpdateMethodeJoueurSchema),
    defaultValues: async () => {
      if (!selectedMethode) {
        return {
          keywords: [],
          joueurnom: "",
          imagejoueur: "",
          clubs: [["", "", ""]],
          matchs: "",
          buts: "",
          passesd: "",
          piedfort: "",
          taille: "",
          poste: "",
        };
      }

      return {
        keywords: selectedMethode.keywords?.map((k) => ({ value: k })) || [],
        joueurnom: selectedMethode.joueurnom || "",
        imagejoueur: selectedMethode.imagejoueur || "",
        clubs: selectedMethode.clubs || [["", "", ""]],
        piedfort: selectedMethode.piedfort || "",
        taille: selectedMethode.taille || "",
        poste: selectedMethode.poste || "",
        matchs: String(selectedMethode.matchs ?? ""),
        buts: String(selectedMethode.buts ?? ""),
        passesd: String(selectedMethode.passesd ?? ""),
      };
    },
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState<string>(
    selectedMethode.imagejoueur || "/_assets/img/pdpdebase.png"
  );
  const [modal, setModal] = useState(false);
  const [fileList, setFileList] = useState<string[]>([]);
  const [activeClubIndex, setActiveClubIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    fields: keywordsfield,
    append: appendkeywords,
    remove: removekeywords,
  } = useFieldArray<UpdateMethodeJoueurSchemaType, "keywords">({
    control,
    name: "keywords",
  });
  const {
    fields: clubsfield,
    append: appendclubs,
    remove: removeclubs,
  } = useFieldArray<UpdateMethodeJoueurSchemaType, "clubs">({
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
    data: UpdateMethodeJoueurSchemaType
  ): UpdateMethodeJoueurSchemaType => {
    // Crée une copie profonde des données pour éviter de modifier l'original
    const processedData = JSON.parse(
      JSON.stringify(data)
    ) as UpdateMethodeJoueurSchemaType;

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

  const handleSubmitForm = async (data: UpdateMethodeJoueurSchemaType) => {
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

    const response = await updateMethodeJoueurForm(
      selectedMethode.id_methode,
      processedData,
      user_id || "",
      selectedFile ?? undefined
    );

    if (response.success) {
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

  const filteredFiles = fileList.filter((file) =>
    file.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useFormErrorToasts(errors);

  return (
    <div className="w-[600px] mx-auto">
      {modal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white font-Montserrat rounded-lg p-6 w-[500px] max-h-[80vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">
                Sélection d&apos;un logo de club
              </h3>
              <button
                onClick={() => setModal(false)}
                className="text-gray-500 hover:text-red-500"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-4">
              <input
                type="text"
                placeholder="Rechercher un logo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {filteredFiles.map((file, index) => (
                  <div
                    key={index}
                    className="border rounded p-2 cursor-pointer hover:bg-gray-100 flex flex-col items-center"
                    onClick={() => selectFile(file)}
                  >
                    <Image
                      width={100}
                      height={100}
                      src={`${IMAGE_PATHS.clubs}${file}`}
                      alt={file}
                      className="h-12 object-contain mb-2"
                    />
                    <span className="text-xs text-center truncate w-full">
                      {file.split(".")[0]}
                    </span>
                  </div>
                ))}
                {filteredFiles.length === 0 && (
                  <div className="col-span-3 text-center py-4 text-gray-500">
                    Aucun fichier trouvé
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <form
        method="POST"
        id="methodesaisonform"
        className="w-[600px]"
        onSubmit={handleSubmit(handleSubmitForm)}
      >
        {/* Image coach */}
        <div className="relative w-[600px] mx-auto">
          {previewPhoto && (
            <div className="w-fit mb-4 relative mx-auto">
              <Image
                width={1024}
                height={1024}
                src={previewPhoto || "/_assets/img/pdpdebase.png"}
                alt="Photo du joueur"
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
            className="underline text-aja-blue font-Montserrat cursor-pointer"
          >
            Modifier la photo du joueur ?
          </label>
        </div>
        <div className="relative w-[600px]">
          <span className="font-semibold font-Montserrat text-gray-600 flex items-center mb-2">
            <WholeWord className="mr-4" />
            Mots-clés :
          </span>

          {keywordsfield.map((field, index) => (
            <div key={field.id} className="flex items-center mb-2 gap-2">
              <input
                type="text"
                placeholder={`Mot clé ${index + 1} (ex: Djibril Cissé)`}
                {...register(`keywords.${index}.value`)}
                className="flex-1 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
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
            className="mx-auto flex items-center justify-center gap-2 text-aja-blue"
          >
            <Plus size={18} />
            Ajouter un mot-clé
          </button>
        </div>

        <div className="relative w-[600px]">
          <span className="font-semibold font-Montserrat text-gray-600 flex items-center mb-2">
            <FolderPen className="mr-4" />
            Nom du joueur :
          </span>
          <input
            type="text"
            {...register("joueurnom")}
            className="w-[600px] my-4 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
            placeholder="Nom du joueur (ex: Djibril Cissé)"
          />
        </div>

        <div className="relative w-[600px]">
          <span className="font-semibold font-Montserrat text-gray-600 flex items-center mb-2">
            <Drama className="mr-4" />
            Poste :
          </span>
          <input
            type="text"
            {...register("poste")}
            className="w-[600px] my-4 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
            placeholder="Poste (ex: Attaquant de pointe)"
          />
        </div>

        <div className="relative w-[600px]">
          <span className="font-semibold font-Montserrat text-gray-600 flex items-center mb-2">
            <Ruler className="mr-4" />
            Taille :
          </span>
          <input
            type="text"
            {...register("taille")}
            className="w-[600px] my-4 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
            placeholder="Taille du joueur (ex: 1m84)"
          />
        </div>

        <div className="relative w-[600px]">
          <span className="font-semibold font-Montserrat text-gray-600 flex items-center mb-2">
            <Footprints className="mr-4" />
            Pied Fort :
          </span>
          <input
            type="text"
            {...register("piedfort")}
            className="w-[600px] my-4 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
            placeholder="Pied fort (ex: Droit)"
          />
        </div>

        <div className="relative w-[600px] mb-4">
          <span className="font-semibold font-Montserrat text-gray-600 flex items-center mb-2">
            <ShieldHalf className="mr-4" />
            Clubs :
          </span>

          {clubsfield.map((field, index) => (
            <div key={field.id} className="flex gap-2 mb-2 w-full">
              <div className="relative w-1/3 flex">
                <input
                  type="text"
                  {...register(`clubs.${index}.0`)}
                  placeholder="Logo (ex: auxerre)"
                  className="py-2 px-4 border rounded w-full"
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
                className="py-2 px-4 border rounded w-1/3"
              />
              <input
                type="text"
                {...register(`clubs.${index}.2`)}
                placeholder="Années (ex: (1999-2004))"
                className="py-2 px-4 border rounded w-1/3"
              />
              <button
                type="button"
                onClick={() => removeclubs(index)}
                className="text-red-500"
              >
                <Trash size={18} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => appendclubs([""])}
            className="mx-auto flex items-center justify-center gap-2 text-aja-blue"
          >
            <Plus size={18} />
            Ajouter un club
          </button>
        </div>

        <div className="relative w-[600px]">
          <span className="font-semibold font-Montserrat text-gray-600 flex items-center mb-2">
            <Sword className="mr-4" />
            Nombre de matchs :
          </span>
          <input
            type="number"
            {...register("matchs")}
            className="w-[600px] my-4 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
            placeholder="Nombre de matchs (ex: 354)"
          />
        </div>

        <div className="relative w-[600px]">
          <span className="font-semibold font-Montserrat text-gray-600 flex items-center mb-2">
            <Volleyball className="mr-4" />
            Nombre de buts marqués :
          </span>
          <input
            type="number"
            {...register("buts")}
            className="w-[600px] my-4 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
            placeholder="Nombre de buts marqués (ex: 116)"
          />
        </div>

        <div className="relative w-[600px]">
          <span className="font-semibold font-Montserrat text-gray-600 flex items-center mb-2">
            <Handshake className="mr-4" />
            Nombre de passes décisives :
          </span>
          <input
            type="number"
            {...register("passesd")}
            className="w-[600px] my-4 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
            placeholder="Nombre de passes décisives (ex: 38)"
          />
        </div>

        <div className="flex justify-center items-center">
          <Button type="submit">Je modifie cette méthode</Button>
        </div>
      </form>
    </div>
  );
}
