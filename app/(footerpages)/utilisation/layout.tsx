import { isAuthenticated } from "@/actions/user/is-user-connected";
import Footer from "@/components/Footer";
import Header from "@/components/header/Header";
import { User } from "@/contexts/Interfaces";
import { getUserbyId } from "@/controllers/UserController";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Règles d'utilisation",
  description:
    "Découvrez les règles d'utilisation de Mémoire d'Auxerrois pour une expérience optimale et respectueuse de notre plateforme dédiée à la mémoire de l'histoire de l'AJ Auxerre.",
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
    <html lang="en">
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
