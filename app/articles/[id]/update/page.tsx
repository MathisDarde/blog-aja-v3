"use client"

import { useParams } from "next/navigation";
import UpdateContent from "./_components/UpdateContent";

export default function UpdateArticle() {
  const params = useParams();

  const id_article = params.id as string;

  return (
    <UpdateContent id_article={id_article} />
  );
}
