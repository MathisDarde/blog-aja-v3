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
