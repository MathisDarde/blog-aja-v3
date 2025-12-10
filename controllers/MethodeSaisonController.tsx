"use server";

import { db } from "@/db/db";
import { SelectSaisonMethode, methodeExpertSaisonTable } from "@/db/schema";
import { MethodeSaisonSchemaType } from "@/types/forms";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export async function getSaisonMethodes(): Promise<SelectSaisonMethode[]> {
  return await db.select().from(methodeExpertSaisonTable);
}

export async function createMethodeSaison(
  data: MethodeSaisonSchemaType,
  userId: string
) {
  try {
    const { saison, coach, systeme, keywords, titulaires, remplacants } = data;

    const result = await db.insert(methodeExpertSaisonTable).values({
      id_methode: uuidv4(),
      saison,
      coach,
      systeme,
      typemethode: "saison",
      keywords: keywords.map((keyword) => keyword.value),
      titulaires: titulaires,
      remplacants: remplacants,
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
): Promise<SelectSaisonMethode[]> {
  const results = await db
    .select()
    .from(methodeExpertSaisonTable)
    .where(eq(methodeExpertSaisonTable.id_methode, methodeId));

  return results.map((item) => ({
    ...item,
    remplacants: item.remplacants as string[][],
  }));
}

export async function updateMethodeSaison(
  id_methode: string,
  data: MethodeSaisonSchemaType,
  userId: string
) {
  try {
    const { saison, coach, systeme, keywords, titulaires, remplacants } = data;

    const updateData: any = {
      saison,
      coach,
      systeme,
      keywords: keywords.map((k) => k.value),
      titulaires,
      remplacants,
      userId,
    };

    const result = await db
      .update(methodeExpertSaisonTable)
      .set(updateData)
      .where(eq(methodeExpertSaisonTable.id_methode, id_methode));

    return { success: true, result };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message:
        "Erreur lors de la mise à jour de la méthode ou du fichier image.",
    };
  }
}

export async function deleteMethodeSaison(methodeId: string) {
  await db
    .delete(methodeExpertSaisonTable)
    .where(eq(methodeExpertSaisonTable.id_methode, methodeId));
  return { success: true };
}
