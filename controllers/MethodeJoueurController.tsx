import { db } from "@/app/db/db";
import { methodeExpertJoueurTable } from "@/app/db/schema";
import { MethodeJoueurSchemaType } from "@/types/forms";
import { eq } from "drizzle-orm";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

export async function getJoueurMethodes(): Promise<
  Array<{
    id_methode: string;
    typemethode: string;
    keywords: string[];
    imagejoueur: string;
    joueurnom: string;
    poste: string;
    taille: string;
    piedfort: string;
    matchs: string;
    buts: string;
    passesd: string;
    clubs: string[][];
  }>
> {
  const results = await db.select().from(methodeExpertJoueurTable);
  return results.map((item) => ({
    ...item,
    clubs: item.clubs as string[][],
  }));
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
  Array<{
    id_methode: string;
    typemethode: string;
    keywords: string[];
    imagejoueur: string;
    joueurnom: string;
    poste: string;
    taille: string;
    piedfort: string;
    matchs: string;
    buts: string;
    passesd: string;
    clubs: string[][];
  }>
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

export async function updateMethode(
  methodeId: string,
  data: Partial<
    Omit<
      {
        id_methode: string;
        typemethode: string;
        keywords: string[];
        imagejoueur: string;
        joueurnom: string;
        poste: string;
        taille: string;
        piedfort: string;
        matchs: string;
        buts: string;
        passesd: string;
        clubs: string[][];
      },
      "id_methode"
    >
  >
) {
  await db
    .update(methodeExpertJoueurTable)
    .set(data)
    .where(eq(methodeExpertJoueurTable.id_methode, methodeId));
}

export async function deleteMethode(methodeId: string) {
  await db
    .delete(methodeExpertJoueurTable)
    .where(eq(methodeExpertJoueurTable.id_methode, methodeId));
}
