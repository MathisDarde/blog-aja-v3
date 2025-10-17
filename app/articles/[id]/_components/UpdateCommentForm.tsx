"use client";

import React, { useEffect } from "react";
import { Heading, Folder, X, Star } from "lucide-react";
import { useForm } from "react-hook-form";
import { CommentSchemaType } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { CommentSchema } from "@/app/schema";
import { toast } from "sonner";
import { UpdateCommentFormProps } from "@/contexts/Interfaces";
import { useGlobalContext } from "@/contexts/GlobalContext";
import updateCommentAction from "@/actions/comment/update-comment";
import { useFormErrorToasts } from "@/components/FormErrorsHook";
import Button from "@/components/BlueButton";

export default function UpdateCommentForm({
  commentId,
  commentData,
}: UpdateCommentFormProps) {
  const { user_id } = useGlobalContext();

  const { register, handleSubmit, formState : { errors }, setValue, watch } =
    useForm<CommentSchemaType>({
      resolver: zodResolver(CommentSchema),
      defaultValues: commentData,
    });
  const watchedStars = watch("stars");

  useEffect(() => {
    if (commentData) {
      setValue("title", commentData.title);
      setValue("content", commentData.content);
      setValue("stars", commentData.stars);
    }
  }, [commentData, setValue]);

  const handleSubmitForm = async (commentData: CommentSchemaType) => {
    if (!user_id) {
      toast.error(
        "L'ID de l'utilisateur n'est pas défini. Veuillez vous connecter."
      );
      return;
    }

    const response = await updateCommentAction(commentId, commentData);

    if (response.success) {
      toast.success("Commentaire modifié avec succès !", {
        icon: "✅",
        className: "bg-green-500 border border-green-200 text-white text-base",
      });

      setTimeout(() => {
        window.location.reload();
      }, 1500);
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

  useFormErrorToasts(errors)

  return (
    <div className="w-full mx-auto relative">
      <form
        id="publishform"
        encType="multipart/form-data"
        className="max-w-[600px] mx-auto text-center"
        onSubmit={handleSubmit(handleSubmitForm)}
      >
        <div className="relative w-full">
        <span className="font-semibold font-Montserrat text-sm sm:text-base flex items-center text-gray-600">
            <Star className="mr-4" />
            Note de l&apos;article :
          </span>
          <div className="flex flex-row gap-2 my-4 w-full">
            {[...Array(5)].map((_, index) => {
              const currentRating = index + 1;

              return (
                <label key={index}>
                  <input
                    type="radio"
                    className="hidden"
                    value={currentRating}
                    checked={watchedStars === currentRating}
                    onChange={() => setValue("stars", currentRating)}
                  />
                  <Star
                    size={30}
                    className="cursor-pointer transition-colors"
                    fill={currentRating <= watchedStars ? "#337cbb" : "#fff"}
                    stroke="#337cbb"
                  />
                </label>
              );
            })}
          </div>
        </div>
        <div className="relative w-full">
        <span className="font-semibold font-Montserrat text-sm sm:text-base flex items-center text-gray-600">
            <Heading className="mr-4" />
            Titre du commentaire :
          </span>
          <input
            type="text"
            {...register("title")}
            className="w-full my-3 sm:my-4 py-3 sm:py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-xs sm:text-sm"
            placeholder="Titre de l'article"
          />
        </div>

        <div className="relative w-full">
        <span className="font-semibold font-Montserrat text-sm sm:text-base flex items-center text-gray-600">
            <Folder className="mr-4" />
            Contenu du commentaire :
          </span>
          <textarea
            {...register("content")}
            rows={15}
            className="w-full my-3 sm:my-4 py-3 sm:py-4 px-6 rounded-md border border-gray-600 font-Montserrat text-xs sm:text-sm"
            placeholder="Contenu de l'article"
          ></textarea>
        </div>

        <Button
          type="submit"
          size="default"
          >
          Je modifie mon commentaire
        </Button>
      </form>
    </div>
  );
}
