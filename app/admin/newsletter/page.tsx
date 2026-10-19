import { isAuthenticated } from "@/actions/user/is-user-connected";
import { getArticles } from "@/controllers/ArticlesController";
import TestMailForm from "./_components/TestMailForm";

// Données réservées aux admins : jamais pré-rendues au build
export const dynamic = "force-dynamic";

export default async function NewsletterAdminPage() {
  const [auth, articles] = await Promise.all([isAuthenticated(), getArticles()]);

  return (
    <TestMailForm
      defaultEmail={auth?.user?.email ?? ""}
      articles={articles
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .map((a) => ({ id: a.id_article, title: a.title }))}
    />
  );
}
