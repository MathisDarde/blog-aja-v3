"use client";

import { Geist, Geist_Mono, Montserrat, Bai_Jamjuree } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Header from "@/components/Header";
import { usePathname } from "next/navigation";
import { AppProvider } from "@/contexts/GlobalContext";
import { GettersProvider } from "@/contexts/DataGettersContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const hideLayout = ["/login", "/register"];

  const shouldHideLayout = hideLayout.includes(pathname);
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} ${baijamjuree.variable} antialiased overflow-x-hidden`}
      >
        {!shouldHideLayout && <Header />}
        <AppProvider>
          <GettersProvider>{children}</GettersProvider>
        </AppProvider>
        <Toaster />
      </body>
    </html>
  );
}
