import Footer from "@/components/Footer";
import Header from "@/components/header/Header";
import { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "À propos",
  description:
    "Mémoire d'Auxerrois est un site de passionnés consacré à l'histoire de l'AJ Auxerre : articles, archives, statistiques et quiz pour revivre le passé du club auxerrois.",
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
