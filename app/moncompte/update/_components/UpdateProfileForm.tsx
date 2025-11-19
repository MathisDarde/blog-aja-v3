"use client";

import React, { useState } from "react";
import { Cake, Mail, Trash, UserIcon } from "lucide-react";
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
import ActionPopup from "@/components/ActionPopup";
import Button from "@/components/BlueButton";
import { useRouter } from "next/navigation";

export default function UpdateProfileForm({ user }: { user: User | null }) {
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(
    user?.image || null
  );
  const [uploadedUrl, setUploadedUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  const [deletePDPPopupOpen, setDeletePDPPopupOpen] = useState(false);

  const router = useRouter();

  // Formatage date YYYY-MM-DD pour affichage dans input date
  const formattedBirthday = user?.birthday
    ? new Date(user.birthday).toISOString().substring(0, 10)
    : "";

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<UpdateProfileSchemaType>({
    resolver: zodResolver(UpdateProfileSchema),
    defaultValues: {
      name: user?.name,
      birthday: formattedBirthday,
      email: user?.email,
      image: user?.image || "",
    },
  });

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      throw error;
    }
  };

  useFormErrorToasts(errors);

  if (!user) {
    return (
      <p className="text-center font-Montserrat text-red-500">
        Utilisateur non connecté.
      </p>
    );
  }

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setPreviewPhoto(URL.createObjectURL(file));

      // Upload immédiatement vers Cloudinary
      setIsUploading(true);
      try {
        const url = await uploadToCloudinary(file);
        setUploadedUrl(url);

        setValue("image", url, { shouldValidate: true });
        toast.success("Image uploadée avec succès !");
      } catch (error) {
        console.error(error);
        toast.error("Erreur lors de l'upload de l'image");
        setPreviewPhoto(null);
      } finally {
        setIsUploading(false);
      }
    } else {
      setPreviewPhoto(null);
      setUploadedUrl("");
    }
  };

  const handleDeletePDP = async () => {
    setPreviewPhoto("/_assets/img/pdpdebase.png");
    if (user?.id) {
      await deletePhotoDeProfil(user.id);
    }
    toast.success("Photo de profil supprimée avec succès.");
  };

  const handleSubmitForm = async (data: UpdateProfileSchemaType) => {
    if (!user.id) {
      toast.error(
        "L'ID de l'utilisateur n'est pas défini. Veuillez vous connecter."
      );
      return;
    }

    const imageToSave = uploadedUrl || user.image || "";

    const finalData: UpdateProfileSchemaType & { image: string } = {
      ...data,
      image: imageToSave,
    };

    try {
      const response = await updateProfileForm(user.id, finalData);

      if (response.success) {
        toast.success(response.message);
        router.push("/moncompte");
      } else {
        toast.error(
          response.message ?? response.errors?.[0]?.message ?? "Erreur inconnue"
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la modification du profil");
    }
  };

  return (
    <div className="w-full mx-auto text-center">
      <form
        onSubmit={handleSubmit(handleSubmitForm)}
        className="max-w-[600px] mx-auto"
      >
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
          {!isUploading ? (
            <>
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
                  className="font-Montserrat text-aja-blue hover:text-orange-third underline cursor-pointer ml-1"
                >
                  modifier ?
                </label>
              </p>
            </>
          ) : (
            <p className="font-Montserrat text-aja-blue opacity-50 text-sm sm:text-base text-center mb-4">
              En cours de modification de la photo de profil...
            </p>
          )}
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

        <Button type="submit" size="default">
          Je modifie mon profil
        </Button>
      </form>
    </div>
  );
}
