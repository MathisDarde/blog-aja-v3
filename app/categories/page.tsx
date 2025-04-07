"use client";

import DisplayAllCategories from "./_components/DisplayAllCategories";
import Link from "next/link";
import Button from "@/components/BlueButton";
import { useEffect } from "react";

export default function CategoriesPage() {
  useEffect(() => {
    document.title = "Catégories - Mémoire d'Auxerrois";

    if (!document.getElementById("favicon")) {
      const link = document.createElement("link");
      link.id = "favicon";
      link.rel = "icon";
      link.href = "/_assets/teamlogos/logoauxerre.svg";
      document.head.appendChild(link);
    }
  }, []);

  return (
    <div className="bg-gray-100 h-full w-full p-0 m-0 box-border ">
      <div>
        <h2 className="uppercase text-black font-Montserrat font-bold text-3xl text-center">
          Catégories
        </h2>
        <div>
          <DisplayAllCategories />
        </div>
        <div className="text-center">
          <Link href="/">
            <Button type="button">Je retourne à l&apos;accueil</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
