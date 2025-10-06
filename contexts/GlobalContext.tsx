"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Article, Category, Methodes, SortParams } from "./Interfaces";
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
  user_id: string | null;
  loadSession: () => Promise<void>;
  getRandomArticles: (articles: Article[], amount: number) => Article[];
  getRandomCategories: (categories: Category[], amount: number) => Category[];
  getArticleById: (articles: Article[], id: string) => Article | null;
  getMethodeById: (methodes: Methodes[], id: string) => Methodes | null;
  getArticleKeywords: (
    id_article: string,
    articles: Article[],
    methodes: Methodes[]
  ) => {
    id_methode: string;
    typemethode: string;
    keywordsList: string[];
  }[];
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [user_id, setuser_id] = useState<string | null>(null);
  const [DashboardPopupId, setDashboardPopupId] = useState<string | null>(null);
  const [DashboardPopupPosition, setDashboardPopupPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const DashboardPopupRef = useRef<HTMLDivElement | null>(null);
  const [activeMenu, setActiveMenu] = useState("users");
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
      let aValue: any = a[sortKey];
      let bValue: any = b[sortKey];

      // Cas spécial pour Date
      if (aValue instanceof Date && bValue instanceof Date) {
        return sortOrder === "asc"
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime();
      }

      // Cas spécial pour admin (bool → number)
      if (sortKey === "admin") {
        const aBool = aValue as boolean;
        const bBool = bValue as boolean;
        return sortOrder === "asc"
          ? Number(aBool) - Number(bBool)
          : Number(bBool) - Number(aBool);
      }

      // String
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      // Number (y compris admin transformé en 0/1)
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

  function getRandomArticles(articles: Article[], amount: number): Article[] {
    if (!Array.isArray(articles)) return [];
    if (amount >= articles.length) return [...articles];

    const shuffled = [...articles].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, amount);
  }

  function getRandomCategories(
    categories: Category[],
    amount: number
  ): Category[] {
    if (!Array.isArray(categories)) return [];
    if (amount >= categories.length) return [...categories];

    const shuffled = [...categories].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, amount);
  }

  {
    /* get article keywords*/
  }
  function getArticleKeywords(
    id_article: string,
    articles: Article[],
    methodes: Methodes[]
  ) {
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
        user_id,
        loadSession,
        getRandomArticles,
        getRandomCategories,
        getArticleKeywords,
        getArticleById,
        getMethodeById,
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
