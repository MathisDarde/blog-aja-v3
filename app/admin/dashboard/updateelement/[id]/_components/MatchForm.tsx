"use client";

import React, { useState } from "react";
import {
  AArrowUp,
  Clock,
  Dumbbell,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { UpdateMethodeMatchSchemaType } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
// Assurez-vous que votre UpdateMethodeMatchSchema est bien mis à jour avec z.object() comme le Create
import { UpdateMethodeMatchSchema } from "@/app/schema";
import { toast } from "sonner";
import { useGlobalContext } from "@/contexts/GlobalContext";
import {
  RempPlayerType,
  UpdateMethodeMatchFromProps,
} from "@/contexts/Interfaces";
import { getFlags } from "@/actions/method/get-flags-files";
import updateMethodeMatchForm from "@/actions/method/update-match-form";
import { useRouter } from "next/navigation";
import { useFormErrorToasts } from "@/components/FormErrorsHook";
import FlagSelectorModal from "@/components/FlagSelector";
import Button from "@/components/BlueButton";
import TeamInfosSection from "@/app/admin/create-methode-expert/_components/TeamInfosSection";
import SwapTeamsButton from "@/app/admin/create-methode-expert/_components/SwapTeamsButton";
import {
  emptyMatchFormValues,
  methodeMatchToFormValues,
  swapMatchTeams,
} from "@/lib/methode-match-form";

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
    getValues,
    watch,
    reset,
    formState: { errors },
  } = useForm<UpdateMethodeMatchSchemaType>({
    resolver: zodResolver(UpdateMethodeMatchSchema),
    // Anciennes méthodes (joueurs en tableaux) converties en objets
    defaultValues: (selectedMethode
      ? methodeMatchToFormValues(selectedMethode)
      : emptyMatchFormValues()) as UpdateMethodeMatchSchemaType,
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
  // Changé à chaque inversion : les sections d'équipe repartent de zéro
  const [teamsKey, setTeamsKey] = useState(0);

  const swapTeams = () => {
    reset(swapMatchTeams(getValues()), { keepDefaultValues: true });
    setTeamsKey((key) => key + 1);
    setExpandedIndices((prev) => ({ equipe1: prev.equipe2, equipe2: prev.equipe1 }));
  };


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

  // Mise à jour pour cibler la propriété .drapeau de l'objet remplaçant
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

  // Traitement des données avant envoi (Ajout prefixe images)
  const processSubmissionData = (
    data: UpdateMethodeMatchSchemaType
  ): UpdateMethodeMatchSchemaType => {
    // Copie profonde
    const processedData = JSON.parse(JSON.stringify(data));

    // Helper pour traiter les tableaux de remplaçants (Objets)
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

    return processedData as UpdateMethodeMatchSchemaType;
  };

  const handleSubmitForm = async (data: UpdateMethodeMatchSchemaType) => {
    if (!user_id) {
      toast.error(
        "L'ID de l'utilisateur n'est pas défini. Veuillez vous connecter."
      );
      return;
    }

    const finalData = processSubmissionData(data);

    const response = await updateMethodeMatchForm(
      selectedMethode.id_methode,
      finalData,
      user_id
    );

    if (response.success) {
      toast.success("Méthode mise à jour avec succès");
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
          console.error("Validation échouée", errors);
          toast.error("Veuillez corriger les erreurs du formulaire.");
        })}
      >
        {/* --- CHAMPS TITRE, STADE, DATE (Inchangés) --- */}

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

        {/* --- SECTIONS ÉQUIPES --- */}
        {/* On passe toujours les mêmes props, mais TeamInfosSection gère maintenant des Objets */}
        <TeamInfosSection
          key={`equipe1-${teamsKey}`}
          control={control}
          register={register}
          watch={watch}
          setValue={setValue}
          getValues={getValues}
          errors={errors}
          teamIndex={1}
          expandedIndices={expandedIndices.equipe1}
          onToggleExpand={(idx) => toggleExpand("equipe1", idx)}
          onOpenModal={openModalTeam1}
        />

        <SwapTeamsButton onSwap={swapTeams} />

        <TeamInfosSection
          key={`equipe2-${teamsKey}`}
          control={control}
          register={register}
          watch={watch}
          setValue={setValue}
          getValues={getValues}
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
