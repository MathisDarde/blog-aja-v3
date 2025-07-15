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
} from "lucide-react";
import Button from "@/components/BlueButton";
import { useForm } from "react-hook-form";
import { ArticleSchemaType } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArticleSchema } from "@/app/schema";
import { toast } from "sonner";
import updateArticleForm from "@/actions/article/update-article-form";
import { Tags, UpdateArticleFormProps } from "@/contexts/Interfaces";
import { useGlobalContext } from "@/contexts/GlobalContext";

export default function UpdateArticleForm({
  articleData,
}: UpdateArticleFormProps) {
  const { params, user_id, setModalParams } = useGlobalContext();

  const [tags, setTags] = useState<Tags[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { register, handleSubmit, formState, setValue, watch } =
    useForm<ArticleSchemaType>({
      resolver: zodResolver(ArticleSchema),
      defaultValues: articleData,
    });

  useEffect(() => {
    fetch("/data/articletags.json")
      .then((response) => response.json())
      .then((data) => setTags(data))
      .catch((error) =>
        console.error("Erreur lors du chargement des tags :", error)
      );
  }, []);

  useEffect(() => {
    if (articleData) {
      setValue("title", articleData.title);
      setValue("teaser", articleData.teaser);
      setValue("content", articleData.content);
      setValue("author", articleData.author);
      setValue("tags", articleData.tags);
    }
  }, [articleData, setValue]);

  const id_article = React.useRef<string>("");

  useEffect(() => {
    if (!params?.id) return;
    const articleId = Array.isArray(params.id) ? params.id[0] : params.id;
    id_article.current = articleId;
  }, [params?.id]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleSubmitForm = async (data: ArticleSchemaType) => {
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

    const response = await updateArticleForm(
      id_article.current,
      data,
      selectedFile
    );

    if (response.success) {
      toast.success(response.message, {
        icon: <X className="text-white" />,
        className: "bg-green-500 border border-green-200 text-white text-base",
      });
      window.location.reload();
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

  // 🔥 Fonction appelée quand on clique sur le bouton
  const onSubmitWithConfirmation = handleSubmit((data) => {
    setModalParams({
      object: "article",
      type: "edit",
      onConfirm: async () => {
        await handleSubmitForm(data);
        setModalParams(null);
      },
      onCancel: () => setModalParams(null),
    });
  });

  return (
    <div className="w-[800px] mx-auto">
      <form
        id="publishform"
        encType="multipart/form-data"
        className="w-[800px]"
      >
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

        {/* Image */}
        <div className="relative w-[800px]">
          <span className="font-semibold font-Montserrat flex items-center text-gray-600">
            <ImageIcon className="mr-4" />
            Image :
          </span>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-[800px] my-4 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
            accept="image/*"
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

        {/* Bouton de confirmation */}
        <div className="flex justify-center items-center">
          <Button type="button" onClick={onSubmitWithConfirmation}>
            Je modifie l&apos;article
          </Button>
        </div>
      </form>
    </div>
  );
}
