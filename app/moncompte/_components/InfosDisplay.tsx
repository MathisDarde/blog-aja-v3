"use client";

import deleteAccount from "@/actions/user/delete-account";
import { logOut } from "@/actions/user/log-out";
import Button from "@/components/BlueButton";
import ActionPopup from "@/components/ActionPopup";
import getUserLikes from "@/actions/article/get-user-liked-articles";
import getUserComments from "@/actions/comment/get-comments-by-user";

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
  MessageCircle,
  Bell,
  Lock,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import ArticleShowcase from "@/components/ArticleComponent";
import CommentComponent from "@/components/CommentComponent";
import toggleNewsletter from "@/actions/user/toggle-newsletter-participation";

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

  const [activeTab, setActiveTab] = useState<
    "favoris" | "comments" | "settings"
  >("favoris");

  const [likedArticles, setLikedArticles] = useState<LikedArticle[]>([]);
  const [loadingLikes, setLoadingLikes] = useState(true);

  const [userComments, setUserComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);

const [newsletterEnabled, setNewsletterEnabled] = useState(user.mailArticle || false);
  const [loadingNewsletter, setLoadingNewsletter] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
        toast.error("Impossible de charger vos commentaires");
      } finally {
        setLoadingComments(false);
      }
    };

    if (user.id) {
      getCommentsUser();
    }
  }, [user.id]);

  const handleNewsletterToggle = async () => {
    setLoadingNewsletter(true);
    try {
      await toggleNewsletter(user.id, !newsletterEnabled);

      await new Promise((resolve) => setTimeout(resolve, 500));

      setNewsletterEnabled(!newsletterEnabled);
      toast.success(
        `Notifications par email ${!newsletterEnabled ? "activées" : "désactivées"}`
      );
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la mise à jour des préférences");
    } finally {
      setLoadingNewsletter(false);
    }
  };

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
      year: "numeric",
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

      <div className="max-w-6xl mx-auto mb-8">
        <h1 className="font-Bai_Jamjuree text-3xl md:text-4xl font-bold uppercase text-gray-900 text-center">
          Mon Compte
        </h1>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center max-h-[550px]">
            <div
              className="relative mb-4 group cursor-pointer"
              onClick={() => router.push("/moncompte/update")}
            >
              <div className="absolute inset-0 bg-aja-blue rounded-full opacity-0 group-hover:opacity-20 transition-opacity"></div>
              {user?.image ? (
                <Image
                  src={user.image}
                  alt="Profil"
                  width={400}
                  height={400}
                  className="w-32 h-32 rounded-full object-cover border-4 border-gray-50 shadow-sm"
                />
              ) : (
                <Image
                  src="/_assets/img/pdpdebase.png"
                  alt="Profil"
                  width={400}
                  height={400}
                  className="w-32 h-32 rounded-full object-cover border-4 border-gray-50 shadow-sm"
                />
              )}
              <div className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow border border-gray-100">
                <UserPen size={16} className="text-aja-blue" />
              </div>
            </div>
            <h2 className="font-Bai_Jamjuree text-2xl font-bold uppercase mb-1">
              {user?.name}
            </h2>
            <span className="bg-blue-50 text-aja-blue font-Montserrat text-xs font-bold px-3 py-1 rounded-full mb-6">
              {user.admin ? "Admin" : "Supporter"}
            </span>
            <div className="w-full space-y-4 text-sm text-left border-t border-gray-100 pt-6">
              <div className="flex items-center gap-3 text-gray-600">
                <Mail size={18} className="text-gray-400 shrink-0" />
                <span className="truncate" title={user?.email}>
                  {user?.email}
                </span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Cake size={18} className="text-gray-400 shrink-0" />
                <span>{formatDate(user?.birthday)}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Calendar1 size={18} className="text-gray-400 shrink-0" />
                <span>
                  Membre depuis {new Date(user?.createdAt).getFullYear()}
                </span>
              </div>
            </div>
            <div className="mt-8 w-full">
              <Button
                type="button"
                size="default"
                onClick={() => router.push("/moncompte/update")}
              >
                Modifier mon profil
              </Button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl flex flex-col shadow-sm border border-gray-100 overflow-y-auto max-h-[700px]">
            <div ref={dropdownRef} className="lg:hidden relative w-full">
              <button
                className="w-full flex justify-between items-center rounded-t-2xl px-6 py-5 bg-white text-gray-700 font-medium hover:bg-aja-blue/10"
                onClick={() => setIsOpen(!isOpen)}
              >
                <span className="mr-2">
                  {activeTab === "favoris" && "Mes favoris"}
                  {activeTab === "comments" && "Mes Commentaires"}
                  {activeTab === "settings" && "Paramètres"}
                </span>
                <ChevronDown
                  className={`w-5 h-5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                    }`}
                />
              </button>

              {isOpen && (
                <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-lg z-20 overflow-hidden">
                  {[
                    { key: "favoris", label: "Mes favoris" },
                    { key: "comments", label: "Mes Commentaires" },
                    { key: "settings", label: "Paramètres" },
                  ].map((item) => (
                    <div
                      key={item.key}
                      onClick={() => {
                        setActiveTab(
                          item.key as "favoris" | "comments" | "settings"
                        );
                        setIsOpen(false);
                      }}
                      className={`px-4 py-3 cursor-pointer text-sm sm:text-base hover:bg-gray-50 transition-colors ${activeTab === item.key
                          ? "font-bold text-aja-blue bg-blue-50/50"
                          : "text-gray-600"
                        }`}
                    >
                      {item.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="hidden lg:flex border-b border-gray-100">
              <button
                onClick={() => setActiveTab("favoris")}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === "favoris" ? "border-aja-blue text-aja-blue" : "border-transparent text-gray-500 hover:text-gray-700"}`}
              >
                <Heart size={18} /> Mes Favoris
              </button>
              <button
                onClick={() => setActiveTab("comments")}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === "comments" ? "border-aja-blue text-aja-blue" : "border-transparent text-gray-500 hover:text-gray-700"}`}
              >
                <MessageCircle size={18} /> Mes Commentaires
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === "settings" ? "border-aja-blue text-aja-blue" : "border-transparent text-gray-500 hover:text-gray-700"}`}
              >
                <Settings size={18} /> Paramètres
              </button>
            </div>

            <div className="p-4 md:p-8 flex-1 overflow-y-auto custom-scrollbar">
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
                          <ArticleShowcase
                            article={article}
                            displayPosition="horizontal"
                            size="small"
                            showAuthor={true}
                            showDate={true}
                            showTags={true}
                            showTeaser={true}
                          />
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center py-10">
                      <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-aja-blue">
                        <Heart size={32} />
                      </div>
                      <h3 className="font-Bai_Jamjuree text-xl font-bold text-gray-900 mb-2">
                        Aucun favori pour le moment
                      </h3>
                      <p className="text-gray-500 max-w-sm mb-6">
                        Vous n&apos;avez pas encore sauvegardé d&apos;articles.
                        Cliquez sur le cœur lors de votre lecture pour les
                        retrouver ici !
                      </p>
                      <Button
                        type="button"
                        onClick={() => router.push("/articles")}
                      >
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
                      <p className="text-sm">
                        Chargement de vos commentaires...
                      </p>
                    </div>
                  ) : userComments.length > 0 ? (
                    <>
                      {userComments.map((comment) => (
                        <React.Fragment key={comment.id_comment} >
                          <CommentComponent comment={comment} />
                        </React.Fragment>
                      ))}
                    </>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center py-10">
                      <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-aja-blue">
                        <MessageCircle size={32} />
                      </div>
                      <h3 className="font-Bai_Jamjuree text-xl font-bold text-gray-900 mb-2">
                        Aucun commentaire pour le moment
                      </h3>
                      <p className="text-gray-500 max-w-sm mb-6">
                        Vous n&apos;avez pas encore commenté d&apos;articles.
                        Ajoutez un commentaire sur un article !
                      </p>
                      <Button
                        type="button"
                        onClick={() => router.push("/articles")}
                      >
                        Explorer les articles
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "settings" && (
                <div className="h-full text-left max-w-2xl mx-auto space-y-8">
                  <section>
                    <div className="flex items-center gap-2 mb-4 text-aja-blue">
                      <Bell size={20} />
                      <h3 className="font-Bai_Jamjuree font-bold text-lg text-gray-900">
                        Notifications
                      </h3>
                    </div>
                    <div
                      className="bg-gray-50 rounded-xl p-5 flex items-center justify-between border border-gray-100"
                    >
                      <div>
                        <p className="font-semibold text-gray-800">
                          Nouveaux articles
                        </p>
                        <p className="text-xs md:text-sm text-gray-500 mt-1">
                          Recevoir un email lorsqu&apos;un nouvel article est
                          publié.
                        </p>
                      </div>

                      <button
                        onClick={handleNewsletterToggle}
                        disabled={loadingNewsletter}
                        className={`relative w-12 h-6 rounded-full transition-colors duration-200 ease-in-out focus:outline-none flex-shrink-0 ${newsletterEnabled ? "bg-aja-blue" : "bg-gray-300"}`}
                      >
                        <span
                          className={`block w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-200 ease-in-out ml-1 ${newsletterEnabled ? "translate-x-6" : "translate-x-0"}`}
                        />
                      </button>
                    </div>
                  </section>

                  <hr className="border-gray-100" />

                  <section>
                    <div className="flex items-center gap-2 mb-4 text-aja-blue">
                      <Lock size={20} />
                      <h3 className="font-Bai_Jamjuree font-bold text-lg text-gray-900">
                        Sécurité
                      </h3>
                    </div>
                    <Link href="/forgot-password" className="block group">
                      <div className="bg-gray-50 rounded-xl p-5 flex items-center justify-between border border-gray-100 group-hover:bg-blue-50 group-hover:border-blue-100 transition-all">
                        <div>
                          <p className="font-semibold text-gray-800">
                            Mot de passe
                          </p>
                          <p className="text-xs md:text-sm text-gray-500 mt-1">
                            Modifier ou réinitialiser votre mot de passe.
                          </p>
                        </div>
                        <ChevronRight
                          className="text-gray-400 group-hover:text-aja-blue transition-colors"
                          size={20}
                        />
                      </div>
                    </Link>
                  </section>

                  <hr className="border-gray-100" />

                  <section>
                    <div className="space-y-3">
                      <button
                        onClick={() => setLogoutPopupOpen(true)}
                        className="w-full bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                      >
                        <span className="font-medium text-sm flex items-center gap-3">
                          <LogOut size={18} /> Se déconnecter
                        </span>
                      </button>

                      <button
                        onClick={() => setDeletePopupOpen(true)}
                        className="w-full bg-white border border-red-100 rounded-xl p-4 flex items-center justify-between text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <span className="font-medium text-sm flex items-center gap-3">
                          <Trash size={18} /> Supprimer mon compte
                        </span>
                      </button>
                    </div>
                  </section>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
