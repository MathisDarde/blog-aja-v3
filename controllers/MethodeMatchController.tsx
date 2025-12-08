"use server";

import { db } from "@/db/db";
import { SelectMatchMethode, methodeExpertMatchTable } from "@/db/schema";
import { MethodeMatchSchemaType } from "@/types/forms";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { RempPlayerType, TituPlayerType } from "@/contexts/Interfaces";

export async function getMatchMethodes(): Promise<SelectMatchMethode[]> {
  return await db.select().from(methodeExpertMatchTable);
}

export async function createMethodeMatch(
  data: MethodeMatchSchemaType,
  userId: string
) {
  try {
    const {
      titrematch,
      couleur1equipe1,
      couleur2equipe1,
      nomequipe1,
      systemeequipe1,
      couleur1equipe2,
      couleur2equipe2,
      nomequipe2,
      systemeequipe2,
      stade,
      date,
      keywords,
      titulairesequipe1,
      titulairesequipe2,
      remplacantsequipe1,
      remplacantsequipe2,
    } = data;

    const result = await db.insert(methodeExpertMatchTable).values({
      id_methode: uuidv4(),
      titrematch,
      couleur1equipe1,
      couleur2equipe1,
      nomequipe1,
      systemeequipe1,
      couleur1equipe2,
      couleur2equipe2,
      nomequipe2,
      systemeequipe2,
      titulairesequipe1,
      titulairesequipe2,
      remplacantsequipe1,
      remplacantsequipe2,
      stade,
      date,
      typemethode: "match",
      keywords: keywords.map((keyword) => keyword.value),
      userId,
    });

    return { success: true, result };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: "Erreur lors de la création de la méthode.",
    };
  }
}

export async function getMethodeById(
  methodeId: string
): Promise<SelectMatchMethode[]> {
  const results = await db
    .select()
    .from(methodeExpertMatchTable)
    .where(eq(methodeExpertMatchTable.id_methode, methodeId));

  return results.map((item) => ({
    ...item,
    titulairesequipe1: item.titulairesequipe1 as unknown as TituPlayerType[],
    titulairesequipe2: item.titulairesequipe2 as unknown as TituPlayerType[],
    remplacantsequipe1: item.remplacantsequipe1 as unknown as RempPlayerType[],
    remplacantsequipe2: item.remplacantsequipe2 as unknown as RempPlayerType[],
  }));
}

export async function updateMethodeMatch(
  id_methode: string,
  data: MethodeMatchSchemaType,
  userId: string
) {
  try {
    const {
      titrematch,
      couleur1equipe1,
      couleur2equipe1,
      nomequipe1,
      systemeequipe1,
      couleur1equipe2,
      couleur2equipe2,
      nomequipe2,
      systemeequipe2,
      stade,
      date,
      keywords,
      titulairesequipe1,
      titulairesequipe2,
      remplacantsequipe1,
      remplacantsequipe2,
    } = data;

    const updateData: any = {
      titrematch,
      couleur1equipe1,
      couleur2equipe1,
      nomequipe1,
      systemeequipe1,
      couleur1equipe2,
      couleur2equipe2,
      nomequipe2,
      systemeequipe2,
      titulairesequipe1,
      titulairesequipe2,
      remplacantsequipe1,
      remplacantsequipe2,
      stade,
      date,
      keywords: keywords.map((keyword) => keyword.value),
      userId,
    };

    const result = await db
      .update(methodeExpertMatchTable)
      .set(updateData)
      .where(eq(methodeExpertMatchTable.id_methode, id_methode));

    return { success: true, result };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: "Erreur lors de la mise à jour de la méthode.",
    };
  }
}

export async function deleteMethodeMatch(methodeId: string) {
  await db
    .delete(methodeExpertMatchTable)
    .where(eq(methodeExpertMatchTable.id_methode, methodeId));
  return { success: true };
}
