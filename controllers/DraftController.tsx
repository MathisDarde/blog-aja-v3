import { Draft } from "@/contexts/Interfaces";
import { db } from "@/db/db";
import { draftTable, SelectDraft } from "@/db/schema";
import { ensureCloudinaryUrl } from "@/lib/store-cloudinary-image";
import { DraftArticleSchemaType } from "@/types/forms";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export async function getBrouillons(): Promise<SelectDraft[]> {
  return db.select().from(draftTable).where(eq(draftTable.state, "pending"));
}

export async function storeBrouillon(
  data: Partial<DraftArticleSchemaType>,
  userId: string
) {
  try {
    const imageUrl = data.imageUrl
      ? ensureCloudinaryUrl(data.imageUrl)
      : undefined;
    const { slug, title, teaser, content, author, tags } = data;
    const safeSlug = slug && slug.trim() !== "" ? slug : `draft-${Date.now()}`;
    const parsedTags = typeof tags === "string" ? JSON.parse(tags) : tags;

    return await db.insert(draftTable).values({
      id_draft: uuidv4(),
      slug: safeSlug,
      ...(imageUrl && { imageUrl }),
      title: title ?? "",
      teaser: teaser ?? "",
      content: content ?? "",
      author: author ?? "",
      tags: parsedTags ?? [],
      state: "pending",
      userId,
    });
  } catch (err) {
    console.error(err);
    throw new Error(`Erreur lors de l'enregistrement du brouillon`);
  }
}

export async function updateBrouillon(
  draftId: string,
  data: Partial<DraftArticleSchemaType>
) {
  try {
    const imageUrl = data.imageUrl
      ? ensureCloudinaryUrl(data.imageUrl)
      : undefined;

    const { slug, title, teaser, content, author, tags } = data;
    const parsedTags = typeof tags === "string" ? JSON.parse(tags) : tags;

    const updateData: Partial<DraftArticleSchemaType & { updatedAt: Date }> = {
      ...(slug !== undefined && { slug }),
      ...(title !== undefined && { title }),
      ...(teaser !== undefined && { teaser }),
      ...(content !== undefined && { content }),
      ...(author !== undefined && { author }),
      ...(parsedTags !== undefined && { tags: parsedTags }),
      ...(imageUrl ? { imageUrl } : {}), // ← inclure seulement si défini
      updatedAt: new Date(),
    };

    return await db
      .update(draftTable)
      .set(updateData as Draft)
      .where(eq(draftTable.id_draft, draftId));
  } catch (err) {
    console.error(err);
    throw new Error(`Erreur lors de la mise à jour du brouillon`);
  }
}
