"use server"

import getAllMethodes from "@/actions/method/get-all-methodes";
import ArticleDisplay from "./ArticleDisplay";
import { getAllArticles, getArticlebyId } from "@/controllers/ArticlesController";
import { getCommentsbyArticle } from "@/controllers/CommentController";
import { isAuthenticated } from "@/actions/user/is-user-connected";
import { User } from "@/contexts/Interfaces";
import { getUserbyId } from "@/controllers/UserController";
import { getLikesByArticle } from "@/controllers/LikedArticlesController";

export default async function ArticleClient({ id_article }: { id_article: string }) {
  const auth = await isAuthenticated();

  let user: User | null = null;

  if (auth?.user?.id) {
    const users = await getUserbyId(auth.user.id);
    user = users?.[0] ?? null;
  }

  if (!id_article) return <p>Aucun article trouvé.</p>;

  const articles = await getAllArticles();

  const article = await getArticlebyId(id_article);
  const methodes = await getAllMethodes();

  const articleComments = await getCommentsbyArticle(id_article);

  const articleLikes = await getLikesByArticle(id_article);

  if (!methodes) {
    return <p>Erreur lors du chargement des méthodes.</p>;
  }

  const keywords = methodes.flatMap((item) =>
  item.keywords.map((kw) => ({
    id_methode: item.id_methode,
    typemethode: item.typemethode,
    keywordsList: [kw],
  }))
);

  if (!article) {
    return <p>Chargement de l&apos;article</p>
  }
    
  return <ArticleDisplay article={article} articles={articles} methodes={methodes} keywords={keywords} articleComments={articleComments} articleLikes={articleLikes} user={user} />;
}
