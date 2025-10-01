"use server";

import { storeLike } from "@/controllers/LikedArticlesController";

const likeArticle = async (
  articleId: string,
  userId: string,
) => {
   const like = await storeLike(userId, articleId);
   return like;
};

export default likeArticle;
