import { db } from "@/db/db";
import { articlesTable } from "@/db/schema";
import { ArticleSchemaType } from "@/types/forms";
import { v4 as uuidv4 } from "uuid";
import { ensureCloudinaryUrl } from "@/lib/store-cloudinary-image";
import { deliverNewsletter } from "@/lib/newsletter";
import { socialImageUrl } from "@/lib/seo";
import { revalidatePath } from "next/cache";
import { after } from "next/server";

// Pages listant les articles publiés : à invalider après chaque modification
export function revalidateArticlePages() {
  revalidatePath("/");
  revalidatePath("/articles");
  revalidatePath("/sitemap.xml");
}

// Cloudinary ne génère le recadrage 1200x630 de la bannière qu'à la première demande :
// sans ça, le premier partage (WhatsApp, Facebook...) peut expirer et rester sans image en cache
export function warmSocialImage(imageUrl: string | null | undefined) {
  if (!imageUrl) return;
  after(() =>
    fetch(socialImageUrl(imageUrl), { method: "GET", cache: "no-store" })
      .then((res) => res.arrayBuffer())
      .catch((err) => console.error("Préchauffage de l'image de partage :", err)),
  );
}

// Sans garde d'accès : l'appelant vérifie les droits (createArticle) ou est le cron
// des publications programmées. Ne jamais exposer en "use server".
export async function insertPublishedArticle(
  data: ArticleSchemaType,
  userId: string,
) {
  const imageUrl = ensureCloudinaryUrl(data.imageUrl);

  const { slug, title, teaser, content, author, tags } = data;
  const parsedTags = typeof tags === "string" ? JSON.parse(tags) : tags;

  const result = await db.insert(articlesTable).values({
    id_article: uuidv4(),
    slug,
    imageUrl,
    title,
    teaser,
    content,
    author,
    tags: parsedTags,
    state: "published",
    userId,
  });

  revalidateArticlePages();
  warmSocialImage(imageUrl);

  if (process.env.NODE_ENV === "production") {
    console.log("📨 Déclenchement de la newsletter en arrière-plan...");
    after(() => deliverNewsletter({ title, teaser, slug, imageUrl }));
  } else {
    console.log("📭 Newsletter ignorée (environnement de développement).");
  }

  return result;
}
