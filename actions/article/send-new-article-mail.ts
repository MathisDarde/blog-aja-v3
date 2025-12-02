"use server";

import { db } from "@/db/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface ArticleData {
  title: string;
  teaser: string;
  slug: string;
  imageUrl: string;
}

export async function sendNewsletter(article: ArticleData) {
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

    const articleLink = `https://memoiredauxerrois.fr/articles/${article.slug}`;

    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #333;">Nouvel article publié ! 📢</h1>
        
        ${article.imageUrl ? `<img src="${article.imageUrl}" alt="${article.title}" style="width: 100%; border-radius: 8px; margin: 20px 0;" />` : ""}
        
        <h2 style="color: #111;">${article.title}</h2>
        
        <p style="color: #555; font-size: 16px; line-height: 1.6;">
          ${article.teaser}
        </p>
        
        <div style="margin-top: 30px; text-align: center;">
          <a href="${articleLink}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Lire l'article complet
          </a>
        </div>
        
        <hr style="border: 0; border-top: 1px solid #eee; margin: 40px 0;">
        <p style="text-align: center; color: #999; font-size: 12px;">
          Vous recevez cet email car vous êtes abonné à Mémoire d'Auxerrois.
        </p>
      </div>
    `;

    const emailBatch = subscribers.map((sub) => ({
      from: "Mémoire d'Auxerrois <contact@memoiredauxerrois.fr>",
      to: sub.email,
      subject: `Nouveau : ${article.title}`,
      html: emailHtml,
      text: `Nouvel article : ${article.title}\n\n${article.teaser}\n\nLire la suite : ${articleLink}`,
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
