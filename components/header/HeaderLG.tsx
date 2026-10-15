"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, LogIn } from "lucide-react";
import SidebarData from "./HeaderDropdownData";
import Image from "next/image";
import Button from "../BlueButton";
import { authClient } from "@/lib/auth-client";
import Skeleton from "../CustomSkeleton";

// Une ligne par menu : 3 cartes pour Histoire, 5 pour Divers et Admin
const GRID_COLUMNS: Record<number, string> = {
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
};

export default function HeaderLarge() {
  // Titre du menu déroulant ouvert (un seul à la fois)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // On récupère isPending
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (
        !target.closest(".dropdown-toggle") &&
        !target.closest(".dropdown-menu")
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative h-[68px] w-full bg-white px-12 py-4 flex items-center">
      <div className="flex-shrink-0 w-[185px] xl:w-[250px]">
        <Link href="/">
          <p className="uppercase text-aja-blue font-Bai_Jamjuree italic font-bold text-base xl:text-xl">
            Mémoire d&apos;Auxerrois
          </p>
        </Link>
      </div>

      <div className="flex flex-grow justify-center">
        <nav className="w-full">
          <ul className="flex flex-row justify-center gap-10 mx-3">
            {SidebarData.filter((val) =>
              val.type === "admin" ? user?.admin : true
            ).map((val, key) => (
              <React.Fragment key={key}>
                <li
                  className="dropdown-toggle flex items-center font-Montserrat text-sm font-semibold text-gray-500 cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => {
                    if (val.items) {
                      setOpenDropdown((prev) => (prev === val.title ? null : val.title));
                    } else {
                      window.location.pathname = val.link;
                    }
                  }}
                >
                  <span>{val.title}</span>
                  {val.items && (
                    <ChevronDown
                      className={`ml-2 transition-transform ${openDropdown === val.title ? "rotate-180" : ""}`}
                    />
                  )}
                </li>

                {val.items && openDropdown === val.title ? (
                  <div
                    ref={dropdownRef}
                    className="dropdown-menu absolute top-full left-0 w-full z-50 bg-white shadow-lg py-6"
                  >
                    <div
                      className={`mx-auto max-w-[1000px] xl:max-w-[1250px] grid grid-cols-1 sm:grid-cols-2 ${
                        GRID_COLUMNS[val.items.length] ?? "lg:grid-cols-4"
                      } gap-3 xl:gap-6 px-6`}
                    >
                      {val.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="group cursor-pointer hover:bg-gray-100 p-4 rounded-lg transition-colors"
                          onClick={() => (window.location.pathname = item.link)}
                        >
                          <div className="flex flex-col gap-2">
                            <div className="w-full rounded-md overflow-hidden aspect-video">
                              <Image
                                src={item.image}
                                alt={item.title}
                                width={512}
                                height={512}
                                className="object-cover object-top w-full h-full"
                              />
                            </div>
                            <p className="text-lg font-Montserrat uppercase font-semibold text-gray-800">
                              {item.title}
                            </p>
                            <p className="font-Montserrat text-xs">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </React.Fragment>
            ))}
          </ul>
        </nav>
      </div>

      {/* 
        Gestion de la largeur du conteneur de droite :
        Si loading, on prend la largeur max (xl:w-[250px]) pour éviter que le layout ne saute 
        quand le texte apparait.
      */}
      <div
        className={`flex-shrink-0 ${!user && !isPending ? "w-[185px]" : "w-[75px]"
          } xl:w-[250px] flex justify-end`}
      >
        {isPending ? (
          // ✅ SKELETON ICI
          <div className="flex items-center gap-4">
            <Skeleton width={36} height={36} borderRadius="rounded-full" />
            <Skeleton
              width={100}
              height={15}
              className="hidden xl:block" // On cache le texte skeleton sur petits écrans desktop comme le vrai texte
            />
          </div>
        ) : !user ? (
          <Link href="/login">
            <Button size="slim" className="flex items-center gap-2">
              <LogIn className="text-white" /> Se connecter
            </Button>
          </Link>
        ) : (
          <Link href="/moncompte">
            <div className="flex items-center gap-4 font-Montserrat text-gray-800">
              <Image
                src={user.image || "/_assets/img/pdpdebase.png"}
                alt="User Avatar"
                width={128}
                height={128}
                className="size-9 object-cover rounded-full"
              />
              <p className="hidden xl:block">{user.name}</p>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}