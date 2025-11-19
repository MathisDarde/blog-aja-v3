import displayBrouillons from "@/actions/article/display-brouillons";
import UpdateBrouillonForm from "../_components/UpdateBrouillonForm";
import UpdateBrouillonGuard from "../_components/UpdateBrouillonGuard";
import { isAuthenticated } from "@/actions/user/is-user-connected";
import { User } from "@/contexts/Interfaces";
import { getUserbyId } from "@/controllers/UserController";

export default async function BrouillonEditPage({
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

  const brouillonId = (await params).id;

  const brouillons = await displayBrouillons();
  const brouillon = brouillons.find(
    (b) => b.id_draft.toString() === brouillonId
  );

  if (!brouillon) {
    return <div className="p-10 text-center">Brouillon introuvable</div>;
  }

  return (
    <div className="p-6 sm:p-10">
      <UpdateBrouillonGuard />

      <UpdateBrouillonForm
        articleData={{
          ...brouillon,
          tags: brouillon.tags ?? [],
          slug: brouillon.slug ?? undefined,
          imageUrl: brouillon.imageUrl ?? undefined,
          title: brouillon.title ?? undefined,
          teaser: brouillon.teaser ?? undefined,
          content: brouillon.content ?? undefined,
          author: brouillon.author ?? undefined,
        }}
        id_article={brouillon.id_draft}
        user={user}
      />
    </div>
  );
}
