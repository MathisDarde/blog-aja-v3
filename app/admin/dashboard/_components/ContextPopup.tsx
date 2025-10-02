"use client";

import updateArticleStatus from "@/actions/article/archive-article";
import deleteArticleSA from "@/actions/article/delete-article";
import deleteCommentAction from "@/actions/comment/delete-comment";
import deleteMethode from "@/actions/method/delete-method";
import deleteAccount from "@/actions/user/delete-account";
import {
  ArchiveRestore,
  Pencil,
  SquareArrowOutUpRight,
  Trash,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { DashboardElementProps } from "@/contexts/Interfaces";
import getArticleIdByComment from "@/actions/comment/get-article-id-by-comment-id";
import { useRouter } from "next/navigation";
import ActionPopup from "@/components/ActionPopup";

export default function ContextPopup({ id, type, state }: DashboardElementProps) {
  const router = useRouter();

  const [deletePopupOpen, setDeletePopupOpen] = useState(false);

  const deleteElement = async (id: string, type: string) => {
    if (!id) {
      toast.error("Element ID is missing.");
      return;
    }

    try {
      let result;

      switch (type) {
        case "user":
          result = await deleteAccount(id);
          if (result && result.success) {
            toast.success("Utilisateur supprimé avec succès");
          } else {
            toast.error("Erreur lors de la suppression de l'utilisateur");
          }
          break;

        case "article":
          result = await deleteArticleSA(id);
          if (result && result.success) {
            toast.success("Article supprimé avec succès");
          } else {
            toast.error("Erreur lors de la suppression de l'article");
          }
          break;

        case "comment":
          result = await deleteCommentAction(id);
          if (result && result.success) {
            toast.success("Commentaire supprimé avec succès");
          } else {
            toast.error("Erreur lors de la suppression du commentaire");
          }
          break;

        case "method":
          result = await deleteMethode(id);
          if (result && result.success) {
            toast.success("Méthode supprimée avec succès");
          } else {
            toast.error("Erreur lors de la suppression de la méthode");
          }
          break;

        default:
          toast.error("Type d'élément inconnu");
          return;
      }
    } catch (error) {
      console.error(error);
      toast.error("Erreur inattendue lors de la suppression");
    }
  };

  const previewElement = async (id: string, type: string) => {
    if (!id) {
      toast.error("Element ID is missing.");
      return;
    }

    switch (type) {
      case "user":
        return router.push(`/admin/dashboard/previewelement/${id}`);
      case "article":
        return router.push(`/articles/${id}`);
      case "comment":
        const articleId = await getArticleIdByComment(id);
        if (articleId) {
          return router.push(`/articles/${articleId}#comment-${id}`);
        } else {
          toast.error("Impossible de retrouver l'article du commentaire");
        }
        break;
      case "method":
        return;
    }
  };

  const updateElement = (id: string, type: string) => {
    if (!id) {
      toast.error("Element ID is missing.");
      return;
    }

    switch (type) {
      case "user":
        return;
      case "article":
        switch (state) {
          case "published":
            return router.push(`/articles/${id}/update`);
          case "archived":
            return toast.error("Impossible de modifier cet article étant donné qu'il est archivé.")
          case "pending":
            return router.push(`/admin/brouillons/${id}`)
        }
      case "comment":
        return;
      case "method":
        return router.push(`/admin/dashboard/updateelement/${id}`);
    }
  };

  const archiveElement = async (id: string) => {
    if (!id) {
      toast.error("Element ID is missing.");
      return;
    }

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

  return (
    <>
      <div className="bg-white p-2 rounded-xl flex flex-col gap-2 border border-gray-300">
        {type !== "method" && (
          <div
            className="px-4 py-2 flex items-center gap-3 rounded-xl cursor-pointer transition-colors hover:bg-gray-100"
            onClick={() => previewElement(id, type)}
          >
            <SquareArrowOutUpRight
              size={20}
              color="oklch(55.4% 0.046 257.417)"
            />{" "}
            Accéder à l&apos;élément
          </div>
        )}
        {(type == "article" || type == "method") && (
          <div
            className="px-4 py-2 flex items-center gap-3 rounded-xl cursor-pointer transition-colors hover:bg-gray-100"
            onClick={() => updateElement(id, type)}
          >
            <Pencil size={20} color="oklch(55.4% 0.046 257.417)" /> Modifier
          </div>
        )}
        {type == "article" && (
          <div
            className="px-4 py-2 flex items-center gap-3 rounded-xl cursor-pointer transition-colors hover:bg-gray-100"
            onClick={() => archiveElement(id)}
          >
            <ArchiveRestore size={20} color="oklch(55.4% 0.046 257.417)" />{" "}
            Archiver
          </div>
        )}
        <div
          className="group px-4 py-2 flex items-center gap-3 rounded-xl cursor-pointer transition-colors hover:bg-red-400 hover:text-white"
          onClick={() => setDeletePopupOpen(true)}
        >
          <Trash
            size={20}
            className="text-[color:oklch(55.4%_0.046_257.417)] group-hover:text-white transition-colors"
          />{" "}
          Supprimer
        </div>
      </div>

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
              try {
                deleteElement(id, type);
                setDeletePopupOpen(false);
              } catch (error) {
                console.error("Erreur suppression élément :", error);
              }
            },
            theme: "delete",
          },
        ]}
        />
      )}
    </>
  );
}
