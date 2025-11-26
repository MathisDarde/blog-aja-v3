import { isAuthenticated } from "@/actions/user/is-user-connected";
import Footer from "@/components/Footer";
import Header from "@/components/header/Header";
import { User } from "@/contexts/Interfaces";
import { getUserbyId } from "@/controllers/UserController";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Créer une méthode Expert",
  description:
  "Accédez à la création de méthodes Expert. Les méthodes Expert sont conçues pour les utilisateurs avancés souhaitant approfondir leur expérience sur Mémoire d'Auxerrois, ainsi que leurs connaissances personnelles sur l'histoire de l'AJA.",
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
    <div className="antialiased overflow-x-hidden bg-gray-100 min-h-screen flex flex-col">
      <Header user={user || undefined} />

      <main className="flex-1">
        {children}
      </main>
      
      <Footer />
    </div>
  );
}
