import { isAuthenticated } from "@/actions/user/is-user-connected";
import Footer from "@/components/Footer";
import Header from "@/components/header/Header";
import { User } from "@/contexts/Interfaces";
import { getUserbyId } from "@/controllers/UserController";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mon compte",
  description:
  "Accédez à votre compte personnel sur Mémoire d'Auxerrois afin de gérer vos informations."
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const auth = await isAuthenticated();

  let user: User | null = null;

  if (auth?.user?.id) {
    const users = await getUserbyId(auth.user.id);
    user = users?.[0] ?? null;
  }
  return (
    <html lang="fr">
      <body
        suppressHydrationWarning
        className={`antialiased overflow-x-hidden bg-gray-100`}
      >
        <Header user={user || undefined} />
        <>{children}</>
        <Footer />
      </body>
    </html>
  );
}
