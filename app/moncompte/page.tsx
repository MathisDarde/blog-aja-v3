"use client";

import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import SidebarResp from "@/components/SidebarResp";
import Sidebar from "@/components/Sidebar";
import displayUserInfo from "@/actions/get-profile-info";

interface UserInfo {
  user_id: number;
  pseudo: string;
  email: string;
  birthday: Date;
  createdAt: Date;
}

interface JwtPayload {
  id: number;
  exp: number;
}

export default function MonCompte() {
  const [sidebarState, setSidebarState] = useState(0);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const toggleSidebar = () => {
    setSidebarState((prevState) => (prevState === 0 ? 1 : 0));
  };

  const isTokenExpired = (token: string): boolean => {
    try {
      const decodedToken = jwtDecode<JwtPayload>(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return decodedToken.exp < currentTime;
    } catch (error) {
      return true;
    }
  };

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Aucun token d'authentification trouvé");
        }

        if (isTokenExpired(token)) {
          throw new Error("Le token a expiré");
        }

        const decodedToken = jwtDecode<JwtPayload>(token);
        const userId = decodedToken.id;

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

  return (
    <>
      <div className="text-center bg-gray-100 h-screen flex flex-col justify-start items-center">
        {sidebarState === 0 ? (
          <SidebarResp onToggle={toggleSidebar} />
        ) : (
          <Sidebar onToggle={toggleSidebar} />
        )}
        <h2 className="font-bold text-4xl font-Montserrat uppercase mb-4 mt-10">
          Mon compte
        </h2>

        {/* User Info Display */}
        <div className="w-full">
          {isLoading ? (
            <p className="text-gray-600">Chargement des informations...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : userInfo ? (
            <div className="p-4 bg-white shadow-md rounded-lg">
              <p>Pseudo: {userInfo.pseudo}</p>
              <p>Email: {userInfo.email}</p>
              <p>
                Date de naissance:{" "}
                {new Date(userInfo.birthday).toLocaleDateString()}
              </p>
              <p>
                Compte créé le:{" "}
                {new Date(userInfo.createdAt).toLocaleDateString()}
              </p>
            </div>
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
