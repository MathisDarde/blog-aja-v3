// Logos d'époque lus dans les galeries d'un article Wikipédia FR de club. Même lecture que
// public/scripts/historical_logos.py des scrapers (clubs de championnat), pour les autres clubs.

/** Première saison couverte par le blog : les logos retirés avant 1970-1971 sont écartés. */
export const MIN_SEASON = 1970;

export interface WikiLogo {
  file: string;
  caption: string;
  // Années de début de saison incluses (1992 = 1992-1993) ; null = sans limite
  de: number | null;
  a: number | null;
}

const YEAR = "(1[89]\\d\\d|20\\d\\d)";
// Section dont toutes les images de galerie sont des logos (« Logos », « Historique du logo »…)
const LOGO_SECTION = /logo|blason|[ée]cusson|embl[èe]me|armoiries/i;
const LOGO_WORD = /logo|blason|[ée]cusson/i;
// Logos d'anniversaire ou spéciaux d'une saison : on garde le logo d'identité du club
const SPECIAL = /anniversaire|centenaire|sp[ée]cial|commémorati/i;

/** Légende lisible : sans paramètres d'image (alt=…), balises, modèles ni références. */
export function cleanCaption(raw: string) {
  let text = raw.replace(/<ref[^>]*>[\s\S]*?<\/ref>|<ref[^/]*\/>/g, "");
  // Modèles ({{Centrer|…}}) et liens ([[…|…]]) d'abord, pour que leurs « | » ne coupent pas la légende
  for (let i = 0; i < 3; i++) {
    text = text.replace(/\{\{[^|{}]*\}\}/g, "").replace(/\{\{[^|{}]*\|([^{}]*)\}\}/g, "$1");
  }
  text = text.replace(/\[\[(?:[^|\]]*\|)?([^\]]*)\]\]/g, "$1");
  const parts = text.split("|").filter((p) => !/^\s*(alt|upright|link|lien|class)\s*=/.test(p));
  text = (parts.at(-1) ?? "").replace(/<[^>]+>/g, "");
  return text.replace(/'{2,}|\s+/g, " ").trim().replace(/^[ .]+|[ .]+$/g, "");
}

/** [de, a] d'après la légende ; une date de changement Y ouvre la saison Y-(Y+1). */
export function parsePeriod(caption: string): [number | null, number | null] | null {
  const c = caption.toLowerCase();
  let m = c.match(new RegExp(`ann[ée]es\\s+${YEAR}`));
  if (m) return [Number(m[1]), Number(m[1]) + 9];
  m = c.match(new RegExp(`${YEAR}\\s*(?:-|–|à|au|et)\\s*${YEAR}`));
  if (m) return [Number(m[1]), Math.max(Number(m[1]), Number(m[2]) - 1)];
  m = c.match(new RegExp(`(?:depuis|à partir de|dès)\\s+${YEAR}`)) ?? c.match(new RegExp(`${YEAR}\\s*[-–](?!\\s*\\d)`));
  if (m) return [Number(m[1]), null]; // « depuis 1997 », « (2026-) »
  m = c.match(new RegExp(`(?:avant|jusqu'en|jusqu’en|jusqu'à)\\s+${YEAR}`));
  if (m) return [null, Number(m[1]) - 1];
  m = c.match(new RegExp(YEAR));
  if (m) return [Number(m[1]), null]; // année seule : bornée plus bas par le logo suivant
  return null;
}

/** [titre de la section, contenu] des galeries d'un wikitexte. */
function galleries(text: string): [string, string][] {
  const found: [string, string][] = [];
  let heading = "";
  for (const m of text.matchAll(/^(={2,5})([^=\n]+)\1[ \t]*$|<gallery[^>]*>([\s\S]*?)<\/gallery>/gm)) {
    if (m[2]) heading = m[2].trim();
    else found.push([heading, m[3]]);
  }
  return found;
}

/** Logos datés des galeries d'un wikitexte, du plus ancien au plus récent. */
export function logosFromWikitext(text: string): WikiLogo[] {
  const found: WikiLogo[] = [];
  for (const [heading, gallery] of galleries(text)) {
    const logoSection = LOGO_SECTION.test(heading);
    for (const line of gallery.split("\n")) {
      // Le préfixe « Fichier: » est facultatif dans une galerie (Zénith Saint-Pétersbourg)
      const m = line.match(
        /^\s*(?:(?:Fichier|File|Image)\s*:\s*)?([^|<>\n]+?\.(?:svg|png|jpe?g|gif|webp))\s*\|(.*)/i,
      );
      if (!m) continue;
      // Hors d'une section consacrée aux logos, seules les images dites « logo » comptent
      if (!logoSection && !LOGO_WORD.test(m[1] + m[2])) continue;
      const caption = cleanCaption(m[2]);
      if (SPECIAL.test(caption + m[1])) continue;
      const period = parsePeriod(caption);
      if (period) found.push({ file: m[1].trim(), caption, de: period[0], a: period[1] });
    }
  }

  // Une année seule (« 1936 ») court jusqu'au logo suivant
  found.sort((x, y) => Number(x.de !== null) - Number(y.de !== null) || (x.de ?? 0) - (y.de ?? 0));
  return found.map((logo, i) => {
    const next = found[i + 1]?.de;
    if (logo.a === null && logo.de !== null && next && !/depuis|à partir|dès/i.test(logo.caption)) {
      return { ...logo, a: Math.max(logo.de, next - 1) };
    }
    return logo;
  });
}

/** Logos encore portés en 1970-1971 ou après. */
export const sinceMinSeason = <T extends { a: number | null }>(logos: T[]) =>
  logos.filter((logo) => logo.a === null || logo.a >= MIN_SEASON);
