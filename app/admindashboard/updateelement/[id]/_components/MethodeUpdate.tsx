"use client";

import React from "react";
import {
  MethodeCoach,
  MethodeJoueur,
  MethodeMatch,
  MethodeSaison,
} from "@/contexts/Interfaces";
import { ChevronLeft } from "lucide-react";
import { ModalAction } from "@/components/ModalAction";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { useParams, useRouter } from "next/navigation";
import JoueurForm from "./JoueurForm";
import CoachForm from "./CoachForm";
import SaisonForm from "./SaisonForm";
import MatchForm from "./MatchForm";

export type Methodes =
  | MethodeJoueur
  | MethodeSaison
  | MethodeMatch
  | MethodeCoach;

export default function MethodeUpdate({ methodes }: { methodes: Methodes[] }) {
  const { modalParams, setModalParams, getMethodeById } = useGlobalContext();
  const router = useRouter();
  const params = useParams();

  const methodeId = params.id as string;

  const methode = getMethodeById(methodes, methodeId);

  const openLeaveChangesMethodModal = () => {
    setModalParams({
      object: "methode",
      type: "leaveChanges",
      onConfirm: async () => {
        setModalParams(null);
        router.push(`/admindashboard`);
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

      <h1
        className="font-bold font-Bai_Jamjuree uppercase text-3xl mb-10 flex items-center justify-center gap-3 cursor-pointer"
        onClick={openLeaveChangesMethodModal}
      >
        <ChevronLeft /> Formulaire de modification de méthode expert
      </h1>

      <div>
        {methode?.typemethode === "joueur" && (
          <JoueurForm selectedMethode={methode} />
        )}
        {methode?.typemethode === "coach" && (
          <CoachForm selectedMethode={methode} />
        )}
        {methode?.typemethode === "saison" && (
          <SaisonForm selectedMethode={methode} />
        )}
        {methode?.typemethode === "match" && (
          <MatchForm selectedMethode={methode} />
        )}
      </div>
    </div>
  );
}
