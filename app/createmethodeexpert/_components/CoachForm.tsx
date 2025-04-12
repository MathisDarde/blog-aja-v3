"use client";

import submitMethodeCoachForm from "@/actions/methode-coach-form";
import { MethodeCoachSchema } from "@/app/schema";
import Button from "@/components/BlueButton";
import { authClient } from "@/lib/auth-client";
import { MethodeCoachSchemaType } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  WholeWord,
  X,
  Plus,
  Trash,
  ImageIcon,
  FolderPen,
  ShieldHalf,
  Trophy,
  ChartBarIncreasing,
} from "lucide-react";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

const session = await authClient.getSession();
const id = session?.data?.user.id || null;

export default function CoachForm() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<MethodeCoachSchemaType>({
    resolver: zodResolver(MethodeCoachSchema),
    defaultValues: {
      keywords: [{ value: "" }],
      clubscoach: [[""]],
      palmares: [[""]],
      nomcoach: "",
      statistiques: "",
    },
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    fields: keywordsfield,
    append: appendkeywords,
    remove: removekeywords,
  } = useFieldArray<MethodeCoachSchemaType, "keywords">({
    control,
    name: "keywords",
  });
  const {
    fields: clubsfield,
    append: appendclubs,
    remove: removeclubs,
  } = useFieldArray<MethodeCoachSchemaType, "clubscoach">({
    control,
    name: "clubscoach",
  });
  const {
    fields: palmaresfield,
    append: appendpalmares,
    remove: removepalmares,
  } = useFieldArray<MethodeCoachSchemaType, "palmares">({
    control,
    name: "palmares",
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleSubmitForm = async (data: MethodeCoachSchemaType) => {
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

    const response = await submitMethodeCoachForm(data, selectedFile, id || "");

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
                placeholder={`Mot clé ${index + 1} (ex: Guy Roux)`}
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
            <FolderPen className="mr-4" />
            Nom du coach :
          </span>
          <input
            type="text"
            {...register("nomcoach")}
            className="w-w-600 my-4 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
            placeholder="Nom du joueur (ex: Guy Roux)"
          />
        </div>

        <div className="relative w-[600px]">
          <span className="font-semibold font-Montserrat text-gray-600 flex items-center mb-2">
            <ImageIcon className="mr-4" />
            Photo du coach :
          </span>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-w-600 my-4 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
            accept="image/*"
          />
        </div>

        <div className="relative w-[600px] mb-4">
          <span className="font-semibold font-Montserrat text-gray-600 flex items-center mb-2">
            <ShieldHalf className="mr-4" />
            Clubs :
          </span>

          {clubsfield.map((field, index) => (
            <div key={field.id} className="flex gap-2 mb-2 w-full">
              <input
                type="text"
                {...register(`clubscoach.${index}.0`)}
                placeholder="Logo (ex: logoajauxerre)"
                className="py-2 px-4 border rounded w-1/3"
              />
              <input
                type="text"
                {...register(`clubscoach.${index}.1`)}
                placeholder="Nom du club (ex: AJ Auxerre)"
                className="py-2 px-4 border rounded w-1/3"
              />
              <input
                type="text"
                {...register(`clubscoach.${index}.2`)}
                placeholder="Années (ex: (1963-2006))"
                className="py-2 px-4 border rounded w-1/3"
              />
              <button
                type="button"
                onClick={() => removeclubs(index)}
                className="text-red-500"
              >
                <Trash size={18} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => appendclubs([""])}
            className="mx-auto flex items-center justify-center gap-2 text-aja-blue"
          >
            <Plus size={18} />
            Ajouter un club
          </button>
        </div>

        <div className="relative w-[600px] mb-4">
          <span className="font-semibold font-Montserrat text-gray-600 flex items-center mb-2">
            <Trophy className="mr-4" />
            Palmarès :
          </span>

          {palmaresfield.map((field, index) => (
            <div key={field.id} className="flex gap-2 mb-2 w-full">
              <input
                type="text"
                {...register(`palmares.${index}.0`)}
                placeholder="Intitulé (ex: Champion de Ligue 2)"
                className="py-2 px-4 border rounded w-1/2"
              />
              <input
                type="text"
                {...register(`palmares.${index}.1`)}
                placeholder="Nombre associé (ex: 3)"
                className="py-2 px-4 border rounded w-1/2"
              />
              <button
                type="button"
                onClick={() => removepalmares(index)}
                className="text-red-500"
              >
                <Trash size={18} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => appendpalmares([""])}
            className="mx-auto flex items-center justify-center gap-2 text-aja-blue"
          >
            <Plus size={18} />
            Ajouter une ligne au palmarès
          </button>
        </div>

        <div className="relative w-[600px]">
          <span className="font-semibold font-Montserrat text-gray-600 flex items-center mb-2">
            <ChartBarIncreasing className="mr-4" />
            Statistiques :
          </span>
          <input
            type="text"
            {...register("statistiques")}
            className="w-w-600 my-4 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
            placeholder="Stats (ex: 512v - 30n - 85d)"
          />
        </div>

        <div className="flex justify-center items-center">
          <Button type="submit">Je publie cette méthode</Button>
        </div>
      </form>
    </div>
  );
}
