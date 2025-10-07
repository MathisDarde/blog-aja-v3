"use client";

import React, { useState } from "react";
import {
  MethodeCoach,
  MethodeJoueur,
  MethodeMatch,
  MethodeSaison,
} from "@/contexts/Interfaces";
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
  const { getMethodeById } = useGlobalContext();
  const router = useRouter();
  const params = useParams();

  const [leaveChangesPopupOpen, setLeaveChangesPopupOpen] = useState(false);

  const methodeId = params.id as string;

  const methode = getMethodeById(methodes, methodeId);

  return (
    <div className="text-center bg-gray-100 min-h-screen w-screen box-border p-6 sm:p-10">
      <h1
        className="font-bold font-Bai_Jamjuree uppercase text-2xl sm:text-3xl mb-4 sm:mb-10 flex items-center justify-center gap-3 cursor-pointer"
      > Formulaire de modification de méthode expert
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
