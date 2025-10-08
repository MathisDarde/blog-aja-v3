"use server"

import { db } from "@/db/db";
import { SelectJoueurMethode, methodeExpertJoueurTable } from "@/db/schema";
import { MethodeJoueurSchemaType } from "@/types/forms";
import { eq } from "drizzle-orm";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

export async function getJoueurMethodes(): Promise<
SelectJoueurMethode[]
> {
  return await db.select().from(methodeExpertJoueurTable);
}

export async function createMethodeJoueur(
  data: MethodeJoueurSchemaType,
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

export async function getMethodeById(methodeId: string): Promise<
SelectJoueurMethode[]
> {
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
  userId: string,
  file?: File
) {
  let imageUrl = "";

  try {
    // Si un nouveau fichier est fourni, on traite l’upload
    if (file) {
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
