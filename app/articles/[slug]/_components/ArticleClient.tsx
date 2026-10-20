import getAllMethodes from "@/actions/method/get-all-methodes";
import { getTeamLogoResolver, withPeriodClubLogos } from "@/lib/team-logos";
import ArticleDisplay from "./ArticleDisplay";
import { getArticle } from "../get-article";
import { getCommentsbyArticle } from "@/controllers/CommentController";
import { isAuthenticated } from "@/actions/user/is-user-connected";
import { User } from "@/contexts/Interfaces";
import { getUserbyId } from "@/controllers/UserController";
import { getLikesByArticle } from "@/controllers/LikedArticlesController";
import { notFound } from "next/navigation";
import { linkMethodes, methodeAnchors } from "@/lib/methodes";
import { citedMethodes } from "@/lib/methode-pages";
import type { Methodes } from "@/contexts/Interfaces";
import {
  AJA_ENTITY,
  jsonLd,
  ORGANIZATION_ENTITY,
  SITE_URL,
  structuredDataImages,
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

  const article = await getArticle(slug);

  // null aussi pour un article non publié si l'utilisateur n'est pas admin
  if (!article) notFound();
  // Logos des clubs des parcours selon l'époque (lib/team-logos)
  const [rawMethodes, resolver] = await Promise.all([getAllMethodes(), getTeamLogoResolver()]);
  const methodes = (rawMethodes?.map((m) => withPeriodClubLogos(m, resolver)) ?? null) as Methodes[] | null;

  const articleComments = await getCommentsbyArticle(article?.id_article);

  const articleLikes = await getLikesByArticle(article?.id_article);

  if (!methodes) {
    return <p>Erreur lors du chargement des méthodes.</p>;
  }

  // Joueurs, coachs et saisons surlignés automatiquement (lib/methodes), puis mentions
  // changées en liens vers les fiches ; seules les cartes des méthodes citées partent au navigateur
  const linked = linkMethodes(article.content, methodes);
  const cited = citedMethodes(linked, methodes, resolver);

  if (!article) {
    return <p>Chargement de l&apos;article</p>;
  }

  // Données structurées schema.org (résultats enrichis Google, Discover)
  const articleUrl = `${SITE_URL}/articles/${article.slug}`;
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${articleUrl}#article`,
        headline: article.title,
        description: article.teaser,
        image: structuredDataImages(article.imageUrl),
        datePublished: new Date(article.createdAt).toISOString(),
        dateModified: new Date(article.updatedAt ?? article.createdAt).toISOString(),
        author: { "@type": "Person", name: article.author },
        publisher: ORGANIZATION_ENTITY,
        mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
        about: AJA_ENTITY,
        keywords: tagLabels(article.tags).join(", "),
        articleSection: "Histoire de l'AJ Auxerre",
        isAccessibleForFree: true,
        inLanguage: "fr-FR",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Articles", item: `${SITE_URL}/articles` },
          { "@type": "ListItem", position: 3, name: article.title, item: articleUrl },
        ],
      },
    ],
  };

  return (
    <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLd(articleJsonLd) }}
    />
    <ArticleDisplay
      article={{ ...article, content: methodeAnchors(linked, methodes) }}
      cited={cited}
      articleComments={articleComments}
      articleLikes={articleLikes}
      user={user}
    />
    </>
  );
}
