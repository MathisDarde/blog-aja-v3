"use client";

import { Draft } from "@/contexts/Interfaces";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarClock, Eye } from "lucide-react";
import { formatScheduledAt } from "@/lib/schedule-date";

export default function BrouillonComponent({
  brouillons,
}: {
  brouillons: Draft[];
}) {
  const router = useRouter();

  const handleEditClick = (brouillon: Draft) => {
    router.push(`/admin/brouillons/${brouillon.id_draft}`);
  };

  return (
    <div className="text-center bg-gray-100 min-h-screen w-screen box-border p-6 md:p-10">
      <h1 className="text-center font-Bai_Jamjuree text-4xl font-bold uppercase mb-6 sm:mb-10">
        Brouillons
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center gap-6 my-2 mx-0 md:mx-5">
        {brouillons.length === 0 ? (
          <div id="noarticlefound" className="col-span-2">
            <p className="flex items-center justify-center text-2xl font-bold text-center mt-8">
              Aucun article trouvé.
            </p>
          </div>
        ) : (
          brouillons.map((brouillon, index) => (
            <div
              key={index}
              className="w-full h-full cursor-pointer"
              onClick={() => handleEditClick(brouillon)}
            >
              <div className="relative flex flex-col bg-white rounded text-center p-6 h-full">
                {brouillon.scheduledAt && (
                  <span className="absolute top-8 left-8 z-[1] flex items-center gap-1.5 rounded-full bg-aja-blue px-3 py-1.5 text-[11px] font-bold text-white shadow font-Montserrat">
                    <CalendarClock size={14} />
                    {formatScheduledAt(brouillon.scheduledAt)}
                  </span>
                )}
                <Image
                  className="inline-block w-full h-auto mx-auto rounded-sm object-contain aspect-video object-top"
                  width={512}
                  height={512}
                  src={
                    brouillon.imageUrl ||
                    "/_assets/img/defaultarticlebanner.png"
                  }
                  alt={brouillon.title || "Image de l'article"}
                />
                <h2 className="text-justify text-black font-semibold font-Montserrat text-lg pt-4 py-2 pr-2 mx-auto">
                  {brouillon.title}
                </h2>
                <p className="text-black text-justify font-Montserrat mx-auto text-sm leading-5">
                  {brouillon.teaser}
                </p>
                <Link
                  href={`/admin/brouillons/${brouillon.id_draft}/apercu`}
                  onClick={(e) => e.stopPropagation()}
                  className="mt-auto pt-4 self-end flex items-center gap-1.5 text-sm font-semibold font-Montserrat text-aja-blue hover:text-orange-third transition-colors"
                >
                  <Eye size={16} /> Aperçu
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
