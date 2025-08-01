"use client";

import React from "react";
import { AlignLeft, Heading, Star, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { CommentSchemaType } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { CommentSchema } from "@/app/schema";
import { toast } from "sonner";
import Button from "@/components/BlueButton";
import submitCommentForm from "@/actions/comment/comment-form";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { useFormErrorToasts } from "@/components/FormErrorsHook";

export default function CommentForm({ id_article }: { id_article: string }) {
  const { user_id } = useGlobalContext();

  const { register, handleSubmit, reset, formState: {errors}, watch, setValue } =
    useForm<CommentSchemaType>({
      resolver: zodResolver(CommentSchema),
    });

  const handleSubmitForm = async (data: CommentSchemaType) => {
    if (!user_id) {
      toast.error("Vous devez être connecté pour publier un commentaire.");
      return;
    }

    const response = await submitCommentForm(data, user_id, id_article);

    if (response.success) {
      toast.success("Commentaire publié !", {
        icon: "✅",
        className: "bg-green-500 border border-green-200 text-white text-base",
      });

      reset();

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
    <div className="w-[600px] mx-auto relative">
      <form action="" onSubmit={handleSubmit(handleSubmitForm)}>
        <div className="flex flex-col items-center relative w-[600px]">
          <div>
            <span className="font-semibold font-Montserrat flex items-center text-gray-600">
              <Star className="mr-4" />
              Note de l&apos;article :
            </span>
            <div className="flex flex-row gap-2 my-4 w-[600px]">
              {[...Array(5)].map((_, index) => {
                const currentRating = index + 1;
                return (
                  <label key={index}>
                    <input
                      type="radio"
                      className="hidden"
                      value={currentRating}
                      onChange={() => setValue("stars", currentRating)}
                    />
                    <Star
                      size={30}
                      className="cursor-pointer transition-colors"
                      fill={
                        currentRating <= (watch("stars") ?? 0)
                          ? "#337cbb"
                          : "#fff"
                      }
                      stroke="#337cbb"
                    />
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        <div className="relative w-[600px]">
          <span className="font-semibold font-Montserrat flex items-center text-gray-600">
            <Heading className="mr-4" />
            Titre du commentaire :
          </span>
          <input
            type="text"
            {...register("title")}
            className="w-[600px] my-4 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
            placeholder="Titre du commentaire"
          />
        </div>

        <div className="relative w-[600px]">
          <span className="font-semibold font-Montserrat flex items-center text-gray-600">
            <AlignLeft className="mr-4" />
            Contenu du commentaire :
          </span>
          <textarea
            {...register("content")}
            className="w-[600px] my-4 py-4 px-6 rounded-xl border border-gray-600 font-Montserrat text-sm"
            rows={5}
            placeholder="Titre du commentaire"
          />
        </div>

        <div className="flex justify-center items-center">
          <Button type="submit">Je publie ce commentaire</Button>
        </div>
      </form>
    </div>
  );
}
