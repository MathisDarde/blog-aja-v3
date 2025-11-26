import Footer from "@/components/Footer";
import Header from "@/components/header/Header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Publier un article",
  description:
    "Publiez un nouvel article sur Mémoire d'Auxerrois et partagez vos connaissances sur l'histoire de l'AJ Auxerre avec notre communauté passionnée.",
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
