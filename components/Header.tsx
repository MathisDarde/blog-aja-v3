"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ChevronDown, LogIn, Loader2 } from "lucide-react";
import SidebarData, {
  AdminDropdownData,
  AutresDropdownData,
} from "./SidebarData";
import Image from "next/image";
import { isAuthenticated } from "@/actions/user/is-user-connected";

export default function Header() {
  const [loading, setLoading] = useState(true);

  interface User {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
    photodeprofil?: string | null;
    birthday: Date;
    admin: boolean;
  }

  const [user, setUser] = useState<User | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const toggleDropdown = (key: string) => {
    setActiveDropdown((prevState) => (prevState === key ? null : key)); // si ouvert, ferme. sinon, ouvre.
  };

  useEffect(() => {
    const cachedUser = localStorage.getItem("userData");
    if (cachedUser) {
      try {
        const parsedUser = JSON.parse(cachedUser);
        setUser(parsedUser);
        setLoading(false);
      } catch (e: unknown) {
        console.error("Erreur de parsing des données utilisateur:", e);
        localStorage.removeItem("userData");
      }
    }

    const authVerif = async () => {
      try {
        const auth = await isAuthenticated();
        if (auth) {
          const transformedUser = {
            ...auth.user,
            admin: auth.user.admin === true,
          };

          setUser(transformedUser);
          localStorage.setItem("userData", JSON.stringify(transformedUser));
        } else {
          setUser(null);
          localStorage.removeItem("userData");
        }
      } catch (error) {
        console.error("Erreur d'authentification:", error);
      } finally {
        setLoading(false);
      }
    };

    authVerif();

    // Fermer les dropdowns quand on clique à l'extérieur
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="h-[68px] w-full bg-white px-12 py-4 flex items-center">
      <div className="flex-shrink-0 w-[250px]">
        <Link href={"/"}>
          <p className="uppercase text-aja-blue font-Bai_Jamjuree italic font-bold text-xl">
            Mémoire d&apos;Auxerrois
          </p>
        </Link>
      </div>

      <div className="flex flex-grow justify-center">
        <nav className="">
          <ul className="relative flex flex-row gap-10 h-auto p-0 mx-3">
            {SidebarData.filter((val) => {
              if (val.type === "admin") {
                return user?.admin === true;
              }
              return true;
            }).map((val, key) => (
              <React.Fragment key={key}>
                <li
                  className="relative w-auto h-8 bg-white list-none mb-1 flex flex-row text-gray-500 items-center font-Montserrat text-sm font-semibold cursor-pointer hover:scale-scale-102 hover:transition-transform duration-200 ease-in-out"
                  onClick={() => {
                    if (val.dropdown) {
                      toggleDropdown(val.title); // Toggle le dropdown si clic sur l'élément de navigation
                    } else {
                      window.location.pathname = val.link;
                    }
                  }}
                >
                  <div className="mx-1">{val.title}</div>
                  {val.dropdown && (
                    <ChevronDown
                      className={`ml-3 transition-transform ${
                        activeDropdown === val.title ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </li>

                {val.dropdown && activeDropdown === val.title && (
                  <div
                    ref={dropdownRef} // Ajouter la référence ici
                    className="absolute top-10 left-1/2 -translate-x-1/2 mt-3 z-50 bg-white shadow-lg rounded-xl p-6 w-screen flex justify-center gap-10"
                  >
                    {val.type === "vanilla" &&
                      AutresDropdownData.map((dropdownVal, dropdownKey) => (
                        <div
                          key={dropdownKey}
                          className="group cursor-pointer hover:bg-gray-100 p-4 rounded-lg transition-colors"
                          onClick={() => {
                            window.location.pathname = dropdownVal.link;
                          }}
                        >
                          <div className="w-[250px] flex justify-center items-center gap-4">
                            <div className="w-full flex flex-col">
                              <Image
                                src={dropdownVal.image}
                                alt={dropdownVal.title}
                                width={512}
                                height={512}
                                className="rounded-md aspect-video object-cover object-top"
                              />
                              <div>
                                <p className="text-lg font-Montserrat uppercase my-2 font-semibold text-gray-800">
                                  {dropdownVal.title}
                                </p>
                                <p className="font-Montserrat text-xs">
                                  {dropdownVal.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    {val.type === "admin" &&
                      AdminDropdownData.map((adminVal, adminKey) => (
                        <div
                          key={adminKey}
                          className="group cursor-pointer hover:bg-gray-100 p-4 rounded-lg transition-colors"
                          onClick={() => {
                            window.location.pathname = adminVal.link;
                          }}
                        >
                          <div className="w-[250px] flex justify-center items-center gap-4">
                            <div className="w-full flex flex-col">
                              <Image
                                src={adminVal.image}
                                alt={adminVal.title}
                                width={512}
                                height={512}
                                className="rounded-md aspect-video object-cover object-top"
                              />
                              <div>
                                <p className="text-lg font-Montserrat uppercase my-2 font-semibold text-gray-800">
                                  {adminVal.title}
                                </p>
                                <p className="font-Montserrat text-xs">
                                  {adminVal.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </React.Fragment>
            ))}
          </ul>
        </nav>
      </div>

      <div className="flex-shrink-0 w-[250px] flex justify-end">
        {loading ? (
          <div className="flex items-center gap-2 font-Montserrat text-gray-500">
            <Loader2 className="animate-spin" size={20} />
            <span>Chargement...</span>
          </div>
        ) : !user ? (
          <Link href={"/login"}>
            <button className="flex items-center gap-2 font-Montserrat text-white bg-aja-blue px-6 py-2 rounded-full">
              Se connecter <LogIn className="text-white" />
            </button>
          </Link>
        ) : (
          <Link href={"/moncompte"}>
            <div className="flex items-center gap-4 font-Montserrat text-gray-800">
              <Image
                src={user.photodeprofil || "/_assets/img/pdpdebase.png"}
                alt="User Avatar"
                width={128}
                height={128}
                className="size-9 object-cover rounded-full"
              />
              <p>{user.name}</p>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}
