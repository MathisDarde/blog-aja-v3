import displayBrouillons from "@/actions/article/display-brouillons";
import UpdateBrouillonForm from "../_components/UpdateBrouillonForm";
import UpdateBrouillonGuard from "../_components/UpdateBrouillonGuard";

interface PageProps {
    params: { id: string };
}

export default async function BrouillonEditPage({ params }: PageProps) {
    const brouillons = await displayBrouillons();
    const brouillon = brouillons.find(
        (b) => b.id_article.toString() === params.id
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
