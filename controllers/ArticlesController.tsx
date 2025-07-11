import { db } from "@/app/db/db";
import { articlesTable, SelectPost } from "@/app/db/schema";
import { ArticleSchemaType, DraftArticleSchemaType } from "@/types/forms";
import { desc, eq } from "drizzle-orm";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

export async function getAllArticles(): Promise<
  Array<{
    id_article: string;
    imageUrl: string;
    title: string;
    teaser: string;
    content: string;
    author: string;
    state: "pending" | "published" | "archived";
    tags: string[];
    userId: string;
    publishedAt: Date;
    updatedAt: Date;
  }>
> {
  return db
    .select()
    .from(articlesTable)
    .then((articles) =>
      articles.map((article) => ({
        ...article,
        state: (article.state ?? "pending") as
          | "pending"
          | "published"
          | "archived",
      }))
    );
}

export async function getArticles(): Promise<
  Array<{
    id_article: string;
    imageUrl: string;
    title: string;
    teaser: string;
    content: string;
    author: string;
    tags: string[];
    state: "pending" | "published" | "archived";
    userId: string;
    publishedAt: Date;
    updatedAt: Date;
  }>
> {
  return db
    .select()
    .from(articlesTable)
    .where(eq(articlesTable.state, "published"))
    .then((articles) =>
      articles.map((article) => ({
        ...article,
        state: (article.state ?? "pending") as
          | "pending"
          | "published"
          | "archived",
      }))
    );
}

export async function getBrouillons(): Promise<
  Array<{
    id_article: string;
    imageUrl: string;
    title: string;
    teaser: string;
    content: string;
    author: string;
    tags: string[];
    state: "pending" | "published" | "archived";
    userId: string;
    publishedAt: Date;
    updatedAt: Date;
  }>
> {
  return db
    .select()
    .from(articlesTable)
    .where(eq(articlesTable.state, "pending"));
}

export async function createArticle(
  data: ArticleSchemaType,
  file: File,
  userId: string
) {
  let imageUrl = "";

  try {
    // Vérification du type et de la taille du fichier
    const MAX_SIZE = 5 * 2048 * 2048; // 5 Mo
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

    // Récupérer les données de l'article
    const { title, teaser, content, author, tags } = data;
    const parsedTags = typeof tags === "string" ? JSON.parse(tags) : tags;

    // Créer l'article dans la base de données avec Drizzle
    const result = await db.insert(articlesTable).values({
      id_article: uuidv4(), // Generate a unique id for the article
      imageUrl,
      title,
      teaser,
      content,
      author,
      tags: parsedTags,
      state: "published",
      userId,
    });

    return result;
  } catch (err) {
    console.log(err);
    throw new Error(
      `Erreur lors de l'upload du fichier ou de la création de l'article`
    );
  }
}

export async function storeBrouillon(
  data: Partial<DraftArticleSchemaType>,
  userId: string,
  file?: File
) {
  let imageUrl = "";

  try {
    if (file) {
      const MAX_SIZE = 5 * 2048 * 2048; // 5 Mo
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

    const { title, teaser, content, author, tags } = data || {};
    const parsedTags = typeof tags === "string" ? JSON.parse(tags) : tags;

    const result = await db.insert(articlesTable).values({
      id_article: uuidv4(),
      imageUrl,
      title: title ?? "",
      teaser: teaser ?? "",
      content: content ?? "",
      author: author ?? "",
      tags: parsedTags ?? [],
      state: "pending",
      userId: userId,
    });

    return result;
  } catch (err) {
    console.log(err);
    throw new Error(`Erreur lors de l'enregistrement du brouillon`);
  }
}

export async function updateBrouillon(
  articleId: string,
  data: Partial<DraftArticleSchemaType>,
  file?: File
) {
  let imageUrl: string | undefined = undefined;

  try {
    // Gérer l'image
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

    const { title, teaser, content, author, tags } = data || {};
    const parsedTags = typeof tags === "string" ? JSON.parse(tags) : tags;

    // Mise à jour de la base
    const updateData = {
      ...(title !== undefined && { title }),
      ...(teaser !== undefined && { teaser }),
      ...(content !== undefined && { content }),
      ...(author !== undefined && { author }),
      ...(parsedTags !== undefined && { tags: parsedTags }),
      ...(imageUrl && { imageUrl }),
      updatedAt: new Date(),
    };

    const result = await db
      .update(articlesTable)
      .set(updateData)
      .where(eq(articlesTable.id_article, articleId));

    return result;
  } catch (err) {
    console.error(err);
    throw new Error(`Erreur lors de la mise à jour du brouillon`);
  }
}

export async function getArticlebyId(
  articleId: SelectPost["id_article"]
): Promise<
  Array<{
    id_article: string;
    title: string;
    teaser: string;
    imageUrl: string;
    content: string;
    author: string;
    userId: string;
    state: "pending" | "published" | "archived";
    publishedAt: Date;
    updatedAt: Date;
    tags: string[];
  }>
> {
  return db
    .select()
    .from(articlesTable)
    .where(eq(articlesTable.id_article, articleId))
    .then((articles) =>
      articles.map((article) => ({
        ...article,
        state: (article.state ?? "pending") as
          | "pending"
          | "published"
          | "archived",
      }))
    );
}

export async function updateArticle(
  articleId: SelectPost["id_article"],
  data: Partial<Omit<SelectPost, "id_article">>,
  file: File
) {
  try {
    const MAX_SIZE = 5 * 2048 * 2048; // 5 Mo
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

    const imageUrl = `/uploads/${fileName}`;

    // Si des tags sont présents, les parser si besoin
    if (data.tags && typeof data.tags === "string") {
      data.tags = JSON.parse(data.tags);
    }

    // Préparer les données à mettre à jour (image obligatoire)
    const updatedData: Partial<Omit<SelectPost, "id_article">> = {
      ...data,
      imageUrl, // imageUrl est obligatoirement mis à jour ici
    };

    // Effectuer la mise à jour
    const result = await db
      .update(articlesTable)
      .set(updatedData)
      .where(eq(articlesTable.id_article, articleId));

    return result;
  } catch (err) {
    console.log(err);
    throw new Error("Erreur lors de la modification de l'article");
  }
}

export async function updateStatus(
  articleId: SelectPost["id_article"],
  state: "pending" | "published" | "archived"
) {
  await db
    .update(articlesTable)
    .set({ state })
    .where(eq(articlesTable.id_article, articleId));
}

export async function deleteArticle(articleId: SelectPost["id_article"]) {
  await db.delete(articlesTable).where(eq(articlesTable.id_article, articleId));
}

export async function getLastPublished() {
  const result = await db
    .select()
    .from(articlesTable)
    .where(eq(articlesTable.state, "published"))
    .orderBy(desc(articlesTable.publishedAt))
    .then((results) => results[0]);
  return result;
}
