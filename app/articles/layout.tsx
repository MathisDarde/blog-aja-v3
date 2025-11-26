import Footer from "@/components/Footer";
import Header from "@/components/header/Header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Articles",
  description:
    "Plongez dans une collection captivante d'articles dédiés à l'histoire de l'AJ Auxerre sur Mémoire d'Auxerrois. Explorez des récits fascinants, des analyses approfondies et des perspectives uniques sur le club bourguignon.",
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
