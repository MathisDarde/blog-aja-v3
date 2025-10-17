"use client";

import deleteAccount from "@/actions/user/delete-account";
import { logOut } from "@/actions/user/log-out";
import Button from "@/components/BlueButton";
import { Cake, Calendar1, LogOut, Mail, Trash } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { User } from "@/contexts/Interfaces";
import ActionPopup from "@/components/ActionPopup";

export default function InfosDisplay({ user }: { user: User }) {
  const [deletePopupOpen, setDeletePopupOpen] = useState(false);
  const [logoutPopupOpen, setLogoutPopupOpen] = useState(false);

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

  const handleLogOut = async () => {
    try {
      await logOut();
      window.location.href = "/login";
    } catch (e) {
      toast.error(`${e}`);
      console.error(e);
    }
  };

  return (
    <div className="text-center bg-gray-100 min-h-screen w-screen box-border p-10">
      {/* delete account popup */}
      {deletePopupOpen && (
        <ActionPopup
          onClose={() => setDeletePopupOpen(false)}
          title="Supprimer ce compte ?"
          description="Cette action est irréversible. Êtes-vous sûr de vouloir continuer ?"
          actions={[
            {
              label: "Annuler",
              onClick: () => setDeletePopupOpen(false),
              theme: "discard",
            },
            {
              label: "Supprimer",
              onClick: () => {
                handleDeleteAccount();
                setDeletePopupOpen(false);
              },
              theme: "delete",
            },
          ]}
        />
      )}

      {/* logout popup */}
      {logoutPopupOpen && (
        <ActionPopup
          onClose={() => setLogoutPopupOpen(false)}
          title="Se déconnecter ?"
          description="Êtes-vous sûr de vouloir vous déconnecter ?"
          actions={[
            {
              label: "Annuler",
              onClick: () => setLogoutPopupOpen(false),
              theme: "discard",
            },
            {
              label: "Se déconnecter",
              onClick: () => {
                handleLogOut();
                setLogoutPopupOpen(false);
              },
              theme: "delete",
            },
          ]}
        />
      )}

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
                    <p>{new Date(user.birthday).toLocaleDateString("fr-FR")}</p>
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
                    <Button
                      type="button"
                      onClick={() => redirect("/moncompte/update")}
                    >
                      Modifier mon profil
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4 font-Montserrat my-10">
                <div className="bg-white text-red-600 border-2 border-red-600 px-6 py-2 rounded-full flex items-center gap-2 transition-colors hover:bg-gray-100">
                  <LogOut className="" />
                  <button
                    type="button"
                    onClick={() => setLogoutPopupOpen(true)}
                    className=""
                  >
                    Se déconnecter
                  </button>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => setDeletePopupOpen(true)}
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
    </div>
  );
}
