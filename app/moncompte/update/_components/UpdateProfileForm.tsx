"use client";

import React, { useState } from "react";
import { Cake, Mail, X, Trash, UserIcon } from "lucide-react";
import { UpdateProfileSchemaType } from "@/types/forms";
import { UpdateProfileSchema } from "@/app/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import updateProfileForm from "@/actions/user/update-profile-form";
import { User } from "@/contexts/Interfaces";
import Image from "next/image";
import deletePhotoDeProfil from "@/actions/user/delete-pdp";
import { useFormErrorToasts } from "@/components/FormErrorsHook";
import { redirect } from "next/navigation";
import ActionPopup from "@/components/ActionPopup";

export default function UpdateProfileForm({ user }: { user: User | null }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(
    user?.photodeprofil || "/_assets/img/pdpdebase.png"
  );
  const [deletePDPPopupOpen, setDeletePDPPopupOpen] = useState(false);

  // Formatage date YYYY-MM-DD pour affichage dans input date
  const formattedBirthday = user?.birthday
    ? new Date(user.birthday).toISOString().substring(0, 10)
    : "";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateProfileSchemaType>({
    resolver: zodResolver(UpdateProfileSchema),
    defaultValues: {
      name: user?.name,
      birthday: formattedBirthday,
      email: user?.email,
      photodeprofil: user?.photodeprofil || "",
    },
  });

  if (!user) {
    return (
      <p className="text-center font-Montserrat text-red-500">
        Utilisateur non connecté.
      </p>
    );
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setPreviewPhoto(URL.createObjectURL(event.target.files[0]));
    }
  };

  const handleDeletePDP = async () => {
    setSelectedFile(null);
    setPreviewPhoto("/_assets/img/pdpdebase.png");
    if (user?.id) {
      await deletePhotoDeProfil(user.id);
    }
    toast.success("Photo de profil supprimée avec succès.", {
      icon: <X className="text-white" />,
      className: "bg-green-500 border border-green-200 text-white text-base",
    });
  };

  const handleSubmitForm = async (data: UpdateProfileSchemaType) => {
    if (!user.id) {
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
      user.id,
      data,
      selectedFile ?? undefined
    );

    if (response.success) {
      toast.success(response.message, {
        icon: <X className="text-white" />,
        className: "bg-green-500 border border-green-200 text-white text-base",
      });
      redirect("/moncompte");
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
    <div className="max-w-[600px] mx-auto">
      <form onSubmit={handleSubmit(handleSubmitForm)} className="w-full">
        {/* Confirm delete PDP */}
        {deletePDPPopupOpen && (
          <ActionPopup
            onClose={() => setDeletePDPPopupOpen(false)}
            title="Supprimer la photo de profil ?"
            description="Êtes-vous sur de vouloir supprimer votre photo de profil ? Une fois supprimée, elle ne pourra plus être récupérée."
            actions={[
              {
                label: "Annuler",
                onClick: () => setDeletePDPPopupOpen(false),
                theme: "discard",
              },
              {
                label: "Supprimer",
                onClick: () => {
                  handleDeletePDP();
                  setDeletePDPPopupOpen(false);
                },
                theme: "delete",
              },
            ]}
          />
        )}

        <div className="relative w-full mx-auto">
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
                onClick={() => setDeletePDPPopupOpen(true)}
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
          <p className="font-Montserrat text-sm sm:text-base text-center mb-4">
            Photo de profil actuelle,
            <label
              htmlFor="fileInput"
              className="font-Montserrat text-aja-blue underline cursor-pointer ml-1"
            >
              modifier ?
            </label>
          </p>
        </div>

        <div className="relative w-full">
          <span className="font-semibold font-Montserrat text-sm sm:text-base flex items-center text-gray-600">
            <UserIcon className="mr-4" />
            Pseudo :
          </span>
          <input
            type="text"
            {...register("name")}
            className="w-full my-3 sm:my-4 py-3 sm:py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-xs sm:text-sm"
            placeholder="Pseudo"
          />
        </div>

        <div className="relative w-full">
          <span className="font-semibold font-Montserrat text-sm sm:text-base flex items-center text-gray-600">
            <Cake className="mr-4" />
            Date de naissance :
          </span>
          <input
            type="date"
            {...register("birthday")}
            className="w-full my-3 sm:my-4 py-3 sm:py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-xs sm:text-sm"
            placeholder="Date de naissance"
          />
        </div>

        <div className="relative w-full">
          <span className="font-semibold font-Montserrat text-sm sm:text-base flex items-center text-gray-600">
            <Mail className="mr-4" />
            Adresse Mail :
          </span>
          <input
            type="email"
            {...register("email")}
            className="w-full my-3 sm:my-4 py-3 sm:py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-xs sm:text-sm"
            placeholder="Adresse Mail"
          />
        </div>

        <div className="flex justify-center mt-2">
          <button
            type="submit"
            className="justify-center items-center bg-aja-blue inline-flex px-6 py-3 rounded-full font-Montserrat text-white text-sm sm:text-base"
          >
            Je modifie mon profil
          </button>
        </div>
      </form>
    </div>
  );
}
