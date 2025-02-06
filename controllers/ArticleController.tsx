import prisma from "../prisma/prisma";

class ArticleController {
  async index() {
    const articles = await prisma.article.findMany({
      orderBy: {
        publishedAt: "desc",
      },
    });
    return articles;
  }

  async store(
    imageUrl: string,
    title: string,
    teaser: string,
    content: string,
    author: string,
    tags: string
  ) {
    const article = await prisma.article.create({
      data: {
        imageUrl,
        title,
        teaser,
        content,
        author,
        tags,
      },
    });
    return article;
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
        tags: {
          contains: tag,
        },
      },
    });
    return articles;
  }
}

export default new ArticleController();
