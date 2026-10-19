// Surlignage automatique des méthodes joueur, coach et saison dans les articles.
import { describe, expect, it } from "vitest";
import { Methodes } from "@/contexts/Interfaces";
import { linkMethodes, mentionedMethodes } from "@/lib/methodes";

const methodes = [
  { typemethode: "joueur", id_methode: "j1", joueurnom: "Djibril Cissé" },
  { typemethode: "joueur", id_methode: "j2", joueurnom: "Guy Roux" },
  { typemethode: "coach", id_methode: "c1", nomcoach: "Guy Roux" },
  { typemethode: "coach", id_methode: "c2", nomcoach: "Jean-Marc Furlan" },
  { typemethode: "saison", id_methode: "s1", saison: "1995-1996" },
  { typemethode: "match", id_methode: "m1", titrematch: "AJA-Ajax" },
] as unknown as Methodes[];

const span = (type: string, id: string, text: string) =>
  `<span class="methode-expert" data-id="${id}" data-type="${type}">${text}</span>`;

describe("linkMethodes", () => {
  it("surligne toutes les occurrences des noms complets et des saisons", () => {
    const html = "<p>Djibril Cissé brille en 1995-1996, puis djibril cissé part.</p>";
    expect(linkMethodes(html, methodes)).toBe(
      `<p>${span("joueur", "j1", "Djibril Cissé")} brille en ${span("saison", "s1", "1995-1996")}, puis ${span("joueur", "j1", "djibril cissé")} part.</p>`,
    );
  });

  it("respecte les accents et les mots entiers", () => {
    const html = "<p>Djibril Cisse, Djibril Cisséo et Jean-Marc Furlanetto.</p>";
    expect(linkMethodes(html, methodes)).toBe(html);
  });

  it("préfère la méthode joueur à la méthode coach de même nom", () => {
    expect(linkMethodes("<p>Guy Roux</p>", methodes)).toBe(`<p>${span("joueur", "j2", "Guy Roux")}</p>`);
  });

  it("accepte un tiret long ou une barre dans la saison, si la saison existe", () => {
    expect(linkMethodes("<p>1995–1996 et 2001-2002</p>", methodes)).toBe(
      `<p>${span("saison", "s1", "1995–1996")} et 2001-2002</p>`,
    );
  });

  it("laisse tels quels les méthodes déjà insérées, les liens, les titres et les attributs", () => {
    const html = [
      `<p>${span("match", "m1", "Guy Roux")}</p>`,
      '<p><a href="/guy-roux">Guy Roux</a></p>',
      "<h2>Guy Roux</h2>",
      '<img alt="Guy Roux en 1995-1996">',
    ].join("");
    expect(linkMethodes(html, methodes)).toBe(html);
  });

  it("surligne dans la mise en forme et après une balise fermée", () => {
    expect(linkMethodes("<p><strong>Jean-Marc   Furlan</strong></p><p>Guy Roux</p>", methodes)).toBe(
      `<p><strong>${span("coach", "c2", "Jean-Marc   Furlan")}</strong></p><p>${span("joueur", "j2", "Guy Roux")}</p>`,
    );
  });

  it("rend les méthodes surlignées visibles pour mentionedMethodes", () => {
    const keys = mentionedMethodes(linkMethodes("<p>Guy Roux en 1995-1996</p>", methodes));
    expect([...keys]).toEqual(["joueur:j2", "saison:s1"]);
  });
});
