"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { sendTestNewArticleMail } from "@/actions/article/send-new-article-mail";

export default function TestMailForm({
  defaultEmail,
  articles,
}: {
  defaultEmail: string;
  // Articles publiés, du plus récent au plus ancien
  articles: { id: string; title: string }[];
}) {
  const [email, setEmail] = useState(defaultEmail);
  const [articleId, setArticleId] = useState(articles[0]?.id ?? "");
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    try {
      const response = await sendTestNewArticleMail(articleId, email);
      if (response.success) toast.success(response.message);
      else toast.error(response.message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-[640px] mx-auto p-6 sm:p-10 font-Montserrat">
      <h1 className="text-center font-Bai_Jamjuree text-3xl sm:text-4xl font-bold uppercase mb-6 sm:mb-10">
        Mail de nouvel article
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-5 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6"
      >
        <p className="text-sm text-gray-500">
          Envoie le mail reçu par les abonnés à la publication d&apos;un
          article, à une seule adresse, pour vérifier son rendu. Les abonnés ne
          reçoivent rien.
        </p>

        <div className="space-y-2 text-left">
          <label
            htmlFor="test-email"
            className="text-[12px] font-black uppercase text-gray-400 font-Bai_Jamjuree ml-2"
          >
            Mail destinataire
          </label>
          <input
            id="test-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="adresse@exemple.fr"
            className="w-full px-4 py-3 sm:px-5 sm:py-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-aja-blue/5 focus:border-aja-blue outline-none transition-all text-sm"
          />
        </div>

        <div className="space-y-2 text-left">
          <label
            htmlFor="test-article"
            className="text-[12px] font-black uppercase text-gray-400 font-Bai_Jamjuree ml-2"
          >
            Article
          </label>
          <select
            id="test-article"
            required
            value={articleId}
            onChange={(e) => setArticleId(e.target.value)}
            className="w-full px-4 py-3 sm:px-5 sm:py-4 bg-white border border-gray-200 rounded-2xl focus:border-aja-blue outline-none transition-all text-sm"
          >
            {articles.map((article) => (
              <option key={article.id} value={article.id}>
                {article.title}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isSending || !articleId}
            className="bg-aja-blue text-white px-8 py-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-blue-100 transition-all font-Bai_Jamjuree hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
          >
            {isSending ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Send size={18} />
            )}
            Envoyer le mail de test
          </button>
        </div>
      </form>
    </div>
  );
}
