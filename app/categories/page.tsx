import DisplayAllCategories from "./_components/DisplayAllCategories";
import { getArticles } from "@/controllers/ArticlesController";

// Nombre d'articles par catégorie : à jour au plus toutes les 60 s, et dès qu'un
// article change (revalidateArticlePages)
export const revalidate = 60;

export default async function CategoriesPage() {
  const articles = await getArticles();

  const counts: Record<string, number> = {};
  for (const article of articles) {
    for (const tag of new Set(article.tags)) counts[tag] = (counts[tag] ?? 0) + 1;
  }

  return (
    <div className="text-center bg-gray-100 min-h-screen w-screen box-border p-6 sm:p-10 font-Montserrat">
      <h1 className="text-center font-Bai_Jamjuree text-3xl sm:text-4xl font-bold uppercase mb-2">
        Catégories
      </h1>
      <p className="max-w-[700px] mx-auto text-sm sm:text-base text-gray-700 mb-6 sm:mb-10">
        Parcourez les articles sur l&apos;AJ Auxerre par époque, par compétition ou par joueur.
      </p>
      <DisplayAllCategories counts={counts} />
    </div>
  );
}
