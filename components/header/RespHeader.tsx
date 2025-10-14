"use client";

import { User } from "@/contexts/Interfaces";
import { Menu, X, ChevronDown, LogIn } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import SidebarData, { AutresDropdownData, AdminDropdownData } from "./HeaderDropdownData";
import Link from "next/link";
import Image from "next/image";

export default function RespHeader({ user }: { user?: User }) {
  const [isOpen, setIsOpen] = useState(false);
  const [openOthersDropdown, setOpenOthersDropdown] = useState(false);
  const [openAdminDropdown, setOpenAdminDropdown] = useState(false);

  // swipe gestion
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
      if (touchStartX.current === null || touchEndX.current === null) return;
      const diff = touchStartX.current - touchEndX.current;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          // Swipe gauche => fermer
          setIsOpen(false);
        } else {
          // Swipe droite => ouvrir
          setIsOpen(true);
        }
      }
      touchStartX.current = null;
      touchEndX.current = null;
    };

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  // end of swipe gestion

  return (
    <>
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className="px-6 py-3 inline-block cursor-pointer"
      >
        <Menu size={35} />
      </div>

      <div
        className={`fixed inset-0 bg-black/50 z-20 transition-opacity duration-300 
          ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <div
        className={`fixed left-0 p-6 top-0 h-screen w-[300px] bg-white z-30 transform transition-transform duration-300
    ${isOpen ? "translate-x-0" : "-translate-x-full"} flex flex-col justify-between`}
      >
        <div>
          <div className="flex justify-end items-center">
            <X className="cursor-pointer" onClick={() => setIsOpen(false)} />
          </div>

          <div className="mt-6 flex flex-col gap-2">
            {SidebarData.filter((val) => (val.type === "admin" ? user?.admin : true)).map((element, idx) => (
              <div key={idx}>
                {!element.dropdown ? (
                  <Link href={element.link}>
                    <div className="flex items-center gap-3 py-2 text-gray-600 hover:text-aja-blue" onClick={() => setIsOpen(false)}>
                      {element.icon}
                      <p className="font-Montserrat">{element.title}</p>
                    </div>
                  </Link>
                ) : (
                  <>
                    <div
                      className="flex items-center justify-between py-2 cursor-pointer"
                      onClick={() => {
                        if (element.type === "vanilla") {
                          setOpenOthersDropdown((prev) => !prev);
                          setOpenAdminDropdown(false);
                        } else if (element.type === "admin") {
                          setOpenAdminDropdown((prev) => !prev);
                          setOpenOthersDropdown(false);
                        }
                      }}
                    >
                      <div className="flex items-center gap-3 text-gray-600">
                        {element.icon}
                        <p className="font-Montserrat">{element.title}</p>
                      </div>
                      <ChevronDown
                        className={`transition-transform text-gray-600 ${(element.type === "vanilla" && openOthersDropdown) ||
                            (element.type === "admin" && openAdminDropdown)
                            ? "rotate-180"
                            : ""
                          }`}
                      />
                    </div>

                    {(element.type === "vanilla" && openOthersDropdown
                      ? AutresDropdownData
                      : element.type === "admin" && openAdminDropdown
                        ? AdminDropdownData
                        : []
                    ).map((sub, subIdx) => (
                      <Link
                        href={sub.link}
                        key={subIdx}
                        onClick={() => setIsOpen(false)}
                        className="ml-6 flex items-center gap-4 py-1 space-y-2 text-sm text-gray-600 hover:text-aja-blue"
                      >
                        {sub.icon}
                        <span className="font-Montserrat">{sub.title}</span>
                      </Link>
                    ))}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ✅ Bloc bas collé */}
        <div>
          {user ? (
            <Link href="/moncompte" >
              <div className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
                <Image
                  src={user.photodeprofil || "/img/pdpdebase.png"}
                  width={128}
                  height={128}
                  className="rounded-full size-9 object-cover"
                  alt="Photo de profil"
                />
                <p className="font-Montserrat text-gray-600">{user.name}</p>
              </div>
            </Link>
          ) : (
            <button
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 text-white bg-aja-blue px-5 py-3 rounded-full font-Montserrat"
            >
              <LogIn />
              Se connecter
            </button>
          )}
        </div>
      </div>
    </>
  );
}
