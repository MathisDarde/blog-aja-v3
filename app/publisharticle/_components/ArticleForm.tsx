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
import { ArticleSchema, DraftArticleSchema } from "@/app/schema";
import submitArticleForm from "@/actions/article/article-form";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import storeDraftArticle from "@/actions/article/store-draft";
import { Tags } from "@/contexts/Interfaces";
import { useGlobalContext } from "@/contexts/GlobalContext";

function ArticleForm() {
  const { user_id } = useGlobalContext();
  const [tags, setTags] = useState([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetch("/data/articletags.json")
      .then((response) => response.json())
      .then((data) => setTags(data))
      .catch((error) =>
        console.error("Erreur lors du chargement des tags :", error)
      );
  }, []);

  const { register, handleSubmit, formState, getValues } =
    useForm<ArticleSchemaType>({
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

    console.log("Normalized Draft Data:", normalizedDraftData);

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
      redirect("/brouillons");
    } else {
      toast.error(response.message || response.errors?.[0].message, {
        icon: <X className="text-white" />,
        className: "bg-red-500 border border-red-200 text-white text-base",
      });
    }
  };

  useEffect(() => {
    Object.values(formState.errors).forEach((error) => {
      if (error && "message" in error) {
        toast.error(error.message as string, {
          icon: <X className="text-white" />,
          className:
            "bg-red-500 !important border border-red-200 text-white text-base",
        });
      }
    });
  }, [formState.errors]);

  return (
    <div className="w-[800px] mx-auto">
      <form
        id="publishform"
        encType="multipart/form-data"
        onSubmit={handleSubmit(handleSubmitForm)}
      >
        <div className="relative w-[800px] mx-auto">
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

        <div className="relative w-[800px] mx-auto">
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

        <div className="relative w-[800px] mx-auto">
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

        <div className="relative w-[800px] mx-auto">
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

        <div className="relative w-[800px] mx-auto">
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

        <div className="flex justify-center items-center">
          <Button
            type="button"
            className="bg-gray-400 border-0 hover:border-none hover:bg-gray-500 hover:text-white"
            onClick={storeBrouillon}
          >
            Sauvegarder le brouillon
          </Button>
          <Button type="submit">Je publie l&apos;article</Button>
        </div>
      </form>
    </div>
  );
}

export default ArticleForm;
