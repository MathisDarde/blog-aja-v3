"use client";

import React, { useState } from "react";
import {
  AArrowUp,
  Clock,
  Dumbbell,
  Plus,
  Trash,
  WholeWord,
} from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { UpdateMethodeMatchSchemaType } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateMethodeMatchSchema } from "@/app/schema";
import { toast } from "sonner";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { UpdateMethodeMatchFromProps } from "@/contexts/Interfaces";
import { getFlags } from "@/actions/method/get-flags-files";
import updateMethodeMatchForm from "@/actions/method/update-match-form";
import { useRouter } from "next/navigation";
import { useFormErrorToasts } from "@/components/FormErrorsHook";
import FlagSelectorModal from "@/components/FlagSelector";
import Button from "@/components/BlueButton";
import TeamInfosSection from "@/app/admin/create-methode-expert/_components/TeamInfosSection";

const IMAGE_PATHS = {
  clubs: "/_assets/teamlogos/",
  drapeaux: "/_assets/flags/",
};

// Fonction utilitaire pour convertir les valeurs BDD (string) en valeurs Formulaire (booléen/string)
const parseCellData = (cell: string | null | undefined | boolean): string | boolean => {
  if (cell === "true") return true;
  if (cell === "false") return false;
  return cell === null || cell === undefined ? "" : String(cell);
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
        // Initialisation vide
        const emptyData = {
          keywords: [],
          nomequipe1: "",
          couleur1equipe1: "",
          couleur1equipe2: "",
          couleur2equipe1: "",
          couleur2equipe2: "",
          date: "",
          nomequipe2: "",
          titulairesequipe1: [["", "", "", "", "", false, false]],
          titulairesequipe2: [["", "", "", "", "", false, false]],
          remplacantsequipe1: [["", "", "", "", "", false, false]],
          remplacantsequipe2: [["", "", "", "", "", false, false]],
          stade: "",
          systemeequipe1: "4-3-3 Offensif",
          systemeequipe2: "4-3-3 Offensif",
          titrematch: "",
        };
        // On cast via unknown pour satisfaire le schéma strict (qui attend string[][])
        // alors qu'on passe des booléens pour les checkboxes
        return emptyData as unknown as UpdateMethodeMatchSchemaType;
      }

      // Initialisation avec données existantes
      const loadedData = {
        keywords: selectedMethode.keywords?.map((k) => ({ value: k })) || [],
        nomequipe1: selectedMethode.nomequipe1 || "",
        couleur1equipe1: selectedMethode.couleur1equipe1 || "",
        couleur1equipe2: selectedMethode.couleur1equipe2 || "",
        couleur2equipe1: selectedMethode.couleur2equipe1 || "",
        couleur2equipe2: selectedMethode.couleur2equipe2 || "",
        date: selectedMethode.date || "",
        nomequipe2: selectedMethode.nomequipe2 || "",
        
        // On parse chaque cellule pour transformer "true"/"false" en true/false
        titulairesequipe1: selectedMethode.titulairesequipe1?.map((row) =>
          row.map(parseCellData)
        ) || [["", "", "", "", "", false, false]],

        titulairesequipe2: selectedMethode.titulairesequipe2?.map((row) =>
          row.map(parseCellData)
        ) || [["", "", "", "", "", false, false]],

        remplacantsequipe1: selectedMethode.remplacantsequipe1?.map((row) =>
          row.map(parseCellData)
        ) || [["", "", "", "", "", false, false]],

        remplacantsequipe2: selectedMethode.remplacantsequipe2?.map((row) =>
          row.map(parseCellData)
        ) || [["", "", "", "", "", false, false]],

        stade: selectedMethode.stade || "",
        systemeequipe1: selectedMethode.systemeequipe1 || "",
        systemeequipe2: selectedMethode.systemeequipe2 || "",
        titrematch: selectedMethode.titrematch || "",
      };

      // Cast "safe" pour éviter l'erreur TS sans utiliser any
      return loadedData as unknown as UpdateMethodeMatchSchemaType;
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
  } = useFieldArray<UpdateMethodeMatchSchemaType, "keywords">({
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

  const toggleExpand = (team: "equipe1" | "equipe2", index: number) => {
    setExpandedIndices((prev) => {
      const teamIndices = [...prev[team]];
      const currentIndex = teamIndices.indexOf(index);
      if (currentIndex === -1) {
        teamIndices.push(index);
      } else {
        teamIndices.splice(currentIndex, 1);
      }
      return { ...prev, [team]: teamIndices };
    });
  };

  // Traitement des données avant envoi (Images + Conversion Booléen -> String)
  const processSubmissionData = (
    data: UpdateMethodeMatchSchemaType
  ): UpdateMethodeMatchSchemaType => {
    // Copie profonde sans typage strict temporaire pour manipulation facile
    const processedData = JSON.parse(JSON.stringify(data));

    const processRows = (rows: (string | boolean)[][]) => {
      return rows.map((row) => {
        return row.map((cell, index) => {
          // 1. Reconversion Booléen -> String pour la BDD
          if (typeof cell === "boolean") {
            return String(cell); // "true" ou "false"
          }

          // 2. Gestion des chemins d'images (Drapeaux)
          // index 1 correspond généralement à la colonne drapeau/numéro selon votre logique
          if (
            index === 1 &&
            cell &&
            typeof cell === "string" &&
            !cell.startsWith("http") &&
            !cell.startsWith("/")
          ) {
            return `${IMAGE_PATHS.drapeaux}${cell}`;
          }

          return cell;
        });
      });
    };

    // Appliquer le traitement à toutes les listes
    if (processedData.remplacantsequipe1) {
      processedData.remplacantsequipe1 = processRows(processedData.remplacantsequipe1);
    }
    if (processedData.remplacantsequipe2) {
      processedData.remplacantsequipe2 = processRows(processedData.remplacantsequipe2);
    }
    if (processedData.titulairesequipe1) {
      processedData.titulairesequipe1 = processRows(processedData.titulairesequipe1);
    }
    if (processedData.titulairesequipe2) {
      processedData.titulairesequipe2 = processRows(processedData.titulairesequipe2);
    }

    // On retourne le résultat casté proprement car maintenant tout est string
    return processedData as UpdateMethodeMatchSchemaType;
  };

  const handleSubmitForm = async (data: UpdateMethodeMatchSchemaType) => {
    if (!user_id) {
      toast.error(
        "L'ID de l'utilisateur n'est pas défini. Veuillez vous connecter."
      );
      return;
    }

    // On transforme les données (images + booléens -> strings)
    const finalData = processSubmissionData(data);

    const response = await updateMethodeMatchForm(
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
        className="max-w-[750px] mx-auto"
        onSubmit={handleSubmit(handleSubmitForm, (errors) => {
          console.error("Validation échouée", errors)
          toast.error("Veuillez corriger les erreurs du formulaire.")
        })}
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
            className="mx-auto flex items-center justify-center gap-2 text-aja-blue text-sm sm:text-base font-Montserrat"
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
          Je modifie cette méthode
        </Button>
      </form>
    </div>
  );
}