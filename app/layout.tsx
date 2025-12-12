import { Montserrat, Bai_Jamjuree } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { AppProvider } from "@/contexts/GlobalContext";
import type { Metadata, Viewport } from "next";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  preload: true,
});

const baijamjuree = Bai_Jamjuree({
  variable: "--font-bai-jamjuree",
  subsets: ["latin"],
  weight: ["400", "700"],
  preload: true,
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://memoiredauxerrois.fr";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "Accueil | Mémoire d'Auxerrois",
    template: "%s | Mémoire d'Auxerrois",
  },
  description:
    "Mémoire d'Auxerrois retrace l'histoire de l'AJ Auxerre. Découvrez des histoires uniques, les légendes du club et revivez les grands moments de l'AJA à travers des articles qui remontent le temps.",

  keywords: [
    "AJ Auxerre",
    "AJA",
    "Football",
    "Histoire",
    "Yonne",
    "Ligue 1",
    "Guy Roux",
    "Mémoire",
    "Articles",
    "Article",
    "Auxerrois",
    "Auxerre",
    "Foot",
    "auxerre foot",
    "foot auxerre",
    "memoire auxerre",
    "memoire d'auxerre",
    "memoire d'auxerrois",
    "auxerre ligue 1",
    "aje ligue 1",
    "aja ligue des champions",
    "ligue des champions",
    "ligue 1",
    "ligue 2",
    "auxerre ligue des champions",
    "histoire auxerre",
    "histoires auxerre",
    "histoires aja",
    "blog aja",
    "blog",
    "blog auxerre",
    "blog auxerrois",
    "legende aja",
    "legendes aja",
    "Stade Abbé Deschamps",
    "Abbé Deschamps",
    "Route de Vaux",
    "Djibril Cissé",
    "Basile Boli",
    "Eric Cantona",
    "Jean-Claude Hamel",
    "Coupe de France",
    "Doublé 1996",
    "Double 1996",
    "Champion de France 1996",
    "champion 1996",
    "Centre de formation",
    "La Pyramide",
    "Ultras Auxerre",
    "Actu AJA",
    "Mercato AJA",
    "Transfert Auxerre",
    "Résultat AJA",
    "Saison AJA",
    "Archives AJA",
    "Retro AJA",
    "Passion AJA",
    "Supporters AJA",
    "Team AJA",
    "Bourgogne Foot",
    "Derby Bourguignon",
    "Philippe Mexès",
    "Jean-Alain Boumsong",
    "Olivier Kapo",
    "Lionel Charbonnier",
    "Bruno Martini",
    "Andrzej Szarmach",
    "Corentin Martins",
    "Yann Lachuer",
    "Gérard Bourgoin",
    "Christophe Pélissier",
    "James Zhou",
    "Coupe Gambardella",
    "AJA 1996",
    "auxerre 1996",
    "AJA Europe",
    "Coupe UEFA",
    "Icaunais",
    "Stade Auxerre",
    "Fan AJA",
    "Photos AJA",
    "Vidéos AJA",
    "Match AJA",
    "Billet AJA",
    "Boutique AJA",
    "Maillot AJA",
    "Anciens joueurs AJA",
    "AJA Dortmund",
    "AJA ajax",
  ],

  icons: {
    icon: "/favicon.svg",
    //logo app mobile -> apple: ""
  },

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "Accueil | Mémoire d'Auxerrois",
    description: "L'histoire complète et immersive de l'AJ Auxerre.",
    url: SITE_URL,
    siteName: "Mémoire d'Auxerrois",
    images: [
      {
        url: "/_assets/img/opengraphimage.avif",
        width: 1200,
        height: 630,
        alt: "Image bannière - Mémoire d'Auxerrois",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Mémoire d'Auxerrois",
    description: "Retracez l'histoire de l'AJ Auxerre.",
    images: ["/_assets/img/opengraphimage.avif"],
  },

  alternates: {
    canonical: "./",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        suppressHydrationWarning
        className={`${montserrat.variable} ${baijamjuree.variable} antialiased overflow-x-hidden bg-gray-100`}
      >
        <AppProvider>{children}</AppProvider>
        <Toaster
          position="bottom-right"
          toastOptions={{
            className:
              "font-Montserrat rounded-md shadow-md text-sm sm:text-base border-0",
            style: { borderRadius: "8px" },
          }}
        />
      </body>
    </html>
  );
}
