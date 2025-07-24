import { getCommentsbyArticle } from "@/controllers/CommentController";
import ArticleClient from "./_components/ArticleClient";

type Props = {
  params: {
    id: string;
  };
};


export default async function ArticlePage({ params }: Props) {


  return <ArticleClient id_article={params.id} />;
}
