import Dashboard from "./_components/Dashboard";
import { getDashboardData } from "@/lib/dashboard-data";

// Données réservées aux admins : lues à chaque visite, jamais pré-rendues
export const dynamic = "force-dynamic";

export default async function PageDashboard() {
  // Toutes les données en une fois, côté serveur et en parallèle (lib/dashboard-data)
  const data = await getDashboardData();

  return (
    <div className="bg-gray-100 w-full box-border">
      <Dashboard data={data} />
    </div>
  );
}
