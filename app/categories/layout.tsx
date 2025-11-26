import { isAuthenticated } from "@/actions/user/is-user-connected";
import Footer from "@/components/Footer";
import Header from "@/components/header/Header";
import { User } from "@/contexts/Interfaces";
import { getUserbyId } from "@/controllers/UserController";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Catégories",
  description:
   "Explorez les différentes catégories de contenu sur Mémoire d'Auxerrois, couvrant divers aspects de l'histoire et des actualités de l'AJ Auxerre.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <div className="antialiased overflow-x-hidden bg-gray-100 min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {children}
      </main>
      
      <Footer />
    </div>
  );
}
