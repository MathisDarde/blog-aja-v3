import { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Inscription",
  description: "Créez votre compte Mémoire d'Auxerrois pour commenter et sauvegarder vos articles préférés.",
  noIndex: true,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
