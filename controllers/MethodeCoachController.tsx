import { db } from "@/app/db/db";
import { SelectCoachMethode, methodeExpertCoachTable } from "@/app/db/schema";
import { MethodeCoachSchemaType } from "@/types/forms";
import { eq } from "drizzle-orm";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

export async function getCoachMethodes(): Promise<
SelectCoachMethode[]
> {
  const results = await db.select().from(methodeExpertCoachTable);
  return results.map((item) => ({
    ...item,
    clubscoach: item.clubscoach as string[][],
    palmares: item.palmares as string[][],
    created_at: new Date(item.createdAt),
    updated_at: new Date(item.updatedAt),
  }));
}

export async function createMethodeCoach(
  data: MethodeCoachSchemaType,
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

export async function getMethodeById(methodeId: string): Promise<
  Array<{
    id_methode: string;
    typemethode: string;
    keywords: string[];
    imagecoach: string;
    nomcoach: string;
    palmares: string[][];
    statistiques: string;
    clubscoach: string[][];
  }>
> {
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
  userId: string,
  file?: File
) {
  try {
    let imageUrl: string | undefined = undefined;

    // Si un fichier est fourni, le traiter
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
