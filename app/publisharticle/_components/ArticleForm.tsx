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
import submitArticleForm from "@/actions/article-form";
import { redirect } from "next/navigation";
import { toast } from "sonner";

interface Tags {
  tag: string;
  value: string;
  img: string;
  type: string;
}

function ArticleForm() {
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

  const { register, handleSubmit } = useForm<ArticleSchemaType>({
    resolver: zodResolver(ArticleSchema),
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
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

    const response = await submitArticleForm(data, selectedFile);

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

  return (
    <div className="w-w-600 mx-auto">
      <form
        id="publishform"
        encType="multipart/form-data"
        className="w-w-600"
        onSubmit={handleSubmit(handleSubmitForm)}
      >
        <div className="relative w-w-600">
          <span className="font-semibold font-Montserrat flex items-center text-gray-600">
            <Heading className="mr-4" />
            Titre :
          </span>
          <input
            type="text"
            {...register("title")}
            className="w-w-600 my-4 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
            placeholder="Titre de l'article"
          />
        </div>

        <div className="relative w-w-600">
          <span className="font-semibold font-Montserrat flex items-center text-gray-600">
            <ImageIcon className="mr-4" />
            Image :
          </span>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-w-600 my-4 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
            accept="image/*"
          />
        </div>

        <div className="relative w-w-600">
          <span className="font-semibold font-Montserrat flex items-center text-gray-600">
            <Film className="mr-4" />
            Teaser :
          </span>
          <input
            type="text"
            {...register("teaser")}
            className="w-w-600 my-4 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
            placeholder="Teaser de l'article"
          />
        </div>

        <div className="relative w-w-600">
          <span className="font-semibold font-Montserrat flex items-center text-gray-600">
            <Folder className="mr-4" />
            Contenu de l&apos;article :
          </span>
          <textarea
            {...register("content")}
            className="w-w-600 h-auto my-4 pt-4 pb-64 px-6 rounded-2xl border border-gray-600 font-Montserrat text-sm"
            placeholder="Contenu de l'article"
          ></textarea>
        </div>

        <div className="relative w-w-600">
          <span className="font-semibold font-Montserrat flex items-center text-gray-600">
            <PenTool className="mr-4" />
            Auteur :
          </span>
          <input
            type="text"
            {...register("author")}
            className="w-w-600 my-4 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
            placeholder="Nom de l'auteur"
          />
        </div>

        <div className="relative w-w-600">
          <span className="font-semibold font-Montserrat flex items-center text-gray-600">
            <Tag className="mr-4" />
            Tags :
          </span>
          <div
            style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}
            className="w-w-600 bg-white rounded-2xl border border-gray-600 my-4"
          >
            {tags.map((category: Tags) => (
              <div
                key={category.value}
                className="relative pl-2 cursor-pointer flex items-center"
              >
                <input
                  type="checkbox"
                  {...register("tags")}
                  value={category.value}
                  className="my-4 mx-2"
                />
                <label htmlFor={`checkbox`} className="cursor-pointer">
                  {category.tag}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center items-center">
          <Button type="submit">Je publie l&apos;article</Button>
        </div>
      </form>
    </div>
  );
}

export default ArticleForm;
