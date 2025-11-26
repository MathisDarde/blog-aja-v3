import Footer from "@/components/Footer";
import Header from "@/components/header/Header";
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
  return (
    <div className="antialiased overflow-x-hidden bg-gray-100 min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">{children}</main>

      <Footer />
    </div>
  );
}
