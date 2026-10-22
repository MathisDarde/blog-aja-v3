import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleDisplay from "@/app/articles/[slug]/_components/ArticleDisplay";
import { withArticleMethodes } from "@/app/articles/[slug]/article-methodes";
import { withHeadingAnchors } from "@/lib/article-toc";
import { getBrouillonById } from "@/controllers/DraftController";
import { isAuthenticated } from "@/actions/user/is-user-connected";
import { getUserbyId } from "@/controllers/UserController";
import { User } from "@/contexts/Interfaces";

export const metadata: Metadata = {
  title: "Aperçu du brouillon",
  robots: { index: false, follow: false },
};

// Brouillon affiché comme s'il était publié, méthodes actives comprises
export default async function ApercuBrouillonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const auth = await isAuthenticated();

  let user: User | null = null;

  if (auth?.user?.id) {
    const users = await getUserbyId(auth.user.id);
    user = users?.[0] ?? null;
  }

  const brouillon = await getBrouillonById((await params).id);
  if (!brouillon) notFound();

  const prepared = await withArticleMethodes(brouillon.content ?? "");
  if (!prepared) {
    return <p>Erreur lors du chargement des méthodes.</p>;
  }

  const { html, toc } = withHeadingAnchors(prepared.content);

  // Daté du jour de publication prévu, sinon d'aujourd'hui
  const date = brouillon.scheduledAt ?? new Date();

  return (
    <ArticleDisplay
      article={{
        id_article: brouillon.id_draft,
        slug: brouillon.slug ?? "",
        title: brouillon.title ?? "",
        teaser: brouillon.teaser ?? "",
        imageUrl: brouillon.imageUrl ?? "",
        content: html,
        author: brouillon.author ?? "",
        userId: brouillon.userId,
        state: "pending",
        createdAt: date,
        updatedAt: date,
        tags: brouillon.tags ?? [],
      }}
      cited={prepared.cited}
      toc={toc}
      articleComments={[]}
      articleLikes={[]}
      user={user}
      draft={{ id: brouillon.id_draft, scheduledAt: brouillon.scheduledAt }}
    />
  );
}
