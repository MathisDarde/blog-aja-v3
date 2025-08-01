"use server"

import { db } from "@/db/db";
import { SelectSaisonMethode, methodeExpertSaisonTable } from "@/db/schema";
import { MethodeSaisonSchemaType } from "@/types/forms";
import { eq } from "drizzle-orm";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

export async function getSaisonMethodes(): Promise<
SelectSaisonMethode[]
> {
  const results = await db.select().from(methodeExpertSaisonTable);
  return results.map((item) => ({
    ...item,
    remplacants: item.remplacants as string[][],
    created_at: new Date(item.createdAt),
    updated_at: new Date(item.updatedAt),
  }));
}

export async function createMethodeSaison(
  data: MethodeSaisonSchemaType,
  file: File,
  userId: string
) {
  let imageUrl = "";

  try {
    // Vérification du type et de la taille du fichier
    const MAX_SIZE = 5 * 1024 * 1024; // 5 Mo
    const ALLOWED_TYPES = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/webp",
    ];

    if (file.size > MAX_SIZE) {
      throw new Error(
        "Le fichier est trop grand. La taille maximale est de 5 Mo."
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new Error(
        "Type de fichier non autorisé. Veuillez télécharger une image JPEG, PNG, JPG ou WEBP."
      );
    }

    // Créer le répertoire si nécessaire
    const uploadDir = path.join(process.cwd(), "/public/uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Générer un nom de fichier unique pour éviter les conflits
    const fileExtension = path.extname(file.name);
    const fileName = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(uploadDir, fileName);

    // Écrire le fichier sur le serveur
    const buffer = await file.arrayBuffer();
    fs.writeFileSync(filePath, Buffer.from(buffer));

    // URL du fichier téléchargé
    imageUrl = `/uploads/${fileName}`;

    // Créer la méthode dans la base de données avec Drizzle
    const { saison, coach, systeme, keywords, remplacants } = data;

    const result = await db.insert(methodeExpertSaisonTable).values({
      id_methode: uuidv4(),
      saison,
      coach,
      systeme,
      imgterrain: imageUrl,
      typemethode: "saison",
      keywords: keywords.map((keyword) => keyword.value),
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

export async function getMethodeById(methodeId: string): Promise<
SelectSaisonMethode[]
> {
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
  userId: string,
  file?: File
) {
  let imageUrl: string | undefined = undefined;

  try {
    // Si un nouveau fichier est fourni, le traiter
    if (file) {
      const MAX_SIZE = 5 * 1024 * 1024;
      const ALLOWED_TYPES = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/webp",
      ];

      if (file.size > MAX_SIZE) {
        throw new Error("Le fichier est trop grand. Max : 5 Mo.");
      }

      if (!ALLOWED_TYPES.includes(file.type)) {
        throw new Error("Type de fichier non autorisé.");
      }

      const uploadDir = path.join(process.cwd(), "/public/uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const fileExtension = path.extname(file.name);
      const fileName = `${uuidv4()}${fileExtension}`;
      const filePath = path.join(uploadDir, fileName);

      const buffer = await file.arrayBuffer();
      fs.writeFileSync(filePath, Buffer.from(buffer));

      imageUrl = `/uploads/${fileName}`;
    }

    const { saison, coach, systeme, keywords, remplacants } = data;

    const updateData: any = {
      saison,
      coach,
      systeme,
      keywords: keywords.map((k) => k.value),
      remplacants,
      userId,
    };

    if (imageUrl) {
      updateData.imgterrain = imageUrl;
    }

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
