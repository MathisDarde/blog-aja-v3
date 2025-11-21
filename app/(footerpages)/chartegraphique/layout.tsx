import { isAuthenticated } from "@/actions/user/is-user-connected";
import Footer from "@/components/Footer";
import Header from "@/components/header/Header";
import { User } from "@/contexts/Interfaces";
import { getUserbyId } from "@/controllers/UserController";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Charte graphique | Mémoire d'Auxerrois",
    template: "%s | Mémoire d'Auxerrois",
  },
  description:
    "Mémoire d'Auxerrois retrace l'histoire de l'AJ Auxerre et offre une exprérience complète et diversifiée pour ses utilisateurs. Découvrez des histoires uniques et apprenez en plus sur l'histoire de votre club préféré !",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Charte graphique | Mémoire d'Auxerrois",
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
        className={`antialiased overflow-x-hidden bg-gray-100`}
      >
        <Header user={user || undefined} />
        <>{children}</>
        <Footer />
      </body>
    </html>
  );
}
