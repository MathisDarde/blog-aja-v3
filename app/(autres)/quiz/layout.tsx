import Footer from "@/components/Footer";
import Header from "@/components/header/Header";
import { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Quiz sur l'AJ Auxerre",
  description:
    "Testez vos connaissances sur l'AJ Auxerre : joueurs, entraîneurs, grands matchs et dates clés de l'histoire de l'AJA. Êtes-vous un vrai supporter auxerrois ?",
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
