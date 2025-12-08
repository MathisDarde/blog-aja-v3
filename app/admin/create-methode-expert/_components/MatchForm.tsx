"use client";

import submitMethodeMatchForm from "@/actions/method/methode-match-form";
// On garde les schémas ici comme demandé, mais idéalement ils sont dans @/app/schema
import { MethodeMatchSchemaType } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  WholeWord,
  Plus,
  Trash,
  AArrowUp,
  Dumbbell,
  Clock,
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
import TeamInfosSection from "./TeamInfosSection";
import { z } from "zod";
import { GameSystems } from "@/components/GameSystems";
import { RempPlayerType } from "@/contexts/Interfaces";

const IMAGE_PATHS = {
  clubs: "/_assets/teamlogos/",
  drapeaux: "/_assets/flags/",
};

// --- DÉFINITION DES SCHÉMAS (Objets) ---

export const TitulaireSchema = z.object({
  nom: z.string().default(""),
  numero: z.string().default(""),
  poste: z.string().default(""),
  sortie: z.string().default(""),
  buts: z.string().default(""),
  cartonJaune: z.boolean().default(false),
  cartonRouge: z.boolean().default(false),
});

export const RemplacantSchema = z.object({
  nom: z.string().default(""),
  drapeau: z.string().default(""),
  poste: z.string().default(""),
  entree: z.string().default(""),
  buts: z.string().default(""),
  cartonJaune: z.boolean().default(false),
  cartonRouge: z.boolean().default(false),
});

export const MethodeMatchSchema = z.object({
  keywords: z
    .array(
      z.object({
        value: z.string().min(1, "Un mot-clé ne peut pas être vide"),
      })
    )
    .min(1, "Ajoute au moins un mot-clé"),
  titrematch: z
    .string()
    .nonempty({ message: "Le titre du match doit être renseigné." }),
  couleur1equipe1: z
    .string()
    .nonempty({ message: "La couleur doit apparaître sous la forme #xxxxxx." }),
  couleur2equipe1: z
    .string()
    .nonempty({ message: "La couleur doit apparaître sous la forme #xxxxxx." }),
  nomequipe1: z
    .string()
    .nonempty({ message: "Le nom de l'équipe doit être renseigné." }),
  systemeequipe1: z.enum(GameSystems, {
    errorMap: () => ({ message: "Veuillez sélectionner un système de jeu." }),
  }),
  couleur1equipe2: z
    .string()
    .nonempty({ message: "La couleur doit apparaître sous la forme #xxxxxx." }),
  couleur2equipe2: z
    .string()
    .nonempty({ message: "La couleur doit apparaître sous la forme #xxxxxx." }),
  nomequipe2: z
    .string()
    .nonempty({ message: "Le nom de l'équipe doit être renseigné." }),
  systemeequipe2: z.enum(GameSystems, {
    errorMap: () => ({ message: "Veuillez sélectionner un système de jeu." }),
  }),
  titulairesequipe1: z.array(TitulaireSchema),
  remplacantsequipe1: z.array(RemplacantSchema),
  titulairesequipe2: z.array(TitulaireSchema),
  remplacantsequipe2: z.array(RemplacantSchema),
  stade: z.string().nonempty({
    message: "Le nom du stade doit être renseigné.",
  }),
  date: z.string().nonempty({
    message: "La date du match doit être renseignée.",
  }),
});

export default function MatchForm() {
  const { user_id } = useGlobalContext();

  const [loading, setLoading] = useState(false);

  // Modèles d'objets vides pour l'initialisation
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
    watch,
    setValue,
    formState: { errors },
  } = useForm<MethodeMatchSchemaType>({
    resolver: zodResolver(MethodeMatchSchema),
    // IMPORTANT : Initialisation avec des Objets et des références uniques
    defaultValues: {
      keywords: [{ value: "" }],
      titrematch: "",
      couleur1equipe1: "#000000",
      couleur2equipe1: "#000000",
      nomequipe1: "",
      systemeequipe1: "4-3-3 Offensif",

      // Initialisation correcte des titulaires (11 objets distincts)
      titulairesequipe1: Array.from({ length: 11 }).map(() => ({
        ...emptyTitulaire,
      })),
      remplacantsequipe1: [{ ...emptyRemplacant }],

      couleur1equipe2: "#000000",
      couleur2equipe2: "#000000",
      nomequipe2: "",
      systemeequipe2: "4-3-3 Offensif",

      // Initialisation correcte des titulaires (11 objets distincts)
      titulairesequipe2: Array.from({ length: 11 }).map(() => ({
        ...emptyTitulaire,
      })),
      remplacantsequipe2: [{ ...emptyRemplacant }],

      stade: "",
      date: "",
    },
  });

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
  } = useFieldArray<MethodeMatchSchemaType, "keywords">({
    control,
    name: "keywords",
  });

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

  const openModalTeam1 = (index: number) => {
    setModal({ team: "equipe1", index });
    fetchFiles();
  };

  const openModalTeam2 = (index: number) => {
    setModal({ team: "equipe2", index });
    fetchFiles();
  };

  // Mise à jour pour cibler la propriété "drapeau" de l'objet remplaçant
  const selectFile = (filename: string) => {
    if (modal && typeof modal !== "boolean") {
      if (modal.team === "equipe1") {
        setValue(`remplacantsequipe1.${modal.index}.drapeau`, filename, {
          shouldDirty: true,
        });
      } else {
        setValue(`remplacantsequipe2.${modal.index}.drapeau`, filename, {
          shouldDirty: true,
        });
      }
      setModal(false);
    }
  };

  // Mise à jour pour traiter les objets au lieu des index
  const processImagePaths = (
    data: MethodeMatchSchemaType
  ): MethodeMatchSchemaType => {
    // Crée une copie profonde des données
    const processedData = JSON.parse(
      JSON.stringify(data)
    ) as MethodeMatchSchemaType;

    const processRemplacants = (remplacants: RempPlayerType[]) => {
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

    if (processedData.remplacantsequipe1) {
      processedData.remplacantsequipe1 = processRemplacants(
        processedData.remplacantsequipe1
      );
    }

    if (processedData.remplacantsequipe2) {
      processedData.remplacantsequipe2 = processRemplacants(
        processedData.remplacantsequipe2
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

  const handleSubmitForm = async (data: MethodeMatchSchemaType) => {
    if (!user_id) {
      toast.error(
        "L'ID de l'utilisateur n'est pas défini. Veuillez vous connecter."
      );
      return;
    }

    const processedData = processImagePaths(data);
    const finalData = { ...processedData };

    const response = await submitMethodeMatchForm(finalData, user_id);

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
        className="max-w-[700px] mx-auto flex flex-col items-center justify-center"
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
                placeholder={`Mot clé ${index + 1} (ex: dimanche 16 mai 2022)`}
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
            <AArrowUp className="mr-4" />
            Nom du match :
          </span>
          <input
            type="text"
            {...register("titrematch")}
            className="w-full py-3 sm:py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-xs sm:text-sm"
            placeholder="Nom du match (ex: DOM X - X EXT)"
          />
        </div>

        <div className="relative w-full my-4">
          <span className="font-semibold font-Montserrat text-sm sm:text-base flex items-center text-gray-600 mb-2">
            <Dumbbell className="mr-4" />
            Stade :
          </span>
          <input
            type="text"
            {...register("stade")}
            className="w-full py-3 sm:py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-xs sm:text-sm"
            placeholder="Stade (ex: Stade de l'Abbé Deschamps, Auxerre)"
          />
        </div>

        <div className="relative w-full my-4">
          <span className="font-semibold font-Montserrat text-sm sm:text-base flex items-center text-gray-600 mb-2">
            <Clock className="mr-4" />
            Horaire et Date :
          </span>
          <input
            type="text"
            {...register("date")}
            className="w-full py-3 sm:py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-xs sm:text-sm"
            placeholder="Date (samedi 16 mai 2022, 20h45)"
          />
        </div>

        <TeamInfosSection
          control={control}
          register={register}
          watch={watch}
          setValue={setValue}
          errors={errors}
          teamIndex={1}
          expandedIndices={expandedIndices.equipe1}
          onToggleExpand={(idx) => toggleExpand("equipe1", idx)}
          onOpenModal={openModalTeam1}
        />

        <TeamInfosSection
          control={control}
          register={register}
          watch={watch}
          setValue={setValue}
          errors={errors}
          teamIndex={2}
          expandedIndices={expandedIndices.equipe2}
          onToggleExpand={(idx) => toggleExpand("equipe2", idx)}
          onOpenModal={openModalTeam2}
        />

        <Button type="submit" size="default">
          Je publie cette méthode
        </Button>
      </form>
    </div>
  );
}
