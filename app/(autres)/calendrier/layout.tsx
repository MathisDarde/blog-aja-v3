import Footer from "@/components/Footer";
import Header from "@/components/header/Header";
import { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Calendrier des matchs de l'AJ Auxerre",
  description:
    "Calendrier de l'AJ Auxerre : dates, horaires et résultats des matchs de l'AJA, à domicile au stade de l'Abbé-Deschamps comme à l'extérieur.",
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
