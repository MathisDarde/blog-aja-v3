import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Article, Comment, Methode, SortParams, User } from "./Interfaces";
import getArticlesInfos from "@/actions/dashboard/get-articles-infos";
import getCommentsInfos from "@/actions/dashboard/get-comments-infos";
import getAllMethodes from "@/actions/dashboard/get-methodes-infos";
import getUsersInfos from "@/actions/dashboard/get-users-infos";
import displayUniqueArticle from "@/actions/article/get-single-article";
import { useParams, useRouter } from "next/navigation";
import deleteArticleSA from "@/actions/article/delete-article";

type SortElementsType = <T>(params: SortParams<T>) => T[];

type OpenContextPopupParams = {
  id: string;
  event: React.MouseEvent;
};

type OpenContextPopupFn = (params: OpenContextPopupParams) => void;

interface GlobalContextType {
  article: Article | null;
  setArticle: React.Dispatch<React.SetStateAction<Article | null>>;
  articles: Article[];
  setArticles: React.Dispatch<React.SetStateAction<Article[]>>;
  comments: Comment[];
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
  methode: Methode | null;
  setMethode: React.Dispatch<React.SetStateAction<Methode | null>>;
  methodes: Methode[];
  setMethodes: React.Dispatch<React.SetStateAction<Methode[]>>;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  articleLoading: boolean;
  setArticleLoading: React.Dispatch<boolean>;
  articlesLoading: boolean;
  setArticlesLoading: React.Dispatch<boolean>;
  userLoading: boolean;
  setUserLoading: React.Dispatch<boolean>;
  usersLoading: boolean;
  setUsersLoading: React.Dispatch<boolean>;
  commentsLoading: boolean;
  setCommentsLoading: React.Dispatch<boolean>;
  methodesLoading: boolean;
  setMethodesLoading: React.Dispatch<boolean>;
  sortElements: SortElementsType;
  openContextPopup: OpenContextPopupFn;
  DashboardPopupId: string | null;
  DashboardPopupPosition: { top: number; left: number } | null;
  DashboardPopupRef: React.RefObject<HTMLDivElement | null>;
  activeMenu: string;
  setActiveMenu: React.Dispatch<string>;
  params: ReturnType<typeof useParams>;
  router: ReturnType<typeof useRouter>;
  isUser: boolean;
  setIsUser: React.Dispatch<boolean>;
  isAdmin: boolean;
  setIsAdmin: React.Dispatch<boolean>;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [article, setArticle] = useState<Article | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [methode, setMethode] = useState<Methode | null>(null);
  const [methodes, setMethodes] = useState<Methode[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [articleLoading, setArticleLoading] = useState(false);
  const [articlesLoading, setArticlesLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [methodesLoading, setMethodesLoading] = useState(false);
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

  useEffect(() => {
    if (!params?.id) return;

    const fetchArticle = async () => {
      try {
        setArticleLoading(true);
        const id_article = params.id as string;
        if (id_article === "") {
          setArticleLoading(false);
          return;
        }

        const fetchedArticles = await displayUniqueArticle(id_article);
        console.log("Fetched article data:", fetchedArticles);

        if (
          fetchedArticles &&
          Array.isArray(fetchedArticles) &&
          fetchedArticles.length > 0
        ) {
          setArticle(fetchedArticles[0]);
        } else {
          setArticle(null);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de l'article:", error);
        setArticle(null);
      } finally {
        setArticleLoading(false);
      }
    };

    fetchArticle();
  }, [params?.id]);

  useEffect(() => {
    const getArticles = async () => {
      try {
        const result = await getArticlesInfos();
        if (Array.isArray(result)) {
          const parsed = result.map((u) => ({
            ...u,
            publishedAt: new Date(u.publishedAt),
            updatedAt: new Date(u.updatedAt),
          }));
          setArticles(parsed);
        } else {
          console.error("Failed to fetch users:", result.message);
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des utilisateurs :",
          error
        );
      } finally {
        setArticlesLoading(false);
      }
    };

    getArticles();
  }, []);

  useEffect(() => {
    const getComments = async () => {
      try {
        const result = await getCommentsInfos();
        if (Array.isArray(result)) {
          const parsed = result.map((u) => ({
            ...u,
            createdAt: new Date(u.createdAt),
            updatedAt: new Date(u.updatedAt),
          }));
          setComments(parsed);
        } else {
          console.error("Failed to fetch users:", result.message);
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des utilisateurs :",
          error
        );
      } finally {
        setCommentsLoading(false);
      }
    };

    getComments();
  }, []);

  useEffect(() => {
    // Déclaration de la fonction fetchData en dehors pour éviter les problèmes de portée
    const fetchData = async () => {
      try {
        const result = await getAllMethodes();
        if (Array.isArray(result)) {
          const parsed = result.map((u) => ({
            id: u.id_methode,
            typemethode: u.typemethode as
              | "joueur"
              | "saison"
              | "match"
              | "coach",
            keywords: Array.isArray(u.keywords) ? u.keywords : [],
            nomcoach: "nomcoach" in u ? u.nomcoach : null,
            joueurnom: "joueurnom" in u ? u.joueurnom : null,
            titrematch: "titrematch" in u ? u.titrematch : null,
            saison: "saison" in u ? u.saison : null,
            created_at: new Date(u.created_at),
            updated_at: new Date(u.updated_at),
          }));
          setMethodes(parsed);
        } else {
          console.error(
            "Failed to fetch methods:",
            result &&
              typeof result === "object" &&
              result !== null &&
              "message" in result
              ? (result as { message: string }).message
              : result
          );
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des méthodes :", error);
      } finally {
        setMethodesLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const result = await getUsersInfos();
        if (Array.isArray(result)) {
          const parsed = result.map((u) => ({
            ...u,
            birthday: new Date(u.birthday),
            createdAt: new Date(u.createdAt),
            updatedAt: new Date(u.updatedAt),
            admin: u.admin === null ? false : u.admin,
          }));
          setUsers(parsed);
        } else {
          console.error("Failed to fetch users:", result.message);
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des utilisateurs :",
          error
        );
      } finally {
        setUsersLoading(false);
      }
    };

    getUsers();
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

  return (
    <GlobalContext.Provider
      value={{
        article,
        setArticle,
        articles,
        setArticles,
        comments,
        setComments,
        methode,
        setMethode,
        methodes,
        setMethodes,
        user,
        setUser,
        users,
        setUsers,
        sortElements,
        openContextPopup,
        DashboardPopupId,
        DashboardPopupPosition,
        DashboardPopupRef,
        activeMenu,
        setActiveMenu,
        params,
        router,
        isUser,
        setIsUser,
        isAdmin,
        setIsAdmin,
        articleLoading,
        setArticleLoading,
        articlesLoading,
        setArticlesLoading,
        commentsLoading,
        setCommentsLoading,
        userLoading,
        setUserLoading,
        usersLoading,
        setUsersLoading,
        methodesLoading,
        setMethodesLoading,
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
