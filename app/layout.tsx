import { Montserrat, Bai_Jamjuree } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Header from "@/components/Header";
import { redirect } from "next/navigation";
import { AppProvider } from "@/contexts/GlobalContext";
import { isAuthenticated } from "@/actions/user/is-user-connected";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const auth = await isAuthenticated();

  if (!auth) {
    return redirect("/login");
  }

  const transformedUser = {
    ...auth.user,
    admin: auth.user.admin === true,
    photodeprofil: auth.user.photodeprofil || null,
  };

  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${montserrat.variable} ${baijamjuree.variable} antialiased overflow-x-hidden`}
      >
        <Header user={transformedUser} />
        <AppProvider>
          {children}
        </AppProvider>
        <Toaster />
      </body>
    </html>
  );
}
