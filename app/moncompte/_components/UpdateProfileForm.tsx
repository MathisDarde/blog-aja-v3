import React, { useEffect, useState } from "react";
import Button from "@/components/BlueButton";
import { User, Cake, Mail, X, ImageIcon } from "lucide-react";
import { UpdateProfileSchemaType } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import updateProfileForm from "@/actions/user/update-profile-form";
import { updateProfileSchema } from "@/app/schema";

interface UpdateArticleFormProps {
  userData: UpdateProfileSchemaType;
}

const session = await authClient.getSession();
const id = session?.data?.user.id || null;

export default function UpdateProfileForm({
  userData,
}: UpdateArticleFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  console.log(userData);

  const { register, handleSubmit, formState } =
    useForm<UpdateProfileSchemaType>({
      resolver: zodResolver(updateProfileSchema),
      defaultValues: {
        name: userData.name || "",
        birthday: userData.birthday,
        email: userData.email || "",
      },
    });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
    }
  };

  const handleSubmitForm = async (data: UpdateProfileSchemaType) => {
    const formData = new FormData();

    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    Object.entries(data).forEach(([key, value]) => {
      formData.append(
        key,
        Array.isArray(value)
          ? JSON.stringify(value)
          : value instanceof Date
          ? value.toISOString()
          : value
      );
    });

    if (!id) {
      toast.error(
        "L'ID de l'utilisateur n'est pas défini. Veuillez vous connecter."
      );
      return;
    }

    const response = await updateProfileForm(
      id,
      data,
      selectedFile ?? undefined
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
          className:
            "bg-red-500 !important border border-red-200 text-white text-base",
        });
      }
    });
  }, [formState.errors]);

  return (
    <div className="w-w-600 mx-auto">
      <form
        onSubmit={handleSubmit(handleSubmitForm)}
        id="inscform"
        className="w-w-600"
      >
        <div className="relative w-w-600">
          <span className="font-semibold font-Montserrat flex items-center text-gray-600">
            <ImageIcon className="mr-4" />
            Photo de profil :
          </span>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-w-600 my-4 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
            accept="image/*"
          />
        </div>
        <div className="relative w-w-600">
          <span className="font-semibold font-Montserrat text-gray-600 flex items-center">
            <User className="mr-4" />
            Pseudo :
          </span>
          <input
            type="text"
            {...register("name")}
            className="w-w-600 my-4 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
            placeholder="Pseudo"
          />
        </div>
        <div className="relative w-w-600">
          <span className="font-semibold font-Montserrat text-gray-600 flex items-center">
            <Cake className="mr-4" />
            Date de naissance :
          </span>
          <input
            type="date"
            {...register("birthday")}
            className="w-w-600 my-4 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
            placeholder="Date de naissance"
          />
        </div>
        <div className="relative w-w-600">
          <span className="font-semibold font-Montserrat text-gray-600 flex items-center">
            <Mail className="mr-4" />
            Adresse Mail :
          </span>
          <input
            type="email"
            {...register("email")}
            className="w-w-600 my-4 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
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
