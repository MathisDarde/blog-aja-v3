"use client";

import React, { useState } from "react";
import Button from "@/components/BlueButton";
import { User, Cake, Mail, X, Trash } from "lucide-react";
import { UpdateProfileSchemaType } from "@/types/forms";
import { UpdateProfileSchema } from "@/app/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import updateProfileForm from "@/actions/user/update-profile-form";
import { UpdateUserFromProps } from "@/contexts/Interfaces";
import { useGlobalContext } from "@/contexts/GlobalContext";
import Image from "next/image";
import deletePhotoDeProfil from "@/actions/user/delete-pdp";
import { useFormErrorToasts } from "@/components/FormErrorsHook";
import { redirect } from "next/navigation";

export default function UpdateProfileForm({ userData }: UpdateUserFromProps) {
  const { user_id } = useGlobalContext();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(
    userData.photodeprofil || "/_assets/img/pdpdebase.png"
  );

  // Formatage date YYYY-MM-DD pour affichage dans input date
  const formattedBirthday = userData.birthday
    ? new Date(userData.birthday).toISOString().substring(0, 10)
    : "";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateProfileSchemaType>({
    resolver: zodResolver(UpdateProfileSchema),
    defaultValues: {
      name: userData.name,
      birthday: formattedBirthday,
      email: userData.email,
      photodeprofil: userData.photodeprofil || "",
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setPreviewPhoto(URL.createObjectURL(event.target.files[0]));
    }
  };

  const handleDeletePDP = async () => {
    setSelectedFile(null);
    setPreviewPhoto("/_assets/img/pdpdebase.png");
    if (user_id) {
      await deletePhotoDeProfil(user_id);
    }
    toast.success("Photo de profil supprimée avec succès.", {
      icon: <X className="text-white" />,
      className: "bg-green-500 border border-green-200 text-white text-base",
    });
  };

  const handleSubmitForm = async (data: UpdateProfileSchemaType) => {
    if (!user_id) {
      toast.error(
        "L'ID de l'utilisateur n'est pas défini. Veuillez vous connecter."
      );
      return;
    }

    const formData = new FormData();

    const birthdayDate = new Date(data.birthday);

    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    Object.entries(data).forEach(([key, value]) => {
      if (key === "birthday") {
        formData.append(key, birthdayDate.toISOString());
      } else {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else if (isDate(value)) {
          formData.append(key, value.toISOString());
        } else if (typeof value === "string") {
          formData.append(key, value);
        } else if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      }
    });

    function isDate(value: unknown): value is Date {
      return value instanceof Date && !isNaN(value.getTime());
    }

    const response = await updateProfileForm(
      user_id,
      data,
      selectedFile ?? undefined
    );

    if (response.success) {
      toast.success(response.message, {
        icon: <X className="text-white" />,
        className: "bg-green-500 border border-green-200 text-white text-base",
      });
      redirect("/moncompte")
    } else {
      toast.error(
        response.message ? response.message : response.errors?.[0]?.message,
        {
          icon: <X className="text-white" />,
          className: "bg-red-500 border border-red-200 text-white text-base",
        }
      );
    }
  };

  useFormErrorToasts(errors);

  return (
    <div className="w-[600px] mx-auto">
      <form onSubmit={handleSubmit(handleSubmitForm)} className="w-[600px]">
        <div className="relative w-[600px] mx-auto">
          {previewPhoto && (
            <div className="w-fit mb-4 relative mx-auto">
              <Image
                width={256}
                height={256}
                src={previewPhoto || "/_assets/img/pdpdebase.png"}
                alt="Photo de profil"
                className="w-40 h-40 rounded-full object-cover mr-4"
              />
              <button
                type="button"
                onClick={handleDeletePDP}
                className="absolute bg-red-500 text-white p-2 rounded-full bottom-4 right-3"
                aria-label="Supprimer la photo de profil"
              >
                <Trash size={20} />
              </button>
            </div>
          )}

          {/* input file caché */}
          <input
            type="file"
            id="fileInput"
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />
          <p className="font-Montserrat">
            Photo de profil actuelle,
            <label
              htmlFor="fileInput"
              className="font-Montserrat text-aja-blue underline cursor-pointer ml-1"
            >
              modifier ?
            </label>
          </p>
        </div>

        <div className="relative w-[600px]">
          <span className="font-semibold font-Montserrat text-gray-600 flex items-center">
            <User className="mr-4" />
            Pseudo :
          </span>
          <input
            type="text"
            {...register("name")}
            className="w-[600px] my-4 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
            placeholder="Pseudo"
          />
        </div>

        <div className="relative w-[600px]">
          <span className="font-semibold font-Montserrat text-gray-600 flex items-center">
            <Cake className="mr-4" />
            Date de naissance :
          </span>
          <input
            type="date"
            {...register("birthday")}
            className="w-[600px] my-4 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
            placeholder="Date de naissance"
          />
        </div>

        <div className="relative w-[600px]">
          <span className="font-semibold font-Montserrat text-gray-600 flex items-center">
            <Mail className="mr-4" />
            Adresse Mail :
          </span>
          <input
            type="email"
            {...register("email")}
            className="w-[600px] my-4 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
            placeholder="Adresse Mail"
          />
        </div>

        <div className="flex justify-center items-center">
          <Button type="submit">Je modifie mes informations</Button>
        </div>
      </form>
    </div>
  );
}
