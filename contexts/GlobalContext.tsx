"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Article, Category, MatchAPI, Methodes, ModalParamsType, SortParams, Team } from "./Interfaces";
import { useParams, useRouter } from "next/navigation";
import { fetchMatches } from "@/utils/matchsapi";
import { authClient } from "@/lib/auth-client";

type SortElementsType = <T>(params: SortParams<T>) => T[];

type OpenContextPopupParams = {
  id: string;
  event: React.MouseEvent;
};

type OpenContextPopupFn = (params: OpenContextPopupParams) => void;

interface GlobalContextType {
  sortElements: SortElementsType;
  openContextPopup: OpenContextPopupFn;
  DashboardPopupId: string | null;
  DashboardPopupPosition: { top: number; left: number } | null;
  DashboardPopupRef: React.RefObject<HTMLDivElement | null>;
  activeMenu: string;
  setActiveMenu: React.Dispatch<string>;
  isUser: boolean;
  setIsUser: React.Dispatch<boolean>;
  isAdmin: boolean;
  setIsAdmin: React.Dispatch<boolean>;
  matches: MatchAPI[];
  getLastMatch: () => Promise<MatchAPI>;
  teams: Team[];
  getReducedClassement: () => Team[];
  user_id: string | null;
  loadSession: () => Promise<void>;
  modalParams: ModalParamsType;
  setModalParams: React.Dispatch<ModalParamsType>;
  classementLoading: boolean;
  setClassementLoading: React.Dispatch<boolean>;
  getRandomArticles: (articles: Article[], amount: number) => Article[];
  getRandomCategories: (categories: Category[], amount: number) => Category[];
  getArticleById: (articles: Article[], id: string) => Article | null;
  getMethodeById: (methodes: Methodes[], id: string) => Methodes | null;
  getArticleKeywords: (id_article: string, articles: Article[], methodes: Methodes[]) => {
    id_methode: string;
    typemethode: string;
    keywordsList: string[];
  }[];

}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [user_id, setuser_id] = useState<string | null>(null);
  const [classementLoading, setClassementLoading] = useState(false);
  const [modalParams, setModalParams] = useState<ModalParamsType>(null);
  const [DashboardPopupId, setDashboardPopupId] = useState<string | null>(null);
  const [DashboardPopupPosition, setDashboardPopupPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const DashboardPopupRef = useRef<HTMLDivElement | null>(null);
  const [activeMenu, setActiveMenu] = useState("users");
  const params = useParams();
  const router = useRouter();
  const [isUser, setIsUser] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const loadSession = async () => {
    const session = await authClient.getSession();
    const id = session?.data?.user.id || null;
    setuser_id(id);
  };

  useEffect(() => {
    loadSession();
  }, []);

  function sortElements<T>({
    elements,
    sortKey,
    sortOrder,
  }: SortParams<T>): T[] {
    return [...elements].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];

      if (aValue instanceof Date && bValue instanceof Date) {
        return sortOrder === "asc"
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime();
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
  }

  function openContextPopup({ id, event }: OpenContextPopupParams) {
    event.stopPropagation();
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    setDashboardPopupPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
    });
    setDashboardPopupId((prev) => (prev === id ? null : id));
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        DashboardPopupRef.current &&
        !DashboardPopupRef.current.contains(event.target as Node)
      ) {
        setDashboardPopupId(null);
        setDashboardPopupPosition(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const cachedUser = localStorage.getItem("userData");
    if (cachedUser) {
      try {
        const parsedUser = JSON.parse(cachedUser);
        setIsUser(true);
        if (parsedUser.admin === true) {
          setIsAdmin(true);
        }
      } catch (e: unknown) {
        console.error("Erreur de parsing des données utilisateur:", e);
        localStorage.removeItem("userData");
      }
    }
  }, []);

  const [matches, setMatches] = useState<MatchAPI[]>([]);

  useEffect(() => {
    fetchMatches(
      "https://raw.githubusercontent.com/openfootball/football.json/master/2024-25/fr.1.json"
    ).then((data) => {
      const filteredMatches = data.matches.filter((match: MatchAPI) => {
        return match.team1 === "AJ Auxerre" || match.team2 === "AJ Auxerre";
      });

      const lastFinishedIndex = [...filteredMatches]
        .reverse()
        .findIndex((match) => match.score?.ft && match.score.ft.length > 0);

      let selectedMatches: MatchAPI[] = [];

      if (lastFinishedIndex !== -1) {
        const actualIndex = filteredMatches.length - 1 - lastFinishedIndex;
        selectedMatches = filteredMatches.slice(actualIndex, actualIndex + 5);
      } else {
        selectedMatches = filteredMatches.slice(0, 5);
      }

      setMatches(selectedMatches);
    });
  }, []);

  async function getLastMatch(): Promise<MatchAPI> {
    const data = await fetchMatches(
      "https://raw.githubusercontent.com/openfootball/football.json/master/2024-25/fr.1.json"
    );
    const filteredMatches = data.matches.filter((match: MatchAPI) => {
      return match.team1 === "AJ Auxerre" || match.team2 === "AJ Auxerre";
    });

    const lastMatch = [...filteredMatches]
      .reverse()
      .find((match) => match.score?.ft && match.score.ft.length > 0);

    if (!lastMatch) {
      throw new Error("No finished match found for AJ Auxerre.");
    }

    return lastMatch;
  }

  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    const fetchTeamStats = async () => {
      try {
        const response = await fetch(
          "https://www.thesportsdb.com/api/v1/json/3/lookuptable.php?l=4334&s=2024-2025"
        );
        const data = await response.json();
        setTeams(data.table);
        setClassementLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        setClassementLoading(false);
      }
    };

    fetchTeamStats();
  }, []);

  function getReducedClassement() {
    const index = teams.findIndex((team) =>
      team.strTeam.toLowerCase().replace(/\./g, "").includes("auxerre")
    );

    if (index === -1) return [];

    const start = Math.max(0, index - 2);
    const end = Math.min(teams.length, index + 3);

    return teams.slice(start, end);
  }

  function getRandomArticles(articles: Article[], amount: number): Article[] {
    if (!Array.isArray(articles)) return [];
    if (amount >= articles.length) return [...articles];
  
    const shuffled = [...articles].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, amount);
  }
  
  function getRandomCategories(categories: Category[], amount: number) : Category[] {
    if (!Array.isArray(categories)) return [];
    if (amount >= categories.length) return [...categories];

    const shuffled = [...categories].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, amount);
  }

  {
    /* get article keywords*/
  }
  function getArticleKeywords(id_article: string, articles: Article[], methodes: Methodes[]) {
    const article = getArticleById(articles, id_article);

    if (!article || !article.content) return [];

    const articleText = article.content.toLowerCase();

    const relatedMethodes = methodes.filter((methode) =>
      methode.keywords.some((kw) => articleText.includes(kw.toLowerCase()))
    );
  
    const keywordsWithMeta = relatedMethodes.flatMap((methode) =>
      methode.keywords.map((kw) => ({
        id_methode: methode.id_methode,
        typemethode: methode.typemethode,
        keywords: kw,
      }))
    );
  
    const uniqueMap = new Map<
      string,
      { id_methode: string; typemethode: string; keywords: string }
    >();
  
    for (const kwObj of keywordsWithMeta) {
      const key = kwObj.keywords.toLowerCase();
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, kwObj);
      }
    }
  
    return Array.from(uniqueMap.values()).map(
      ({ id_methode, typemethode, keywords }) => ({
        id_methode,
        typemethode,
        keywordsList: [keywords],
      })
    );
  }

  function getArticleById(articles: Article[], id: string) {
    const article = articles.find((a) => a.id_article === id);
    return article || null;
  }
  function getMethodeById(methodes: Methodes[], id: string) {
    const methode = methodes.find((a) => a.id_methode === id);
    return methode || null;
  }

  return (
    <GlobalContext.Provider
      value={{
        sortElements,
        openContextPopup,
        DashboardPopupId,
        DashboardPopupPosition,
        DashboardPopupRef,
        activeMenu,
        setActiveMenu,
        isUser,
        setIsUser,
        isAdmin,
        setIsAdmin,
        classementLoading,
        setClassementLoading,
        matches,
        getLastMatch,
        teams,
        getReducedClassement,
        user_id,
        loadSession,
        modalParams,
        setModalParams,
        getRandomArticles,
        getRandomCategories,
        getArticleKeywords,
        getArticleById,
        getMethodeById
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = (): GlobalContextType => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within an AppProvider");
  }
  return context;
};
