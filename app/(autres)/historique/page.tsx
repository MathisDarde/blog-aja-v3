import Link from "next/link";
import { fetchHistoriqueMatchs, fetchSaisonsIndex, SaisonIndexEntry } from "@/lib/scraped-data";
import Trajectoire from "./_components/Trajectoire";
import Confrontations from "./_components/Confrontations";

const SECTION_TITLE = "font-Bai_Jamjuree text-2xl sm:text-3xl font-bold uppercase mb-4 text-left";

function KeyFigures({ saisons }: { saisons: SaisonIndexEntry[] }) {
  const done = saisons.slice(1); // la saison en cours n'est pas terminée
  const count = (id: string) => saisons.filter((s) => s.competition.id === id).length;
  const champion = (id: string) =>
    done.filter((s) => s.competition.id === id && s.aja?.position === 1).map((s) => `${s.season.slice(0, 5)}${s.season.slice(7)}`); // « 1995-96 »
  const figures = [
    { label: "Saisons en Ligue 1", value: count("FR1") },
    { label: "Saisons en Ligue 2", value: count("FR2") },
    { label: "Champion de Ligue 1", value: champion("FR1").join(", ") || "—" },
    { label: "Champion de Ligue 2", value: champion("FR2").join(", ") || "—" },
  ];
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-10">
      {figures.map((f) => (
        <div key={f.label} className="bg-white rounded-xl p-4 text-left">
          <p className="text-xs sm:text-sm text-gray-500 font-Montserrat">{f.label}</p>
          <p className="font-Bai_Jamjuree text-2xl sm:text-3xl font-bold">{f.value}</p>
        </div>
      ))}
    </div>
  );
}

export default async function HistoriquePage() {
  const [saisons, matchs] = await Promise.all([fetchSaisonsIndex(), fetchHistoriqueMatchs()]);
  const oldest = saisons[saisons.length - 1]?.season;

  return (
    <div className="text-center bg-gray-100 min-h-screen w-screen box-border p-6 sm:p-10">
      <h1 className="font-Bai_Jamjuree text-3xl sm:text-4xl font-bold uppercase">Historique</h1>
      <p className="font-Montserrat text-gray-600 mt-1 mb-8 sm:mb-10">
        Le parcours de l&apos;AJ Auxerre en championnat{oldest ? ` depuis ${oldest}` : ""}
      </p>

      {saisons.length === 0 ? (
        <p className="font-Montserrat text-gray-600">L&apos;historique est momentanément indisponible.</p>
      ) : (
        <div className="max-w-[1300px] mx-auto">
          <KeyFigures saisons={saisons} />

          <section className="mb-12">
            <h2 className={SECTION_TITLE}>Classement saison par saison</h2>
            <div className="bg-white rounded-xl p-4 sm:p-6">
              <Trajectoire saisons={saisons} />
            </div>
          </section>

          <section className="mb-12">
            <h2 className={SECTION_TITLE}>Confrontations</h2>
            <div className="bg-white rounded-xl p-4 sm:p-6">
              <Confrontations matchs={matchs} />
            </div>
          </section>

          <section className="mb-12">
            <h2 className={SECTION_TITLE}>Toutes les saisons</h2>
            <div className="bg-white rounded-xl overflow-x-auto">
              <table className="w-full text-sm font-Montserrat text-left">
                <thead className="bg-gray-50 text-xs text-gray-500">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Saison</th>
                    <th className="px-4 py-3 font-semibold">Championnat</th>
                    <th className="px-4 py-3 font-semibold text-right">Rang</th>
                    <th className="px-4 py-3 font-semibold text-right">Pts</th>
                    <th className="px-4 py-3 font-semibold text-right">V</th>
                    <th className="px-4 py-3 font-semibold text-right">N</th>
                    <th className="px-4 py-3 font-semibold text-right">D</th>
                    <th className="px-4 py-3 font-semibold text-right">Buts</th>
                    <th className="px-4 py-3 font-semibold"></th>
                  </tr>
                </thead>
                <tbody className="tabular-nums">
                  {saisons.map((s, i) => (
                    <tr key={s.seasonId} className="border-t border-gray-100">
                      <td className="px-4 py-2 font-semibold whitespace-nowrap">
                        {s.season}
                        {i === 0 && <span className="ml-2 text-xs font-normal text-gray-500">en cours</span>}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <span
                          className={`inline-block w-2 h-2 rounded-full mr-2 ${
                            s.competition.id === "FR1" ? "bg-aja-blue" : "bg-gray-400"
                          }`}
                        />
                        {s.competition.name}
                      </td>
                      <td className="px-4 py-2 text-right">
                        {s.aja ? `${s.aja.position}e / ${s.equipes}` : "—"}
                        {s.aja?.position === 1 && i > 0 && " 🏆"}
                      </td>
                      <td className="px-4 py-2 text-right">{s.aja?.points ?? "—"}</td>
                      <td className="px-4 py-2 text-right">{s.aja?.gagnes ?? "—"}</td>
                      <td className="px-4 py-2 text-right">{s.aja?.nuls ?? "—"}</td>
                      <td className="px-4 py-2 text-right">{s.aja?.perdus ?? "—"}</td>
                      <td className="px-4 py-2 text-right whitespace-nowrap">
                        {s.aja ? `${s.aja.buts_marques}-${s.aja.buts_encaisses}` : "—"}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-right">
                        <Link href={`/classement-statistiques?saison=${s.seasonId}`} className="text-aja-blue hover:underline">
                          Classement
                        </Link>
                        <span className="text-gray-300 mx-2">|</span>
                        <Link href={`/calendrier?saison=${s.seasonId}`} className="text-aja-blue hover:underline">
                          Matchs
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
