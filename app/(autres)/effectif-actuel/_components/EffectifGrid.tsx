import Image from "next/image";
import { EffectifMember } from "@/lib/scraped-data";

const PLAYER_SECTIONS = [
  { poste: "Gardien", title: "Gardiens" },
  { poste: "Défenseur", title: "Défenseurs" },
  { poste: "Milieu de terrain", title: "Milieux" },
  { poste: "Attaquant", title: "Attaquants" },
];

const DEFAULT_PICTURE = "/_assets/img/pdpdebase.png";

const byNumber = (a: EffectifMember, b: EffectifMember) =>
  Number(a.numéro ?? 999) - Number(b.numéro ?? 999);

export default function EffectifGrid({ players }: { players: EffectifMember[] }) {
  const sections = PLAYER_SECTIONS.map(({ poste, title }) => ({
    title,
    members: players.filter((p) => p.poste === poste).sort(byNumber),
  })).filter((section) => section.members.length > 0);

  // Tout ce qui n'est pas un poste de joueur, dans l'ordre du site du club (entraîneur principal d'abord)
  const staff = players.filter((p) => !PLAYER_SECTIONS.some((s) => s.poste === p.poste));

  return (
    <div className="max-w-[1400px] mx-auto text-left">
      {sections.map((section) => (
        <section key={section.title} className="mb-8 sm:mb-12">
          <SectionTitle title={section.title} count={section.members.length} />
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {section.members.map((player) => (
              <PlayerCard key={player.nom} player={player} />
            ))}
          </div>
        </section>
      ))}

      {staff.length > 0 && (
        <section className="mb-12">
          <SectionTitle title="Staff" count={staff.length} />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4">
            {staff.map((member) => (
              <StaffCard key={member.nom} member={member} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function SectionTitle({ title, count }: { title: string; count: number }) {
  return (
    <h2 className="font-Bai_Jamjuree text-xl sm:text-3xl font-bold uppercase mb-4 sm:mb-5 flex items-center gap-3">
      <span className="w-1.5 h-7 bg-aja-blue rounded-full" />
      {title} <span className="text-gray-400 text-xl">({count})</span>
    </h2>
  );
}

function PlayerCard({ player }: { player: EffectifMember }) {
  const { nom, poste, numéro, image_url, age, taille, poids, pied, ville, date_naissance } = player;
  const [firstName, ...lastNames] = nom.split(" ");
  const facts = [
    age ? `${age} ans` : null,
    taille,
    poids,
    pied ? `Pied ${pied.toLowerCase()}` : null,
  ].filter(Boolean);

  return (
    <article className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow">
      <div className="relative h-52 sm:h-80 bg-gradient-to-br from-aja-blue via-[#2f6aa8] to-[#1d4f86] overflow-hidden">
        <div className="absolute inset-0 bg-[url('/_assets/img/motif-aja.png')] bg-cover opacity-30" />
        {numéro && (
          <span className="absolute -top-2 sm:-top-4 right-2 sm:right-3 font-Bai_Jamjuree font-bold text-[6rem] sm:text-[10rem] leading-none text-white/15 select-none">
            {numéro}
          </span>
        )}
        <Image
          src={image_url || DEFAULT_PICTURE}
          alt={nom}
          width={512}
          height={947}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[95%] w-auto object-contain object-bottom transition-transform duration-300 group-hover:scale-105 origin-bottom"
        />
        {numéro && (
          <span className="absolute top-3 left-3 sm:top-4 sm:left-4 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-white text-aja-blue font-Bai_Jamjuree font-bold text-sm sm:text-lg flex items-center justify-center shadow">
            {numéro}
          </span>
        )}
      </div>

      <div className="p-3 sm:p-4 font-Montserrat">
        <p className="text-[10px] sm:text-xs uppercase tracking-wider text-orange-third font-semibold">{poste}</p>
        <h3 className="font-Bai_Jamjuree leading-tight truncate" title={nom}>
          <span className="block text-sm sm:text-base text-gray-600">{firstName}</span>
          <span className="block text-lg sm:text-2xl font-bold uppercase">{lastNames.join(" ") || firstName}</span>
        </h3>
        {facts.length > 0 && (
          <ul className="mt-2 sm:mt-3 flex flex-wrap gap-1 sm:gap-1.5 text-[11px] sm:text-xs">
            {facts.map((fact) => (
              <li key={fact} className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md bg-gray-100 text-gray-700">
                {fact}
              </li>
            ))}
          </ul>
        )}
        {(date_naissance || ville) && (
          <p className="mt-2 text-[11px] sm:text-xs text-gray-500">
            Né{date_naissance ? ` le ${date_naissance}` : ""}
            {ville ? ` à ${ville}` : ""}
          </p>
        )}
      </div>
    </article>
  );
}

function StaffCard({ member }: { member: EffectifMember }) {
  return (
    <article className="bg-white rounded-xl overflow-hidden shadow-sm text-center">
      <div className="relative h-32 sm:h-40 bg-gradient-to-b from-gray-100 to-gray-200 overflow-hidden">
        <Image
          src={member.image_url || DEFAULT_PICTURE}
          alt={member.nom}
          width={379}
          height={650}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[95%] w-auto object-contain object-bottom"
        />
      </div>
      <div className="p-3 font-Montserrat">
        <p className="font-semibold text-sm leading-tight">{member.nom}</p>
        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{member.poste}</p>
      </div>
    </article>
  );
}
