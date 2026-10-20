import { MethodeModalFrame } from "@/app/(methodes)/_components/MethodeModal";

// Cadre commun aux fiches : il reste ouvert pendant le chargement et d'une fiche à l'autre
export default function Layout({ children }: { children: React.ReactNode }) {
  return <MethodeModalFrame type="saison">{children}</MethodeModalFrame>;
}
