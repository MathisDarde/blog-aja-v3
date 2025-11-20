"use server";

import { db } from "@/db/db";
import { SelectJoueurMethode, methodeExpertJoueurTable } from "@/db/schema";
import { MethodeJoueurSchemaType } from "@/types/forms";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { ensureCloudinaryUrl } from "@/lib/store-cloudinary-image";

export async function getJoueurMethodes(): Promise<SelectJoueurMethode[]> {
  return await db.select().from(methodeExpertJoueurTable);
}

export async function createMethodeJoueur(
  data: MethodeJoueurSchemaType,
  userId: string
) {
  try {
    const imageUrl = ensureCloudinaryUrl(data.imagejoueur);

    // Créer la méthode dans la base de données avec Drizzle
    const {
      joueurnom,
      poste,
      taille,
      piedfort,
      matchs,
      buts,
      passesd,
      keywords,
      clubs,
    } = data;

    const result = await db.insert(methodeExpertJoueurTable).values({
      id_methode: uuidv4(),
      joueurnom,
      poste,
      taille,
      piedfort,
      matchs,
      buts,
      passesd,
      imagejoueur: imageUrl,
      typemethode: "joueur",
      keywords: keywords.map((keyword) => keyword.value),
      clubs: clubs,
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
): Promise<SelectJoueurMethode[]> {
  const results = await db
    .select()
    .from(methodeExpertJoueurTable)
    .where(eq(methodeExpertJoueurTable.id_methode, methodeId));

  return results.map((item) => ({
    ...item,
    clubs: item.clubs as string[][],
  }));
}

export async function updateMethodeJoueur(
  id_methode: string,
  data: MethodeJoueurSchemaType,
  userId: string
) {
  try {
    const imageUrl = ensureCloudinaryUrl(data.imagejoueur);

    const {
      joueurnom,
      poste,
      taille,
      piedfort,
      matchs,
      buts,
      passesd,
      keywords,
      clubs,
    } = data;

    // Construction des données à mettre à jour
    const updatedFields: any = {
      joueurnom,
      poste,
      taille,
      piedfort,
      matchs,
      buts,
      passesd,
      keywords: keywords.map((keyword) => keyword.value),
      clubs,
      userId,
    };

    // Si une nouvelle image a été uploadée, on met à jour le champ
    if (imageUrl) {
      updatedFields.imagejoueur = imageUrl;
    }

    // Mise à jour de la base de données
    const result = await db
      .update(methodeExpertJoueurTable)
      .set(updatedFields)
      .where(eq(methodeExpertJoueurTable.id_methode, id_methode));

    return { success: true, result };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: "Erreur lors de la mise à jour du fichier ou de la méthode.",
    };
  }
}

export async function deleteMethodeJoueur(methodeId: string) {
  await db
    .delete(methodeExpertJoueurTable)
    .where(eq(methodeExpertJoueurTable.id_methode, methodeId));
  return { success: true };
}
