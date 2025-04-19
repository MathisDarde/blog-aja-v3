import React, { useEffect, useState } from "react";
import { AlignLeft, Heading, Star, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { CommentSchemaType } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { CommentSchema } from "@/app/schema";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import Button from "@/components/BlueButton";
import submitCommentForm from "@/actions/comment-form";
import { authClient } from "@/lib/auth-client";

const session = await authClient.getSession();
const id = session?.data?.user.id ?? "";

export default function CommentForm() {
  const params = useParams();

  const [rating, setRating] = useState<number | null>(null);
  const [hover, setHover] = useState<number | null>(0);

  const { register, handleSubmit, reset, formState } =
    useForm<CommentSchemaType>({
      resolver: zodResolver(CommentSchema),
    });

  const id_article = React.useRef<string>("");

  useEffect(() => {
    if (!params?.id) return;
    id_article.current = Array.isArray(params.id) ? params.id[0] : params.id;
  }, [params?.id]);

  const handleSubmitForm = async (data: CommentSchemaType) => {
    const response = await submitCommentForm(
      data,
      id as string,
      id_article.current
    );
    if (response.success) {
      toast.success("Commentaire publié !", {
        icon: "✅",
        className: "bg-green-500 border border-green-200 text-white text-base",
      });

      reset();
      setRating(null);
      setHover(null);

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
    <div className="w-w-600 mx-auto relative">
      <form action="" onSubmit={handleSubmit(handleSubmitForm)}>
        <div className="flex flex-col items-center relative w-[600px]">
          <div>
            <span className="font-semibold font-Montserrat flex items-center text-gray-600">
              <Star className="mr-4" />
              Note de l&apos;article :
            </span>
            <div className="flex flex-row gap-2 my-4 w-[600px]">
              {[...Array(5)].map((star, index) => {
                const currentRating = index + 1;

                return (
                  <label key={index}>
                    <input
                      type="radio"
                      value={currentRating}
                      onClick={() => setRating(currentRating)}
                      className="hidden"
                      {...register("stars")}
                    />
                    <Star
                      size={30}
                      className="cursor-pointer transition-colors"
                      fill={
                        currentRating <= ((hover ?? 0) || (rating ?? 0))
                          ? "#337cbb"
                          : "#fff"
                      }
                      stroke="#337cbb"
                      onMouseEnter={() => setHover(currentRating)}
                      onMouseLeave={() => setHover(null)}
                    />
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        <div className="relative w-w-600">
          <span className="font-semibold font-Montserrat flex items-center text-gray-600">
            <Heading className="mr-4" />
            Titre du commentaire :
          </span>
          <input
            type="text"
            {...register("title")}
            className="w-w-600 my-4 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
            placeholder="Titre du commentaire"
          />
        </div>

        <div className="relative w-w-600">
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
