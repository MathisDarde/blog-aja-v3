import { getCommentsByUser } from "@/controllers/CommentController";
import UserPreview from "./_components/PreviewUser";
import { User } from "@/contexts/Interfaces";
import { getUserbyId } from "@/controllers/UserController";

export default async function UserPreviewPage({
  params,
}: {
  params: Promise<{ user: string }>;
}) {
  const userId = (await params).user;
  const user = await getUserbyId(userId);
  const comments = await getCommentsByUser(userId);

  return <UserPreview userData={user as User[]} comments={comments} />;
}
