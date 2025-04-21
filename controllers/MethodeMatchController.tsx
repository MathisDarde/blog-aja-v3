import { db } from "@/app/db/db";
import { methodeExpertMatchTable } from "@/app/db/schema";
import { MethodeMatchSchemaType } from "@/types/forms";
import { eq } from "drizzle-orm";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

export async function getMatchMethodes(): Promise<
  Array<{
    id_methode: string;
    typemethode: string;
    keywords: string[];
    titrematch: string;
    imgterrain: string;
    couleur1equipe1: string;
    couleur2equipe1: string;
    nomequipe1: string;
    systemeequipe1: string;
    couleur1equipe2: string;
    couleur2equipe2: string;
    nomequipe2: string;
    systemeequipe2: string;
    stade: string;
    date: string;
    remplacantsequipe1: string[][];
    remplacantsequipe2: string[][];
  }>
> {
  const results = await db.select().from(methodeExpertMatchTable);
  return results.map((item) => ({
    ...item,
    remplacantsequipe1: item.remplacantsequipe1 as string[][],
    remplacantsequipe2: item.remplacantsequipe2 as string[][],
  }));
}

export async function createMethodeMatch(
  data: MethodeMatchSchemaType,
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
      remplacantsequipe1,
      remplacantsequipe2,
      stade,
      date,
      imgterrain: imageUrl,
      typemethode: "match",
      keywords: keywords.map((keyword) => keyword.value),
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
    titrematch: string;
    imgterrain: string;
    couleur1equipe1: string;
    couleur2equipe1: string;
    nomequipe1: string;
    systemeequipe1: string;
    couleur1equipe2: string;
    couleur2equipe2: string;
    nomequipe2: string;
    systemeequipe2: string;
    stade: string;
    date: string;
    remplacantsequipe1: string[][];
    remplacantsequipe2: string[][];
  }>
> {
  const results = await db
    .select()
    .from(methodeExpertMatchTable)
    .where(eq(methodeExpertMatchTable.id_methode, methodeId));

  return results.map((item) => ({
    ...item,
    remplacantsequipe1: item.remplacantsequipe1 as string[][],
    remplacantsequipe2: item.remplacantsequipe2 as string[][],
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
        titrematch: string;
        imgterrain: string;
        couleur1equipe1: string;
        couleur2equipe1: string;
        nomequipe1: string;
        systemeequipe1: string;
        couleur1equipe2: string;
        couleur2equipe2: string;
        nomequipe2: string;
        systemeequipe2: string;
        stade: string;
        date: string;
        remplacantsequipe1: string[][];
        remplacantsequipe2: string[][];
      },
      "id_methode, typemethode"
    >
  >
) {
  await db
    .update(methodeExpertMatchTable)
    .set(data)
    .where(eq(methodeExpertMatchTable.id_methode, methodeId));
}

export async function deleteMethode(methodeId: string) {
  await db
    .delete(methodeExpertMatchTable)
    .where(eq(methodeExpertMatchTable.id_methode, methodeId));
}
