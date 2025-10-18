"use client";

import React, { useEffect, useState } from "react";
import {
  Heading,
  Image as ImageIcon,
  Film,
  Folder,
  PenTool,
  Tag,
  X,
  Cctv,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { UpdateArticleSchemaType } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArticleSchema } from "@/app/schema";
import { toast } from "sonner";
import updateArticleForm from "@/actions/article/update-article-form";
import { UpdateBrouillonFormProps } from "@/contexts/Interfaces";
import updateBrouillonForm from "@/actions/article/update-brouillon-form";
import tags from "@/public/data/articletags.json";
import { useFormErrorToasts } from "@/components/FormErrorsHook";
import { redirect } from "next/navigation";
import Button from "@/components/BlueButton";

export default function UpdateBrouillonForm({
  articleData,
  id_article,
  user,
}: UpdateBrouillonFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>(
    articleData?.tags || []
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
    getValues,
  } = useForm<UpdateArticleSchemaType>({
    resolver: zodResolver(ArticleSchema),
    defaultValues: articleData,
  });

  useEffect(() => {
    if (articleData) {
      setValue("title", articleData.title);
      setValue("teaser", articleData.teaser);
      setValue("content", articleData.content);
      setValue("author", articleData.author);
      setValue("tags", articleData.tags);
    }
  }, [articleData, setValue]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handlePublishForm = async (data: UpdateArticleSchemaType) => {
    const formData = new FormData();

    if (selectedFile) {
      formData.append("image", selectedFile);
    }

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

    if (!selectedFile) {
      toast.error("Veuillez sélectionner un fichier avant de soumettre.");
      return;
    }

    const response = await updateArticleForm(id_article, data, selectedFile);

    if (response.success) {
      toast.success(response.message);
      window.location.reload();
    } else {
      toast.error(
        response.message ? response.message : response.errors?.[0].message
      );
    }
  };

  const handleSaveForm = async () => {
    const data = { ...getValues(), tags: selectedTags }; // <-- sync tags

    const formData = new FormData();

    if (selectedFile) {
      formData.append("image", selectedFile);
    }

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

    const response = await updateBrouillonForm(
      id_article,
      data,
      selectedFile ?? undefined
    );

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

        {/* Image */}
        <div className="relative w-full">
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
