"use client";

import submitMethodeSaisonForm from "@/actions/methode-saison-form";
import { MethodeSaisonSchema } from "@/app/schema";
import Button from "@/components/BlueButton";
import { authClient } from "@/lib/auth-client";
import { MethodeSaisonSchemaType } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  WholeWord,
  X,
  Plus,
  Trash,
  ImageIcon,
  BookCheck,
  ChartBarBig,
  Clock4,
  ArrowLeftRight,
} from "lucide-react";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

const session = await authClient.getSession();
const id = session?.data?.user.id || null;

export default function SaisonForm() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<MethodeSaisonSchemaType>({
    resolver: zodResolver(MethodeSaisonSchema),
    defaultValues: {
      keywords: [{ value: "" }],
      remplacants: [[""]],
      saison: "",
      coach: "",
      systeme: "",
    },
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const {
    fields: keywordsfield,
    append: appendkeywords,
    remove: removekeywords,
  } = useFieldArray<MethodeSaisonSchemaType, "keywords">({
    control,
    name: "keywords",
  });
  const {
    fields: remplacantsfield,
    append: appendremplacants,
    remove: removeremplacants,
  } = useFieldArray<MethodeSaisonSchemaType, "remplacants">({
    control,
    name: "remplacants",
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleSubmitForm = async (data: MethodeSaisonSchemaType) => {
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

    const response = await submitMethodeSaisonForm(
      data,
      selectedFile,
      id || ""
    );

    if (response.success) {
      redirect("/");
    } else {
      toast.error(
        response.message || response.errors?.[0]?.message || "Erreur inconnue",
        {
          icon: <X className="text-white" />,
          className: "bg-red-500 border border-red-200 text-white text-base",
        }
      );
    }
  };

  useEffect(() => {
    Object.values(errors).forEach((error) => {
      if (error && "message" in error) {
        toast.error(error.message as string, {
          icon: <X className="text-white" />,
          className: "bg-red-500 border border-red-200 text-white text-base",
        });
      }
    });
  }, [errors]);

  return (
    <div className="w[600px] mx-auto">
      <form
        method="POST"
        id="methodesaisonform"
        className="w-[600px]"
        onSubmit={handleSubmit(handleSubmitForm)}
      >
        <div className="relative w-[600px]">
          <span className="font-semibold font-Montserrat text-gray-600 flex items-center mb-2">
            <WholeWord className="mr-4" />
            Mots-clés :
          </span>

          {keywordsfield.map((field, index) => (
            <div key={field.id} className="flex items-center mb-2 gap-2">
              <input
                type="text"
                placeholder={`Mot clé ${index + 1} (ex: saison 2020-2021)`}
                {...register(`keywords.${index}.value`)}
                className="flex-1 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
              />
              {keywordsfield.length > 1 && (
                <button
                  type="button"
                  onClick={() => removekeywords(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash size={18} />
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={() => appendkeywords({ value: "" })}
            className="mx-auto flex items-center justify-center gap-2 text-aja-blue"
          >
            <Plus size={18} />
            Ajouter un mot-clé
          </button>
        </div>

        <div className="relative w-[600px]">
          <span className="font-semibold font-Montserrat text-gray-600 flex items-center mb-2">
            <Clock4 className="mr-4" />
            Saison :
          </span>
          <input
            type="text"
            {...register("saison")}
            className="w-w-600 my-4 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
            placeholder="Saison (ex: 2020-2021)"
          />
        </div>

        <div className="relative w-[600px]">
          <span className="font-semibold font-Montserrat text-gray-600 flex items-center mb-2">
            <ImageIcon className="mr-4" />
            Image du terrain :
          </span>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-w-600 my-4 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
            accept="image/*"
          />
        </div>

        <div className="relative w-[600px]">
          <span className="font-semibold font-Montserrat text-gray-600 flex items-center mb-2">
            <BookCheck className="mr-4" />
            Coach :
          </span>
          <input
            type="text"
            {...register("coach")}
            className="w-w-600 my-4 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
            placeholder="Coach (ex: Jean-Marc Furlan)"
          />
        </div>

        <div className="relative w-[600px]">
          <span className="font-semibold font-Montserrat text-gray-600 flex items-center mb-2">
            <ChartBarBig className="mr-4" />
            Système :
          </span>
          <input
            type="text"
            {...register("systeme")}
            className="w-w-600 my-4 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
            placeholder="Système (ex: 4-3-3)"
          />
        </div>

        <div className="relative w-[600px] mb-4">
          <span className="font-semibold font-Montserrat text-gray-600 flex items-center mb-2">
            <ArrowLeftRight className="mr-4" />
            Remplaçants :
          </span>

          {remplacantsfield.map((field, index) => (
            <div key={field.id} className="flex gap-2 mb-2 w-full">
              <input
                type="text"
                {...register(`remplacants.${index}.0`)}
                placeholder="Nom (ex: Gaëtan Perrin)"
                className="py-2 px-4 border rounded"
              />
              <input
                type="text"
                {...register(`remplacants.${index}.1`)}
                placeholder="URL du drapeau (/_assets/flags/...)"
                className="py-2 px-4 border rounded"
              />
              <input
                type="text"
                {...register(`remplacants.${index}.2`)}
                placeholder="Poste (ex: G ou Gardien)"
                className="py-2 px-4 border rounded w-[125px]"
              />
              <button
                type="button"
                onClick={() => removeremplacants(index)}
                className="text-red-500"
              >
                <Trash size={18} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => appendremplacants([""])}
            className="mx-auto flex items-center justify-center gap-2 text-aja-blue"
          >
            <Plus size={18} />
            Ajouter un remplaçant
          </button>
        </div>

        <div className="flex justify-center items-center">
          <Button type="submit">Je publie cette méthode</Button>
        </div>
      </form>
    </div>
  );
}
