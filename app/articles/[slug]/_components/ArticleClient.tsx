import getAllMethodes from "@/actions/method/get-all-methodes";
import ArticleDisplay from "./ArticleDisplay";
import {
  getArticles,
  getArticleBySlug,
} from "@/controllers/ArticlesController";
import { getCommentsbyArticle } from "@/controllers/CommentController";
import { isAuthenticated } from "@/actions/user/is-user-connected";
import { User } from "@/contexts/Interfaces";
import { getUserbyId } from "@/controllers/UserController";
import { getLikesByArticle } from "@/controllers/LikedArticlesController";
import { notFound } from "next/navigation";
import {
  jsonLd,
  SITE_NAME,
  SITE_URL,
  socialImageUrl,
  tagLabels,
} from "@/lib/seo";

export default async function ArticleClient({ slug }: { slug: string }) {
  const auth = await isAuthenticated();

  let user: User | null = null;

  if (auth?.user?.id) {
    const users = await getUserbyId(auth.user.id);
    user = users?.[0] ?? null;
  }

  if (!slug) notFound();

  const articles = await getArticles();

  const article = await getArticleBySlug(slug);

  // null aussi pour un article non publié si l'utilisateur n'est pas admin
  if (!article) notFound();
  const methodes = await getAllMethodes();

  const articleComments = await getCommentsbyArticle(article?.id_article);

  const articleLikes = await getLikesByArticle(article?.id_article);

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
    return <p>Chargement de l&apos;article</p>;
  }

  // Données structurées schema.org (résultats enrichis Google)
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.teaser,
    image: [socialImageUrl(article.imageUrl)],
    datePublished: new Date(article.createdAt).toISOString(),
    dateModified: new Date(article.updatedAt ?? article.createdAt).toISOString(),
    author: { "@type": "Person", name: article.author },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/favicon.svg` },
    },
    mainEntityOfPage: `${SITE_URL}/articles/${article.slug}`,
    keywords: tagLabels(article.tags).join(", "),
    inLanguage: "fr-FR",
  };

  return (
    <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLd(articleJsonLd) }}
    />
    <ArticleDisplay
      article={article}
      articles={articles}
      methodes={methodes}
      keywords={keywords}
      articleComments={articleComments}
      articleLikes={articleLikes}
      user={user}
    />
    </>
  );
}
