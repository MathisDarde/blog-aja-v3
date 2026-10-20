import { Montserrat, Bai_Jamjuree } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { AppProvider } from "@/contexts/GlobalContext";
import type { Metadata, Viewport } from "next";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "@/lib/seo";

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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,

  title: {
    default: `${SITE_NAME} – L'histoire de l'AJ Auxerre (AJA)`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,

  // Ignorés par Google, encore lus par Bing et quelques moteurs : liste courte et ciblée
  keywords: [
    "AJ Auxerre",
    "AJA",
    "Auxerre",
    "Auxerre foot",
    "foot Auxerre",
    "football Auxerre",
    "histoire de l'AJ Auxerre",
    "histoire AJA",
    "Mémoire d'Auxerrois",
    "Association de la jeunesse auxerroise",
    "Stade de l'Abbé-Deschamps",
    "Guy Roux",
    "AJA 1996",
    "doublé 1996",
    "Ligue 1",
    "Yonne",
    "Bourgogne",
    "légendes de l'AJA",
    "anciens joueurs AJA",
    "chants AJA",
    "palmarès AJ Auxerre",
  ],
  authors: [{ name: "Mathis Dardé" }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "sports",
  formatDetection: { telephone: false, address: false, email: false },

  appleWebApp: {
    capable: true,
    title: SITE_NAME,
    statusBarStyle: "default",
  },

  robots: {
    index: true,
    follow: true,
    // Grandes miniatures dans Google Images / Discover et extraits complets
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    title: `${SITE_NAME} – L'histoire de l'AJ Auxerre`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "fr_FR",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} – L'histoire de l'AJ Auxerre`,
    description: SITE_DESCRIPTION,
  },

  // Résolu par Next sur le chemin de chaque page
  alternates: {
    canonical: "./",
  },

  // Ancrage local (Auxerre, Yonne) lu par certains moteurs et annuaires
  other: {
    "geo.region": "FR-89",
    "geo.placename": "Auxerre",
    "geo.position": "47.7986;3.5673",
    ICBM: "47.7986, 3.5673",
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
