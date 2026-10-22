"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  FilePen,
  Gem,
  Image as ImageIcon,
  Mail,
  MessageSquare,
  Newspaper,
  Plus,
  Search,
  Trophy,
  Users,
} from "lucide-react";
import getArticleStats from "@/actions/dashboard/get-article-stats";
import type { ArticleStats } from "@/lib/article-stats";
import type { DashboardData } from "@/lib/dashboard-data";
import ScheduledBanner from "./ScheduledBanner";
import UsersSection from "./UsersSection";
import ArticlesSection from "./ArticlesSection";
import DraftsSection from "./DraftsSection";
import MethodesSection from "./MethodesSection";
import CommentsSection from "./CommentsSection";

type Section = "articles" | "drafts" | "methodes" | "comments" | "users";

const plural = (n: number, word: string) => `${n} ${word}${n > 1 ? "s" : ""}`;

const SHORTCUTS = [
  { href: "/admin/brouillons", label: "Brouillons", icon: FilePen },
  { href: "/admin/logos", label: "Logos", icon: ImageIcon },
  { href: "/admin/quiz", label: "Quiz", icon: Trophy },
  { href: "/admin/newsletter", label: "Newsletter", icon: Mail },
];

export default function Dashboard({ data }: { data: DashboardData }) {
  const { users, articles, drafts, methodes, comments } = data;
  const [section, setSection] = useState<Section>("articles");
  const [search, setSearch] = useState("");
  const [stats, setStats] = useState<Record<string, ArticleStats> | null>(null);

  useEffect(() => {
    // À part : PostHog peut être lent, le tableau s'affiche sans attendre les vues
    getArticleStats()
      .then(setStats)
      .catch((error) => console.error("Stats des articles :", error));
  }, []);

  const published = articles.filter((a) => a.state === "published").length;
  const archived = articles.filter((a) => a.state === "archived").length;
  const scheduled = drafts.filter((d) => d.scheduledAt).length;
  const toModerate = comments.filter((c) => c.reportsCount > 0 && !c.hidden).length;
  const admins = users.filter((u) => u.admin).length;
  const totalViews = stats ? Object.values(stats).reduce((sum, s) => sum + s.views, 0) : null;
  const methodesOf = (type: string) => methodes.filter((m) => m.typemethode === type).length;

  const cards: {
    key: Section;
    label: string;
    value: number;
    hint: string;
    alert?: boolean;
    icon: React.ElementType;
  }[] = [
    {
      key: "articles",
      label: "Articles en ligne",
      value: published,
      hint:
        totalViews !== null
          ? `${totalViews.toLocaleString("fr-FR")} vues au total`
          : archived > 0
            ? plural(archived, "archivé")
            : "Aucun archivé",
      icon: Newspaper,
    },
    {
      key: "drafts",
      label: "Brouillons",
      value: drafts.length,
      hint: scheduled > 0 ? plural(scheduled, "programmé") : "Aucun programmé",
      icon: FilePen,
    },
    {
      key: "methodes",
      label: "Méthodes expert",
      value: methodes.length,
      hint: `${methodesOf("joueur")} joueurs · ${methodesOf("match")} matchs`,
      icon: Gem,
    },
    {
      key: "comments",
      label: "Commentaires",
      value: comments.length,
      hint: toModerate > 0 ? `${toModerate} à modérer` : "Rien à modérer",
      alert: toModerate > 0,
      icon: MessageSquare,
    },
    {
      key: "users",
      label: "Utilisateurs",
      value: users.length,
      hint: plural(admins, "admin"),
      icon: Users,
    },
  ];

  const current = cards.find((c) => c.key === section)!;

  const selectSection = (key: Section) => {
    setSection(key);
    setSearch("");
  };

  return (
    <div className="max-w-[1300px] mx-auto px-4 py-6 sm:p-8 flex flex-col gap-6 font-Montserrat text-left">
      {/* En-tête et raccourcis */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h1 className="font-Bai_Jamjuree text-3xl sm:text-4xl font-bold uppercase">Tableau de bord</h1>
          <p className="text-sm text-gray-600 mt-1">Contenus, communauté et modération de Mémoire d&apos;Auxerrois.</p>
        </div>
        <div className="flex flex-col lg:items-end gap-2 text-sm font-semibold">
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/publish-article"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-aja-blue text-white hover:bg-orange-third transition-colors"
            >
              <Plus size={16} /> Nouvel article
            </Link>
            <Link
              href="/admin/create-methode-expert"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-gray-200 hover:border-aja-blue hover:text-aja-blue transition-colors"
            >
              <Plus size={16} /> Nouvelle méthode
            </Link>
          </div>
          <div className="flex flex-wrap gap-1 -ml-3 lg:ml-0 lg:-mr-3">
            {SHORTCUTS.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-gray-600 hover:bg-white hover:text-aja-blue transition-colors"
              >
                <Icon size={15} /> {label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Chiffres : un clic ouvre la section */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {cards.map(({ key, label, value, hint, alert, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => selectSection(key)}
            aria-pressed={section === key}
            className={`bg-white rounded-xl p-4 text-left shadow-sm transition-all hover:shadow-md last:col-span-2 lg:last:col-span-1 ${
              section === key ? "ring-2 ring-aja-blue" : "ring-1 ring-transparent"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</span>
              <span className="w-8 h-8 rounded-full bg-aja-blue/10 text-aja-blue flex items-center justify-center shrink-0">
                <Icon size={16} />
              </span>
            </div>
            <p className="font-Bai_Jamjuree text-3xl font-bold mt-1 tabular-nums">{value.toLocaleString("fr-FR")}</p>
            <p className={`text-xs mt-0.5 truncate ${alert ? "text-red-600 font-semibold" : "text-gray-500"}`}>{hint}</p>
          </button>
        ))}
      </div>

      <ScheduledBanner drafts={drafts} />

      {/* Section choisie */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4">
          <h2 className="font-Bai_Jamjuree text-xl font-bold uppercase">
            {current.label === "Articles en ligne" ? "Articles" : current.label}{" "}
            <span className="text-gray-400">({current.key === "articles" ? articles.length : current.value})</span>
          </h2>
          <div className="relative w-full sm:max-w-[300px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher…"
              className="w-full h-9 rounded-full pl-9 pr-4 text-sm border border-gray-200 focus:border-aja-blue focus:outline-none"
            />
          </div>
        </div>

        {section === "articles" && <ArticlesSection articles={articles} stats={stats} search={search} />}
        {section === "drafts" && <DraftsSection drafts={drafts} search={search} />}
        {section === "methodes" && <MethodesSection methodes={methodes} search={search} />}
        {section === "comments" && <CommentsSection comments={comments} search={search} />}
        {section === "users" && <UsersSection users={users} search={search} />}
      </div>
    </div>
  );
}
