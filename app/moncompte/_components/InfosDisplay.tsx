"use client";

import deleteAccount from "@/actions/user/delete-account";
import { logOut } from "@/actions/user/log-out";
import Button from "@/components/BlueButton";
import {
  Cake,
  Calendar1,
  ChevronLeft,
  LogOut,
  Mail,
  Trash,
} from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { User } from "@/contexts/Interfaces";
import UpdateProfileForm from "./UpdateProfileForm";

export default function InfosDisplay({ user }: { user: User }) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [confirmLeaveChanges, setConfirmLeaveChanges] = useState(false);

  const handleDeleteAccount = async () => {
    const userId = user?.id;

    if (!userId) {
      toast.error("User ID is missing.");
      return;
    }
    const result = await deleteAccount(userId);

    if (result.success) {
      redirect("/login");
    } else {
      toast.error("Erreur lors de la suppression du compte.");
    }
  };

  return (
    <div className="text-center bg-gray-100 min-h-screen w-screen box-border p-10">
      {isUpdating ? (
        <div>
          {confirmLeaveChanges && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 font-Montserrat">
              <div className="bg-white p-6 rounded-xl shadow-lg w-96 text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Revenir en arrière ?
                </h3>
                <p className="text-gray-600 mb-6">
                  SI vous revenez en arrière, vous perdrez toutes vos
                  modifications, voulez-vous continuer ?
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setConfirmLeaveChanges(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg transition-colors hover:bg-gray-500 hover:text-white"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => {
                      setConfirmLeaveChanges(false);
                      window.location.reload();
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg transition-colors hover:bg-red-800"
                  >
                    Continuer
                  </button>
                </div>
              </div>
            </div>
          )}
          <h2
            className="font-bold font-Bai_Jamjuree uppercase text-3xl mb-10 flex items-center justify-center gap-3 cursor-pointer"
            onClick={() => setConfirmLeaveChanges(true)}
          >
            <ChevronLeft /> Formulaire de modification du profil
          </h2>

          <UpdateProfileForm
            userData={{
              name: user?.name || "",
              email: user?.email || "",
              birthday: user?.birthday || new Date(),
              photodeprofil: user?.photodeprofil || "",
            }}
          />
        </div>
      ) : (
        <div>
          <h1 className="text-center font-Bai_Jamjuree text-4xl font-bold uppercase mb-10">
            Mon Compte
          </h1>
          <div className="w-full gap-4 px-4 my-10">
            {user ? (
              <>
                <div className="flex gap-4">
                  <div className="flex flex-col gap-2 font-Montserrat w-[1000px] p-10 bg-white rounded-xl shadow-xl mx-auto">
                    {!user.photodeprofil ? (
                      <Image
                        src="/_assets/img/pdpdebase.png"
                        alt="Photo de profil"
                        width={512}
                        height={512}
                        className="mx-auto h-48 w-48 object-cover rounded-full"
                      />
                    ) : (
                      <Image
                        src={user.photodeprofil}
                        alt="Photo de profil"
                        width={512}
                        height={512}
                        className="mx-auto h-48 w-48 object-cover rounded-full"
                      />
                    )}
                    <div className="text-center my-4">
                      <h3 className="uppercase font-Montserrat font-bold text-2xl">
                        {user.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail width={20} height={20} />
                      <label className="font-medium">Email :</label>
                      <p>{user.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Cake width={20} height={20} />
                      <label className="font-medium">Date de naissance :</label>
                      <p>
                        {new Date(user.birthday).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar1 width={20} height={20} />
                      <label className="font-medium">
                        Inscrit sur Mémoire d&apos;Auxerrois depuis le :
                      </label>
                      <p>
                        {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                      </p>
                    </div>

                    <div>
                      <Button type="button" onClick={() => setIsUpdating(true)}>
                        Modifier mon profil
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-4 font-Montserrat my-10">
                  <div className="bg-white text-red-600 border-2 border-red-600 px-6 py-2 rounded-full flex items-center gap-2 transition-colors hover:bg-gray-100">
                    <LogOut className="" />
                    <button type="button" onClick={logOut} className="">
                      Se déconnecter
                    </button>
                  </div>
                  <div className="">
                    {isPopupOpen && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 font-Montserrat">
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
                                handleDeleteAccount();
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
      )}
    </div>
  );
}
