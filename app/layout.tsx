import { Montserrat, Bai_Jamjuree } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { AppProvider } from "@/contexts/GlobalContext";
import type { Metadata } from "next";

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

export const metadata: Metadata = {
  title: {
    default: "Accueil | Mémoire d'Auxerrois",
    template: "%s | Mémoire d'Auxerrois",
  },
  description:
    "Mémoire d'Auxerrois retrace l'histoire de l'AJ Auxerre et offre une exprérience complète et diversifiée pour ses utilisateurs. Découvrez des histoires uniques et apprenez en plus sur l'histoire de votre club préféré !",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Accueil | Mémoire d'Auxerrois",
    description:
      "Mémoire d'Auxerrois retrace l'histoire de l'AJ Auxerre et offre une exprérience complète et diversifiée pour ses utilisateurs. Découvrez des histoires uniques et apprenez en plus sur l'histoire de votre club préféré !",
    url: "memoiredauxerrois.vercel.app",
    siteName: "Mémoire d'Auxerrois",
    images: [
      {
        url: "https://upload.wikimedia.org/wikipedia/fr/thumb/f/f6/Logo_AJ_Auxerre_2024.svg/1200px-Logo_AJ_Auxerre_2024.svg.png",
        width: 1200,
        height: 630,
        alt: "Logo AJ Auxerre",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
