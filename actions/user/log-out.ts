import { authClient } from "@/lib/auth-client";

export const logOut = async () => {
  await authClient.signOut();
};
