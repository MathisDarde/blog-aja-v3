import Dashboard from "./_components/Dashboard";
import { getAllUsers } from "@/controllers/UserController";
import { getAllArticles } from "@/controllers/ArticlesController";
import { getComments } from "@/controllers/CommentController";
import getAllMethodes from "@/actions/dashboard/get-methodes-infos";
import { Methodes } from "@/contexts/Interfaces";

export default async function PageDashboard() {
  const users = await getAllUsers();
  const articles = await getAllArticles();
  const comments = await getComments();
  const methodes = await getAllMethodes();

  return (
    <div className="text-center bg-gray-100 h-[calc(100vh-68px)] w-screen box-border overflow-y-hidden">
      <Dashboard
        users={users}
        articles={articles}
        comments={comments}
        methodes={methodes as Methodes[]}
      />
    </div>
  );
}
