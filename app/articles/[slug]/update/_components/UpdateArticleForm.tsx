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
  LinkIcon,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { UpdateArticleSchemaType } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateArticleSchema } from "@/app/schema";
import { toast } from "sonner";
import updateArticleForm from "@/actions/article/update-article-form";
import { UpdateArticleFormProps } from "@/contexts/Interfaces";
import Image from "next/image";
import { useRouter } from "next/navigation";
import tags from "@/public/data/articletags.json";
import { useFormErrorToasts } from "@/components/FormErrorsHook";
import Button from "@/components/BlueButton";

export default function UpdateArticleForm({
  id_article,
  articleData,
}: UpdateArticleFormProps) {
  const router = useRouter();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState<string>(
    articleData?.imageUrl || "/_assets/img/defaultarticlebanner.png"
  );
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

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<UpdateArticleSchemaType>({
    resolver: zodResolver(UpdateArticleSchema),
    defaultValues: {
      title: "",
      slug: "",
      teaser: "",
      content: "",
      author: "",
      tags: [],
      state: "pending",
      imageUrl: "",
    },
  });

  // Reset form et preview image quand articleData change
  useEffect(() => {
    if (articleData) {
      reset(articleData);
      setPreviewPhoto(
        articleData.imageUrl || "/_assets/img/defaultarticlebanner.png"
      );
      setSelectedTags(articleData.tags || []);
    }
  }, [articleData, reset]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setPreviewPhoto(URL.createObjectURL(event.target.files[0]));
    } else {
      setSelectedFile(null);
      setPreviewPhoto("/_assets/img/defaultarticlebanner.png");
    }
  };

  const handleSubmitForm = async (data: UpdateArticleSchemaType) => {
    const finalData = { ...data, tags: selectedTags }; // <-- on envoie les tags du state

    const response = await updateArticleForm(
      id_article,
      finalData,
      selectedFile ?? undefined
    );

    if (response.success) {
      toast.success(response.message);
      router.push(`/articles/${finalData.slug}`);
    } else {
      toast.error(
        response.message ? response.message : response.errors?.[0].message
      );
    }
  };

  useFormErrorToasts(errors);

  return (
    <div className="max-w-[800px] mx-auto">
      <form
        id="publishform"
        encType="multipart/form-data"
        className="w-full"
        onSubmit={handleSubmit(handleSubmitForm)}
      >
        {/* Image */}
        <div className="relative w-full mx-auto mb-4">
          {previewPhoto && (
            <div className="w-fit mb-4 relative mx-auto">
              <Image
                width={1024}
                height={1024}
                src={previewPhoto}
                alt="Photo de l'article"
                className="w-full aspect-video object-cover"
              />
            </div>
          )}
          <input
            type="file"
            id="fileInput"
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />
          <label
            htmlFor="fileInput"
            className="mx-auto cursor-pointer underline inline-flex items-center justify-center gap-2 font-Montserrat text-aja-blue text-sm sm:text-base hover:text-orange-third hover:underline"
          >
            Modifier l&apos;image de bannière de l&apos;article ?
          </label>
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

        {/* Teaser */}
        <div className="relative w-full">
          <span className="font-semibold font-Montserrat text-sm sm:text-base flex items-center text-gray-600">
            <LinkIcon className="mr-4" />
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

        <Button type="submit" size="default">
          Je modifie l&apos;article
        </Button>
      </form>
    </div>
  );
}
