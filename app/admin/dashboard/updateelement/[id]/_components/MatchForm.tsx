"use client";

import React, { useState } from "react";
import {
  AArrowUp,
  ArrowLeftRight,
  ChartBarBig,
  ChevronDown,
  ChevronRight,
  Clock,
  Dumbbell,
  FileQuestion,
  FolderPen,
  Loader2,
  PaintbrushVertical,
  Plus,
  Trash,
  WholeWord,
  X,
} from "lucide-react";
import Button from "@/components/BlueButton";
import { useFieldArray, useForm } from "react-hook-form";
import { UpdateMethodeMatchSchemaType } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateMethodeMatchSchema } from "@/app/schema";
import { toast } from "sonner";
import { useGlobalContext } from "@/contexts/GlobalContext";
import Image from "next/image";
import { UpdateMethodeMatchFromProps } from "@/contexts/Interfaces";
import { getFlags } from "@/actions/method/get-flags-files";
import updateMethodeMatchForm from "@/actions/method/update-match-form";
import Section from "@/app/admin/createmethodeexpert/_components/DropdownContainerDomExt";
import { useRouter } from "next/navigation";
import { useFormErrorToasts } from "@/components/FormErrorsHook";

const IMAGE_PATHS = {
  clubs: "/_assets/teamlogos/",
  drapeaux: "/_assets/flags/",
};

export default function MatchForm({
  selectedMethode,
}: UpdateMethodeMatchFromProps) {
  const { user_id } = useGlobalContext();

  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UpdateMethodeMatchSchemaType>({
    resolver: zodResolver(UpdateMethodeMatchSchema),
    defaultValues: async () => {
      if (!selectedMethode) {
        return {
          keywords: [],
          nomequipe1: "",
          couleur1equipe1: "",
          couleur1equipe2: "",
          couleur2equipe1: "",
          couleur2equipe2: "",
          date: "",
          nomequipe2: "",
          remplacantsequipe1: [["", "", "", "", ""]],
          remplacantsequipe2: [["", "", "", "", ""]],
          stade: "",
          systemeequipe1: "",
          systemeequipe2: "",
          titrematch: "",
          imgterrain: "",
        };
      }

      return {
        keywords: selectedMethode.keywords?.map((k) => ({ value: k })) || [],
        nomequipe1: selectedMethode.nomequipe1 || "",
        couleur1equipe1: selectedMethode.couleur1equipe1 || "",
        couleur1equipe2: selectedMethode.couleur1equipe2 || "",
        couleur2equipe1: selectedMethode.couleur2equipe1 || "",
        couleur2equipe2: selectedMethode.couleur2equipe2 || "",
        date: selectedMethode.date || "",
        nomequipe2: selectedMethode.nomequipe2 || "",
        remplacantsequipe1: selectedMethode.remplacantsequipe1?.map((row) =>
          row.map((cell) => cell || "")
        ) || [["", "", "", "", ""]],
        remplacantsequipe2: selectedMethode.remplacantsequipe2?.map((row) =>
          row.map((cell) => cell || "")
        ) || [["", "", "", "", ""]],
        stade: selectedMethode.stade || "",
        systemeequipe1: selectedMethode.systemeequipe1 || "",
        systemeequipe2: selectedMethode.systemeequipe2 || "",
        titrematch: selectedMethode.titrematch || "",
        imgterrain: selectedMethode.imgterrain || "",
      };
    },
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState<string>(
    selectedMethode.imgterrain || "/_assets/terrain/demiterrain.png"
  );
  const [modal, setModal] = useState<
    false | { team: "equipe1" | "equipe2"; index: number }
  >(false);
  const [fileList, setFileList] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedIndices, setExpandedIndices] = useState<{
    equipe1: number[];
    equipe2: number[];
  }>({
    equipe1: [],
    equipe2: [],
  });

  const {
    fields: keywordsfield,
    append: appendkeywords,
    remove: removekeywords,
  } = useFieldArray<UpdateMethodeMatchSchemaType, "keywords">({
    control,
    name: "keywords", // Assurez-vous que c'est juste "keywords"
  });

  const {
    fields: remplacantseq1field,
    append: appendremplacantseq1,
    remove: removeremplacantseq1,
  } = useFieldArray<UpdateMethodeMatchSchemaType, "remplacantsequipe1">({
    control,
    name: "remplacantsequipe1",
  });

  const {
    fields: remplacantseq2field,
    append: appendremplacantseq2,
    remove: removeremplacantseq2,
  } = useFieldArray<UpdateMethodeMatchSchemaType, "remplacantsequipe2">({
    control,
    name: "remplacantsequipe2",
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

  const openModalTeam1 = (index: number) => {
    setModal({ team: "equipe1", index });
    fetchFiles();
  };

  const openModalTeam2 = (index: number) => {
    setModal({ team: "equipe2", index });
    fetchFiles();
  };

  // Modifiez la fonction selectFile pour utiliser l'information de l'équipe
  const selectFile = (filename: string) => {
    if (modal && typeof modal !== "boolean") {
      if (modal.team === "equipe1") {
        setValue(`remplacantsequipe1.${modal.index}.1`, filename);
      } else {
        setValue(`remplacantsequipe2.${modal.index}.1`, filename);
      }
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

  // Modifiez la fonction processImagePaths pour traiter correctement les deux équipes
  const processImagePaths = (
    data: UpdateMethodeMatchSchemaType
  ): UpdateMethodeMatchSchemaType => {
    // Crée une copie profonde des données pour éviter de modifier l'original
    const processedData = JSON.parse(
      JSON.stringify(data)
    ) as UpdateMethodeMatchSchemaType;

    // Traitement des logos pour l'équipe 1
    if (processedData.remplacantsequipe1) {
      processedData.remplacantsequipe1 = processedData.remplacantsequipe1.map(
        (remp1) => {
          if (
            remp1[1] &&
            !remp1[1].startsWith("http") &&
            !remp1[1].startsWith("/")
          ) {
            remp1[1] = `${IMAGE_PATHS.drapeaux}${remp1[1]}`;
          }
          return remp1;
        }
      );
    }

    // Traitement des logos pour l'équipe 2
    if (processedData.remplacantsequipe2) {
      processedData.remplacantsequipe2 = processedData.remplacantsequipe2.map(
        (remp2) => {
          if (
            remp2[1] &&
            !remp2[1].startsWith("http") &&
            !remp2[1].startsWith("/")
          ) {
            remp2[1] = `${IMAGE_PATHS.drapeaux}${remp2[1]}`;
          }
          return remp2;
        }
      );
    }

    return processedData;
  };

  const toggleExpand = (team: "equipe1" | "equipe2", index: number) => {
    setExpandedIndices((prev) => {
      const teamIndices = [...prev[team]];
      const currentIndex = teamIndices.indexOf(index);

      if (currentIndex === -1) {
        teamIndices.push(index);
      } else {
        teamIndices.splice(currentIndex, 1);
      }

      return {
        ...prev,
        [team]: teamIndices,
      };
    });
  };

  const handleSubmitForm = async (data: UpdateMethodeMatchSchemaType) => {
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

    const response = await updateMethodeMatchForm(
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

  const handleColorChangeDom1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Validation du code hex
    if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
      setValue("couleur1equipe1", value);
    }
  };
  const handleColorChangeDom2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Validation du code hex
    if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
      setValue("couleur2equipe1", value);
    }
  };
  const handleColorChangeAway1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Validation du code hex
    if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
      setValue("couleur1equipe2", value);
    }
  };
  const handleColorChangeAway2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Validation du code hex
    if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
      setValue("couleur2equipe2", value);
    }
  };

  const filteredFiles = fileList.filter((file) =>
    file.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useFormErrorToasts(errors)

  return (
    <div className="w-[750px] mx-auto">
      {modal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white font-Montserrat rounded-lg p-6 w-[500px] max-h-[80vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Sélection d&apos;un drapeau</h3>
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
                placeholder="Rechercher un drapeau..."
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
                      src={`${IMAGE_PATHS.drapeaux}${file}`}
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
        className="w-[750px] flex flex-col items-center justify-center"
        onSubmit={handleSubmit(handleSubmitForm)}
      >
        {/* Image terrain */}
        <div className="relative mx-auto">
          {previewPhoto && (
            <div className="w-fit mb-4 relative mx-auto">
              <Image
                width={1024}
                height={1024}
                src={previewPhoto || "/_assets/img/demiterrain.png"}
                alt="Image du terrain"
                className="h-[300px] w-auto"
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
            Modifier l&apos;image du terrain ?
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
                placeholder={`Mot clé ${index + 1} (ex: dimanche 16 mai 2022)`}
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

        <div className="relative w-[600px] my-4">
          <span className="font-semibold font-Montserrat text-gray-600 flex items-center mb-2">
            <AArrowUp className="mr-4" />
            Nom du match :
          </span>
          <input
            type="text"
            {...register("titrematch")}
            className="w-full my-2 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
            placeholder="Nom du match (ex: DOM X - X EXT)"
          />
        </div>

        <div className="relative w-[600px] my-4">
          <span className="font-semibold font-Montserrat text-gray-600 flex items-center mb-2">
            <Dumbbell className="mr-4" />
            Stade :
          </span>
          <input
            type="text"
            {...register("stade")}
            className="w-full my-2 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
            placeholder="Stade (ex: Stade de l'Abbé Deschamps, Auxerre)"
          />
        </div>

        <div className="relative w-[600px] my-4">
          <span className="font-semibold font-Montserrat text-gray-600 flex items-center mb-2">
            <Clock className="mr-4" />
            Horaire et Date :
          </span>
          <input
            type="text"
            {...register("date")}
            className="w-full my-2 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
            placeholder="Date (samedi 16 mai 2022, 20h45)"
          />
        </div>

        <Section title="Infos sur équipe à domicile">
          <div className="relative w-auto my-4">
            <span className="font-semibold font-Montserrat text-gray-600 flex items-center">
              <PaintbrushVertical className="mr-4" />
              Couleur principale de l&apos;équipe à domicile (Code héx.) :
            </span>
            <div className="flex items-center gap-6">
              <input
                type="color"
                id="inputcolor"
                {...register("couleur1equipe1")}
                onChange={handleColorChangeDom1}
                className="my-2 w-10 h-10 border-none cursor-pointer appearance-none"
              />
              <input
                type="text"
                id="inputhex"
                {...register("couleur1equipe1")}
                value={watch("couleur1equipe1")}
                onChange={handleColorChangeDom1}
                className="bg-white w-1/3 px-6 py-3 rounded-md border-gray-600 border"
              />
            </div>
          </div>

          <div className="relative w-auto my-4">
            <span className="font-semibold font-Montserrat text-gray-600 flex items-center mb-2">
              <PaintbrushVertical className="mr-4" />
              Couleur secondaire de l&apos;équipe à domicile (Code héx.) :
            </span>
            <div className="flex items-center gap-6">
              <input
                type="color"
                id="inputcolor"
                {...register("couleur2equipe1")}
                onChange={handleColorChangeDom2}
                className="my-2 w-10 h-10 border-none cursor-pointer appearance-none"
              />
              <input
                type="text"
                id="inputhex"
                {...register("couleur2equipe1")}
                value={watch("couleur2equipe1")}
                onChange={handleColorChangeDom2}
                className="bg-white w-1/3 px-6 py-3 rounded-md border-gray-600 border"
              />
            </div>
          </div>

          <div className="relative w-auto my-4">
            <span className="font-semibold font-Montserrat text-gray-600 flex items-center mb-2">
              <FolderPen className="mr-4" />
              Nom de l&apos;équipe à domicile :
            </span>
            <input
              type="text"
              {...register("nomequipe1")}
              className="w-full my-2 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
              placeholder="Nom de l'équipe (ex: AJ Auxerre)"
            />
          </div>

          <div className="relative w-auto my-4">
            <span className="font-semibold font-Montserrat text-gray-600 flex items-center mb-2">
              <ChartBarBig className="mr-4" />
              Système de jeu de l&apos;équipe à domicile :
            </span>
            <input
              type="text"
              {...register("systemeequipe1")}
              className="w-full my-2 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
              placeholder="Système de jeu (ex: 4-3-3)"
            />
          </div>

          <div className="relative w-auto my-4">
            <span className="font-semibold font-Montserrat text-gray-600 flex items-center mb-2">
              <ArrowLeftRight className="mr-4" />
              Remplaçants de l&apos;équipe à domicile :
            </span>

            {remplacantseq1field.map((field, index) => (
              <React.Fragment key={field.id}>
                <div className="flex items-center gap-2 mb-2 w-full">
                  {expandedIndices.equipe1.includes(index) ? (
                    <ChevronDown
                      onClick={() => toggleExpand("equipe1", index)}
                    />
                  ) : (
                    <ChevronRight
                      onClick={() => toggleExpand("equipe1", index)}
                    />
                  )}
                  <input
                    type="text"
                    {...register(`remplacantsequipe1.${index}.0`)}
                    placeholder="Nom (ex: Gaëtan Perrin)"
                    className="py-2 px-4 border rounded w-2/5"
                  />
                  <div className="relative w-2/5 flex">
                    <input
                      type="text"
                      {...register(`remplacantsequipe1.${index}.1`)}
                      placeholder="Drapeau (ex: france)"
                      className="py-2 px-4 border rounded"
                    />
                    <button
                      type="button"
                      onClick={() => openModalTeam1(index)}
                      className="ml-1 text-aja-blue"
                    >
                      <FileQuestion size={20} />
                    </button>
                  </div>
                  <input
                    type="text"
                    {...register(`remplacantsequipe1.${index}.2`)}
                    placeholder="Poste (ex: G ou Gardien)"
                    className="py-2 px-4 border rounded w-1/5"
                  />
                  <button
                    type="button"
                    onClick={() => removeremplacantseq1(index)}
                    className="text-red-500"
                  >
                    <Trash size={18} />
                  </button>
                </div>

                {expandedIndices.equipe1.includes(index) && (
                  <div className="flex gap-4 items-center px-12 mb-2">
                    <input
                      type="text"
                      {...register(`remplacantsequipe1.${index}.3`)}
                      placeholder="Minute du changement (ex: 75')"
                      className="py-2 px-4 border rounded w-2/4"
                    />
                    <input
                      type="text"
                      {...register(`remplacantsequipe1.${index}.4`)}
                      placeholder="Nombre de buts marqués (ex: 0)"
                      className="py-2 px-4 border rounded w-2/4"
                    />
                  </div>
                )}
              </React.Fragment>
            ))}

            <button
              type="button"
              onClick={() => appendremplacantseq1([""])}
              className="mx-auto flex items-center justify-center gap-2 text-aja-blue"
            >
              <Plus size={18} />
              Ajouter un remplaçant
            </button>
          </div>
        </Section>

        <Section title="Infos sur équipe à l'extérieur">
          <div className="relative w-auto my-4">
            <span className="font-semibold font-Montserrat text-gray-600 flex items-center">
              <PaintbrushVertical className="mr-4" />
              Couleur principale de l&apos;équipe à l&apos;extérieur (Code héx.)
              :
            </span>
            <div className="flex items-center gap-6">
              <input
                type="color"
                id="inputcolor"
                {...register("couleur1equipe2")}
                onChange={handleColorChangeAway1}
                className="my-2 w-10 h-10 border-none cursor-pointer appearance-none"
              />
              <input
                type="text"
                id="inputhex"
                {...register("couleur1equipe2")}
                value={watch("couleur1equipe2")}
                onChange={handleColorChangeAway1}
                className="bg-white w-1/3 px-6 py-3 rounded-md border-gray-600 border"
              />
            </div>
          </div>

          <div className="relative w-auto my-4">
            <span className="font-semibold font-Montserrat text-gray-600 flex items-center mb-2">
              <PaintbrushVertical className="mr-4" />
              Couleur secondaire de l&apos;équipe à l&apos;extérieur (Code héx.)
              :
            </span>
            <div className="flex items-center gap-6">
              <input
                type="color"
                id="inputcolor"
                {...register("couleur2equipe2")}
                onChange={handleColorChangeAway2}
                className="my-2 w-10 h-10 border-none cursor-pointer appearance-none"
              />
              <input
                type="text"
                id="inputhex"
                {...register("couleur2equipe2")}
                value={watch("couleur2equipe2")}
                onChange={handleColorChangeAway2}
                className="bg-white w-1/3 px-6 py-3 rounded-md border-gray-600 border"
              />
            </div>
          </div>

          <div className="relative w-auto my-4">
            <span className="font-semibold font-Montserrat text-gray-600 flex items-center mb-2">
              <FolderPen className="mr-4" />
              Nom de l&apos;équipe à l&apos;extérieur :
            </span>
            <input
              type="text"
              {...register("nomequipe2")} // Modifié de nomequipe1 à nomequipe2
              className="w-full my-2 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
              placeholder="Nom de l'équipe (ex: RC Lens)"
            />
          </div>

          <div className="relative w-auto my-4">
            <span className="font-semibold font-Montserrat text-gray-600 flex items-center mb-2">
              <ChartBarBig className="mr-4" />
              Système de jeu de l&apos;équipe à l&apos;extérieur :
            </span>
            <input
              type="text"
              {...register("systemeequipe2")} // Modifié de systemeequipe1 à systemeequipe2
              className="w-full my-2 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
              placeholder="Système de jeu (ex: 3-4-3)"
            />
          </div>

          <div className="relative w-auto my-4">
            <span className="font-semibold font-Montserrat text-gray-600 flex items-center mb-2">
              <ArrowLeftRight className="mr-4" />
              Remplaçants de l&apos;équipe à l&apos;extérieur :
            </span>

            {remplacantseq2field.map((field, index) => (
              <React.Fragment key={field.id}>
                <div className="flex items-center gap-2 mb-2 w-full">
                  {expandedIndices.equipe2.includes(index) ? (
                    <ChevronDown
                      onClick={() => toggleExpand("equipe2", index)}
                    />
                  ) : (
                    <ChevronRight
                      onClick={() => toggleExpand("equipe2", index)}
                    />
                  )}
                  <input
                    type="text"
                    {...register(`remplacantsequipe2.${index}.0`)}
                    placeholder="Nom (ex: Gaëtan Perrin)"
                    className="py-2 px-4 border rounded w-2/5"
                  />
                  <div className="relative w-2/5 flex">
                    <input
                      type="text"
                      {...register(`remplacantsequipe2.${index}.1`)}
                      placeholder="Drapeau (ex: france)"
                      className="py-2 px-4 border rounded"
                    />
                    <button
                      type="button"
                      onClick={() => openModalTeam2(index)}
                      className="ml-1 text-aja-blue"
                    >
                      <FileQuestion size={20} />
                    </button>
                  </div>
                  <input
                    type="text"
                    {...register(`remplacantsequipe2.${index}.2`)}
                    placeholder="Poste (ex: G ou Gardien)"
                    className="py-2 px-4 border rounded w-1/5"
                  />
                  <button
                    type="button"
                    onClick={() => removeremplacantseq2(index)}
                    className="text-red-500"
                  >
                    <Trash size={18} />
                  </button>
                </div>

                {expandedIndices.equipe2.includes(index) && (
                  <div className="flex gap-4 items-center px-12 mb-2">
                    <input
                      type="text"
                      {...register(`remplacantsequipe2.${index}.3`)}
                      placeholder="Minute du changement (ex: 75')"
                      className="py-2 px-4 border rounded w-2/4"
                    />
                    <input
                      type="text"
                      {...register(`remplacantsequipe2.${index}.4`)}
                      placeholder="Nombre de buts marqués (ex: 0)"
                      className="py-2 px-4 border rounded w-2/4"
                    />
                  </div>
                )}
              </React.Fragment>
            ))}
            <button
              type="button"
              onClick={() => appendremplacantseq2([""])}
              className="mx-auto flex items-center justify-center gap-2 text-aja-blue"
            >
              <Plus size={18} />
              Ajouter un remplaçant
            </button>
          </div>
        </Section>

        <div className="flex justify-center items-center">
          <Button type="submit">Je modifie cette méthode</Button>
        </div>
      </form>
    </div>
  );
}
