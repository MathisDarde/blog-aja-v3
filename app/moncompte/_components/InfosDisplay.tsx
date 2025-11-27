"use client";

import deleteAccount from "@/actions/user/delete-account";
import { logOut } from "@/actions/user/log-out";
import Button from "@/components/BlueButton";
import ActionPopup from "@/components/ActionPopup";
import getUserLikes from "@/actions/article/get-user-liked-articles"; // Ton action serveur
import { Comment, User } from "@/contexts/Interfaces";
import {
  Cake,
  Calendar1,
  LogOut,
  Mail,
  Trash,
  Heart,
  Settings,
  UserPen,
  Loader2,
  MessageCircle
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ArticleShowcase from "@/components/ArticleComponent";
import getUserComments from "@/actions/comment/get-comments-by-user";

export interface LikedArticle {
  id_article: string;
  title: string;
  slug: string;
  imageUrl: string;
  teaser: string;
  content: string;
  userId: string;
  state: "published" | "pending" | "archived";
  updatedAt: Date;
  createdAt: Date;
  tags: string[];
  author: string;
  likedAt: Date;
}

export default function InfosDisplay({ user }: { user: User }) {
  const router = useRouter();
  const [deletePopupOpen, setDeletePopupOpen] = useState(false);
  const [logoutPopupOpen, setLogoutPopupOpen] = useState(false);

  const [activeTab, setActiveTab] = useState<"favoris" | "comments" | "settings">("favoris");

  const [likedArticles, setLikedArticles] = useState<LikedArticle[]>([]);
  const [loadingLikes, setLoadingLikes] = useState(true);

  const [userComments, setUserComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);

  useEffect(() => {
    const getUserFavoriteArticles = async () => {
      try {
        setLoadingLikes(true);
        const articles = await getUserLikes(user.id);

        if (Array.isArray(articles)) {
          setLikedArticles(articles);
        }
      } catch (error) {
        console.error("Erreur chargement favoris:", error);
        toast.error("Impossible de charger vos favoris");
      } finally {
        setLoadingLikes(false);
      }
    };

    if (user.id) {
      getUserFavoriteArticles();
    }
  }, [user.id]);

  useEffect(() => {
    const getCommentsUser = async () => {
      try {
        setLoadingComments(true);
        const comments = await getUserComments(user.id);

        if (Array.isArray(comments)) {
          setUserComments(comments);
        }
      } catch (error) {
        console.error("Erreur chargement commentaires:", error);
        toast.error("Impossible de charger vos commentaires")
      } finally {
        setLoadingComments(false);
      }
    }

        if (user.id) {
      getCommentsUser();
    }
  }, [user.id])

  const handleDeleteAccount = async () => {
    const userId = user?.id;
    if (!userId) {
      toast.error("User ID is missing.");
      return;
    }
    const result = await deleteAccount(userId);
    if (result.success) {
      router.push("/login");
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

  const formatDate = (date: Date | string | undefined | null) => {
    if (!date) return "Non renseignée";
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  return (
    <div className="bg-gray-100 min-h-screen w-full p-4 md:p-10 font-Montserrat text-gray-800">

      {deletePopupOpen && (
        <ActionPopup
          onClose={() => setDeletePopupOpen(false)}
          title="Supprimer ce compte ?"
          description="Cette action est irréversible. Êtes-vous sûr de vouloir continuer ?"
          actions={[
            { label: "Annuler", onClick: () => setDeletePopupOpen(false), theme: "discard" },
            { label: "Supprimer", onClick: () => { handleDeleteAccount(); setDeletePopupOpen(false); }, theme: "delete" },
          ]}
        />
      )}

      {logoutPopupOpen && (
        <ActionPopup
          onClose={() => setLogoutPopupOpen(false)}
          title="Se déconnecter ?"
          description="Êtes-vous sûr de vouloir vous déconnecter ?"
          actions={[
            { label: "Annuler", onClick: () => setLogoutPopupOpen(false), theme: "discard" },
            { label: "Se déconnecter", onClick: () => { handleLogOut(); setLogoutPopupOpen(false); }, theme: "delete" },
          ]}
        />
      )}

      <div className="max-w-6xl mx-auto mb-8">
        <h1 className="font-Bai_Jamjuree text-3xl md:text-4xl font-bold uppercase text-gray-900 text-center">
          Mon Compte
        </h1>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center">
            <div className="relative mb-4 group cursor-pointer" onClick={() => router.push("/moncompte/update")}>
              <div className="absolute inset-0 bg-aja-blue rounded-full opacity-0 group-hover:opacity-20 transition-opacity"></div>
              {user?.image ? (
                <Image src={user.image} alt="Profil" width={400} height={400} className="w-32 h-32 rounded-full object-cover border-4 border-gray-50 shadow-sm" />
              ) : (
                <Image src="/_assets/img/pdpdebase.png" alt="Profil" width={400} height={400} className="w-32 h-32 rounded-full object-cover border-4 border-gray-50 shadow-sm" />
              )}
              <div className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow border border-gray-100">
                <UserPen size={16} className="text-aja-blue" />
              </div>
            </div>
            <h2 className="font-Bai_Jamjuree text-xl font-bold uppercase mb-1">{user?.name}</h2>
            <span className="bg-blue-50 text-aja-blue font-Montserrat text-xs font-bold px-3 py-1 rounded-full mb-6">
              {user.admin ? "Admin" : "Supporter"}
            </span>
            <div className="w-full space-y-4 text-sm text-left border-t border-gray-100 pt-6">
              <div className="flex items-center gap-3 text-gray-600">
                <Mail size={18} className="text-gray-400 shrink-0" />
                <span className="truncate" title={user?.email}>{user?.email}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Cake size={18} className="text-gray-400 shrink-0" />
                <span>{formatDate(user?.birthday)}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Calendar1 size={18} className="text-gray-400 shrink-0" />
                <span>Membre depuis {new Date(user?.createdAt).getFullYear()}</span>
              </div>
            </div>
            <div className="mt-8 w-full">
              <Button type="button" size="default" onClick={() => router.push("/moncompte/update")}>
                Modifier mon profil
              </Button>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-2">
            <button onClick={() => setLogoutPopupOpen(true)} className="w-full flex items-center gap-3 p-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors text-sm font-medium">
              <LogOut size={18} /> Se déconnecter
            </button>
            <button onClick={() => setDeletePopupOpen(true)} className="w-full flex items-center gap-3 p-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium">
              <Trash size={18} /> Supprimer mon compte
            </button>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[500px] flex flex-col">

            <div className="flex border-b border-gray-100 overflow-x-auto">
              <button onClick={() => setActiveTab("favoris")} className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === "favoris" ? "border-aja-blue text-aja-blue" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
                <Heart size={18} /> Mes Favoris
              </button>
              <button onClick={() => setActiveTab("comments")} className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === "comments" ? "border-aja-blue text-aja-blue" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
                <MessageCircle size={18} /> Mes Commentaires
              </button>
              <button onClick={() => setActiveTab("settings")} className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === "settings" ? "border-aja-blue text-aja-blue" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
                <Settings size={18} /> Préférences
              </button>
            </div>

            <div className="p-4 md:p-8 flex-1">
              {activeTab === "favoris" && (
                <div className="h-full">
                  {loadingLikes ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                      <Loader2 className="animate-spin mb-2" size={32} />
                      <p className="text-sm">Chargement de vos articles...</p>
                    </div>
                  ) : likedArticles.length > 0 ? (
                    <>
                      {likedArticles.map((article, index) => (
                        <div key={index}>
                          <ArticleShowcase article={article} displayPosition="horizontal" size="small" showAuthor={true} showDate={true} showTags={true} showTeaser={true} />
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center py-10">
                      <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-aja-blue">
                        <Heart size={32} />
                      </div>
                      <h3 className="font-Bai_Jamjuree text-xl font-bold text-gray-900 mb-2">Aucun favori pour le moment</h3>
                      <p className="text-gray-500 max-w-sm mb-6">
                        Vous n&apos;avez pas encore sauvegardé d&apos;articles. Cliquez sur le cœur lors de votre lecture pour les retrouver ici !
                      </p>
                      <Button type="button" onClick={() => router.push("/articles")}>
                        Explorer les articles
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "comments" && (
                <div className="h-full">
                  {loadingComments ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                      <Loader2 className="animate-spin mb-2" size={32} />
                      <p className="text-sm">Chargement de vos commentaires...</p>
                    </div>
                  ) : userComments.length > 0 ? (
                    <>
                      {userComments.map((comment, index) => (
                        <div
                          key={index}
                          className="border rounded-lg p-4 bg-gray-50 font-Montserrat cursor-pointer"
                          onClick={() =>
                            router.push(
                              `/articles/${comment.articleId}#comment-${comment.id_comment}`
                            )
                          }
                        >
                          <div className="flex items-center gap-4">
                            <Image
                              src={
                                comment.image || "/_assets/img/pdpdebase.png"
                              }
                              alt="Photo de profil"
                              width={248}
                              height={248}
                              className="rounded-full w-10 h-10 object-cover"
                            />
                            <p className="font-semibold">{comment.pseudo}</p>
                            <p className="font-light text-xs">
                              {new Date(comment.updatedAt).toLocaleDateString(
                                "fr-FR"
                              )}
                            </p>
                            <div className="flex items-center gap-1 my-2 ml-auto">
                              {Array.from({
                                length: Number(comment.stars),
                              }).map((_, idx) => (
                                <span
                                  key={idx}
                                  className="text-yellow-400 text-2xl"
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                          </div>
                          <p className="font-semibold text-left uppercase my-2">
                            {comment.title}
                          </p>
                          <p className="text-sm text-left text-gray-700 mb-2">
                            {comment.content}
                          </p>
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center py-10">
                      <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-aja-blue">
                        <MessageCircle size={32} />
                      </div>
                      <h3 className="font-Bai_Jamjuree text-xl font-bold text-gray-900 mb-2">Aucun commentaire pour le moment</h3>
                      <p className="text-gray-500 max-w-sm mb-6">
                        Vous n&apos;avez pas encore commenté d&apos;articles. Ajoutez un commentaire sur un article !
                      </p>
                      <Button type="button" onClick={() => router.push("/articles")}>
                        Explorer les articles
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "settings" && (
                <div className="h-full flex flex-col items-center justify-center text-center py-10">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-aja-blue">
                    <Settings size={32} />
                  </div>
                  <h3 className="font-Bai_Jamjuree text-xl font-bold text-gray-900 mb-2">Aucun paramètre disponible pour le moment</h3>
                  <p className="text-gray-500 max-w-sm mb-6">
                    Les paramètres ne sont pas disponibles pour le moment. Veuillez réessayer ultérieurement.
                  </p>
                  <Button type="button" onClick={() => router.push("/")}>
                    Retourner à l&apos;accueil
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}