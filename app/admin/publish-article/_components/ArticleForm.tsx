"use client";

import React, { useState } from "react";
import {
  ImageIcon,
  ChevronDown,
  Loader2,
  Save,
  Send,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { ArticleSchemaType } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArticleSchema } from "@/app/schema";
import submitArticleForm from "@/actions/article/article-form";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import { User } from "@/contexts/Interfaces";
import tags from "@/public/data/articletags.json";
import { useFormErrorToasts } from "@/components/FormErrorsHook";
import Image from "next/image";
import storeDraftArticle from "@/actions/article/store-draft";
import { ArticleEditor } from "./ArticleEditor";

export default function MultiStepArticleForm({ user }: { user: User | null }) {
  const [step, setStep] = useState(1);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [openTagsCategory, setOpenTagsCategory] = useState<string | null>(null);

  const user_id = user?.id;

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    watch,
    setValue,
    getValues,
  } = useForm<ArticleSchemaType>({
    resolver: zodResolver(ArticleSchema),
    defaultValues: { tags: [] },
  });

  const selectedTags = watch("tags") || [];
  const categories = {
    year: tags.filter((t) => t.type === "year"),
    player: tags.filter((t) => t.type === "player"),
    league: tags.filter((t) => t.type === "league"),
  };

  const validateStep = async (current: number) => {
    if (current === 1) {
      const result = await trigger(["title", "teaser", "slug", "author"]);
      if (!result) {
        toast.error("Veuillez remplir correctement les champs de l'étape 1");
        return false;
      }
      if (!uploadedUrl) {
        toast.error("L'image est obligatoire");
        return false;
      }
    }
    if (current === 2) {
      if (selectedTags.length === 0) {
        toast.error("Veuillez sélectionner au moins un tag");
        return false;
      }
    }
    return true;
  };

  const handleNextStep = async () => {
    const isValid = await validateStep(step);
    if (isValid) setStep(step + 1);
  };

  const jumpToStep = async (targetStep: number) => {
    if (targetStep < step) {
      setStep(targetStep);
      return;
    }
    const isValid = await validateStep(step);
    if (isValid) {
      if (targetStep === 3 && step === 1) {
        toast.error("Passez par l'étape des tags d'abord");
        setStep(2);
      } else {
        setStep(targetStep);
      }
    }
  };

  const toggleTag = (value: string) => {
    const newTags = selectedTags.includes(value)
      ? selectedTags.filter((t) => t !== value)
      : [...selectedTags, value];
    setValue("tags", newTags);
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files?.[0]) {
      const file = event.target.files[0];
      setPreviewPhoto(URL.createObjectURL(file));
      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        setUploadedUrl(data.secure_url);
        setValue("imageUrl", data.secure_url, { shouldValidate: true });
      } catch (e) {
        console.error(e);
        toast.error("Erreur d'upload");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const onSubmit = async (data: ArticleSchemaType) => {
    const response = await submitArticleForm(
      { ...data, imageUrl: uploadedUrl },
      user_id!
    );
    if (response.success) redirect("/");
  };

  useFormErrorToasts(errors);

  return (
    <div className="min-h-screen bg-gray-50/30 font-Montserrat w-full mx-auto max-w-[1000px]">
      {/* --- HEADER NAVIGATION --- */}
      <div className="sticky top-0 z-10 w-full bg-white border-b border-gray-200 shadow-sm">
        <div className="px-5 sm:px-6 h-20 sm:h-24 flex items-center justify-between">
          <div className="flex items-center gap-1 sm:gap-4">
            <nav className="flex items-center gap-1 sm:gap-2">
              {[
                { id: 1, label: "Infos" },
                { id: 2, label: "Tags" },
                { id: 3, label: "Contenu" },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => jumpToStep(s.id)}
                  className="flex items-center group"
                >
                  <div
                    className={`flex justify-center items-center gap-2 sm:px-4 sm:w-auto sm:py-2 sm:h-auto h-[35px] w-[35px] rounded-full transition-all ${
                      step === s.id
                        ? "bg-aja-blue/10 text-aja-blue"
                        : step > s.id
                          ? "text-green-600 hover:bg-green-50"
                          : "text-gray-400 hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-xs font-bold font-Montserrat uppercase">
                      {step > s.id ? <CheckCircle2 size={14} /> : `0${s.id}.`}
                    </span>
                    <span className="hidden md:block text-sm">{s.label}</span>
                  </div>
                  {s.id < 3 && <div className="ml-2 w-4 h-[1px] bg-gray-200" />}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => {
                storeDraftArticle(getValues(), user_id!);
                redirect("/admin/brouillons");
              }}
              className="p-2.5 sm:px-5 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-gray-800 transition-all font-Bai_Jamjuree flex items-center gap-2"
            >
              <Save size={18} />
              <span className="hidden md:block">Brouillon</span>
            </button>
            <button
              form="article-form"
              type="submit"
              disabled={isUploading || step !== 3}
              className={`bg-aja-blue text-white p-2.5 sm:px-8 sm:py-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-blue-100 transition-all font-Bai_Jamjuree ${step !== 3 ? "opacity-30 cursor-not-allowed" : "hover:scale-105"}`}
            >
              {isUploading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Send size={18} />
              )}
              <span className="hidden md:block">Publier</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-6 sm:mt-8">
        <form id="article-form" onSubmit={handleSubmit(onSubmit)}>
          {/* ÉTAPE 1 : INFOS */}
          {step === 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 animate-in fade-in duration-500">
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-white p-5 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
                  <h2 className="font-Bai_Jamjuree text-xl sm:text-2xl font-bold text-gray-900 border-b border-gray-100 pb-4">
                    Détails de l&apos;article
                  </h2>
                  <div className="space-y-2 text-left">
                    <label className="text-[12px] font-black uppercase text-gray-400 font-Bai_Jamjuree ml-2">
                      Titre
                    </label>
                    <input
                      {...register("title")}
                      placeholder="Ex: Le résumé de la saison..."
                      className="w-full px-4 py-3 sm:px-5 sm:py-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-aja-blue/5 focus:border-aja-blue outline-none transition-all text-sm"
                    />
                  </div>

                  <div className="space-y-2 text-left">
                    <label className="text-[12px] font-black uppercase text-gray-400 font-Bai_Jamjuree ml-2">
                      Introduction (Teaser)
                    </label>
                    <textarea
                      {...register("teaser")}
                      rows={4}
                      placeholder="Écrivez un court résumé accrocheur..."
                      className="w-full px-4 py-3 sm:px-5 sm:py-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-aja-blue/5 focus:border-aja-blue outline-none transition-all resize-none text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2 text-left">
                      <label className="text-[12px] font-black uppercase text-gray-400 font-Bai_Jamjuree ml-2">
                        Auteur
                      </label>
                      <input
                        {...register("author")}
                        className="w-full px-4 py-3 sm:px-5 sm:py-4 bg-white border border-gray-200 rounded-2xl focus:border-aja-blue outline-none transition-all text-sm"
                        placeholder="Nom"
                      />
                    </div>
                    <div className="space-y-2 text-left">
                      <label className="text-[12px] font-black uppercase text-gray-400 font-Bai_Jamjuree ml-2">
                        Slug URL
                      </label>
                      <input
                        {...register("slug")}
                        className="w-full px-4 py-3 sm:px-5 sm:py-4 bg-white border border-gray-200 rounded-2xl focus:border-aja-blue outline-none transition-all font-Montserrat text-sm"
                        placeholder="mon-slug"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="bg-white p-5 sm:p-8 rounded-3xl border border-gray-200 shadow-sm lg:sticky lg:top-32">
                  <h2 className="font-Bai_Jamjuree text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                    Bannière
                  </h2>
                  <div className="relative aspect-video w-full bg-gray-50 rounded-2xl overflow-hidden border-2 border-dashed border-gray-200 group transition-all hover:border-aja-blue">
                    {previewPhoto ? (
                      <>
                        <Image
                          src={previewPhoto}
                          fill
                          alt="Cover"
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <label
                            htmlFor="file-up"
                            className="cursor-pointer bg-white p-3 rounded-full shadow-xl"
                          >
                            <ImageIcon className="text-gray-900" />
                          </label>
                        </div>
                      </>
                    ) : (
                      <label
                        htmlFor="file-up"
                        className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer p-4 text-center"
                      >
                        <ImageIcon size={32} className="text-gray-300 mb-2" />
                        <span className="text-[12px] font-bold text-gray-400 uppercase font-Bai_Jamjuree">
                          Uploader une image
                        </span>
                      </label>
                    )}
                    <input
                      id="file-up"
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ÉTAPE 2 : TAGS */}
          {step === 2 && (
            <div className="mx-auto animate-in fade-in duration-500">
              <div className="bg-white p-5 sm:p-10 rounded-3xl border border-gray-200 shadow-sm">
                <h2 className="font-Bai_Jamjuree text-xl sm:text-2xl font-black text-gray-900 text-center mb-2">
                  Référencement (Tags)
                </h2>
                <p className="text-center text-xs sm:text-sm text-gray-500 mb-8">
                  Assignez des tags pour faciliter le référencement.
                </p>

                <div className="space-y-4">
                  {(["year", "player", "league"] as const).map((cat) => (
                    <div key={cat} className="w-full">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenTagsCategory(
                            openTagsCategory === cat ? null : cat
                          )
                        }
                        className={`w-full flex justify-between items-center p-4 sm:p-6 rounded-2xl border transition-all ${openTagsCategory === cat ? "border-aja-blue bg-aja-blue/5 shadow-sm" : "border-gray-100 hover:border-gray-200 bg-gray-50/30"}`}
                      >
                        <span className="text-xs sm:text-sm font-black uppercase text-gray-800 font-Bai_Jamjuree">
                          {cat === "year"
                            ? "Années"
                            : cat === "player"
                              ? "Joueurs"
                              : "Ligues"}
                        </span>
                        <ChevronDown
                          className={`transition-transform duration-300 ${openTagsCategory === cat ? "rotate-180 text-aja-blue" : "text-gray-400"}`}
                        />
                      </button>

                      <div
                        className={`grid transition-all duration-300 ease-in-out ${openTagsCategory === cat ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0"}`}
                      >
                        <div className="overflow-hidden">
                          <div className="flex flex-wrap gap-2 p-1">
                            {categories[cat].map((tag) => (
                              <button
                                key={tag.value}
                                type="button"
                                onClick={() => toggleTag(tag.value)}
                                className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-[10px] sm:text-[11px] font-semibold transition-all border font-Montserrat ${
                                  selectedTags.includes(tag.value)
                                    ? "bg-aja-blue border-aja-blue text-white shadow-md shadow-blue-100"
                                    : "bg-white border-gray-200 text-gray-500 hover:border-gray-400"
                                }`}
                              >
                                {tag.tag}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ÉTAPE 3 : ÉDITEUR */}
          {step === 3 && (
            <div className="bg-white p-5 sm:p-10 rounded-3xl border border-gray-200 shadow-sm animate-in fade-in duration-500">
              <div className="text-center mb-6 border-b border-gray-100 pb-6">
                <h2 className="font-Bai_Jamjuree text-xl sm:text-2xl font-black text-gray-900 mb-2">
                  Éditeur d&apos;article
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 font-Montserrat">
                  Rédigez le contenu complet de votre article.
                </p>
              </div>
              <div className="overflow-x-auto">
                <ArticleEditor />
              </div>
            </div>
          )}
        </form>

        {/* NAVIGATION BAS DE PAGE */}
        <div className="mt-8 sm:mt-12 flex justify-between items-center">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-gray-400 hover:text-aja-blue transition-all font-Bai_Jamjuree uppercase text-xs sm:text-sm"
            >
              <ArrowLeft size={18} />{" "}
              <span className="hidden xs:inline">Précédent</span>
            </button>
          ) : (
            <div />
          )}

          {step < 3 && (
            <button
              type="button"
              onClick={handleNextStep}
              className="flex items-center gap-2 sm:gap-3 px-6 sm:px-10 py-3 sm:py-4 bg-gray-900 text-white rounded-2xl font-black font-Bai_Jamjuree uppercase text-xs sm:text-sm hover:bg-aja-blue transition-all shadow-xl shadow-gray-200 group"
            >
              <span className="hidden xs:inline">Continuer</span>
              <span className="xs:hidden">Suivant</span>
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
