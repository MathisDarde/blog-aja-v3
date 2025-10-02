import displayBrouillons from "@/actions/article/display-brouillons";
import UpdateBrouillonForm from "../_components/UpdateBrouillonForm";
import UpdateBrouillonGuard from "../_components/UpdateBrouillonGuard";

export default async function BrouillonEditPage({
    params,
  }: {
    params: Promise<{ id: string }>;
  }) {

    const brouillonId = (await params).id;

    const brouillons = await displayBrouillons();
    const brouillon = brouillons.find(
        (b) => b.id_article.toString() === brouillonId
    );

    if (!brouillon) {
        return <div className="p-10 text-center">Brouillon introuvable</div>;
    }

    return (
        <div className="p-10">
            <UpdateBrouillonGuard />

            <UpdateBrouillonForm
                articleData={brouillon}
                id_article={brouillon.id_article}
            />
        </div>
    );
}
