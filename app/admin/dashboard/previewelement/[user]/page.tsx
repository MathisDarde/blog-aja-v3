import { getCommentsByUser } from "@/controllers/CommentController";
import UserPreview from "./_components/PreviewUser";
import { isAuthenticated } from "@/actions/user/is-user-connected";
import { Comment, User } from "@/contexts/Interfaces";
import { getUserbyId } from "@/controllers/UserController";

export default async function UserPreviewPage() {
  const auth = await isAuthenticated();

  if (!auth)
    return;

  const user = await getUserbyId(auth.user.id);
  const comments = await getCommentsByUser(auth.user.id);

  return <UserPreview user={user as unknown as User} comments={comments as Comment[]} />;
}
