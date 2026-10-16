import { getClubLogosAdmin } from "@/controllers/ClubLogosController";
import LogosAdmin from "./_components/LogosAdmin";

// Données réservées aux admins : jamais pré-rendues au build
export const dynamic = "force-dynamic";

export default async function LogosAdminPage() {
  const { clubs, sansLogo } = await getClubLogosAdmin();
  return <LogosAdmin clubs={clubs} sansLogo={sansLogo} />;
}
