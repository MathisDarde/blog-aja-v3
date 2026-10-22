import { db } from "@/db/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Resend } from "resend";
import { SITE_URL } from "@/lib/seo";

export interface ScheduledPublishFailure {
  id: string;
  slug: string | null;
  title: string | null;
  error: string;
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

// Mail aux admins quand une publication programmée échoue : le brouillon a perdu sa
// programmation et attend d'être corrigé puis reprogrammé. Sans garde d'accès (cron).
export async function alertScheduledPublishFailures(failures: ScheduledPublishFailure[]) {
  if (failures.length === 0 || !process.env.RESEND_API_KEY) return;

  try {
    const admins = await db
      .select({ email: user.email })
      .from(user)
      .where(eq(user.admin, true));
    if (admins.length === 0) return;

    const items = failures.map((f) => ({
      name: f.title || f.slug || "Brouillon sans titre",
      url: `${SITE_URL}/admin/brouillons/${f.id}`,
      error: f.error,
    }));
    const subject =
      failures.length === 1
        ? `Publication programmée échouée : ${items[0].name}`
        : `${failures.length} publications programmées échouées`;
    const intro =
      "Ces brouillons n'ont pas pu être publiés à l'heure prévue. Ils ne sont plus programmés : corrigez-les puis reprogrammez-les.";

    const text = [
      intro,
      "",
      ...items.map((i) => `- ${i.name} : ${i.error}\n  ${i.url}`),
    ].join("\n");
    const html = `<div style="font-family: Arial, sans-serif; color: #111827; font-size: 14px; line-height: 1.5">
  <p>${escapeHtml(intro)}</p>
  <ul>
    ${items
      .map(
        (i) =>
          `<li style="margin-bottom: 8px"><a href="${i.url}" style="color: #3c77b4; font-weight: bold">${escapeHtml(i.name)}</a><br /><span style="color: #6b7280">${escapeHtml(i.error)}</span></li>`
      )
      .join("\n    ")}
  </ul>
</div>`;

    await new Resend(process.env.RESEND_API_KEY).batch.send(
      admins.map((admin) => ({
        from: "Mémoire d'Auxerrois <contact@memoiredauxerrois.fr>",
        to: admin.email,
        subject,
        html,
        text,
      }))
    );
  } catch (error) {
    // Le cron renvoie déjà l'échec (workflow GitHub en erreur) : le mail est un plus
    console.error("Alerte des publications programmées échouées :", error);
  }
}
