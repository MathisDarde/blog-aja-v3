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
    // Ligne de bilan en bas du parcours
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
    });
  }
  return rows;
}
