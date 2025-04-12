"use client";

import submitMethodeMatchForm from "@/actions/methode-match-form";
import { MethodeMatchSchema } from "@/app/schema";
import Button from "@/components/BlueButton";
import { authClient } from "@/lib/auth-client";
import { MethodeMatchSchemaType } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  WholeWord,
  X,
  Plus,
  Trash,
  ImageIcon,
  ChartBarBig,
  ArrowLeftRight,
  AArrowUp,
  PaintbrushVertical,
  Dumbbell,
  Clock,
  FolderPen,
} from "lucide-react";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import Section from "./DropdownContainerDomExt";

const session = await authClient.getSession();
const id = session?.data?.user.id || null;

export default function MatchForm() {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<MethodeMatchSchemaType>({
    resolver: zodResolver(MethodeMatchSchema),
    defaultValues: {
      keywords: [{ value: "" }], // Changé de [{value: ""}] à [""]
      titrematch: "",
      couleur1equipe1: "#000000",
      couleur2equipe1: "#000000",
      nomequipe1: "",
      systemeequipe1: "",
      couleur1equipe2: "#000000",
      couleur2equipe2: "#000000",
      nomequipe2: "",
      systemeequipe2: "",
      stade: "",
      date: "",
      remplacantsequipe1: [[""]],
      remplacantsequipe2: [[""]],
    },
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    fields: keywordsfield,
    append: appendkeywords,
    remove: removekeywords,
  } = useFieldArray<MethodeMatchSchemaType, "keywords">({
    control,
    name: "keywords", // Assurez-vous que c'est juste "keywords"
  });

  const {
    fields: remplacantseq1field,
    append: appendremplacantseq1,
    remove: removeremplacantseq1,
  } = useFieldArray({
    control,
    name: "remplacantsequipe1",
  });

  const {
    fields: remplacantseq2field,
    append: appendremplacantseq2,
    remove: removeremplacantseq2,
  } = useFieldArray({
    control,
    name: "remplacantsequipe2",
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleSubmitForm = async (data: MethodeMatchSchemaType) => {
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

    const response = await submitMethodeMatchForm(data, selectedFile, id || "");

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

  const handleColorChangeDom1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Validation du code hex
    if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
      setValue("couleur1equipe1", value);
    }
  };
  const handleColorChangeDom2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Validation du code hex
    if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
      setValue("couleur2equipe1", value);
    }
  };
  const handleColorChangeAway1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Validation du code hex
    if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
      setValue("couleur1equipe2", value);
    }
  };
  const handleColorChangeAway2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Validation du code hex
    if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
      setValue("couleur2equipe2", value);
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
    <div className="w-[750px] ">
      <form
        method="POST"
        id="methodesaisonform"
        className="w-[750px] flex flex-col items-center justify-center"
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
                placeholder={`Mot clé ${index + 1} (ex: dimanche 16 mai 2022)`}
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

        <div className="relative w-[600px] my-4">
          <span className="font-semibold font-Montserrat text-gray-600 flex items-center mb-2">
            <AArrowUp className="mr-4" />
            Nom du match :
          </span>
          <input
            type="text"
            {...register("titrematch")}
            className="w-full my-2 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
            placeholder="Nom du match (ex: DOM X - X EXT)"
          />
        </div>

        <div className="relative w-[600px] my-4">
          <span className="font-semibold font-Montserrat text-gray-600 flex items-center mb-2">
            <ImageIcon className="mr-4" />
            Image du terrain :
          </span>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full my-2 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
            accept="image/*"
          />
        </div>

        <div className="relative w-[600px] my-4">
          <span className="font-semibold font-Montserrat text-gray-600 flex items-center mb-2">
            <Dumbbell className="mr-4" />
            Stade :
          </span>
          <input
            type="text"
            {...register("stade")}
            className="w-full my-2 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
            placeholder="Stade (ex: Stade de l'Abbé Deschamps, Auxerre)"
          />
        </div>

        <div className="relative w-[600px] my-4">
          <span className="font-semibold font-Montserrat text-gray-600 flex items-center mb-2">
            <Clock className="mr-4" />
            Horaire et Date :
          </span>
          <input
            type="text"
            {...register("date")}
            className="w-full my-2 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
            placeholder="Date (samedi 16 mai 2022, 20h45)"
          />
        </div>

        <Section title="Infos sur équipe à domicile">
          <div className="relative w-auto my-4">
            <span className="font-semibold font-Montserrat text-gray-600 flex items-center">
              <PaintbrushVertical className="mr-4" />
              Couleur principale de l&apos;équipe à domicile (Code héx.) :
            </span>
            <div className="flex items-center gap-6">
              <input
                type="color"
                id="inputcolor"
                {...register("couleur1equipe1")}
                onChange={handleColorChangeDom1}
                className="my-2 w-10 h-10 border-none cursor-pointer appearance-none"
              />
              <input
                type="text"
                id="inputhex"
                {...register("couleur1equipe1")}
                value={watch("couleur1equipe1")}
                onChange={handleColorChangeDom1}
                className="bg-white w-1/3 px-6 py-3 rounded-md border-gray-600 border"
              />
            </div>
          </div>

          <div className="relative w-auto my-4">
            <span className="font-semibold font-Montserrat text-gray-600 flex items-center mb-2">
              <PaintbrushVertical className="mr-4" />
              Couleur secondaire de l&apos;équipe à domicile (Code héx.) :
            </span>
            <div className="flex items-center gap-6">
              <input
                type="color"
                id="inputcolor"
                {...register("couleur2equipe1")}
                onChange={handleColorChangeDom2}
                className="my-2 w-10 h-10 border-none cursor-pointer appearance-none"
              />
              <input
                type="text"
                id="inputhex"
                {...register("couleur2equipe1")}
                value={watch("couleur2equipe1")}
                onChange={handleColorChangeDom2}
                className="bg-white w-1/3 px-6 py-3 rounded-md border-gray-600 border"
              />
            </div>
          </div>

          <div className="relative w-auto my-4">
            <span className="font-semibold font-Montserrat text-gray-600 flex items-center mb-2">
              <FolderPen className="mr-4" />
              Nom de l&apos;équipe à domicile :
            </span>
            <input
              type="text"
              {...register("nomequipe1")}
              className="w-full my-2 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
              placeholder="Nom de l'équipe (ex: AJ Auxerre)"
            />
          </div>

          <div className="relative w-auto my-4">
            <span className="font-semibold font-Montserrat text-gray-600 flex items-center mb-2">
              <ChartBarBig className="mr-4" />
              Système de jeu de l&apos;équipe à domicile :
            </span>
            <input
              type="text"
              {...register("systemeequipe1")}
              className="w-full my-2 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
              placeholder="Système de jeu (ex: 4-3-3)"
            />
          </div>

          <div className="relative w-auto my-4">
            <span className="font-semibold font-Montserrat text-gray-600 flex items-center mb-2">
              <ArrowLeftRight className="mr-4" />
              Remplaçants de l&apos;équipe à domicile :
            </span>

            {remplacantseq1field.map((field, index) => {
              return (
                <div key={field.id} className="flex gap-2 mb-2 w-full">
                  <input
                    type="text"
                    {...register(`remplacantsequipe1.${index}.0`)}
                    placeholder="Nom (ex: Gaëtan Perrin)"
                    className="py-2 px-4 border rounded w-2/5"
                  />
                  <input
                    type="text"
                    {...register(`remplacantsequipe1.${index}.1`)}
                    placeholder="Nom du pays (ex: france)"
                    className="py-2 px-4 border rounded w-2/5"
                  />
                  <input
                    type="text"
                    {...register(`remplacantsequipe1.${index}.2`)}
                    placeholder="Poste (ex: G ou Gardien)"
                    className="py-2 px-4 border rounded w-1/5"
                  />
                  <button
                    type="button"
                    onClick={() => removeremplacantseq1(index)}
                    className="text-red-500"
                  >
                    <Trash size={18} />
                  </button>
                </div>
              );
            })}
            <button
              type="button"
              onClick={() => appendremplacantseq1([""])}
              className="mx-auto flex items-center justify-center gap-2 text-aja-blue"
            >
              <Plus size={18} />
              Ajouter un remplaçant
            </button>
          </div>
        </Section>

        <Section title="Infos sur équipe à l'extérieur">
          <div className="relative w-auto my-4">
            <span className="font-semibold font-Montserrat text-gray-600 flex items-center">
              <PaintbrushVertical className="mr-4" />
              Couleur principale de l&apos;équipe à l&apos;extérieur (Code héx.)
              :
            </span>
            <div className="flex items-center gap-6">
              <input
                type="color"
                id="inputcolor"
                {...register("couleur1equipe2")}
                onChange={handleColorChangeAway1}
                className="my-2 w-10 h-10 border-none cursor-pointer appearance-none"
              />
              <input
                type="text"
                id="inputhex"
                {...register("couleur1equipe2")}
                value={watch("couleur1equipe2")}
                onChange={handleColorChangeAway1}
                className="bg-white w-1/3 px-6 py-3 rounded-md border-gray-600 border"
              />
            </div>
          </div>

          <div className="relative w-auto my-4">
            <span className="font-semibold font-Montserrat text-gray-600 flex items-center mb-2">
              <PaintbrushVertical className="mr-4" />
              Couleur secondaire de l&apos;équipe à l&apos;extérieur (Code héx.)
              :
            </span>
            <div className="flex items-center gap-6">
              <input
                type="color"
                id="inputcolor"
                {...register("couleur2equipe2")}
                onChange={handleColorChangeAway2}
                className="my-2 w-10 h-10 border-none cursor-pointer appearance-none"
              />
              <input
                type="text"
                id="inputhex"
                {...register("couleur2equipe2")}
                value={watch("couleur2equipe2")}
                onChange={handleColorChangeAway2}
                className="bg-white w-1/3 px-6 py-3 rounded-md border-gray-600 border"
              />
            </div>
          </div>

          <div className="relative w-auto my-4">
            <span className="font-semibold font-Montserrat text-gray-600 flex items-center mb-2">
              <FolderPen className="mr-4" />
              Nom de l&apos;équipe à l&apos;extérieur :
            </span>
            <input
              type="text"
              {...register("nomequipe2")} // Modifié de nomequipe1 à nomequipe2
              className="w-full my-2 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
              placeholder="Nom de l'équipe (ex: RC Lens)"
            />
          </div>

          <div className="relative w-auto my-4">
            <span className="font-semibold font-Montserrat text-gray-600 flex items-center mb-2">
              <ChartBarBig className="mr-4" />
              Système de jeu de l&apos;équipe à l&apos;extérieur :
            </span>
            <input
              type="text"
              {...register("systemeequipe2")} // Modifié de systemeequipe1 à systemeequipe2
              className="w-full my-2 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
              placeholder="Système de jeu (ex: 3-4-3)"
            />
          </div>

          <div className="relative w-auto my-4">
            <span className="font-semibold font-Montserrat text-gray-600 flex items-center mb-2">
              <ArrowLeftRight className="mr-4" />
              Remplaçants de l&apos;équipe à l&apos;extérieur :
            </span>

            {remplacantseq2field.map((field, index) => {
              return (
                <div key={field.id} className="flex gap-2 mb-2 w-full">
                  <input
                    type="text"
                    {...register(`remplacantsequipe2.${index}.0`)}
                    placeholder="Nom (ex: Gaëtan Perrin)"
                    className="py-2 px-4 border rounded w-2/5"
                  />
                  <input
                    type="text"
                    {...register(`remplacantsequipe2.${index}.1`)}
                    placeholder="Nom du pays (ex: france)"
                    className="py-2 px-4 border rounded w-2/5"
                  />
                  <input
                    type="text"
                    {...register(`remplacantsequipe2.${index}.2`)}
                    placeholder="Poste (ex: G ou Gardien)"
                    className="py-2 px-4 border rounded w-1/5"
                  />
                  <button
                    type="button"
                    onClick={() => removeremplacantseq2(index)}
                    className="text-red-500"
                  >
                    <Trash size={18} />
                  </button>
                </div>
              );
            })}
            <button
              type="button"
              onClick={() => appendremplacantseq2([""])}
              className="mx-auto flex items-center justify-center gap-2 text-aja-blue"
            >
              <Plus size={18} />
              Ajouter un remplaçant
            </button>
          </div>
        </Section>

        <div className="flex justify-center items-center">
          <Button type="submit">Je publie cette méthode</Button>
        </div>
      </form>
    </div>
  );
}
