"use client";

import React, { useState } from "react";
import {
  Heading,
  Image as ImageIcon,
  Film,
  Folder,
  PenTool,
  Tag,
  X,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { ArticleSchemaType } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArticleSchema, DraftArticleSchema } from "@/app/schema";
import submitArticleForm from "@/actions/article/article-form";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import storeDraftArticle from "@/actions/article/store-draft";
import { Tags, User } from "@/contexts/Interfaces";
import tags from "@/public/data/articletags.json";
import { useFormErrorToasts } from "@/components/FormErrorsHook";

export default function ArticleForm({ user }: { user: User | null }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const user_id = user?.id;

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ArticleSchemaType>({
    resolver: zodResolver(ArticleSchema),
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleSubmitForm = async (data: ArticleSchemaType) => {
    if (!selectedFile) {
      toast.error("Veuillez sélectionner une image !");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);

    Object.entries(data).forEach(([key, value]) => {
      formData.append(
        key,
        Array.isArray(value) ? JSON.stringify(value) : value
      );
    });
    if (!user_id) {
      toast.error(
        "L'ID de l'utilisateur n'est pas défini. Veuillez vous connecter."
      );
      return;
    }
    const response = await submitArticleForm(data, selectedFile, user_id);

    if (response.success) {
      redirect("/");
    } else {
      toast.error(
        response.message ? response.message : response.errors?.[0].message,
        {
          icon: <X className="text-white" />,
          className: "bg-red-500 border border-red-200 text-white text-base",
        }
      );
    }
  };

  const storeBrouillon = async () => {
    const rawData = getValues();

    const normalizedDraftData = {
      ...rawData,
      tags: Array.isArray(rawData.tags)
        ? rawData.tags
        : rawData.tags
        ? [rawData.tags]
        : [],
    };

    const parsed = DraftArticleSchema.safeParse(normalizedDraftData);

    if (!parsed.success) {
      console.error("Validation Error:", parsed.error.format());
      toast.error("Erreur de validation du brouillon.");
      return;
    }

    if (!user_id) {
      toast.error(
        "L'ID de l'utilisateur n'est pas défini. Veuillez vous connecter."
      );
      return;
    }

    const response = await storeDraftArticle(
      parsed.data,
      user_id,
      selectedFile || undefined
    );

    if (response.success) {
      redirect("/admin/brouillons");
    } else {
      toast.error(response.message || response.errors?.[0].message, {
        icon: <X className="text-white" />,
        className: "bg-red-500 border border-red-200 text-white text-base",
      });
    }
  };

  useFormErrorToasts(errors);

  return (
    <div className="max-w-[800px] mx-auto">
      <form
        id="publishform"
        encType="multipart/form-data"
        onSubmit={handleSubmit(handleSubmitForm)}
      >
        <div className="relative w-full mx-auto">
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

        <div className="relative w-full mx-auto">
          <span className="font-semibold font-Montserrat text-sm sm:text-base flex items-center text-gray-600">
            <ImageIcon className="mr-4" />
            Image :
          </span>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full my-3 sm:my-4 py-3 sm:py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-xs sm:text-sm"
            accept="image/*"
          />
        </div>

        <div className="relative w-full mx-auto">
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

        <div className="relative w-full mx-auto">
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

        <div className="relative w-full mx-auto">
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

        <div className="relative w-full">
          <span className="font-semibold font-Montserrat text-sm sm:text-base flex items-center text-gray-600">
            <Tag className="mr-4" />
            Tags :
          </span>
          <div className="w-full bg-white rounded-2xl text-left border border-gray-600 my-4 p-4 grid grid-cols-2 lg:grid-cols-3 gap-4">
            {tags.map((category: Tags) => (
              <div
                key={category.value}
                className="relative cursor-pointer flex items-center"
              >
                <input
                  type="checkbox"
                  {...register("tags")}
                  id={`checkbox-${category.value}`}
                  value={category.value}
                  className="mx-2 accent-aja-blue"
                />
                <label
                  htmlFor={`checkbox-${category.value}`}
                  className="cursor-pointer font-Montserrat text-xs sm:text-base"
                >
                  {category.tag}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row justify-center items-center">
          <button
            type="button"
            className="justify-center items-center bg-gray-500 inline-flex px-6 py-3 rounded-full font-Montserrat text-white text-sm sm:text-base"
            onClick={storeBrouillon}
          >
            Je sauvgarde le brouillon
          </button>
          <button
            type="submit"
            className="justify-center items-center bg-aja-blue inline-flex px-6 py-3 rounded-full font-Montserrat text-white text-sm sm:text-base"
          >
            Je publie l&apos;article
          </button>
        </div>
      </form>
    </div>
  );
}
