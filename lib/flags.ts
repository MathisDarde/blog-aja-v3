import flagsList from "@/lib/image-assets/flags-list.json";
import { uploadBufferToCloudinary } from "@/lib/cloudinary";
import { downloadCommonsImage } from "@/lib/wikidata";

const LOCAL_FLAGS_PATH = "/_assets/flags/";

// Pays dont le fichier ne suit pas le nom français complet
const COUNTRY_ALIASES: Record<string, string> = {
  republiquedemocratiqueducongo: "rdc",
  republiqueducongo: "congo",
  macedoinedunord: "macedoine",
  royaumedespaysbas: "paysbas",
};

const localFlagStems = new Map(
  flagsList.map((file) => [file.replace(/^drapeau/, "").replace(/\.[a-z]+$/, ""), file]),
);

// Codes FIFA des effectifs de Wikipédia EN ({{Fs player|nat=POR}}, {{Flag|ENG}})
const FIFA_CODES: Record<string, string> = {
  ALG: "Algérie", ARG: "Argentine", AUS: "Australie", AUT: "Autriche", BEL: "Belgique",
  BFA: "Burkina Faso", BIH: "Bosnie-Herzégovine", BRA: "Brésil", BUL: "Bulgarie",
  CAN: "Canada", CGO: "Congo", CHI: "Chili", CHN: "Chine", CIV: "Côte d'Ivoire",
  CMR: "Cameroun", COD: "RDC", COL: "Colombie", COM: "Comores", CPV: "Cap-Vert",
  CRO: "Croatie", CZE: "Tchéquie", DEN: "Danemark", ECU: "Équateur", EGY: "Égypte",
  ENG: "Angleterre", ESP: "Espagne", FIN: "Finlande", FRA: "France", GAB: "Gabon",
  GER: "Allemagne", GHA: "Ghana", GNB: "Guinée-Bissau", GRE: "Grèce", GUI: "Guinée",
  HAI: "Haïti", HUN: "Hongrie", IRL: "Irlande", ISL: "Islande", ITA: "Italie",
  JPN: "Japon", KOR: "Corée du Sud", MAD: "Madagascar", MAR: "Maroc", MEX: "Mexique",
  MKD: "Macédoine", MLI: "Mali", NED: "Pays-Bas", NGA: "Nigeria", NIR: "Irlande du Nord",
  NOR: "Norvège", PAR: "Paraguay", PER: "Pérou", POL: "Pologne", POR: "Portugal",
  ROU: "Roumanie", RUS: "Russie", SCO: "Écosse", SEN: "Sénégal", SRB: "Serbie",
  SUI: "Suisse", SUR: "Suriname", SVK: "Slovaquie", SVN: "Slovénie", SWE: "Suède",
  TOG: "Togo", TUN: "Tunisie", TUR: "Turquie", UKR: "Ukraine", URU: "Uruguay",
  USA: "États-Unis", WAL: "Pays de Galles",
};

// Noms anglais des effectifs de Wikipédia EN (« Spain », « Ivory Coast »)
const ENGLISH_NAMES: Record<string, string> = {
  algeria: "Algérie", argentina: "Argentine", belgium: "Belgique", brazil: "Brésil",
  cameroon: "Cameroun", "cape verde": "Cap-Vert", chile: "Chili", colombia: "Colombie",
  "dr congo": "RDC", "congo dr": "RDC", "republic of the congo": "Congo", denmark: "Danemark",
  egypt: "Égypte", england: "Angleterre", finland: "Finlande", germany: "Allemagne",
  guinea: "Guinée", "guinea-bissau": "Guinée-Bissau", haiti: "Haïti", hungary: "Hongrie",
  italy: "Italie", "ivory coast": "Côte d'Ivoire", japan: "Japon", morocco: "Maroc",
  netherlands: "Pays-Bas", "north macedonia": "Macédoine", macedonia: "Macédoine",
  norway: "Norvège", poland: "Pologne", russia: "Russie", senegal: "Sénégal",
  serbia: "Serbie", slovenia: "Slovénie", spain: "Espagne", sweden: "Suède",
  tunisia: "Tunisie",
};

/** Nationalité d'un effectif (« France », « Spain », ou code FIFA « POR ») → pays en français. */
export const countryName = (nationalite: string) =>
  FIFA_CODES[nationalite.trim().toUpperCase()] ??
  ENGLISH_NAMES[nationalite.trim().toLowerCase()] ??
  nationalite;

/** « Côte d'Ivoire » → /_assets/flags/drapeaucotedivoire.svg, si le fichier existe. */
export function findLocalFlag(countryName: string): string | null {
  const stem = countryName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z]+/g, "");
  const file = localFlagStems.get(COUNTRY_ALIASES[stem] ?? stem);
  return file ? `${LOCAL_FLAGS_PATH}${file}` : null;
}

/**
 * Drapeau d'un pays : fichier local s'il existe, sinon le drapeau Wikimedia copié
 * une seule fois sur Cloudinary (identifiant Wikidata du pays comme nom de fichier).
 */
export async function resolveFlag(country: {
  id: string;
  label: string;
  flagFile: string | null;
}): Promise<string | null> {
  const local = findLocalFlag(country.label);
  if (local || !country.flagFile) return local;

  const cached = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/flags/${country.id}.png`;
  const head = await fetch(cached, { method: "HEAD" });
  if (head.ok) return cached;

  const image = await downloadCommonsImage(country.flagFile, 256);
  const { secure_url } = await uploadBufferToCloudinary(image, {
    public_id: `flags/${country.id}`,
    resource_type: "image",
  });
  return secure_url;
}
