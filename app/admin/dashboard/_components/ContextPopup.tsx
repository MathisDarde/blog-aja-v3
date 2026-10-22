"use client";

import {
  Archive,
  ArchiveRestore,
  Eye,
  EyeOff,
  FlagOff,
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
import deleteDraftArticle from "@/actions/article/delete-draft";
import deleteCommentAction from "@/actions/comment/delete-comment";
import deleteMethode from "@/actions/method/delete-method";
import deleteAccount from "@/actions/user/delete-account";
import giveUserAdmin from "@/actions/user/set-user-admin";
import removeUserAdminRole from "@/actions/user/remove-user-admin";
import {
  dismissCommentReportsAction,
  setCommentHiddenAction,
} from "@/actions/comment/moderate-comment";

export type DashboardElementType = "user" | "article" | "draft" | "comment" | "method";

// Libellés des messages de suppression
const DELETED: Record<DashboardElementType, string> = {
  user: "Utilisateur supprimé",
  article: "Article supprimé",
  draft: "Brouillon supprimé",
  comment: "Commentaire supprimé",
  method: "Méthode supprimée",
};

const DELETE_ACTIONS: Record<DashboardElementType, (id: string) => Promise<{ success: boolean } | undefined>> = {
  user: deleteAccount,
  article: deleteArticleSA,
  draft: deleteDraftArticle,
  comment: deleteCommentAction,
  method: deleteMethode,
};

const itemClass =
  "w-full px-3 py-2 flex items-center gap-2.5 rounded-lg text-left transition-colors hover:bg-gray-100";

/** Menu « trois points » d'une ligne du dashboard. */
export default function ContextPopup({
  id,
  type,
  href,
  editHref,
  state,
  isAdmin,
  hidden,
  reportsCount,
  onDone,
}: {
  id: string;
  type: DashboardElementType;
  // « Accéder à l'élément », absent si l'élément n'a pas d'adresse
  href?: string | null;
  // « Modifier »
  editHref?: string;
  // Article : publié ou archivé
  state?: string;
  isAdmin?: boolean;
  // Commentaire : état de modération
  hidden?: boolean;
  reportsCount?: number;
  // Ferme le menu
  onDone: () => void;
}) {
  const router = useRouter();
  const [confirm, setConfirm] = useState<"delete" | "promote" | "demote" | null>(null);

  // Données du dashboard relues côté serveur, sans recharger la page
  const run = async (
    action: () => Promise<{ success: boolean; message?: string } | undefined>,
    success: string,
    failure: string
  ) => {
    try {
      const result = await action();
      if (result?.success) {
        toast.success(success);
        onDone();
        router.refresh();
      } else {
        toast.error(result?.message ?? failure);
      }
    } catch (error) {
      console.error(error);
      toast.error(failure);
    }
  };

  const archived = state === "archived";

  return (
    <>
      <div className="bg-white p-1.5 rounded-xl flex flex-col border border-gray-200 shadow-lg font-Montserrat text-sm text-gray-800">
        {href && (
          <button type="button" className={itemClass} onClick={() => router.push(href)}>
            <SquareArrowOutUpRight size={16} /> Accéder à l&apos;élément
          </button>
        )}

        {editHref &&
          (archived ? (
            <button
              type="button"
              className={`${itemClass} text-gray-400`}
              onClick={() => toast.error("Désarchivez l'article pour le modifier.")}
            >
              <Pencil size={16} /> Modifier
            </button>
          ) : (
            <button type="button" className={itemClass} onClick={() => router.push(editHref)}>
              <Pencil size={16} /> Modifier
            </button>
          ))}

        {type === "article" && (
          <button
            type="button"
            className={itemClass}
            onClick={() =>
              run(
                () => updateArticleStatus(id, archived ? "published" : "archived"),
                archived ? "Article de nouveau en ligne" : "Article archivé",
                "Erreur lors de la modification du statut"
              )
            }
          >
            {archived ? <ArchiveRestore size={16} /> : <Archive size={16} />}
            {archived ? "Désarchiver" : "Archiver"}
          </button>
        )}

        {type === "comment" && (
          <button
            type="button"
            className={itemClass}
            onClick={() =>
              run(
                () => setCommentHiddenAction(id, !hidden),
                hidden ? "Commentaire réaffiché" : "Commentaire masqué",
                "Erreur de modération"
              )
            }
          >
            {hidden ? <Eye size={16} /> : <EyeOff size={16} />}
            {hidden ? "Réafficher" : "Masquer"}
          </button>
        )}

        {type === "comment" && !hidden && (reportsCount ?? 0) > 0 && (
          <button
            type="button"
            className={itemClass}
            onClick={() =>
              run(() => dismissCommentReportsAction(id), "Signalements ignorés", "Erreur de modération")
            }
          >
            <FlagOff size={16} /> Ignorer les signalements
          </button>
        )}

        {type === "user" && (
          <button type="button" className={itemClass} onClick={() => setConfirm(isAdmin ? "demote" : "promote")}>
            {isAdmin ? <UserMinus2 size={16} /> : <UserPlus2 size={16} />}
            {isAdmin ? "Rétrograder" : "Promouvoir admin"}
          </button>
        )}

        <div className="my-1 border-t border-gray-100" />
        <button
          type="button"
          className={`${itemClass} text-red-600 hover:bg-red-50`}
          onClick={() => setConfirm("delete")}
        >
          <Trash size={16} /> Supprimer
        </button>
      </div>

      {confirm === "promote" && (
        <ActionPopup
          onClose={() => setConfirm(null)}
          title="Conférer le rôle admin ?"
          description="Souhaitez-vous donner à cet utilisateur le rôle admin ?"
          actions={[
            { label: "Annuler", onClick: () => setConfirm(null), theme: "discard" },
            {
              label: "Confirmer",
              onClick: () =>
                run(() => giveUserAdmin(id), "L'utilisateur est désormais administrateur.", "Échec de la mise à jour du rôle."),
              theme: "confirm",
            },
          ]}
        />
      )}

      {confirm === "demote" && (
        <ActionPopup
          onClose={() => setConfirm(null)}
          title="Retirer le rôle admin ?"
          description="Souhaitez-vous retirer à cet utilisateur le rôle admin ?"
          actions={[
            { label: "Annuler", onClick: () => setConfirm(null), theme: "discard" },
            {
              label: "Retirer",
              onClick: () =>
                run(
                  () => removeUserAdminRole(id),
                  "L'utilisateur ne possède plus les droits administrateur.",
                  "Échec de la mise à jour du rôle."
                ),
              theme: "delete",
            },
          ]}
        />
      )}

      {confirm === "delete" && (
        <ActionPopup
          onClose={() => setConfirm(null)}
          title="Supprimer cet élément ?"
          description="Cette action est irréversible. Êtes-vous sûr de vouloir continuer ?"
          actions={[
            { label: "Annuler", onClick: () => setConfirm(null), theme: "discard" },
            {
              label: "Supprimer",
              onClick: () => run(() => DELETE_ACTIONS[type](id), DELETED[type], "Erreur lors de la suppression"),
              theme: "delete",
            },
          ]}
        />
      )}
    </>
  );
}
