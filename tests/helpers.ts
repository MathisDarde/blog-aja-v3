import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import path from "node:path";

/** Wikitexte réel enregistré par tests/record-fixtures.mjs. */
export const wikitext = (name: string) =>
  gunzipSync(readFileSync(path.join(__dirname, "fixtures", `${name}.wikitext.gz`))).toString("utf8");
