import { isAuthenticated } from "@/actions/user/is-user-connected";
import InfosDisplay from "./_components/InfosDisplay";
import { getUserbyId } from "@/controllers/UserController";
import { User } from "@/contexts/Interfaces";

export default async function PageAccount() {
  const auth = await isAuthenticated();

  if (!auth) {
    return;
  }
  
  const user = await getUserbyId(auth.user.id);

  return (
    <InfosDisplay user={user as unknown as User} />
  );
}
