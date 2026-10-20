import displayBrouillons from "@/actions/article/display-brouillons";
import ArticleForm from "@/app/admin/publish-article/_components/ArticleForm";
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
    <div className="text-center bg-gray-100 min-h-screen w-screen box-border p-6 sm:p-10 flex flex-col items-center">
      <UpdateBrouillonGuard />

      <h1 className="text-center font-Bai_Jamjuree text-3xl sm:text-4xl font-bold uppercase mb-6 sm:mb-10">
        Modifier un brouillon
      </h1>

      <ArticleForm
        user={user}
        draft={{
          id_draft: brouillon.id_draft,
          scheduledAt: brouillon.scheduledAt,
          data: {
            tags: brouillon.tags ?? [],
            slug: brouillon.slug ?? undefined,
            imageUrl: brouillon.imageUrl ?? undefined,
            title: brouillon.title ?? undefined,
            teaser: brouillon.teaser ?? undefined,
            content: brouillon.content ?? undefined,
            author: brouillon.author ?? undefined,
          },
        }}
      />
    </div>
  );
}
