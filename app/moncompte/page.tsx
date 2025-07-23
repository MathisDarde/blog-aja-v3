import { isAuthenticated } from "@/actions/user/is-user-connected";
import InfosDisplay from "./_components/InfosDisplay";
import { redirect } from "next/navigation";

export default async function PageAccount() {
  const auth = await isAuthenticated();

  if (!auth) {
    return redirect("/login");
  }

  const transformedUser = {
    ...auth.user,
    admin: auth.user.admin === true,
    photodeprofil: auth.user.photodeprofil || null,
  };

  return (
    <InfosDisplay user={transformedUser} />
  );
}
