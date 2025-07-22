import getAllMethodes from "@/actions/method/get-all-methodes";
import ArticleDisplay from "./ArticleDisplay";
import { getAllArticles, getArticlebyId } from "@/controllers/ArticlesController";

export default async function ArticleClient({ id_article }: { id_article: string }) {
  if (!id_article) return <p>Aucun article trouvé.</p>;

  const articles = await getAllArticles();

  const article = await getArticlebyId(id_article);
  const methodes = await getAllMethodes();

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
    
  return <ArticleDisplay article={article} articles={articles} methodes={methodes} keywords={keywords} />;
}
