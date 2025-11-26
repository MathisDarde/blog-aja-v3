import Footer from "@/components/Footer";
import Header from "@/components/header/Header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Mémoire d'Auxerrois retrace l'histoire de l'AJ Auxerre et offre une exprérience complète et diversifiée pour ses utilisateurs. Découvrez des histoires uniques et apprenez en plus sur l'histoire de votre club préféré !",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="antialiased overflow-x-hidden bg-gray-100 min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">{children}</main>

      <Footer />
    </div>
  );
}
