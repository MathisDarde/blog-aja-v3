import { Suspense } from "react";
import ArticleCenter from "./_components/ArticleCenter";

export default function Page() {
  return (
    <Suspense fallback={<div>Chargement des articles...</div>}>
      <ArticleCenter />
    </Suspense>
  );
}
