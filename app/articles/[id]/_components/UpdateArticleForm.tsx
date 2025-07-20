"use client";

import React, { useEffect, useState } from "react";
import { Heading, Film, Folder, PenTool, Tag, X, Cctv } from "lucide-react";
import Button from "@/components/BlueButton";
import { useForm } from "react-hook-form";
import { UpdateArticleSchemaType } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateArticleSchema } from "@/app/schema";
import { toast } from "sonner";
import updateArticleForm from "@/actions/article/update-article-form";
import { Tags, UpdateArticleFormProps } from "@/contexts/Interfaces";
import { useGlobalContext } from "@/contexts/GlobalContext";
import Image from "next/image";

export default function UpdateArticleForm({
  articleData,
}: UpdateArticleFormProps) {
  const { router, params, user_id } = useGlobalContext();

  const [tags, setTags] = useState<Tags[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState<string>(
    articleData.imageUrl || "/_assets/img/pdpdebase.png"
  );

  const { register, handleSubmit, formState, setValue, watch, reset } =
    useForm<UpdateArticleSchemaType>({
      resolver: zodResolver(UpdateArticleSchema),
      defaultValues: {
        title: "",
        teaser: "",
        content: "",
        author: "",
        tags: [],
        state: "pending",
        imageUrl: "",
      },
    });

  useEffect(() => {
    if (articleData) {
      reset(articleData);
      setPreviewPhoto(articleData.imageUrl || "/_assets/img/pdpdebase.png");
    }
  }, [articleData, reset]);

  useEffect(() => {
    fetch("/data/articletags.json")
      .then((response) => response.json())
      .then((data) => setTags(data))
      .catch((error) =>
        console.error("Erreur lors du chargement des tags :", error)
      );
  }, []);

  const id_article = React.useRef<string>("");

  useEffect(() => {
    if (!params?.id) return;
    const articleId = Array.isArray(params.id) ? params.id[0] : params.id;
    id_article.current = articleId;
  }, [params?.id]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setPreviewPhoto(URL.createObjectURL(event.target.files[0]));
    } else {
      setSelectedFile(null);
      setPreviewPhoto("/_assets/img/pdpdebase.png");
    }
  };

  const handleSubmitForm = async (data: UpdateArticleSchemaType) => {
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

    const response = await updateArticleForm(
      id_article.current,
      data,
      selectedFile ?? undefined
    );

    if (response.success) {
      toast.success(response.message, {
        icon: <X className="text-white" />,
        className: "bg-green-500 border border-green-200 text-white text-base",
      });
      router.push(`/articles/${id_article.current}`);
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

  useEffect(() => {
    Object.values(formState.errors).forEach((error) => {
      if (error && "message" in error) {
        toast.error(error.message as string, {
          icon: <X className="text-white" />,
          className: "bg-red-500 border border-red-200 text-white text-base",
        });
      }
    });
  }, [formState.errors]);

  const watchedTags = watch("tags") || [];

  return (
    <div className="w-[800px] mx-auto">
      <form
        id="publishform"
        encType="multipart/form-data"
        className="w-[800px]"
        onSubmit={handleSubmit(handleSubmitForm)}
      >
        {/* Image */}
        <div className="relative w-[800px] mx-auto">
          {previewPhoto && (
            <div className="w-fit mb-4 relative mx-auto">
              <Image
                width={1024}
                height={1024}
                src={previewPhoto || "/_assets/img/pdpdebase.png"}
                alt="Photo de l'article"
                className="w-full aspect-video object-cover mr-4"
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
            className="underline text-aja-blue font-Montserrat cursor-pointer"
          >
            Modifier l&apos;image de bannière de l&apos;article ?
          </label>
        </div>

        {/* Titre */}
        <div className="relative w-[800px]">
          <span className="font-semibold font-Montserrat flex items-center text-gray-600">
            <Heading className="mr-4" />
            Titre :
          </span>
          <input
            type="text"
            {...register("title")}
            className="w-[800px] my-4 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
            placeholder="Titre de l'article"
          />
        </div>

        {/* Teaser */}
        <div className="relative w-[800px]">
          <span className="font-semibold font-Montserrat flex items-center text-gray-600">
            <Film className="mr-4" />
            Teaser :
          </span>
          <input
            type="text"
            {...register("teaser")}
            className="w-[800px] my-4 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
            placeholder="Teaser de l'article"
          />
        </div>

        {/* Contenu */}
        <div className="relative w-[800px]">
          <span className="font-semibold font-Montserrat flex items-center text-gray-600">
            <Folder className="mr-4" />
            Contenu de l&apos;article :
          </span>
          <textarea
            {...register("content")}
            rows={20}
            className="w-[800px] h-auto my-4 pt-4 py-3 px-6 rounded-2xl border border-gray-600 font-Montserrat text-sm"
            placeholder="Contenu de l'article"
          ></textarea>
        </div>

        {/* Auteur */}
        <div className="relative w-[800px]">
          <span className="font-semibold font-Montserrat flex items-center text-gray-600">
            <PenTool className="mr-4" />
            Auteur :
          </span>
          <input
            type="text"
            {...register("author")}
            className="w-[800px] my-4 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
            placeholder="Nom de l'auteur"
          />
        </div>

        {/* Tags */}
        <div className="relative w-[800px]">
          <span className="font-semibold font-Montserrat flex items-center text-gray-600">
            <Tag className="mr-4" />
            Tags :
          </span>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "16px",
            }}
            className="w-[800px] bg-white rounded-2xl border border-gray-600 my-4 p-4"
          >
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
                  checked={watchedTags.includes(category.value)}
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    const value = category.value;

                    let updatedTags = [...watchedTags];
                    if (isChecked) {
                      updatedTags.push(value);
                    } else {
                      updatedTags = updatedTags.filter((tag) => tag !== value);
                    }
                    setValue("tags", updatedTags);
                  }}
                  className="mx-2 accent-aja-blue"
                />
                <label
                  htmlFor={`checkbox-${category.value}`}
                  className="cursor-pointer font-Montserrat"
                >
                  {category.tag}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Statut */}
        <div className="relative w-[800px]">
          <span className="font-semibold font-Montserrat flex items-center text-gray-600">
            <Cctv className="mr-4" />
            Statut :
          </span>
          <select
            {...register("state")}
            className="w-[800px] my-4 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
            value={watch("state")}
          >
            <option value="published">Published</option>
            <option value="pending">Pending</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {/* Bouton de confirmation */}
        <div className="flex justify-center items-center">
          <Button type="submit">Je modifie l&apos;article</Button>
        </div>
      </form>
    </div>
  );
}
