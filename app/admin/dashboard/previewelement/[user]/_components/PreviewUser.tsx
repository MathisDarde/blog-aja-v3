"use client";

import Button from "@/components/BlueButton";
import { Cake, Calendar1, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Comment, User } from "@/contexts/Interfaces";
import { useScreenSize } from "@/utils/use-screen-size";
import { redirect } from "next/navigation";

export default function UserPreview({
  userData,
  comments,
}: {
  userData: User[];
  comments: Comment[];
}) {
  const user = userData[0];
  const { width } = useScreenSize();

  return (
    <div className="text-center bg-gray-100 min-h-screen w-screen box-border p-6 lg:p-10">
      <div>
        <h2 className="font-bold text-3xl sm:text-4xl font-Montserrat uppercase mb-4 mt-0 lg:mt-10">
          Vue de l&apos;utilisateur
        </h2>
        <div className="w-full gap-4 px-0 sm:px-4 my-10">
          {user ? (
            <>
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Infos utilisateur */}
                <div className="flex flex-col gap-2 font-Montserrat w-full max-w-[600px] p-6 sm:p-10 bg-white rounded-xl mx-auto">
                  <Image
                    src={user.photodeprofil || "/_assets/img/pdpdebase.png"}
                    alt="Photo de profil"
                    width={512}
                    height={512}
                    className="mx-auto h-36 sm:h-48 w-36 sm:w-48 object-cover rounded-full"
                  />
                  <div className="text-center my-4">
                    <h3 className="uppercase font-Montserrat font-bold text-xl sm:text-2xl">
                      {user.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 text-sm sm:text-base">
                    <Mail width={20} height={20} />
                    <span className="font-medium hidden sm:block">Email :</span>
                    <p className="sm:max-w-[200px] sm:truncate">{user.email}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm sm:text-base">
                    <Cake width={20} height={20} />
                    <span className="font-medium hidden sm:block">
                      Date de naissance :
                    </span>
                    <p>{new Date(user.birthday).toLocaleDateString("fr-FR")}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm sm:text-base">
                    <Calendar1 width={20} height={20} />
                    <span className="font-medium hidden sm:block">
                      Inscrit(e) depuis le :
                    </span>
                    <p>
                      {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                </div>

                {/* Commentaires */}
                <div className="flex flex-col gap-6 sm:gap-10 font-Montserrat max-w-[600px] w-full h-[450px] p-6 sm:p-10 bg-white rounded-xl mx-auto">
                  <h2 className="uppercase font-bold text-xl">
                    Commentaires de l&apos;utilisateur
                  </h2>

                  <div className="flex flex-col gap-4 overflow-y-auto no-scrollbar">
                    {comments.length > 0 ? (
                      comments.map((comment) =>
                        width > 540 ? (
                          // Version desktop complète
                          <div
                            key={comment.id_comment}
                            className="border rounded-lg p-4 bg-gray-50 font-Montserrat cursor-pointer"
                            onClick={() =>
                              redirect(
                                `/articles/${comment.articleId}#comment-${comment.id_comment}`
                              )
                            }
                          >
                            <div className="flex items-center gap-4">
                              <Image
                                src={
                                  comment.photodeprofil ||
                                  "/_assets/img/pdpdebase.png"
                                }
                                alt="Photo de profil"
                                width={248}
                                height={248}
                                className="rounded-full w-10 h-10 object-cover"
                              />
                              <p className="font-semibold">{comment.pseudo}</p>
                              <p className="font-light text-xs">
                                {new Date(comment.updatedAt).toLocaleDateString(
                                  "fr-FR"
                                )}
                              </p>
                              <div className="flex items-center gap-1 my-2 ml-auto">
                                {Array.from({
                                  length: Number(comment.stars),
                                }).map((_, idx) => (
                                  <span
                                    key={idx}
                                    className="text-yellow-400 text-2xl"
                                  >
                                    ★
                                  </span>
                                ))}
                              </div>
                            </div>
                            <p className="font-semibold text-left uppercase my-2">
                              {comment.title}
                            </p>
                            <p className="text-sm text-left text-gray-700 mb-2">
                              {comment.content}
                            </p>
                          </div>
                        ) : (
                          <div
                            key={comment.id_comment}
                            className="border rounded-lg p-4 bg-gray-50 font-Montserrat flex flex-col items-start gap-4"
                          >
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-3">
                                <Image
                                  src={
                                    comment.photodeprofil ||
                                    "/_assets/img/pdpdebase.png"
                                  }
                                  alt="Photo de profil"
                                  width={48}
                                  height={48}
                                  className="rounded-full w-10 h-10 object-cover"
                                />
                              </div>
                              <div className="flex flex-col items-start">
                                <div className="flex items-center gap-2">
                                  <p className="font-semibold text-sm">
                                    {comment.pseudo}
                                  </p>

                                  <p className="text-xs text-gray-500">
                                    {new Date(
                                      comment.updatedAt
                                    ).toLocaleDateString("fr-FR")}
                                  </p>
                                </div>
                                <div>
                                  {Array.from({
                                    length: Number(comment.stars),
                                  }).map((_, idx) => (
                                    <span
                                      key={idx}
                                      className="text-yellow-400 text-2xl"
                                    >
                                      ★
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <Link
                              href={`/articles/${comment.articleId}#comment-${comment.id_comment}`}
                            >
                              <button className="justify-center items-center bg-aja-blue inline-flex px-5 py-2 rounded-full font-Montserrat text-white text-sm">
                                Accéder
                              </button>
                            </Link>
                          </div>
                        )
                      )
                    ) : (
                      <p className="text-sm text-gray-500">
                        Aucun commentaire trouvé.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Link href={"/admin/dashboard"}>
                  <Button>Retourner au dashboard</Button>
                </Link>
              </div>
            </>
          ) : (
            <p className="text-gray-600">
              Aucune information utilisateur trouvée.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
