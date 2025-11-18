"use server";

import { db } from "@/db/db";
import { articlesTable, SelectArticle, SelectPost } from "@/db/schema";
import { ArticleSchemaType, DraftArticleSchemaType } from "@/types/forms";
import { and, desc, eq, ilike, like, or, sql } from "drizzle-orm";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { Article, GetURLParams } from "@/contexts/Interfaces";

export async function getAllArticles(): Promise<SelectArticle[]> {
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

export async function getArticles(): Promise<SelectArticle[]> {
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

export async function getBrouillons(): Promise<SelectArticle[]> {
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
    const { slug, title, teaser, content, author, tags } = data;
    const parsedTags = typeof tags === "string" ? JSON.parse(tags) : tags;

    // Créer l'article dans la base de données avec Drizzle
    const result = await db.insert(articlesTable).values({
      id_article: uuidv4(), // Generate a unique id for the article
      slug,
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
    console.error(err);
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

    const { slug, title, teaser, content, author, tags } = data || {};
    const parsedTags = typeof tags === "string" ? JSON.parse(tags) : tags;

    const result = await db.insert(articlesTable).values({
      id_article: uuidv4(),
      slug: slug ?? "",
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
    console.error(err);
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

    const { slug, title, teaser, content, author, tags } = data || {};
    const parsedTags = typeof tags === "string" ? JSON.parse(tags) : tags;

    // Mise à jour de la base
    const updateData = {
      ...(title !== undefined && { title }),
      ...(slug !== undefined && { slug }),
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
): Promise<SelectArticle | null> {
  const articles = await db
    .select()
    .from(articlesTable)
    .where(eq(articlesTable.id_article, articleId));

  if (articles.length === 0) return null;

  const article = articles[0];

  return {
    ...article,
    state: (article.state ?? "pending") as "pending" | "published" | "archived",
  };
}

export async function getArticleBySlug(
  slug: SelectPost["slug"]
): Promise<SelectArticle | null> {
  const articles = await db
    .select()
    .from(articlesTable)
    .where(eq(articlesTable.slug, slug));

  if (articles.length === 0) return null;

  const article = articles[0];

  return {
    ...article,
    state: (article.state ?? "pending") as "pending" | "published" | "archived",
  };
}

export async function updateArticle(
  articleId: SelectPost["id_article"],
  data: Partial<Omit<SelectPost, "id_article">>,
  file?: File // <-- rendre optionnel ici
) {
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

      const imageUrl = `/uploads/${fileName}`;

      // Si des tags sont présents, les parser si besoin
      if (data.tags && typeof data.tags === "string") {
        data.tags = JSON.parse(data.tags);
      }

      // Met à jour imageUrl dans les données
      data.imageUrl = imageUrl;
    }

    // Effectuer la mise à jour avec ou sans nouvelle image
    const result = await db
      .update(articlesTable)
      .set(data)
      .where(eq(articlesTable.id_article, articleId));

    return result;
  } catch (err) {
    console.error(err);
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
    .orderBy(desc(articlesTable.createdAt))
    .then((results) => results[0]);
  return result;
}

export async function getArticlesbyKeywords({
  q,
  year,
  player,
  league,
}: GetURLParams = {}): Promise<SelectArticle[]> {
  try {
    const searchTerms =
      q
        ?.trim()
        .split(/\s+/)
        .filter((s) => s.length > 0) || [];

    const conditions = [];

    // Recherche textuelle
    if (searchTerms.length > 0) {
      const searchConditions = searchTerms.map((term) =>
        or(
          like(articlesTable.title, `%${term.toLowerCase()}%`),
          like(articlesTable.teaser, `%${term.toLowerCase()}%`),
          ilike(articlesTable.content, `%${term}%`)
        )
      );
      conditions.push(or(...searchConditions));
    }

    // Filtres de tags
    if (year) {
      conditions.push(sql`${year} = ANY(${articlesTable.tags})`);
    }
    if (league) {
      conditions.push(sql`${league} = ANY(${articlesTable.tags})`);
    }
    if (player) {
      conditions.push(sql`${player} = ANY(${articlesTable.tags})`);
    }

    // Toujours vérifier l'état publié
    conditions.push(eq(articlesTable.state, "published"));

    // Exécution de la requête
    const results = await db
      .select()
      .from(articlesTable)
      .where(and(...conditions));

    return results as Article[];
  } catch (error) {
    console.error("❌ Erreur Drizzle:", error);
    return [];
  }
}
