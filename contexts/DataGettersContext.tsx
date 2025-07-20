import displayUniqueArticle from "@/actions/article/get-single-article";
import getArticlesInfos from "@/actions/dashboard/get-articles-infos";
import getCommentsInfos from "@/actions/dashboard/get-comments-infos";
import getAllMethodes from "@/actions/dashboard/get-methodes-infos";
import getUsersInfos from "@/actions/dashboard/get-users-infos";
import { createContext, useContext, useEffect, useState } from "react";
import { Article, Comment, Keyword, Methode, User } from "./Interfaces";
import { useParams } from "next/navigation";

interface GettersContextInterface {
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
  allKeywords: Keyword[];
  setAllKeywords: React.Dispatch<React.SetStateAction<Keyword[]>>;
  articleKeywords: Keyword[];
  setArticleKeywords: React.Dispatch<React.SetStateAction<Keyword[]>>;
  keywordsLoading: boolean;
  getArticleById: (id: string) => Article | null;
  getMethodeById: (id: string) => Methode | null;
}

const GettersContext = createContext<GettersContextInterface | undefined>(
  undefined
);

export const GettersProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const params = useParams();

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
  const [allKeywords, setAllKeywords] = useState<Keyword[]>([]);
  const [articleKeywords, setArticleKeywords] = useState<Keyword[]>([]);
  const [keywordsLoading, setKeywordsLoading] = useState(false);

  {
    /* get unique article */
  }
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

  {
    /* get all articles */
  }
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

  {
    /* get all comments */
  }
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

  {
    /* get all methodes */
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getAllMethodes();
        if (Array.isArray(result)) {
          const parsed = result.map((u) => ({
            id_methode: u.id_methode,
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

  {
    /* get all users */
  }
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

  {
    /* get all keywords */
  }
  useEffect(() => {
    setKeywordsLoading(true);

    getAllMethodes()
      .then((data) => {
        if (data) {
          const typedMethodes = data.map((item) => {
            switch (item.typemethode) {
              case "joueur":
                return item as unknown as Methode;
              case "saison":
                return item as unknown as Methode;
              case "match":
                return item as unknown as Methode;
              case "coach":
                return item as unknown as Methode;
              default:
                throw new Error(
                  `Type de méthode inconnu : ${item.typemethode}`
                );
            }
          });

          setMethodes(typedMethodes);

          const everyKeywords = typedMethodes.flatMap((item) =>
            item.keywords.map((kw) => ({
              id_methode: item.id_methode,
              typemethode: item.typemethode,
              keywordsList: [kw],
            }))
          );

          setAllKeywords(everyKeywords);
        } else {
          setAllKeywords([]);
        }
        setKeywordsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setKeywordsLoading(false);
      });
  }, []);

  {
    /* get article keywords*/
  }
  useEffect(() => {
    if (!article || !article.content) {
      setKeywordsLoading(true);
      setArticleKeywords([]);
      return;
    }

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

    const uniqueKeywords = Array.from(uniqueMap.values()).map(
      ({ id_methode, typemethode, keywords }) => ({
        id_methode,
        typemethode,
        keywordsList: [keywords],
      })
    );

    setArticleKeywords(uniqueKeywords);
  }, [article, methodes]);

  function getArticleById(id: string) {
    const article = articles.find((a) => a.id_article === id);
    return article || null;
  }
  function getMethodeById(id: string) {
    const methode = methodes.find((a) => a.id_methode === id);
    return methode || null;
  }

  return (
    <GettersContext.Provider
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
        allKeywords,
        setAllKeywords,
        articleKeywords,
        setArticleKeywords,
        keywordsLoading,
        getArticleById,
        getMethodeById,
      }}
    >
      {children}
    </GettersContext.Provider>
  );
};

export const useGettersContext = (): GettersContextInterface => {
  const context = useContext(GettersContext);
  if (!context) {
    throw new Error("useGettersContext must be used within an AppProvider");
  }
  return context;
};
