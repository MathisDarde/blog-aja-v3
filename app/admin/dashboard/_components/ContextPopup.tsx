"use client";

import {
  ArchiveRestore,
  Pencil,
  SquareArrowOutUpRight,
  Trash,
  UserMinus2,
  UserPlus2,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import ActionPopup from "@/components/ActionPopup";
import updateArticleStatus from "@/actions/article/archive-article";
import deleteArticleSA from "@/actions/article/delete-article";
import deleteCommentAction from "@/actions/comment/delete-comment";
import deleteMethode from "@/actions/method/delete-method";
import deleteAccount from "@/actions/user/delete-account";
import giveUserAdmin from "@/actions/user/set-user-admin";
import removeUserAdminRole from "@/actions/user/remove-user-admin";
import getArticleIdByComment from "@/actions/comment/get-article-id-by-comment-id";
import { DashboardElementProps } from "@/contexts/Interfaces";

export default function ContextPopup({
  id,
  type,
  state,
  isAdmin,
}: DashboardElementProps) {
  const router = useRouter();

  const [deletePopupOpen, setDeletePopupOpen] = useState(false);
  const [giveAdminPopupOpen, setGiveAdminPopupOpen] = useState(false);
  const [removeAdminPopupOpen, setRemoveAdminPopupOpen] = useState(false);

  const deleteElement = async (id: string, type: string) => {
    console.log("Suppression démarrée pour:", id, type);
    if (!id) return toast.error("Element ID is missing.");
    try {
      let result;
      switch (type) {
        case "user":
          result = await deleteAccount(id);
          break;
        case "article":
          result = await deleteArticleSA(id);
          break;
        case "comment":
          result = await deleteCommentAction(id);
          break;
        case "method":
          result = await deleteMethode(id);
          break;
      }
      console.log("Résultat de la suppression:", result);
      if (result?.success) {
        toast.success(`${type} supprimé avec succès`);
        // Attendre un peu avant de recharger
        await new Promise((r) => setTimeout(r, 1000));
        window.location.reload();
      } else {
        toast.error(`Erreur lors de la suppression du ${type}`);
      }
    } catch (error) {
      console.error("Erreur de suppression:", error);
      toast.error("Erreur inattendue lors de la suppression");
    }
  };

  const handleAdminRole = async (id: string) => {
    console.log("Modification du rôle admin pour:", id, "isAdmin:", isAdmin);
    try {
      const update = !isAdmin
        ? await giveUserAdmin(id)
        : await removeUserAdminRole(id);
      console.log("Résultat de la mise à jour:", update);
      if (update?.success) {
        toast.success(
          isAdmin
            ? "L'utilisateur ne possède plus les droits administrateur."
            : "L'utilisateur est désormais administrateur."
        );
        await new Promise((r) => setTimeout(r, 1000));
        window.location.reload();
      } else {
        toast.error("Échec de la mise à jour du rôle.");
      }
    } catch (e) {
      console.error("Erreur lors de la mise à jour:", e);
      toast.error("Erreur lors de la mise à jour.");
    }
  };

  const archiveElement = async (id: string) => {
    try {
      const result = await updateArticleStatus(id, "archived");
      if (result.success) {
        toast.success("Modification réussie");
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la modification du status");
    }
  };

  const previewElement = async (id: string, type: string) => {
    switch (type) {
      case "user":
        router.push(`/admin/dashboard/previewelement/${id}`);
        break;
      case "article":
        router.push(`/articles/${id}`);
        break;
      case "comment":
        const articleId = await getArticleIdByComment(id);
        if (articleId) router.push(`/articles/${articleId}#comment-${id}`);
        else toast.error("Impossible de retrouver l'article du commentaire");
        break;
      case "method":
        return;
    }
  };

  const updateElement = (id: string, type: string) => {
    if (!id) return;
    switch (type) {
      case "article":
        switch (state) {
          case "published":
            router.push(`/articles/${id}/update`);
            break;
          case "archived":
            toast.error(
              "Impossible de modifier cet article étant donné qu'il est archivé."
            );
            break;
          case "pending":
            router.push(`/admin/brouillons/${id}`);
            break;
        }
        break;
      case "method":
        router.push(`/admin/dashboard/updateelement/${id}`);
        break;
    }
  };

  return (
    <>
      <div className="bg-white p-2 rounded-xl flex flex-col gap-2 border border-gray-300 font-Montserrat">
        {type !== "method" && (
          <div
            className="px-4 py-2 flex items-center gap-3 rounded-xl cursor-pointer transition-colors hover:bg-gray-100"
            onClick={() => previewElement(id, type)}
          >
            <SquareArrowOutUpRight size={20} /> Accéder à l&apos;élément
          </div>
        )}

        {(type == "article" || type == "method") && (
          <div
            className="px-4 py-2 flex items-center gap-3 rounded-xl cursor-pointer transition-colors hover:bg-gray-100"
            onClick={() => updateElement(id, type)}
          >
            <Pencil size={20} /> Modifier
          </div>
        )}

        {type == "article" && (
          <div
            className="px-4 py-2 flex items-center gap-3 rounded-xl cursor-pointer transition-colors hover:bg-gray-100"
            onClick={() => archiveElement(id)}
          >
            <ArchiveRestore size={20} /> Archiver
          </div>
        )}

        {type == "user" && (
          <div
            className="px-4 py-2 flex items-center gap-3 rounded-xl cursor-pointer transition-colors hover:bg-gray-100"
            onClick={() => {
              if (isAdmin) setRemoveAdminPopupOpen(true);
              else setGiveAdminPopupOpen(true);
            }}
          >
            {isAdmin ? <UserMinus2 size={20} /> : <UserPlus2 size={20} />}{" "}
            {isAdmin ? "Rétrograder" : "Promouvoir"}
          </div>
        )}

        <div
          className="group px-4 py-2 flex items-center gap-3 rounded-xl cursor-pointer transition-colors hover:bg-red-400 hover:text-white"
          onClick={() => setDeletePopupOpen(true)}
        >
          <Trash size={20} /> Supprimer
        </div>
      </div>

      {giveAdminPopupOpen && (
        <ActionPopup
          onClose={() => setGiveAdminPopupOpen(false)}
          title="Conférer le rôle admin ?"
          description="Souhaitez-vous donner à cet utilisateur le rôle admin ?"
          actions={[
            {
              label: "Annuler",
              onClick: () => setGiveAdminPopupOpen(false),
              theme: "discard",
            },
            {
              label: "Confirmer",
              onClick: async () => {
                console.log("Bouton Confirmer cliqué");
                await handleAdminRole(id);
                setGiveAdminPopupOpen(false);
              },
              theme: "confirm",
            },
          ]}
        />
      )}

      {removeAdminPopupOpen && (
        <ActionPopup
          onClose={() => setRemoveAdminPopupOpen(false)}
          title="Supprimer le rôle admin ?"
          description="Souhaitez-vous retirer à cet utilisateur le rôle admin ?"
          actions={[
            {
              label: "Annuler",
              onClick: () => setRemoveAdminPopupOpen(false),
              theme: "discard",
            },
            {
              label: "Supprimer",
              onClick: async () => {
                console.log("Bouton Supprimer admin cliqué");
                await handleAdminRole(id);
                setRemoveAdminPopupOpen(false);
              },
              theme: "delete",
            },
          ]}
        />
      )}

      {deletePopupOpen && (
        <ActionPopup
          onClose={() => setDeletePopupOpen(false)}
          title="Supprimer cet élément ?"
          description="Cette action est irréversible. Êtes-vous sûr de vouloir continuer ?"
          actions={[
            {
              label: "Annuler",
              onClick: () => setDeletePopupOpen(false),
              theme: "discard",
            },
            {
              label: "Supprimer",
              onClick: async () => {
                console.log("Bouton Supprimer élément cliqué");
                await deleteElement(id, type);
                setDeletePopupOpen(false);
              },
              theme: "delete",
            },
          ]}
        />
      )}
    </>
  );
}
