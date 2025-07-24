"use server";

import Button from "@/components/BlueButton";
import { Cake, Calendar1, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Comment, User } from "@/contexts/Interfaces";

export default function UserPreview({
  user,
  comments,
}: {
  user: User;
  comments: Comment[];
}) {
  return (
    <div className="text-center bg-gray-100 min-h-screen w-screen box-border p-10">
      <div>
        <h2 className="font-bold text-4xl font-Montserrat uppercase mb-4 mt-10">
          Vue de l&apos;utilisateur
        </h2>
        <div className="w-full gap-4 px-4 my-10">
          {user ? (
            <>
              <div className="flex gap-4">
                <div className="flex flex-col gap-2 font-Montserrat w-[600px] p-10 bg-white rounded-xl mx-auto">
                  <Image
                    src={user.photodeprofil || "/_assets/img/pdpdebase.png"}
                    alt="Photo de profil"
                    width={512}
                    height={512}
                    className="mx-auto h-48 w-48 object-cover rounded-full"
                  />
                  <div className="text-center my-4">
                    <h3 className="uppercase font-Montserrat font-bold text-2xl">
                      {user.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail width={20} height={20} />
                    <span className="font-medium">Email :</span>
                    <p>{user.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Cake width={20} height={20} />
                    <span className="font-medium">Date de naissance :</span>
                    <p>{new Date(user.birthday).toLocaleDateString("fr-FR")}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar1 width={20} height={20} />
                    <span className="font-medium">
                      Inscrit sur Mémoire d&apos;Auxerrois depuis le :
                    </span>
                    <p>
                      {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-10 font-Montserrat w-[600px] h-[450px] p-10 bg-white rounded-xl mx-auto">
                  <h2 className="uppercase font-bold text-xl">
                    Commentaires de l&apos;utilisateur
                  </h2>

                  <div className="flex flex-col gap-4 overflow-y-auto no-scrollbar">
                    {comments.length > 0 ? (
                      comments.map((comment) => (
                        <div
                          key={comment.id_comment}
                          className="border rounded-lg p-4 bg-gray-50 font-Montserrat"
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
                      ))
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
