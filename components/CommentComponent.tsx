import deleteCommentAction from "@/actions/comment/delete-comment";
import reportCommentAction from "@/actions/comment/report-comment";
import { Comment } from "@/contexts/Interfaces";
import type { CommentReportReason } from "@/db/schema";
import { EyeOff, Flag, PenSquare, Trash } from "lucide-react";
import Image from "next/image";
import ActionPopup from "./ActionPopup";
import { useState } from "react";
import { toast } from "sonner";

interface CommentProps {
    comment: Comment;
    userId?: string | null;
    onEdit?: (comment: Comment) => void;
    // Bouton « Signaler » pour les commentaires des autres (page article)
    allowReport?: boolean;
}

const REPORT_REASONS: { reason: CommentReportReason; label: string }[] = [
    { reason: "spam", label: "Spam" },
    { reason: "insulte", label: "Propos insultants" },
    { reason: "hors-sujet", label: "Hors sujet" },
    { reason: "autre", label: "Autre" },
];

export default function CommentComponent({ comment, userId, onEdit, allowReport }: CommentProps) {
    const [deletePopupOpen, setDeletePopupOpen] = useState(false);
    const [reportPopupOpen, setReportPopupOpen] = useState(false);
    const [reported, setReported] = useState(false);

    async function reportComment(reason: CommentReportReason) {
        setReportPopupOpen(false);
        const result = await reportCommentAction(comment.id_comment, reason);
        if (result.success) {
            setReported(true);
            toast.success(result.message);
        } else {
            toast.error(result.message);
        }
    }

    const canReport = allowReport && userId && comment.userId !== userId;

    async function deleteComment(id: string) {
        try {
            return await deleteCommentAction(id);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            {/* delete comment modal */}
            {deletePopupOpen && (
                <ActionPopup
                    onClose={() => setDeletePopupOpen(false)}
                    title="Supprimer ce commentaire ?"
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
                                    // On utilise directement comment.id_comment
                                    await deleteComment(comment.id_comment);
                                    window.location.reload();
                                    setDeletePopupOpen(false);
                                } catch (e) {
                                    console.error("error", e);
                                }
                            },
                            theme: "delete",
                        },
                    ]}
                />
            )}

            {reportPopupOpen && (
                <ActionPopup
                    onClose={() => setReportPopupOpen(false)}
                    title="Signaler ce commentaire ?"
                    description="Choisissez le motif : un administrateur examinera le commentaire."
                    actions={[
                        ...REPORT_REASONS.map(({ reason, label }) => ({
                            label,
                            onClick: () => reportComment(reason),
                            theme: "confirm" as const,
                        })),
                        {
                            label: "Annuler",
                            onClick: () => setReportPopupOpen(false),
                            theme: "discard",
                        },
                    ]}
                />
            )}

            <div
                id={`comment-${comment.id_comment}`}
                className="border rounded-lg p-4 bg-gray-50 font-Montserrat flex flex-col md:flex-row"
            >
                <div className="flex-1">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-1 md:gap-4">
                        <div className="flex items-center gap-3 sm:gap-4">
                            {!comment.image ? (
                                <Image
                                    src={"/_assets/img/pdpdebase.png"}
                                    alt="Photo de profil"
                                    width={128}
                                    height={128}
                                    className="w-8 md:w-11 h-8 md:h-11 rounded-full"
                                />
                            ) : (
                                <Image
                                    src={comment.image}
                                    alt="Photo de profil"
                                    width={128}
                                    height={128}
                                    className="w-8 md:w-11 h-8 md:h-11 rounded-full object-cover"
                                />
                            )}
                            <p className="font-semibold text-sm sm:text-base">
                                {comment.pseudo}
                            </p>
                            <p className="font-light text-[10px] sm:text-xs">
                                {comment.updatedAt.toLocaleString("fr-FR")}
                            </p>
                        </div>
                        <div className="flex items-center gap-1 my-0 md:my-2">
                            {Array.from({
                                length: Number(comment.stars),
                            }).map((_, idx) => (
                                <span
                                    key={idx}
                                    className="text-yellow-400 text-xl md:text-3xl"
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                    </div>

                    {comment.hidden && (
                        <p className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full bg-gray-200 text-gray-700 text-[10px] sm:text-xs">
                            <EyeOff className="w-3 h-3" /> Masqué par la modération
                        </p>
                    )}
                    <p className="font-semibold uppercase my-1 sm:my-2">
                        {comment.title}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-700 mb-2">
                        {comment.content}
                    </p>
                </div>

                {userId && onEdit && comment.userId === userId && (
                    <div className="flex flex-row md:flex-col items-center justify-center md:justify-start gap-2 ml-4 mt-2">
                        <button
                            className="rounded-full border border-gray-300 p-2 hover:bg-gray-100 transition"
                            onClick={() => {
                                onEdit(comment);
                            }}
                        >
                            <PenSquare className="w-4 sm:w-5 h-4 sm:h-5" />
                        </button>
                        <button
                            className="rounded-full border bg-red-500 text-white border-gray-300 p-2 hover:bg-red-600 transition"
                            onClick={() => {
                                setDeletePopupOpen(true);
                            }}
                        >
                            <Trash className="w-4 sm:w-5 h-4 sm:h-5" />
                        </button>
                    </div>
                )}

                {canReport && (
                    <div className="flex flex-row md:flex-col items-center justify-center md:justify-start ml-4 mt-2">
                        <button
                            className="rounded-full border border-gray-300 p-2 text-gray-500 hover:bg-gray-100 hover:text-red-600 transition disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gray-500"
                            onClick={() => setReportPopupOpen(true)}
                            disabled={reported}
                            title={reported ? "Commentaire signalé" : "Signaler ce commentaire"}
                            aria-label={reported ? "Commentaire signalé" : "Signaler ce commentaire"}
                        >
                            <Flag className="w-4 sm:w-5 h-4 sm:h-5" fill={reported ? "currentColor" : "none"} />
                        </button>
                    </div>
                )}
            </div>
        </>
    )
}