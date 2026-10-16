import { getClubLogosAdmin } from "@/controllers/ClubLogosController";
import LogosAdmin from "./_components/LogosAdmin";

// Données réservées aux admins : jamais pré-rendues au build
export const dynamic = "force-dynamic";
// Chaque étape de la recherche des logos dure ~30 s (lib/club-logo-sync)
export const maxDuration = 60;

export default async function LogosAdminPage() {
  const { clubs, enAttente } = await getClubLogosAdmin();
  return <LogosAdmin clubs={clubs} enAttente={enAttente} />;
}
