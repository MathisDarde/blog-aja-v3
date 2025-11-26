"use client";

import { Menu, X, ChevronDown, LogIn } from "lucide-react";
import { useState } from "react";
import SidebarData, {
  AutresDropdownData,
  AdminDropdownData,
} from "./HeaderDropdownData";
import Link from "next/link";
import Image from "next/image";
import Button from "../BlueButton";
import { authClient } from "@/lib/auth-client";
import Skeleton from "../CustomSkeleton";

export default function RespHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [openOthersDropdown, setOpenOthersDropdown] = useState(false);
  const [openAdminDropdown, setOpenAdminDropdown] = useState(false);

  // On récupère isPending
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

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
          ${isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
          }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <div
        className={`fixed left-0 p-6 top-0 h-screen overflow-y-auto w-[300px] bg-white z-30 transform transition-transform duration-300
    ${isOpen ? "translate-x-0" : "-translate-x-full"
          } flex flex-col justify-between`}
      >
        <div>
          <div className="flex justify-end items-center">
            <X className="cursor-pointer" onClick={() => setIsOpen(false)} />
          </div>

          <div className="mt-4 flex flex-col gap-2">
            {/* Note: Les liens admin n'apparaîtront qu'après chargement si user.admin est true */}
            {SidebarData.filter((val) =>
              val.type === "admin" ? user?.admin : true
            ).map((element, idx) => (
              <div key={idx}>
                {!element.dropdown ? (
                  <Link href={element.link}>
                    <div
                      className="flex items-center gap-3 py-1  text-gray-600 hover:text-aja-blue"
                      onClick={() => setIsOpen(false)}
                    >
                      {element.icon}
                      <p className="font-Montserrat text-sm">{element.title}</p>
                    </div>
                  </Link>
                ) : (
                  <>
                    <div
                      className="flex items-center justify-between py-1 cursor-pointer"
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
                        <p className="font-Montserrat text-sm">
                          {element.title}
                        </p>
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

        {/* ✅ Bloc bas collé avec SKELETON */}
        <div>
          {isPending ? (
            // Etat de chargement
            <div className="flex items-center gap-3">
              <Skeleton width={36} height={36} borderRadius="rounded-full" />
              <Skeleton width={120} height={20} />
            </div>
          ) : user ? (
            // Utilisateur connecté
            <Link href="/moncompte">
              <div
                className="flex items-center gap-3"
                onClick={() => setIsOpen(false)}
              >
                <Image
                  src={user.image || "/img/pdpdebase.png"}
                  width={128}
                  height={128}
                  className="rounded-full size-9 object-cover"
                  alt="Photo de profil"
                />
                <p className="font-Montserrat text-gray-600">{user.name}</p>
              </div>
            </Link>
          ) : (
            // Visiteur
            <Link href={"/login"}>
              <Button
                onClick={() => setIsOpen(false)}
                size="default"
                className="flex items-center gap-2 m-0"
              >
                <LogIn />
                Se connecter
              </Button>
            </Link>
          )}
        </div>
      </div>
    </>
  );
}