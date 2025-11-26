import Footer from "@/components/Footer";
import Header from "@/components/header/Header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Classement & Statistiques",
  description:
    "Consultez le classement actuel de l'AJ Auxerre ainsi que des statistiques détaillées sur les performances de l'équipe et des joueurs tout au long de la saison.",
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
