import React from "react";
import ArticleForm from "./_components/ArticleForm";
import { isAuthenticated } from "@/actions/user/is-user-connected";
import { User } from "@/contexts/Interfaces";
import { getUserbyId } from "@/controllers/UserController";

export const dynamic = "force-dynamic";

export default async function PublishArticle() {
  const auth = await isAuthenticated();

  let user: User | null = null;

  if (auth?.user?.id) {
    const users = await getUserbyId(auth.user.id);
    user = users?.[0] ?? null;
  }

  return (
    <>
      <div className="text-center bg-gray-100 min-h-screen w-screen box-border p-6 sm:p-10">
        <h1 className="text-center font-Bai_Jamjuree text-3xl sm:text-4xl font-bold uppercase mb-6 sm:mb-10">
          Publier un article
        </h1>

        <ArticleForm user={user} />
      </div>
    </>
  );
}
