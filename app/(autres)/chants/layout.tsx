import { isAuthenticated } from "@/actions/user/is-user-connected";
import Footer from "@/components/Footer";
import Header from "@/components/header/Header";
import { User } from "@/contexts/Interfaces";
import { getUserbyId } from "@/controllers/UserController";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chants",
  description:
    "Découvrez les chants emblématiques de l'AJ Auxerre, portés par les supporters passionnés du club. Plongez dans l'ambiance unique des matchs avec ces hymnes qui résonnent dans le stade.",
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
