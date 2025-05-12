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
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

interface Props {
  id: string;
  type: string;
}

export default function ContextPopup({ id, type }: Props) {
  const router = useRouter();
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);

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

  const previewElement = (id: string, type: string) => {
    if (!id) {
      toast.error("Element ID is missing.");
      return;
    }

    switch (type) {
      case "user":
        return router.push(`/admindashboard/previewelement/${id}`);
      case "article":
        return router.push(`/articles/${id}`);
      case "comment":
        return router.push(`/articles/${id}`);
      case "method":
        return;
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
      }
    } catch (error) {
      console.log(error);
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
          <div className="px-4 py-2 flex items-center gap-3 rounded-xl cursor-pointer transition-colors hover:bg-gray-100">
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
          onClick={() => setIsDeletePopupOpen(true)}
        >
          <Trash
            size={20}
            className="text-[color:oklch(55.4%_0.046_257.417)] group-hover:text-white transition-colors"
          />{" "}
          Supprimer
        </div>
      </div>

      {isDeletePopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 font-Montserrat">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96 text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Supprimer l&apos;élément ?
            </h3>
            <p className="text-gray-600 mb-6">
              Cette action est irréversible. Êtes-vous sûr de vouloir continuer
              ?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setIsDeletePopupOpen(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg transition-colors hover:bg-gray-500 hover:text-white"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  deleteElement(id, type);
                  setIsDeletePopupOpen(false);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg transition-colors hover:bg-red-800"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
