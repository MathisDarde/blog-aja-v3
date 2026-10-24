"use server";

import { Resend } from "resend";
import { z } from "zod";
import { getArticlebyId } from "@/controllers/ArticlesController";
import { requireAdmin } from "@/lib/auth-guard";
import { newArticleEmail } from "@/lib/new-article-email";
import { EMAIL_FROM } from "@/lib/email-layout";

const resend = new Resend(process.env.RESEND_API_KEY);

const TestMailSchema = z.object({
  articleId: z.string().nonempty({ message: "Choisissez un article." }),
  email: z
    .string()
    .email({ message: "Le mail que vous avez entré n'est pas valide." }),
});

/** Envoie le mail de nouvel article à une seule adresse, pour vérifier son rendu. */
export async function sendTestNewArticleMail(articleId: string, email: string) {
  const admin = await requireAdmin();

  const parsed = TestMailSchema.safeParse({ articleId, email });
  if (!parsed.success) {
    return { success: false, message: parsed.error.errors[0].message };
  }

  try {
    const article = await getArticlebyId(articleId);
    if (!article) return { success: false, message: "Article introuvable" };

    const { subject, html, text } = newArticleEmail(article, admin.name);
    const { error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: parsed.data.email,
      subject: `[Test] ${subject}`,
      html,
      text,
    });
    if (error) return { success: false, message: error.message };

    return { success: true, message: `Mail de test envoyé à ${parsed.data.email}` };
  } catch (error) {
    console.error("❌ Erreur envoi mail de test:", error);
    return { success: false, message: "Erreur lors de l'envoi du mail de test" };
  }
}
