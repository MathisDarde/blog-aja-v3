import { isAuthenticated } from "@/actions/user/is-user-connected";
import InfosDisplay from "./_components/InfosDisplay";
import { getUserbyId } from "@/controllers/UserController";
import { User } from "@/contexts/Interfaces";

export default async function PageAccount() {
  const auth = await isAuthenticated();

  let user: User | null = null;

  if (auth?.user?.id) {
    const users = await getUserbyId(auth.user.id);
    user = users?.[0] ?? null;
  }

  return (
    <InfosDisplay user={user as unknown as User} />
  );
}
