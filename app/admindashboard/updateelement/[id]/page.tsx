"use client";

import React, { useEffect, useState } from "react";
import {
  MethodeCoach,
  MethodeJoueur,
  MethodeMatch,
  MethodeSaison,
} from "@/contexts/Interfaces";
import { ChevronLeft } from "lucide-react";
import { ModalAction } from "@/components/ModalAction";
import { useGettersContext } from "@/contexts/DataGettersContext";
import { useGlobalContext } from "@/contexts/GlobalContext";
import JoueurForm from "./_components/JoueurForm";
import CoachForm from "./_components/CoachForm";
import SaisonForm from "./_components/SaisonForm";
import MatchForm from "./_components/MatchForm";

export type Methodes =
  | MethodeJoueur
  | MethodeSaison
  | MethodeMatch
  | MethodeCoach;

export default function MethodeUpdate() {
  const { router, params, modalParams, setModalParams } = useGlobalContext();
  const { getMethodeById } = useGettersContext();

  const [selectedMethode, setSelectedMethode] = useState<Methodes | null>(null);

  useEffect(() => {
    function getMethodByParam() {
      const methodeId = params.id as string;
      if (!methodeId) {
        router.push("/admindashboard");
        return null;
      }

      const methode = getMethodeById(methodeId) as Methodes | null;
      if (methode) {
        setSelectedMethode(methode);
      }
    }
    getMethodByParam();
  }, [params.id, getMethodeById, router]);

  const openLeaveChangesMethodModal = () => {
    setModalParams({
      object: "methode",
      type: "leaveChanges",
      onConfirm: async () => {
        setModalParams(null);
        if (selectedMethode) {
          router.push(`/admindashboard`);
        }
      },
      onCancel: () => setModalParams(null),
    });
  };

  return (
    <div className="text-center bg-gray-100 min-h-screen w-screen box-border p-10">
      {modalParams && (
        <ModalAction
          object={modalParams.object}
          type={modalParams.type}
          onConfirm={modalParams.onConfirm}
          onCancel={modalParams.onCancel}
        />
      )}

      <h2
        className="font-bold font-Bai_Jamjuree uppercase text-3xl mb-10 flex items-center justify-center gap-3 cursor-pointer"
        onClick={() => openLeaveChangesMethodModal()}
      >
        <ChevronLeft /> Formulaire de modification de méthode expert
      </h2>

      <div>
        {selectedMethode?.typemethode === "joueur" && (
          <JoueurForm selectedMethode={selectedMethode} />
        )}
        {selectedMethode?.typemethode === "coach" && (
          <CoachForm selectedMethode={selectedMethode} />
        )}

        {selectedMethode?.typemethode === "saison" && (
          <SaisonForm selectedMethode={selectedMethode} />
        )}

        {selectedMethode?.typemethode === "match" && (
          <MatchForm selectedMethode={selectedMethode} />
        )}
      </div>
    </div>
  );
}
