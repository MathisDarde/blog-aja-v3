import { authClient } from "@/lib/auth-client";

const handleLoginWithGoogle = async () => {
  await authClient.signIn.social({
    provider: "google",
    callbackURL: "/",
  });
};

export default handleLoginWithGoogle;
