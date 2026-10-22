// Notifications d'activité dans des salons Discord (inscriptions, likes, commentaires), par
// webhook : un salon = une variable d'environnement. Sans variable, rien n'est envoyé.
// Envoi après la réponse (after) : jamais bloquant, et une erreur Discord est ignorée.

import { after } from "next/server";
import { SITE_URL } from "@/lib/seo";

export type DiscordChannel = "signups" | "likes" | "comments";

const WEBHOOKS: Record<DiscordChannel, string | undefined> = {
  signups: process.env.DISCORD_WEBHOOK_SIGNUPS,
  likes: process.env.DISCORD_WEBHOOK_LIKES,
  comments: process.env.DISCORD_WEBHOOK_COMMENTS,
};

// Couleurs de l'app : aja-blue, orange-third, rouge
export const DISCORD_COLORS = { blue: 0x3c77b4, orange: 0xf76200, red: 0xdc2626, green: 0x16a34a };

export interface DiscordEmbed {
  title: string;
  description?: string;
  // Chemin du site (« /articles/… ») ou adresse complète
  url?: string;
  color?: number;
  fields?: { name: string; value: string; inline?: boolean }[];
  thumbnail?: string | null;
}

// Limites de Discord : 256 caractères pour un titre, 1024 pour un champ, 4096 pour la description
const cut = (text: string, max: number) => (text.length > max ? `${text.slice(0, max - 1)}…` : text);

export function discordPayload(embed: DiscordEmbed) {
  return {
    username: "Mémoire d'Auxerrois",
    embeds: [
      {
        title: cut(embed.title, 256),
        ...(embed.description && { description: cut(embed.description, 4096) }),
        ...(embed.url && { url: embed.url.startsWith("/") ? `${SITE_URL}${embed.url}` : embed.url }),
        color: embed.color ?? DISCORD_COLORS.blue,
        ...(embed.fields && {
          fields: embed.fields.map((f) => ({ ...f, name: cut(f.name, 256), value: cut(f.value || "—", 1024) })),
        }),
        ...(embed.thumbnail && { thumbnail: { url: embed.thumbnail } }),
        timestamp: new Date().toISOString(),
      },
    ],
  };
}

/** Message dans un salon. `build` n'est appelé que si le salon est configuré (requêtes évitées). */
export function notifyDiscord(channel: DiscordChannel, build: () => Promise<DiscordEmbed | null> | DiscordEmbed | null) {
  const webhook = WEBHOOKS[channel];
  if (!webhook) return;

  const send = async () => {
    try {
      const embed = await build();
      if (!embed) return;
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(discordPayload(embed)),
      });
      if (!res.ok) console.error(`Discord (${channel}) :`, res.status, await res.text());
    } catch (error) {
      console.error(`Discord (${channel}) :`, error);
    }
  };

  try {
    after(send);
  } catch {
    // Hors d'une requête (scripts) : envoi direct
    void send();
  }
}
