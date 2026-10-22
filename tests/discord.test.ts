import { describe, expect, it } from "vitest";
import { discordPayload, DISCORD_COLORS } from "@/lib/discord";

describe("messages Discord", () => {
  it("complète l'adresse, met la couleur par défaut et respecte les limites de Discord", () => {
    const { embeds } = discordPayload({
      title: "x".repeat(300),
      url: "/articles/coupe-uefa-1993",
      fields: [{ name: "Auteur", value: "" }],
    });
    expect(embeds[0].title).toHaveLength(256);
    expect(embeds[0].title.endsWith("…")).toBe(true);
    expect(embeds[0].url).toMatch(/^https?:\/\/.+\/articles\/coupe-uefa-1993$/);
    expect(embeds[0].color).toBe(DISCORD_COLORS.blue);
    expect(embeds[0].fields).toEqual([{ name: "Auteur", value: "—" }]);
  });
});
