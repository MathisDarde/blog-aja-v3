"use client";

import React, { useEffect, useState } from "react";
import {
  Heading,
  Film,
  Folder,
  PenTool,
  Tag,
  Cctv,
  ChevronUp,
  ChevronDown,
  ImageIcon,
  Loader2,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { UpdateArticleSchemaType } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateArticleSchema } from "@/app/schema";
import { toast } from "sonner";
import updateArticleForm from "@/actions/article/update-article-form";
import { UpdateBrouillonFormProps } from "@/contexts/Interfaces";
import updateBrouillonForm from "@/actions/article/update-brouillon-form";
import tags from "@/public/data/articletags.json";
import { useFormErrorToasts } from "@/components/FormErrorsHook";
import { redirect } from "next/navigation";
import Button from "@/components/BlueButton";
import Image from "next/image";

export default function UpdateBrouillonForm({
  articleData,
  id_article,
  user,
}: UpdateBrouillonFormProps) {
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>(
    (articleData?.tags ?? []).filter((t): t is string => typeof t === "string")
  );
  const [openTagsCategory, setOpenTagsCategory] = useState<string | null>(null);

  const toggleCategory = (category: string) => {
    setOpenTagsCategory(openTagsCategory === category ? null : category);
  };

  const categories = {
    year: tags.filter((t) => t.type === "year"),
    player: tags.filter((t) => t.type === "player"),
    league: tags.filter((t) => t.type === "league"),
  };

  const user_id = user?.id;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
    getValues,
  } = useForm<UpdateArticleSchemaType>({
    resolver: zodResolver(UpdateArticleSchema),
    defaultValues: articleData,
  });

  useEffect(() => {
    if (articleData) {
      setValue("title", articleData.title || "");
      setValue("slug", articleData.slug || "");
      setValue("teaser", articleData.teaser || "");
      setValue("content", articleData.content || "");
      setValue("author", articleData.author || "");
      setValue(
        "tags",
        (articleData.tags ?? []).filter(
          (t): t is string => typeof t === "string"
        )
      );
    }
  }, [articleData, setValue]);

  useEffect(() => {
    if (articleData) {
      reset(articleData);

      const img = articleData.imageUrl;
      let createdUrl: string | null = null;

      if (typeof img === "string") {
        setPreviewPhoto(img);
      } else if (img instanceof File) {
        createdUrl = URL.createObjectURL(img);
        setPreviewPhoto(createdUrl);
      }

      setSelectedTags(
        (articleData.tags ?? []).filter(
          (t): t is string => typeof t === "string"
        )
      );

      return () => {
        if (createdUrl) {
          URL.revokeObjectURL(createdUrl);
        }
      };
    }
  }, [articleData, reset]);

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      throw error;
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setPreviewPhoto(URL.createObjectURL(file));

      // Upload immédiatement vers Cloudinary
      setIsUploading(true);
      try {
        const url = await uploadToCloudinary(file);
        setUploadedUrl(url);

        setValue("imageUrl", url, { shouldValidate: true });
        toast.success("Image uploadée avec succès !");
      } catch (error) {
        console.error(error);
        toast.error("Erreur lors de l'upload de l'image");
        setPreviewPhoto(null);
      } finally {
        setIsUploading(false);
      }
    } else {
      setPreviewPhoto(null);
      setUploadedUrl("");
    }
  };

  const handlePublishForm = async (data: UpdateArticleSchemaType) => {
    if (!uploadedUrl) {
      toast.error(
        "Veuillez sélectionner une image et attendre qu'elle soit uploadée !"
      );
      return;
    }

    const finalData = { ...data, image: uploadedUrl };

    if (!user_id) {
      toast.error(
        "L'ID de l'utilisateur n'est pas défini. Veuillez vous connecter."
      );
      return;
    }

    // On envoie directement l'URL Cloudinary au lieu du fichier
    const response = await updateArticleForm(user_id, finalData);

    if (response.success) {
      redirect("/");
    } else {
      toast.error(
        response.message ? response.message : response.errors?.[0].message
      );
    }
  };

  const handleSaveForm = async () => {
    const data = { ...getValues(), tags: selectedTags };

    if (uploadedUrl) {
      data.imageUrl = uploadedUrl; // override seulement si nouvelle image
    }

    if (!user_id) {
      toast.error(
        "L'ID de l'utilisateur n'est pas défini. Veuillez vous connecter."
      );
      return;
    }

    const response = await updateBrouillonForm(id_article, data);

    if (response.success) {
      toast.success(response.message);
      redirect("/admin/brouillons");
    } else {
      toast.error(
        response.message ? response.message : response.errors?.[0].message
      );
    }
  };

  useFormErrorToasts(errors);

  return (
    <div className="max-w-[800px] mx-auto">
      <h1 className="font-bold font-Bai_Jamjuree text-center uppercase text-xl sm:text-3xl mb-10 flex items-center justify-center gap-3 cursor-pointer">
        Formulaire de modification de brouillon
      </h1>
      <form id="publishform" encType="multipart/form-data" className="w-full">
        <div className="relative w-full mx-auto mb-4">
          {/* SI PAS DE PHOTO → afficher l'input */}
          {!previewPhoto ? (
            <div>
              <span className="font-semibold font-Montserrat text-sm sm:text-base flex items-center text-gray-600">
                <ImageIcon className="mr-4" />
                Image :
              </span>
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full my-3 sm:my-4 py-3 sm:py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-xs sm:text-sm"
                accept="image/*"
                disabled={isUploading}
              />
            </div>
          ) : (
            <>
              {/* SI PHOTO → l'afficher */}
              <div className="w-fit mb-4 relative mx-auto">
                <Image
                  width={1024}
                  height={1024}
                  src={previewPhoto}
                  alt="Photo de l'article"
                  className="w-full aspect-video object-cover rounded-xl"
                />
                {isUploading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-xl">
                    <Loader2 className="w-12 h-12 text-white animate-spin" />
                  </div>
                )}
              </div>

              {/* input hidden permanent */}
              <input
                type="file"
                id="fileInput"
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
                disabled={isUploading}
              />

              {/* Bouton pour changer l'image */}
              <label
                htmlFor="fileInput"
                className={`cursor-pointer underline inline-flex items-center justify-center gap-2 font-Montserrat text-aja-blue text-sm sm:text-base hover:text-orange-third hover:underline mx-auto ${
                  isUploading ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                {isUploading
                  ? "Upload en cours..."
                  : "Modifier l'image de bannière"}
              </label>
            </>
          )}
        </div>

        {/* Titre */}
        <div className="relative w-full">
          <span className="font-semibold font-Montserrat text-sm sm:text-base flex items-center text-gray-600">
            <Heading className="mr-4" />
            Titre :
          </span>
          <input
            type="text"
            {...register("title")}
            className="w-full my-3 sm:my-4 py-3 sm:py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-xs sm:text-sm"
            placeholder="Titre de l'article"
          />
        </div>

        {/* Slug */}
        <div className="relative w-full">
          <span className="font-semibold font-Montserrat text-sm sm:text-base flex items-center text-gray-600">
            <Film className="mr-4" />
            Slug de l&apos;URL :
          </span>
          <input
            type="text"
            {...register("slug")}
            className="w-full my-3 sm:my-4 py-3 sm:py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-xs sm:text-sm"
            placeholder="Slug de l'article"
          />
        </div>

        {/* Teaser */}
        <div className="relative w-full">
          <span className="font-semibold font-Montserrat text-sm sm:text-base flex items-center text-gray-600">
            <Film className="mr-4" />
            Teaser :
          </span>
          <input
            type="text"
            {...register("teaser")}
            className="w-full my-3 sm:my-4 py-3 sm:py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-xs sm:text-sm"
            placeholder="Teaser de l'article"
          />
        </div>

        {/* Contenu */}
        <div className="relative w-full">
          <span className="font-semibold font-Montserrat text-sm sm:text-base flex items-center text-gray-600">
            <Folder className="mr-4" />
            Contenu de l&apos;article :
          </span>
          <textarea
            {...register("content")}
            rows={20}
            className="w-full h-auto my-3 sm:my-4 pt-4 py-3 px-6 rounded-2xl border border-gray-600 font-Montserrat text-xs sm:text-sm"
            placeholder="Contenu de l'article"
          ></textarea>
        </div>

        {/* Auteur */}
        <div className="relative w-full">
          <span className="font-semibold font-Montserrat text-sm sm:text-base flex items-center text-gray-600">
            <PenTool className="mr-4" />
            Auteur :
          </span>
          <input
            type="text"
            {...register("author")}
            className="w-full my-3 sm:my-4 py-3 sm:py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-xs sm:text-sm"
            placeholder="Nom de l'auteur"
          />
        </div>

        {/* Tags */}
        <div className="relative w-full">
          <span className="font-semibold font-Montserrat text-sm sm:text-base flex items-center text-gray-600">
            <Tag className="mr-4" />
            Tags :
          </span>

          {(["year", "player", "league"] as const).map((type) => (
            <div key={type} className="border border-gray-600 rounded-2xl my-4">
              <button
                type="button"
                onClick={() => toggleCategory(type)}
                className="w-full flex justify-between items-center px-4 py-3 text-left font-Montserrat text-sm sm:text-base"
              >
                {type === "year"
                  ? "Années"
                  : type === "player"
                    ? "Joueurs"
                    : "Ligues"}
                {openTagsCategory === type ? <ChevronUp /> : <ChevronDown />}
              </button>

              {openTagsCategory === type && (
                <div className="px-4 pb-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {categories[type].map((tag) => (
                    <label
                      key={tag.value}
                      className="flex items-center text-xs sm:text-sm font-Montserrat"
                    >
                      <input
                        type="checkbox"
                        value={tag.value}
                        checked={selectedTags.includes(tag.value)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedTags([...selectedTags, tag.value]);
                          } else {
                            setSelectedTags(
                              selectedTags.filter((t) => t !== tag.value)
                            );
                          }
                        }}
                        className="mr-2 accent-orange-third"
                      />
                      {tag.tag}
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Statut */}
        <div className="relative w-full">
          <span className="font-semibold font-Montserrat text-sm sm:text-base flex items-center text-gray-600">
            <Cctv className="mr-4" />
            Statut :
          </span>
          <select
            {...register("state")}
            className="w-full my-3 sm:my-4 py-3 sm:py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-xs sm:text-sm"
            value={watch("state")}
          >
            <option value="published">Published</option>
            <option value="pending">Pending</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row justify-center items-center">
          <Button
            type="button"
            className="bg-gray-500 m-0"
            onClick={handleSaveForm}
          >
            Je sauvegarde l&apos;article
          </Button>

          <Button
            type="button"
            size="default"
            className="m-0"
            onClick={handleSubmit(handlePublishForm)}
          >
            Je publie l&apos;article
          </Button>
        </div>
      </form>
    </div>
  );
}
