"use client";

import React, { useEffect, useState } from "react";
import { Article, Comment, Methodes, User } from "@/contexts/Interfaces";
import TabContentContainer from "./TabContentContainer";
import getAllMethodes from "@/actions/dashboard/get-methodes-infos";
import { getAllUsers } from "@/controllers/UserController";
import { getAllArticles } from "@/controllers/ArticlesController";
import { getComments } from "@/controllers/CommentController";
import Skeleton from "@/components/CustomSkeleton";

export default function Dashboard() {
  const [users, setUsers] = useState<User[] | null>(null);
  const [articles, setArticles] = useState<Article[] | null>(null);
  const [methodes, setMethodes] = useState<Methodes[] | null>(null);
  const [comments, setComments] = useState<Comment[] | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const [usersRes, articlesRes, methodesRes, commentsRes] = await Promise.all([
          getAllUsers(),
          getAllArticles(),
          getAllMethodes(),
          getComments(),
        ]);

        setUsers(usersRes);
        setArticles(articlesRes);
        setMethodes(methodesRes as Methodes[]);
        setComments(commentsRes);
      } catch (error) {
        console.error("Erreur lors du chargement des données du dashboard:", error);
      }
    }

    fetchData();
  }, []);

  const isLoading = !users || !articles || !methodes || !comments;

  return (
    <div className="font-Montserrat flex gap-6 max-w-[1300px] h-full mx-auto flex-col p-10">
      <div className="w-full bg-white h-auto rounded-md grid grid-cols-1 sm:grid-cols-2 md:flex items-center justify-around gap-4 p-4">
<div className="mx-auto flex flex-col items-center">
          <h3 className="font-Bai_Jamjuree font-semibold text-xl uppercase">Utilisateurs inscrits</h3>
          {isLoading ? (
            <Skeleton animated={true} height="50px" width="100px" />
          ) : (
            <p className="text-5xl font-Bai_Jamjuree font-bold">{users?.length ?? 0}</p>
          )}
        </div>
<div className="mx-auto flex flex-col items-center">
          <h3 className="font-Bai_Jamjuree font-semibold text-xl uppercase">Articles publiés</h3>
          {isLoading ? (
            <Skeleton animated={true} height="50px" width="100px" />
          ) : (
            <p className="text-5xl font-Bai_Jamjuree font-bold">{articles?.length ?? 0}</p>
          )}
        </div>
<div className="mx-auto flex flex-col items-center">
          <h3 className="font-Bai_Jamjuree font-semibold text-xl uppercase">Méthodes publiées</h3>
          {isLoading ? (
            <Skeleton animated={true} height="50px" width="100px" />
          ) : (
            <p className="text-5xl font-Bai_Jamjuree font-bold">{methodes?.length ?? 0}</p>
          )}
        </div>
<div className="mx-auto flex flex-col items-center">
          <h3 className="font-Bai_Jamjuree font-semibold text-xl uppercase">Commentaires publiés</h3>
          {isLoading ? (
            <Skeleton animated={true} height="50px" width="100px" />
          ) : (
            <p className="text-5xl font-Bai_Jamjuree font-bold">{comments?.length ?? 0}</p>
          )}
        </div>
      </div>

      <div className="w-full mb-10">
        <TabContentContainer
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          users={users ?? []}
          articles={articles ?? []}
          methodes={methodes ?? []}
          comments={comments ?? []}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
