"use server";

import { requireAdmin } from "@/lib/auth-guard";
import { fetchArticleStats } from "@/lib/article-stats";

const getArticleStats = async () => {
  await requireAdmin();
  return fetchArticleStats();
};

export default getArticleStats;
