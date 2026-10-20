import Footer from "@/components/Footer";
import Header from "@/components/header/Header";
import { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Fiches joueurs, coachs et matchs de l'AJA",
  description:
    "Les méthodes expert de Mémoire d'Auxerrois : fiches des joueurs et des entraîneurs, compositions des grands matchs et des saisons de l'AJ Auxerre.",
});

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
