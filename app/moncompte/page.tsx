"use client";

import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import SidebarResp from "@/components/SidebarResp";
import Sidebar from "@/components/Sidebar";
import displayUserInfo from "@/actions/get-profile-info";
import Image from "next/image";
import { Cake, Mail, Calendar1, LogOut, Trash } from "lucide-react";
import Button from "@/components/BlueButton";
import deleteAccount from "@/actions/delete-account";

interface UserInfo {
  user_id: number;
  photodeprofil?: string | null;
  pseudo: string;
  email: string;
  birthday: Date;
  createdAt: Date;
}

interface JwtPayload {
  userId: number;
  email: string;
  exp: number;
}

export default function MonCompte() {
  const [sidebarState, setSidebarState] = useState(0);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarState((prevState) => (prevState === 0 ? 1 : 0));
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
    const fetchInfo = async () => {
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

        setIsLoading(true);
        const fetchedInfos = await displayUserInfo(userId);
        setUserInfo(fetchedInfos);
        setIsLoading(false);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Erreur de récupération des informations";

        setError(errorMessage);
        setIsLoading(false);
        console.error(err);
      }
    };

    fetchInfo();
  }, []); // Pas de dépendance car on veut charger une seule fois

  const deleteAccountFunction = async () => {
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

      await deleteAccount(userId);
      localStorage.removeItem("token");
      window.location.href = "/register";
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erreur lors de la suppression de compte";
      setError(errorMessage);
      setIsLoading(false);
      console.error(err);
    }
  };

  const logOutFunction = async () => {
    try {
      localStorage.removeItem("token");
      window.location.href = "/login";
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erreur lors de la déconnexion";
      setError(errorMessage);
      setIsLoading(false);
      console.error(err);
    }
  };

  return (
    <>
      <div className="text-center bg-gray-100 h-screen flex flex-col justify-start items-center ml-24">
        {sidebarState === 0 ? (
          <SidebarResp onToggle={toggleSidebar} />
        ) : (
          <Sidebar onToggle={toggleSidebar} />
        )}
        <h2 className="font-bold text-4xl font-Montserrat uppercase mb-4 mt-10">
          Mon compte
        </h2>

        {/* User Info Display */}
        <div className="w-full gap-4 px-4 my-10">
          {isLoading ? (
            <p className="text-gray-600">Chargement des informations...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : userInfo ? (
            <>
              <div className="flex gap-4">
                <div className="flex flex-col gap-2 font-Montserrat w-1/2 p-4 bg-white rounded-xl shadow-xl">
                  {!userInfo.photodeprofil ? (
                    <Image
                      src="/_assets/img/pdpdebase.png"
                      alt="Photo de profil"
                      width={512}
                      height={512}
                      className="mx-auto h-48 w-48 object-cover rounded-full"
                    />
                  ) : (
                    <Image
                      src={userInfo.photodeprofil}
                      alt="Photo de profil"
                      width={512}
                      height={512}
                      className="mx-auto h-48 w-48 object-cover rounded-full"
                    />
                  )}
                  <div className="text-center my-4">
                    <h3 className="uppercase font-Montserrat font-bold text-2xl">
                      {userInfo.pseudo}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail width={20} height={20} />
                    <label className="font-medium">Email :</label>
                    <p>{userInfo.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Cake width={20} height={20} />
                    <label className="font-medium">Date de naissance :</label>
                    <p>
                      {new Date(userInfo.birthday).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar1 width={20} height={20} />
                    <label className="font-medium">
                      Inscrit sur Mémoire d&apos;Auxerrois depuis le :
                    </label>
                    <p>
                      {new Date(userInfo.createdAt).toLocaleDateString("fr-FR")}
                    </p>
                  </div>

                  <div>
                    <Button type="button">Modifier ce profil</Button>
                  </div>
                </div>
                <div className="font-Montserrat w-1/2 p-4 bg-white rounded-xl shadow-xl">
                  <h3>Commentaires</h3>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4 font-Montserrat my-10">
                <div className="bg-white text-red-600 border-2 border-red-600 px-6 py-2 rounded-full flex items-center gap-2 transition-colors hover:bg-gray-100">
                  <LogOut className="" />
                  <button type="button" onClick={logOutFunction} className="">
                    Se déconnecter
                  </button>
                </div>
                <div className="">
                  {isPopupOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                      <div className="bg-white p-6 rounded-xl shadow-lg w-96 text-center">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">
                          Supprimer le compte ?
                        </h3>
                        <p className="text-gray-600 mb-6">
                          Cette action est irréversible. Êtes-vous sûr de
                          vouloir continuer ?
                        </p>
                        <div className="flex justify-center gap-4">
                          <button
                            onClick={() => setIsPopupOpen(false)}
                            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg transition-colors hover:bg-gray-500 hover:text-white"
                          >
                            Annuler
                          </button>
                          <button
                            onClick={() => {
                              deleteAccountFunction();
                              setIsPopupOpen(false);
                            }}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg transition-colors hover:bg-red-800"
                          >
                            Supprimer
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setIsPopupOpen(true)}
                    className="flex items-center gap-2 bg-red-600 px-6 py-2 rounded-full text-white transition-colors hover:bg-red-800"
                  >
                    <Trash />
                    Supprimer ce compte
                  </button>
                </div>
              </div>
            </>
          ) : (
            <p className="text-gray-600">
              Aucune information utilisateur trouvée.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
