import DisplayAllCategories from "./_components/DisplayAllCategories";
import Link from "next/link";
import Button from "@/components/BlueButton";

export default function CategoriesPage() {
  return (
    <div className="text-center bg-gray-100 min-h-screen w-screen box-border p-10">
      <h1 className="text-center font-Bai_Jamjuree text-4xl font-bold uppercase mb-10">
        Catégories
      </h1>
      <div>
        <DisplayAllCategories />
      </div>
      <div className="text-center">
        <Link href="/">
          <Button type="button" size="default">Je retourne à l&apos;accueil</Button>
        </Link>
      </div>
    </div>
  );
}
