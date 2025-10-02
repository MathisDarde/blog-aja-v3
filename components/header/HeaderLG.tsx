"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, LogIn } from "lucide-react";
import SidebarData, {
  AdminDropdownData,
  AutresDropdownData,
} from "../HeaderDropdownData";
import Image from "next/image";
import { User } from "@/contexts/Interfaces";

export default function HeaderLarge({ user }: { user?: User }) {
  const [openOthersDropdown, setOpenOthersDropdown] = useState(false);
  const [openAdminDropdown, setOpenAdminDropdown] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      // Si le clic ne vient ni d’un toggle ni d’un menu => on ferme
      if (
        !target.closest(".dropdown-toggle") &&
        !target.closest(".dropdown-menu")
      ) {
        setOpenOthersDropdown(false);
        setOpenAdminDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="h-[68px] w-full bg-white px-12 py-4 flex items-center">
      <div className="flex-shrink-0 w-[185px] xl:w-[250px]">
        <Link href="/">
          <p className="uppercase text-aja-blue font-Bai_Jamjuree italic font-bold text-base xl:text-xl">
            Mémoire d&apos;Auxerrois
          </p>
        </Link>
      </div>

      <div className="flex flex-grow justify-center">
        <nav>
          <ul className="relative flex flex-row gap-10 mx-3">
            {SidebarData.filter((val) =>
              val.type === "admin" ? user?.admin : true
            ).map((val, key) => (
              <React.Fragment key={key}>
                <li
                  className="dropdown-toggle relative flex items-center font-Montserrat text-sm font-semibold text-gray-500 cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => {
                    if (val.dropdown) {
                      if (val.type === "vanilla") {
                        setOpenOthersDropdown((prev) => !prev);
                        setOpenAdminDropdown(false);
                      } else if (val.type === "admin") {
                        setOpenAdminDropdown((prev) => !prev);
                        setOpenOthersDropdown(false);
                      }
                    } else {
                      window.location.pathname = val.link;
                    }
                  }}
                >
                  <span>{val.title}</span>
                  {val.dropdown && (
                    <ChevronDown
                      className={`ml-2 transition-transform ${
                        (val.type === "vanilla" && openOthersDropdown) ||
                        (val.type === "admin" && openAdminDropdown)
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  )}
                </li>

                {(val.type === "vanilla" && openOthersDropdown) ||
                (val.type === "admin" && openAdminDropdown) ? (
                  <div
                    ref={dropdownRef}
                    className="dropdown-menu absolute top-10 left-1/2 -translate-x-1/2 mt-1 z-50 bg-white shadow-lg rounded-xl p-6 w-screen flex justify-center gap-10"
                  >
                    {(val.type === "vanilla"
                      ? AutresDropdownData
                      : AdminDropdownData
                    ).map((item, idx) => (
                      <div
                        key={idx}
                        className="group cursor-pointer hover:bg-gray-100 p-4 rounded-lg transition-colors"
                        onClick={() => (window.location.pathname = item.link)}
                      >
                        <div className="w-[250px] flex flex-col gap-2">
                          <Image
                            src={item.image}
                            alt={item.title}
                            width={512}
                            height={512}
                            className="rounded-md aspect-video object-cover object-top"
                          />
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
                ) : null}
              </React.Fragment>
            ))}
          </ul>
        </nav>
      </div>

      <div className="flex-shrink-0 w-[75px] xl:w-[250px] flex justify-end">
        {!user ? (
          <Link href="/login">
            <button className="flex items-center gap-2 font-Montserrat text-white bg-aja-blue px-6 py-2 rounded-full">
              Se connecter <LogIn className="text-white" />
            </button>
          </Link>
        ) : (
          <Link href="/moncompte">
            <div className="flex items-center gap-4 font-Montserrat text-gray-800">
              <Image
                src={user.photodeprofil || "/_assets/img/pdpdebase.png"}
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
