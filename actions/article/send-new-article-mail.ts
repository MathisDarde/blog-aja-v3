"use server";

import { db } from "@/db/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Resend } from "resend";
import { requireAdmin } from "@/lib/auth-guard";
import { NewArticleEmailData, newArticleEmail } from "@/lib/new-article-email";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendNewsletter(article: NewArticleEmailData) {
  await requireAdmin();

  try {
    const subscribers = await db
      .select({ email: user.email })
      .from(user)
      .where(eq(user.mailArticle, true));

    if (subscribers.length === 0) {
      return { success: false, message: "Aucun abonné trouvé" };
    }

    console.log(
      `🚀 Préparation de l'envoi pour ${subscribers.length} abonnés...`
    );

    const { subject, html, text } = newArticleEmail(article);

    const emailBatch = subscribers.map((sub) => ({
      from: "Mémoire d'Auxerrois <contact@memoiredauxerrois.fr>",
      to: sub.email,
      subject,
      html,
      text,
    }));

    const data = await resend.batch.send(emailBatch);

    console.log("✅ Newsletter envoyée avec succès !", data);
    return { success: true, data };
  } catch (error: unknown) {
    let errorMessage = "Une erreur inconnue est survenue";
    if (error instanceof Error) errorMessage = error.message;

    console.error("❌ Erreur envoi newsletter:", errorMessage);
    return { success: false, error: errorMessage };
  }
}
