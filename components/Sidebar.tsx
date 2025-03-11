import React, { useState, useEffect } from "react";
import SidebarData from "./SidebarData";
import SearchBar from "./SidebarSearchbar";
import { ChevronDown, LogIn, X } from "lucide-react";
import Classement from "./Classement";
import { AutresDropdownData } from "./SidebarData";
import Link from "next/link";
import getUsernamePhoto from "@/actions/getUserNamePdp";
import { jwtDecode } from "jwt-decode";
import Image from "next/image";

interface SidebarProps {
  onToggle: () => void;
}

interface UserInfo {
  pseudo: string;
  photodeprofil?: string | null;
}

interface JwtPayload {
  userId: number;
  email: string;
  exp: number;
}

function Sidebar({ onToggle }: SidebarProps) {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const isTokenExpired = (token: string): boolean => {
    try {
      const decodedToken = jwtDecode<JwtPayload>(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return decodedToken.exp < currentTime;
    } catch (error) {
      console.log(error);
      return true;
    }
  };

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des informations utilisateur :",
        error
      );
    }
  }, []);

  const displayUserNamePhoto = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        window.location.href = "/login";
        throw new Error("Aucun token d'authentification trouvé");
      }

      if (isTokenExpired(token)) {
        window.location.href = "/login";
        throw new Error("Le token a expiré");
      }

      const decodedToken = jwtDecode<JwtPayload>(token);
      const userId = decodedToken.userId;

      const response = await getUsernamePhoto(userId);

      if (
        !response ||
        Array.isArray(response) ||
        typeof response !== "object"
      ) {
        throw new Error("Format de réponse invalide pour getUsernamePhoto");
      }

      setUserInfo(response);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des infos utilisateur :",
        error
      );
    }
  };

  useEffect(() => {
    displayUserNamePhoto();
  });

  return (
    <>
      <div
        className="z-30 fixed left-0 top-0 w-screen h-screen bg-nav-overlay-color cursor-pointer"
        onClick={onToggle}
      ></div>
      <div
        className="h-screen w-80 left-0 top-0 fixed bg-white overflow-y-auto z-40"
        id="sidebar"
      >
        <div
          className="flex items-center pt-3 px-3 font-Montserrat"
          onClick={onToggle}
        >
          {!token || !userInfo ? (
            <Link href="/login">
              <div className="flex items-center gap-2 ml-2">
                <button
                  type="button"
                  className="uppercase font-bold text-aja-blue"
                >
                  Se connecter
                </button>
                <LogIn className="text-aja-blue" />
              </div>
            </Link>
          ) : (
            <Link href="/moncompte">
              <div className="flex items-center gap-2 ml-2">
                <Image
                  width={512}
                  height={512}
                  src={userInfo.photodeprofil || "/_assets/img/pdpdebase.png"}
                  alt="Photo de profil"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <span className="ml-2 uppercase text-lg font-bold text-aja-blue">
                  {userInfo.pseudo}
                </span>
              </div>
            </Link>
          )}

          <X size={24} className="cursor-pointer ml-auto text-red-600" />
        </div>
        <SearchBar />
        <ul className="h-auto p-0 mx-3">
          {SidebarData.map((val, key) => (
            <React.Fragment key={key}>
              <li
                className="w-full h-8 bg-white list-none mb-1 flex flex-row text-gray-500 items-center font-Montserrat text-sm font-semibold cursor-pointer hover:scale-scale-102 hover:transition-transform duration-200 ease-in-out"
                onClick={() => {
                  if (val.dropdown) {
                    toggleDropdown();
                  } else {
                    window.location.pathname = val.link;
                  }
                }}
              >
                <div className="mx-3">{val.icon}</div>
                <div className="mx-1">{val.title}</div>
                {val.dropdown && (
                  <ChevronDown
                    className={`mx-3 transition-transform ${
                      dropdownVisible ? "rotate-180" : ""
                    }`}
                  />
                )}
              </li>

              {val.dropdown && dropdownVisible && (
                <ul className="ml-6">
                  {AutresDropdownData.map((dropdownVal, dropdownKey) => (
                    <li
                      key={dropdownKey}
                      className="group relative w-full h-10 bg-white list-none flex flex-row mb-1 text-gray-600 items-center font-Montserrat text-sm font-normal cursor-pointer hover:text-aja-blue hover:font-semibold hover:transition-colors"
                      onClick={() => {
                        window.location.pathname = dropdownVal.link;
                      }}
                    >
                      <div className="mx-3">{dropdownVal.icon}</div>
                      <div className="mx-1">{dropdownVal.title}</div>
                      <span
                        className="absolute -bottom-1 left-4 w-12 transition-all bg-gray-600 group-hover:w-32"
                        style={{ height: "1px" }}
                      ></span>
                    </li>
                  ))}
                </ul>
              )}
            </React.Fragment>
          ))}
        </ul>

        <div className="mt-5">
          <h3 className="text-lg text-black font-bold font-Montserrat text-center">
            Classement Ligue 1
          </h3>
          <Classement />
        </div>
      </div>
    </>
  );
}

export default Sidebar;
