import { ArticleSchemaType } from "@/types/forms";
import prisma from "../prisma/prisma";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

class ArticleController {
  async index() {
    const articles = await prisma.article.findMany({
      orderBy: {
        publishedAt: "desc",
      },
    });
    return articles;
  }

  async store(data: ArticleSchemaType, file: File) {
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

      // Récupérer les données de l'article
      const { title, teaser, content, author, tags } = data;
      const parsedTags = typeof tags === "string" ? JSON.parse(tags) : tags;

      // Créer l'article dans la base de données
      const article = await prisma.article.create({
        data: {
          imageUrl,
          title,
          teaser,
          content,
          author,
          tags: parsedTags,
        },
      });

      return article;
    } catch (err) {
      throw new Error(
        `Erreur lors de l'upload du fichier ou de la création de l'article`
      );
    }
  }

  async show(id_article: number) {
    const result = await prisma.article.findUnique({
      where: {
        article_id: id_article,
      },
    });
    return result;
  }

  async update(
    id_article: number,
    imageUrl: string,
    title: string,
    teaser: string,
    content: string,
    author: string,
    tags: string
  ) {
    const article = await prisma.article.update({
      where: { article_id: id_article },
      data: { imageUrl, title, teaser, content, author, tags },
    });
    return article;
  }

  async destroy(id_article: number) {
    const article = await prisma.article.delete({
      where: { article_id: id_article },
    });
    return article;
  }

  async filter(tag: string) {
    const articles = await prisma.article.findMany({
      where: {
        // tags: {
        //   contains: tag,
        // },
      },
    });
    return articles;
  }
}

export default new ArticleController();
