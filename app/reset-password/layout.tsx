import { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Nouveau mot de passe",
  description: "Choisissez un nouveau mot de passe pour votre compte Mémoire d'Auxerrois.",
  noIndex: true,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
