import { Montserrat, Bai_Jamjuree } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Header from "@/components/Header";
import { AppProvider } from "@/contexts/GlobalContext";
import { isAuthenticated } from "@/actions/user/is-user-connected";
import type { Metadata } from "next";
import Footer from "@/components/Footer";
import { getUserbyId } from "@/controllers/UserController";
import { User } from "@/contexts/Interfaces";

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
    default: "Mémoire d'Auxerrois",
    template: "%s | Mémoire d'Auxerrois",
  },
  description:
    "Mémoire d'Auxerrois retrace l'histoire de l'AJ Auxerre et offre une exprérience complète et diversifiée pour ses utilisateurs. Découvrez des histoires uniques et apprenez en plus sur l'histoire de votre club préféré !",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Mémoire d'Auxerrois",
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
  const auth = await isAuthenticated();

  let user: User | null = null;

  if (auth?.user?.id) {
    const users = await getUserbyId(auth.user.id);
    user = users?.[0] ?? null;
  }
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${montserrat.variable} ${baijamjuree.variable} antialiased overflow-x-hidden`}
      >
        <Header user={user || undefined} />
        <AppProvider>{children}</AppProvider>
        <Toaster />
        <Footer />
      </body>
    </html>
  );
}
