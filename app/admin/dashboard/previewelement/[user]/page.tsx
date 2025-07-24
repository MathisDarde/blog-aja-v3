import { getCommentsByUser } from "@/controllers/CommentController";
import UserPreview from "./_components/PreviewUser";
import { isAuthenticated } from "@/actions/user/is-user-connected";
import { redirect } from "next/navigation";

export default async function UserPreviewPage() {
  const auth = await isAuthenticated();

  if (!auth) {
    return redirect("/login");
  }

  const transformedUser = {
    ...auth.user,
    admin: auth.user.admin === true,
    photodeprofil: auth.user.photodeprofil || null,
  };

  const comments = await getCommentsByUser(auth.user.id);

  return <UserPreview user={transformedUser} comments={comments} />;
}
