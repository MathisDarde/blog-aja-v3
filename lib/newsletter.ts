import { db } from "@/db/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Resend } from "resend";
import { NewArticleEmailData, newArticleEmail } from "@/lib/new-article-email";
import { EMAIL_FROM } from "@/lib/email-layout";

const resend = new Resend(process.env.RESEND_API_KEY);
// Limite de Resend par appel à batch.send
const BATCH_SIZE = 100;

// Sans garde d'accès : appelé par l'action admin `sendNewsletter` et par la
// publication programmée (cron, sans session). Ne jamais exposer en "use server".
export async function deliverNewsletter(article: NewArticleEmailData) {
  try {
    const subscribers = await db
      .select({ email: user.email, name: user.name })
      .from(user)
      .where(eq(user.mailArticle, true));

    if (subscribers.length === 0) {
      return { success: false, message: "Aucun abonné trouvé" };
    }

    console.log(
      `🚀 Préparation de l'envoi pour ${subscribers.length} abonnés...`
    );

    // Un mail par abonné, salué par son nom
    const emails = subscribers.map((sub) => ({
      from: EMAIL_FROM,
      to: sub.email,
      ...newArticleEmail(article, sub.name),
    }));

    const data = [];
    for (let i = 0; i < emails.length; i += BATCH_SIZE) {
      data.push(await resend.batch.send(emails.slice(i, i + BATCH_SIZE)));
    }

    console.log("✅ Newsletter envoyée avec succès !", data);
    return { success: true, data };
  } catch (error: unknown) {
    let errorMessage = "Une erreur inconnue est survenue";
    if (error instanceof Error) errorMessage = error.message;

    console.error("❌ Erreur envoi newsletter:", errorMessage);
    return { success: false, error: errorMessage };
  }
}
