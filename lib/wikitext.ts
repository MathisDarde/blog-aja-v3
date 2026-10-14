// Lecture minimale du wikitext des infobox Wikipédia (modèles {{…}} et liens [[…]]).

export interface InfoboxCareerRow {
  start: number | null;
  end: number | null;
  // Cible du lien vers l'article du club, absente si le club n'a pas d'article
  clubTitle: string | null;
  clubName: string;
  // « adjoint », « formation » (colonne statistiques), « prêt », « réserve » (modèles)
  note: string | null;
  // Cellule brute, quand le club n'est pas un lien mais un modèle à développer
  clubCell: string;
  // Colonne statistiques en texte (« 169 (90) », « 64v 52n 54d »)
  stats: string;
}

/** Découpe sur les « | » de premier niveau, en ignorant ceux des modèles et des liens. */
export function splitTopLevel(text: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let current = "";
  for (let i = 0; i < text.length; i++) {
    const pair = text.slice(i, i + 2);
    if (pair === "{{" || pair === "[[") {
      depth++;
      current += pair;
      i++;
    } else if ((pair === "}}" || pair === "]]") && depth > 0) {
      depth--;
      current += pair;
      i++;
    } else if (text[i] === "|" && depth === 0) {
      parts.push(current);
      current = "";
    } else {
      current += text[i];
    }
  }
  parts.push(current);
  return parts;
}

/** Contenu du premier modèle {{nom…}} trouvé (sans les accolades), ou null. */
export function findTemplate(text: string, names: string[]): string | null {
  const pattern = new RegExp(`\\{\\{\\s*(?:${names.join("|")})\\s*[|}]`, "i");
  const match = pattern.exec(text);
  if (!match) return null;

  let depth = 0;
  for (let i = match.index; i < text.length - 1; i++) {
    const pair = text.slice(i, i + 2);
    if (pair === "{{") {
      depth++;
      i++;
    } else if (pair === "}}") {
      depth--;
      i++;
      if (depth === 0) return text.slice(match.index + 2, i - 1);
    }
  }
  return null;
}

/** Valeur d'un paramètre nommé d'un modèle (ex. « carrière entraîneur » de l'infobox). */
export function templateParam(template: string, names: string[]): string | null {
  const wanted = names.map((n) => n.toLowerCase());
  for (const arg of splitTopLevel(template).slice(1)) {
    const equals = arg.indexOf("=");
    if (equals === -1) continue;
    if (wanted.includes(arg.slice(0, equals).trim().toLowerCase())) {
      return arg.slice(equals + 1).trim();
    }
  }
  return null;
}

// Liens vers des fichiers (drapeaux…) ou des catégories : ce ne sont pas des articles
const FILE_LINK = /\[\[\s*(?:Fichier|File|Image|Catégorie|Category)\s*:[^\]]*\]\]/gi;

/** Premier lien interne [[cible|texte]] d'une cellule. */
export function firstLink(text: string): { title: string; label: string } | null {
  const match = /\[\[([^\]|#]+)(?:#[^\]|]*)?(?:\|([^\]]+))?\]\]/.exec(
    // Sans les fichiers ni les liens vers d'autres langues ([[:en:…]])
    text.replace(FILE_LINK, "").replace(/\[\[\s*:[^\]]*\]\]/g, ""),
  );
  if (!match) return null;
  const title = match[1].trim();
  return { title, label: (match[2] ?? title).trim() };
}

// {{lien|Titre}}, {{Lien|fr=Titre|lang=en|texte=Texte affiché}}
function lienText(args: string): string {
  const parts = args.split("|").map((part) => part.trim());
  const named = (name: string) =>
    parts.find((part) => part.startsWith(`${name}=`))?.slice(name.length + 1).trim();
  return named("texte") ?? named("fr") ?? parts.find((part) => !part.includes("=")) ?? "";
}

/** Texte lisible d'une cellule : liens réduits à leur texte, modèles et balises retirés. */
export function plainText(text: string): string {
  let result = text
    .replace(FILE_LINK, "")
    .replace(/<ref[^>]*\/>/gi, "")
    .replace(/<ref[\s\S]*?<\/ref>/gi, "")
    .replace(/\[\[(?:[^\]|]+\|)?([^\]]+)\]\]/g, "$1");

  // {{nobr|…}}, {{small|…}} : on garde le contenu ; {{lien|…}} (article pas encore
  // traduit) : on garde son texte ; les autres modèles disparaissent
  let previous;
  do {
    previous = result;
    result = result
      .replace(/\{\{\s*(?:nobr|nowrap|small|petit)\s*\|([^{}]*)\}\}/gi, "$1")
      // {{1er}}, {{3e}} → 1er, 3e
      .replace(/\{\{\s*(\d+)\s*(er|re|e|ème)\s*\}\}/gi, "$1$2")
      .replace(/\{\{\s*lien\s*\|([^{}]*)\}\}/gi, (_, args: string) => lienText(args))
      .replace(/\{\{[^{}]*\}\}/g, "");
  } while (result !== previous);

  return result
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/'{2,}/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** « 1961-2005 », « 2007 », « depuis 2022 », « 2022- » → années de début et de fin. */
export function parseYears(text: string): { start: number | null; end: number | null } {
  const plain = plainText(text);
  const years = (plain.match(/\b(18|19|20)\d{2}\b/g) ?? []).map(Number);
  if (years.length === 0) return { start: null, end: null };

  const ongoing = /depuis|[-–]\s*$/i.test(plain);
  if (years.length === 1) return { start: years[0], end: ongoing ? null : years[0] };
  return { start: years[0], end: years[years.length - 1] };
}

/**
 * Lignes d'un parcours d'infobox écrit avec {{deux colonnes}} / {{trois colonnes}} :
 * années | club | (statistiques ou mention).
 */
export function parseCareerColumns(value: string): InfoboxCareerRow[] {
  const template = findTemplate(value, ["trois colonnes", "deux colonnes"]);
  if (!template) return [];

  const [name, ...cells] = splitTopLevel(template);
  const width = /trois/i.test(name) ? 3 : 2;

  const rows: InfoboxCareerRow[] = [];
  for (let i = 0; i + 1 < cells.length; i += width) {
    const [yearsCell, clubCell, statsCell = ""] = cells.slice(i, i + width);
    if (!plainText(yearsCell) && !plainText(clubCell)) continue;
    // Ligne de bilan en bas du parcours : voir parseCareerTotal
    if (/^total$/i.test(plainText(clubCell))) continue;

    const link = firstLink(clubCell);
    const stats = plainText(statsCell).replace(/^\((.*)\)$/, "$1");
    const notes = [
      // Du texte sans chiffres (« adjoint », « formation ») : une mention, pas des stats
      stats && !/\d/.test(stats) ? stats : null,
      /\{\{\s*équipe réserve\s*\}\}/i.test(clubCell) ? "réserve" : null,
      /\{\{\s*prêt\s*\}\}/i.test(clubCell) ? "prêt" : null,
    ].filter(Boolean);
    const note = notes.length > 0 ? notes.join(", ") : null;

    rows.push({
      ...parseYears(yearsCell),
      clubTitle: link?.title ?? null,
      // Le texte autour du lien compte (« RC Strasbourg -19 ans ») mais pas le drapeau
      clubName: plainText(clubCell) || link?.label || "",
      note,
      clubCell,
      stats,
    });
  }
  return rows;
}

/** Statistiques de la ligne « Total » d'un parcours, s'il y en a une. */
export function parseCareerTotal(value: string): string | null {
  const template = findTemplate(value, ["trois colonnes"]);
  if (!template) return null;
  const cells = splitTopLevel(template).slice(1);
  for (let i = 0; i + 2 < cells.length; i += 3) {
    if (/^total$/i.test(plainText(cells[i + 1]))) return plainText(cells[i + 2]);
  }
  return null;
}

/** « 169 (90) » → 169 matchs, 90 buts. */
export function parseAppearances(stats: string): { matchs: number; buts: number } | null {
  const match = /(\d+)\s*\((\d+)\)/.exec(stats);
  return match ? { matchs: Number(match[1]), buts: Number(match[2]) } : null;
}

/** « 64v 52n 54d » → victoires, nuls, défaites. */
export function parseRecord(stats: string): { v: number; n: number; d: number } | null {
  const match = /(\d+)\s*v\b\D*(\d+)\s*n\b\D*(\d+)\s*d\b/i.exec(stats);
  return match ? { v: Number(match[1]), n: Number(match[2]), d: Number(match[3]) } : null;
}

/**
 * Lignes d'une section « Palmarès » (« * Champion de France de Ligue 2 en 2015 avec
 * l'ES Troyes AC ») → [intitulé, nombre de titres]. Si la section a une sous-partie
 * correspondant à `part` (ex. « Entraîneur »), seule celle-ci est lue.
 */
export function parsePalmares(section: string, part?: RegExp): string[][] {
  let text = section;
  if (part) {
    const headings = [...section.matchAll(/^(={3,})\s*(.*?)\s*\1\s*$/gm)];
    const index = headings.findIndex((h) => part.test(h[2]));
    if (index !== -1) {
      const start = headings[index].index! + headings[index][0].length;
      text = section.slice(start, headings[index + 1]?.index ?? section.length);
    }
  }

  const lines = text.split("\n").map((line) => line.trim());
  const counts = new Map<string, number>();
  let heading = "";

  lines.forEach((raw, i) => {
    const headingMatch = /^={3,}\s*(.*?)\s*=+$/.exec(raw);
    if (headingMatch) {
      heading = plainText(headingMatch[1]);
      return;
    }
    // « * AJ Auxerre » suivi de « ** Champion de France en 1996 » : le club n'est qu'un
    // regroupement, les titres sont les sous-puces
    const isItem =
      /^\*\*/.test(raw) || (/^\*[^*]/.test(raw) && !/^\*\*/.test(lines[i + 1] ?? ""));
    if (!isItem) return;

    // Première phrase seulement, sans les places d'honneur (« , finaliste en 1979 »)
    const line = plainText(raw.replace(/^\*+\s*/, ""))
      .split(/\.\s/)[0]
      .split(/,\s*(?:finaliste|vice-champion|demi-finaliste)/i)[0];
    if (!line) return;

    let title: string;
    let years: Set<string>;
    // « 2020 : Champion (promu) avec le FC Lorient » sous l'intertitre « Ligue 2 »
    const dated = /^((?:(?:19|20)\d{2}[\s,et]*)+):\s*(.+)$/.exec(line);
    if (dated) {
      const result = dated[2].split(/\s+avec\s+/)[0].replace(/\s*\([^)]*\)/g, "").trim();
      title = heading ? `${result} de ${heading}` : result;
      years = new Set(dated[1].match(/\b(19|20)\d{2}\b/g) ?? []);
    } else {
      // L'intitulé s'arrête aux années (« en 2015 ») ou au club (« avec … »)
      title = line
        .split(/\s+(?:en|avec|à)\s+(?=\d{4}|[A-ZÉ]|l'|le |la |les )/)[0]
        .replace(/[\s:,]+$/, "");
      years = new Set(line.match(/\b(19|20)\d{2}\b/g) ?? []);
    }

    // Même distinction sur plusieurs lignes (1re et 2e division) : on additionne
    counts.set(title, (counts.get(title) ?? 0) + Math.max(years.size, 1));
  });

  return [...counts].map(([title, count]) => [title, String(count)]);
}
