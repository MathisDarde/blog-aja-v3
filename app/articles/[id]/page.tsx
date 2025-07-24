"use client"

import { useParams } from "next/navigation";
import ArticleClient from "./_components/ArticleClient";

export default async function ArticlePage() {

  const params = useParams();

  const id_article = params.id as string

  return <ArticleClient id_article={id_article} />;
}
