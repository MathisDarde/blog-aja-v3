import displayBrouillons from "@/actions/article/display-brouillons";
import BrouillonComponent from "./_components/BrouillonComponent";

// Données réservées aux admins : jamais pré-rendues au build
export const dynamic = "force-dynamic";

export default async function PageBrouillon() {
  const brouillons = await displayBrouillons();

  const normalizedBrouillons = brouillons.map((b) => ({
    ...b,
    state: b.state ?? "pending",
  }));

  return <BrouillonComponent brouillons={normalizedBrouillons} />;
}
