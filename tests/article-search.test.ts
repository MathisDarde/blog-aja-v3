// Recherche des articles : texte brut, accents, tous les mots, pertinence.
import { describe, expect, it } from "vitest";
import { htmlToText, searchArticles, toSearchableArticle } from "@/lib/article-search";
import type { Article } from "@/contexts/Interfaces";

const article = (id: string, title: string, content: string, tags: string[] = []): Article => ({
  id_article: id,
  slug: id,
  title,
  teaser: "",
  imageUrl: "",
  content,
  author: "Mathis",
  userId: "u",
  state: "published",
  createdAt: new Date(),
  updatedAt: new Date(),
  tags,
});

const filters = [{ id: 1, tag: "Djibril Cissé", value: "djibrilcisse", img: "", type: "player" }];
const searchable = [
  article(
    "cisse",
    "Djibril Cissé, la promesse de Guy Roux",
    '<p><span style="color: rgb(0,0,0)">L’équipe de 2001</span></p>',
    ["djibrilcisse"],
  ),
  article("montee", "Saison 2021-2022, une montée historique", "<p>Gauthier Hein et Guy Roux en tribune</p>"),
].map((a) => toSearchableArticle(a, filters));

const found = (query: string) => searchArticles(searchable, query).map((a) => a.id_article);

describe("htmlToText", () => {
  it("retire les balises et décode les entités", () => {
    const text = htmlToText("<p>Aujourd&#39;hui &amp; demain&nbsp;: <b>l&rsquo;AJA</b> &#x27;ok&#x27;</p>");
    expect(text.replace(/\s+/g, " ").trim()).toBe("Aujourd'hui & demain : l'AJA 'ok'");
  });
});

describe("searchArticles", () => {
  it("ne trouve pas le HTML (styles, balises)", () => {
    expect(found("span")).toEqual([]);
    expect(found("color")).toEqual([]);
  });

  it("ignore accents, casse et apostrophes", () => {
    expect(found("EQUIPE")).toEqual(["cisse"]);
    expect(found("l'équipe")).toEqual(["cisse"]);
  });

  it("exige tous les mots, pas forcément à la suite", () => {
    expect(found("hein roux")).toEqual(["montee"]);
    expect(found("hein cissé")).toEqual([]);
  });

  it("cherche aussi dans le libellé des tags", () => {
    expect(found("Djibril Cisse")).toEqual(["cisse"]);
  });

  it("classe le titre avant le texte", () => {
    // « Guy Roux » est dans le titre de l'un et seulement dans le texte de l'autre
    expect(found("guy roux")).toEqual(["cisse", "montee"]);
  });
});
