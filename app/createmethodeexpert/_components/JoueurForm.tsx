"use client";

import submitMethodeJoueurForm from "@/actions/methode-joueur-form";
import { MethodeJoueurSchema } from "@/app/schema";
import Button from "@/components/BlueButton";
import { authClient } from "@/lib/auth-client";
import { MethodeJoueurSchemaType } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  WholeWord,
  X,
  Plus,
  Trash,
  ImageIcon,
  FolderPen,
  Drama,
  Ruler,
  Footprints,
  ShieldHalf,
  Sword,
  Volleyball,
  Handshake,
} from "lucide-react";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

const session = await authClient.getSession();
const id = session?.data?.user.id || null;

export default function JoueurForm() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<MethodeJoueurSchemaType>({
    resolver: zodResolver(MethodeJoueurSchema),
    defaultValues: {
      keywords: [{ value: "" }],
      clubs: [[""]],
      joueurnom: "",
      poste: "",
      taille: "",
      piedfort: "",
      matchs: "",
      buts: "",
      passesd: "",
    },
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    fields: keywordsfield,
    append: appendkeywords,
    remove: removekeywords,
  } = useFieldArray<MethodeJoueurSchemaType, "keywords">({
    control,
    name: "keywords",
  });
  const {
    fields: clubsfield,
    append: appendclubs,
    remove: removeclubs,
  } = useFieldArray<MethodeJoueurSchemaType, "clubs">({
    control,
    name: "clubs",
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleSubmitForm = async (data: MethodeJoueurSchemaType) => {
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

    const response = await submitMethodeJoueurForm(
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
                placeholder={`Mot clé ${index + 1} (ex: Djibril Cissé)`}
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
            Nom du joueur :
          </span>
          <input
            type="text"
            {...register("joueurnom")}
            className="w-w-600 my-4 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
            placeholder="Nom du joueur (ex: Djibril Cissé)"
          />
        </div>

        <div className="relative w-[600px]">
          <span className="font-semibold font-Montserrat text-gray-600 flex items-center mb-2">
            <ImageIcon className="mr-4" />
            Photo du joueur :
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
            <Drama className="mr-4" />
            Poste :
          </span>
          <input
            type="text"
            {...register("poste")}
            className="w-w-600 my-4 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
            placeholder="Poste (ex: Attaquant de pointe)"
          />
        </div>

        <div className="relative w-[600px]">
          <span className="font-semibold font-Montserrat text-gray-600 flex items-center mb-2">
            <Ruler className="mr-4" />
            Taille :
          </span>
          <input
            type="text"
            {...register("taille")}
            className="w-w-600 my-4 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
            placeholder="Taille du joueur (ex: 1m84)"
          />
        </div>

        <div className="relative w-[600px]">
          <span className="font-semibold font-Montserrat text-gray-600 flex items-center mb-2">
            <Footprints className="mr-4" />
            Pied Fort :
          </span>
          <input
            type="text"
            {...register("piedfort")}
            className="w-w-600 my-4 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
            placeholder="Pied fort (ex: Droit)"
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
                {...register(`clubs.${index}.0`)}
                placeholder="Logo (ex: logoajauxerre)"
                className="py-2 px-4 border rounded w-1/3"
              />
              <input
                type="text"
                {...register(`clubs.${index}.1`)}
                placeholder="Nom du club (ex: AJ Auxerre)"
                className="py-2 px-4 border rounded w-1/3"
              />
              <input
                type="text"
                {...register(`clubs.${index}.2`)}
                placeholder="Années (ex: (1999-2004))"
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

        <div className="relative w-[600px]">
          <span className="font-semibold font-Montserrat text-gray-600 flex items-center mb-2">
            <Sword className="mr-4" />
            Nombre de matchs :
          </span>
          <input
            type="number"
            {...register("matchs")}
            className="w-w-600 my-4 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
            placeholder="Nombre de matchs (ex: 354)"
          />
        </div>

        <div className="relative w-[600px]">
          <span className="font-semibold font-Montserrat text-gray-600 flex items-center mb-2">
            <Volleyball className="mr-4" />
            Nombre de buts marqués :
          </span>
          <input
            type="number"
            {...register("buts")}
            className="w-w-600 my-4 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
            placeholder="Nombre de buts marqués (ex: 116)"
          />
        </div>

        <div className="relative w-[600px]">
          <span className="font-semibold font-Montserrat text-gray-600 flex items-center mb-2">
            <Handshake className="mr-4" />
            Nombre de passes décisives :
          </span>
          <input
            type="number"
            {...register("passesd")}
            className="w-w-600 my-4 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
            placeholder="Nombre de passes décisives (ex: 38)"
          />
        </div>

        <div className="flex justify-center items-center">
          <Button type="submit">Je publie cette méthode</Button>
        </div>
      </form>
    </div>
  );
}
