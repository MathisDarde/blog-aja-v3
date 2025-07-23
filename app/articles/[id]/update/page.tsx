"use client"

import { useParams } from "next/navigation";
import UpdateContent from "./_components/UpdateContent";
import { useGlobalContext } from "@/contexts/GlobalContext";

export default function UpdateArticle() {
  const { getArticleById } = useGlobalContext();
  const params = useParams();

  const id_article = params.id as string;

  return (
    <UpdateContent id_article={id_article} getArticleById={getArticleById} />
  );
}
