import { isAuthenticated } from "@/actions/user/is-user-connected";
import UpdateContent from "./_components/UpdateContent";
import { User } from "@/contexts/Interfaces";
import { getUserbyId } from "@/controllers/UserController";

export default async function ArticlePage({
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

  const { id } = await params;

  return <UpdateContent id_article={id} user={user} />;
}
