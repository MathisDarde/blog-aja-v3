"use client";

import React, { useState } from "react";
import { Article, Comment, Methodes, User } from "@/contexts/Interfaces";
import TabContentContainer from "./TabContentContainer";

export default function Dashboard({
  users,
  articles,
  methodes,
  comments,
}: {
  users: User[];
  articles: Article[];
  methodes: Methodes[];
  comments: Comment[];
}) {
  const nbUsers = users.length;
  const nbArticles = articles.length;
  const nbMethodes = methodes.length;
  const nbComments = comments.length;

  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="font-Montserrat flex gap-6 max-w-[1300px] h-full mx-auto flex-col p-10">
      <div className="w-full bg-white h-auto rounded-md grid grid-cols-1 sm:grid-cols-2 md:flex items-center justify-around gap-4 p-4">
        <div>
          <h3 className="font-Bai_Jamjuree font-semibold text-xl uppercase">Utilisateurs inscrits</h3>
          <p className="text-5xl font-Bai_Jamjuree font-bold">{nbUsers}</p>
        </div>
        <div>
        <h3 className="font-Bai_Jamjuree font-semibold text-xl uppercase">Articles publiés</h3>
          <p className="text-5xl font-Bai_Jamjuree font-bold">{nbArticles}</p>
        </div>
        <div>
        <h3 className="font-Bai_Jamjuree font-semibold text-xl uppercase">Méthodes publiées</h3>
          <p className="text-5xl font-Bai_Jamjuree font-bold">{nbMethodes}</p>
        </div>
        <div>
        <h3 className="font-Bai_Jamjuree font-semibold text-xl uppercase">Commentaires publiés</h3>
          <p className="text-5xl font-Bai_Jamjuree font-bold">{nbComments}</p>
        </div>
      </div>

      <div className="w-full mb-10">
        <TabContentContainer
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          users={users}
          articles={articles}
          methodes={methodes}
          comments={comments}
        />
      </div>
    </div>
  );
}
