// Enregistre les wikitextes réels utilisés par les tests (tests/fixtures/, compressés).
//   node tests/record-fixtures.mjs
// À relancer si Wikipédia change la mise en forme d'un article : les tests montrent ce qui a bougé.

import { gzipSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";

const PAGES = {
  "fr-djibril-cisse": ["fr", "Djibril Cissé"],
  "fr-guy-roux": ["fr", "Guy Roux"],
  "fr-saison-2021-2022": ["fr", "Saison 2021-2022 de l'AJ Auxerre"],
  "fr-modele-effectif-2021-2022": ["fr", "Modèle:Effectif de l'AJ Auxerre 2021-2022"],
  "en-season-2021-22": ["en", "2021–22 AJ Auxerre season"],
  // Galeries de logos d'époque
  "fr-zenit": ["fr", "Zénith Saint-Pétersbourg"],
  "fr-marseille": ["fr", "Olympique de Marseille"],
  "fr-toulouse": ["fr", "Toulouse Football Club"],
};

mkdirSync("tests/fixtures", { recursive: true });
for (const [name, [lang, title]] of Object.entries(PAGES)) {
  const url = `https://${lang}.wikipedia.org/w/api.php?action=parse&format=json&prop=wikitext&redirects=1&page=${encodeURIComponent(title)}`;
  const res = await fetch(url, { headers: { "User-Agent": "memoire-auxerrois-tests/1.0" } });
  const text = (await res.json()).parse?.wikitext?.["*"];
  if (!text) throw new Error(`${title} : page introuvable`);
  writeFileSync(`tests/fixtures/${name}.wikitext.gz`, gzipSync(text));
  console.log(`✓ ${name} (${text.length} caractères)`);
}
