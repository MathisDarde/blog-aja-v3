"use client";

import React, { useEffect, useState } from "react";
import { Article, Comment, Draft, Methodes, User } from "@/contexts/Interfaces";
import TabContentContainer from "./TabContentContainer";
import getAllMethodes from "@/actions/dashboard/get-methodes-infos";
import { getAllUsers } from "@/controllers/UserController";
import { getAllArticles } from "@/controllers/ArticlesController";
import { getComments } from "@/controllers/CommentController";
import displayBrouillons from "@/actions/article/display-brouillons";
import getArticleStats from "@/actions/dashboard/get-article-stats";
import type { ArticleStats } from "@/lib/article-stats";
import Skeleton from "@/components/CustomSkeleton";
import { formatScheduledAt } from "@/lib/schedule-date";

export default function Dashboard() {
  const [users, setUsers] = useState<User[] | null>(null);
  const [articles, setArticles] = useState<Article[] | null>(null);
  const [drafts, setDrafts] = useState<Draft[] | null>(null);
  const [methodes, setMethodes] = useState<Methodes[] | null>(null);
  const [comments, setComments] = useState<Comment[] | null>(null);
  const [articleStats, setArticleStats] = useState<Record<string, ArticleStats> | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const [usersRes, articlesRes, draftsRes, methodesRes, commentsRes] = await Promise.all([
          getAllUsers(),
          getAllArticles(),
          displayBrouillons(),
          getAllMethodes(),
          getComments(),
        ]);

        setUsers(usersRes);
        setArticles(articlesRes);
        setDrafts(draftsRes);
        setMethodes(methodesRes as Methodes[]);
        setComments(commentsRes);
      } catch (error) {
        console.error("Erreur lors du chargement des données du dashboard:", error);
      }
    }

    fetchData();
    // À part : PostHog peut être lent, les tableaux s'affichent sans attendre les vues
    getArticleStats()
      .then(setArticleStats)
      .catch((error) => console.error("Stats des articles :", error));
  }, []);

  const isLoading = !users || !articles || !drafts || !methodes || !comments;
  // L'onglet Articles liste aussi les archivés : la case ne compte que les publiés
  const publishedCount = articles?.filter((a) => a.state === "published").length ?? 0;
  // Brouillons programmés, du plus proche au plus lointain
  const scheduled = (drafts ?? [])
    .flatMap((d) => (d.scheduledAt ? [d.scheduledAt] : []))
    .sort((a, b) => a.getTime() - b.getTime());
  const toModerate = comments?.filter((c) => (c.reportsCount ?? 0) > 0).length ?? 0;

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
            <>
              <p className="text-5xl font-Bai_Jamjuree font-bold">{publishedCount}</p>
              {scheduled.length > 0 && (
                <p className="text-sm font-semibold text-aja-blue text-center">
                  {scheduled.length} programmé{scheduled.length > 1 ? "s" : ""} · prochain{" "}
                  {formatScheduledAt(scheduled[0])}
                </p>
              )}
            </>
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
            <>
              <p className="text-5xl font-Bai_Jamjuree font-bold">{comments?.length ?? 0}</p>
              {toModerate > 0 && (
                <p className="text-sm font-semibold text-red-600">{toModerate} à modérer</p>
              )}
            </>
          )}
        </div>
      </div>

      <div className="w-full mb-10">
        <TabContentContainer
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          users={users ?? []}
          articles={articles ?? []}
          drafts={drafts ?? []}
          methodes={methodes ?? []}
          comments={comments ?? []}
          articleStats={articleStats}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
