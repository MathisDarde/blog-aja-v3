"use server";

import { db } from "@/db/db";
import { SelectCoachMethode, methodeExpertCoachTable } from "@/db/schema";
import { MethodeCoachSchemaType } from "@/types/forms";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { ensureCloudinaryUrl } from "@/lib/store-cloudinary-image";

export async function getCoachMethodes(): Promise<SelectCoachMethode[]> {
  return await db.select().from(methodeExpertCoachTable);
}

export async function createMethodeCoach(
  data: MethodeCoachSchemaType,
  userId: string
) {
  try {
    const imageUrl = ensureCloudinaryUrl(data.imagecoach);

    // Créer la méthode dans la base de données avec Drizzle
    const { nomcoach, palmares, statistiques, keywords, clubscoach } = data;

    const result = await db.insert(methodeExpertCoachTable).values({
      id_methode: uuidv4(),
      nomcoach,
      statistiques,
      imagecoach: imageUrl,
      typemethode: "coach",
      keywords: keywords.map((keyword) => keyword.value),
      clubscoach: clubscoach,
      palmares: palmares,
      userId,
    });

    return { success: true, result };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message:
        "Erreur lors de l'upload du fichier ou de la création de la méthode.",
    };
  }
}

export async function getMethodeById(
  methodeId: string
): Promise<SelectCoachMethode[]> {
  const results = await db
    .select()
    .from(methodeExpertCoachTable)
    .where(eq(methodeExpertCoachTable.id_methode, methodeId));

  return results.map((item) => ({
    ...item,
    clubscoach: item.clubscoach as string[][],
    palmares: item.palmares as string[][],
  }));
}

export async function updateMethodeCoach(
  id_methode: string,
  data: MethodeCoachSchemaType,
  userId: string
) {
  try {
    const imageUrl = ensureCloudinaryUrl(data.imagecoach);

    const { nomcoach, palmares, statistiques, keywords, clubscoach } = data;

    // Préparer les champs à mettre à jour
    const updatedFields: any = {
      nomcoach,
      palmares,
      statistiques,
      keywords: keywords.map((keyword) => keyword.value),
      clubscoach,
      userId,
    };

    if (imageUrl) {
      updatedFields.imagecoach = imageUrl;
    }

    // Mise à jour dans la base de données
    const result = await db
      .update(methodeExpertCoachTable)
      .set(updatedFields)
      .where(eq(methodeExpertCoachTable.id_methode, id_methode));

    return { success: true, result };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message:
        "Erreur lors de l'upload du fichier ou de la mise à jour de la méthode.",
    };
  }
}

export async function deleteMethodeCoach(methodeId: string) {
  await db
    .delete(methodeExpertCoachTable)
    .where(eq(methodeExpertCoachTable.id_methode, methodeId));
  return { success: true };
}
