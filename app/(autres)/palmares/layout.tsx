import Footer from "@/components/Footer";
import Header from "@/components/header/Header";
import { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Palmarès et records de l'AJ Auxerre",
  description:
    "Le palmarès de l'AJ Auxerre : champion de France 1996, quatre Coupes de France (1994, 1996, 2003, 2005), deux titres de Ligue 2, la Coupe Intertoto 1997 et les records du club.",
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
