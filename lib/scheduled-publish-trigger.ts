import { Client, Receiver } from "@upstash/qstash";
import { SITE_URL } from "@/lib/seo";

// Le cron de GitHub Actions n'est pas fiable (exécutions retardées de plusieurs
// heures, voire sautées) : à chaque programmation, QStash est chargé d'appeler
// /api/cron/publish-scheduled à la seconde près. Le cron GitHub reste en secours.

const client = process.env.QSTASH_TOKEN ? new Client() : null;

const receiver =
  process.env.QSTASH_CURRENT_SIGNING_KEY && process.env.QSTASH_NEXT_SIGNING_KEY
    ? new Receiver({
        currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY,
        nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY,
      })
    : null;

// Inutile d'annuler l'appel si la date change ensuite : l'endpoint ne publie que
// les brouillons réellement arrivés à échéance, un appel périmé ne fait rien.
export async function triggerPublishAt(date: Date) {
  if (!client) {
    console.warn("QSTASH_TOKEN absent : publication laissée au cron de secours");
    return;
  }
  await client.publishJSON({
    url: `${SITE_URL}/api/cron/publish-scheduled`,
    body: { scheduledAt: date.toISOString() },
    notBefore: Math.ceil(date.getTime() / 1000),
  });
}

export async function isQStashRequest(signature: string | null, body: string) {
  if (!receiver || !signature) return false;
  return receiver
    .verify({ signature, body, clockTolerance: 30 })
    .catch(() => false);
}
