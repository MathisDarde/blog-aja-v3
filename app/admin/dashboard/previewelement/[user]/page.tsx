import { getCommentsByUser } from "@/controllers/CommentController";
import UserPreview from "./_components/PreviewUser";
import { isAuthenticated } from "@/actions/user/is-user-connected";
import { Comment, User } from "@/contexts/Interfaces";
import { getUserbyId } from "@/controllers/UserController";

export default async function UserPreviewPage() {
  const auth = await isAuthenticated();

  let user: User | null = null;
  let comments: Comment[] = [];

  if (auth?.user?.id) {
    const users = await getUserbyId(auth.user.id);
    user = users?.[0] ?? null;
    comments = await getCommentsByUser(auth.user.id);
  }

  return <UserPreview user={user as unknown as User} comments={comments as unknown as Comment[] } />;
}
