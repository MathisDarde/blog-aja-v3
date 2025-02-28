"use client";

import Sidebar from "@/components/Sidebar";
import SidebarResp from "@/components/SidebarResp";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { JsonValue } from "@prisma/client/runtime/library";
import { Calendar1 } from "lucide-react";

interface ArticleProps {
  article: {
    title: string;
    teaser: string;
    imageUrl: string;
    content: string;
    author: string;
    publishedAt: Date;
    tags: JsonValue;
  };
}

export default function ArticleDisplay({ article }: ArticleProps) {
  const [sidebarState, setSidebarState] = useState(0);

  const toggleSidebar = () => {
    setSidebarState((prevState) => (prevState === 0 ? 1 : 0));
  };

  return (
    <div className="bg-gray-100 h-full w-full p-0 m-0 box-border">
      {sidebarState === 0 ? (
        <SidebarResp onToggle={toggleSidebar} />
      ) : (
        <Sidebar onToggle={toggleSidebar} />
      )}
      <div className="ml-24">
        <div className="text-center">
          <Link href={"/"}>
            <p className="text-5xl text-center font-title italic uppercase font-bold text-aja-blue py-10">
              Mémoire d&apos;Auxerrois
            </p>
          </Link>
        </div>

        <div className="flex justify-center gap-10">
          <div className="w-[975px]">
            <h2 className="font-Montserrat font-extrabold text-3xl">
              {article.title}
            </h2>
            <p className="font-Montserrat flex items-center my-4 italic">
              <Calendar1 className="mr-2" />
              {new Date(article.publishedAt).toLocaleDateString("fr-FR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}{" "}
              par {article.author}
            </p>
            <Image
              src={`${article.imageUrl}`}
              width={512}
              height={512}
              alt="Image de bannière de l'article"
              className="aspect-video w-full object-cover object-top mb-10 rounded-xl"
            ></Image>
            <p className="font-Montserrat text-justify bg-white rounded-xl p-8 leading-7 ">
              {article.content}
            </p>
          </div>
          <div className="w-[325px] bg-white h-[200px] border border-black rounded-xl"></div>
        </div>
      </div>
    </div>
  );
}
