import { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Mot de passe oublié",
  description: "Réinitialisez le mot de passe de votre compte Mémoire d'Auxerrois.",
  noIndex: true,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
