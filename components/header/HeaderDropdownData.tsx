import React from "react";
import {
  House,
  Newspaper,
  Ellipsis,
  Trophy,
  List,
  Calendar1,
  ChartBarBig,
  MessageCircle,
  Mic2,
  DraftingCompass,
  GlassesIcon,
  LayoutDashboard,
  FolderLock,
  History,
  Landmark,
  Shield,
} from "lucide-react";

// Passé du club
export const HistoireDropdownData = [
  {
    title: "Historique",
    icon: <History size={20} />,
    image: "/_assets/img/ajaldc2010.webp",
    description:
      "Le parcours de l'AJA saison par saison depuis 1974, entre Ligue 1 et Ligue 2, et le bilan face à chaque adversaire.",
    link: "/historique",
    dropdown: false,
  },
  {
    title: "Palmarès & Records",
    icon: <Trophy size={20} />,
    image: "/_assets/img/djibrilcisserecords.avif",
    description:
      "Découvrez le palmarès et les records de l'AJ Auxerre, notamment durant les années d'or de l'histoire du club.",
    link: "/palmares",
    dropdown: false,
  },
  {
    title: "Méthodes expert",
    icon: <GlassesIcon size={20} />,
    image: "/_assets/img/methodeexpertpic.jpg",
    description:
      "Retrouvez toutes les fiches des joueurs et des coachs, et les compositions des grands matchs et des saisons de l'AJA.",
    link: "/methodes-expert",
    dropdown: false,
  },
];

// Saison en cours, jeux et culture du club
export const DiversDropdownData = [
  {
    title: "Effectif Actuel",
    icon: <List size={20} />,
    image: "/_assets/img/danois.webp",
    description:
      "Vous avez accès à l'ensemble des membres de l'effectif de l'AJA et leurs informations personnelles, ainsi que les membres du staff.",
    link: "/effectif-actuel",
    dropdown: false,
  },
  {
    title: "Calendrier",
    icon: <Calendar1 size={20} />,
    image: "/_assets/img/calendrier.webp",
    description:
      "Accédez maintenant au calendrier complet des matchs de l'AJ Auxerre sur la saison en cours.",
    link: "/calendrier",
    dropdown: false,
  },
  {
    title: "Classements & Stats",
    icon: <ChartBarBig size={20} />,
    image: "/_assets/img/ligue2.jpg",
    description:
      "Visualisez le classement du championnat, saison en cours ou passée, et les statistiques des joueurs.",
    link: "/classement-statistiques",
    dropdown: false,
  },
  {
    title: "Quiz",
    icon: <MessageCircle size={20} />,
    image: "/_assets/img/martins.webp",
    description:
      "Essayez-vous au quiz 100% AJA et testez vos connaissances sur le plus grand club bourguignon.",
    link: "/quiz",
    dropdown: false,
  },
  {
    title: "Chants",
    icon: <Mic2 size={20} />,
    image: "/_assets/img/public.webp",
    description:
      "Retrouvez la liste des chants auxerrois pour être plongés dans l'ambiance la prochaine fois que vous irez au stade !",
    link: "/chants",
    dropdown: false,
  },
];

export const AdminDropdownData = [
  {
    title: "Publier un article",
    icon: <Newspaper size={20} />,
    image: "/_assets/img/writingpaper.jpg",
    description: "Je souhaite rédiger un article",
    link: "/admin/publish-article",
    dropdown: false,
  },
  {
    title: "Consulter les brouillons",
    icon: <DraftingCompass size={20} />,
    image: "/_assets/img/drafts.jpg",
    description: "Consulter la liste des brouillons sur Mémoire d'Auxerrois",
    link: "/admin/brouillons",
    dropdown: false,
  },
  {
    title: "Créer une méthode expert",
    icon: <GlassesIcon size={20} />,
    image: "/_assets/img/methodeexpertpic.jpg",
    description: "Accéder au formulaire de création d'une méthode expert",
    link: "/admin/create-methode-expert",
    dropdown: false,
  },
  {
    title: "Questions du quiz",
    icon: <MessageCircle size={20} />,
    image: "/_assets/img/martins.webp",
    description: "Ajouter, modifier ou désactiver les questions du quiz",
    link: "/admin/quiz",
    dropdown: false,
  },
  {
    title: "Logos des clubs",
    icon: <Shield size={20} />,
    image: "/_assets/img/ajaldc2010.webp",
    description: "Gérer les logos de chaque club selon les époques",
    link: "/admin/logos",
    dropdown: false,
  },
  {
    title: "Dashboard Admin",
    icon: <LayoutDashboard size={20} />,
    image: "/_assets/img/adminicon.jpg",
    description:
      "Vous avez accès à l'ensemble des outils administratifs de Mémoire d'Auxerrois",
    link: "/admin/dashboard",
    dropdown: false,
  },
];

export interface MenuEntry {
  title: string;
  icon: React.ReactNode;
  link: string;
  // « admin » : visible des administrateurs seulement
  type: "vanilla" | "admin";
  // Liens du menu déroulant ; absent pour un lien direct
  items?: typeof DiversDropdownData;
}

export const SidebarData: MenuEntry[] = [
  { title: "Accueil", icon: <House size={20} />, link: "/", type: "vanilla" },
  { title: "Articles & Histoires", icon: <Newspaper size={20} />, link: "/articles", type: "vanilla" },
  { title: "Histoire", icon: <Landmark size={20} />, link: "/historique", type: "vanilla", items: HistoireDropdownData },
  { title: "Divers", icon: <Ellipsis size={20} />, link: "/calendrier", type: "vanilla", items: DiversDropdownData },
  { title: "Admin", icon: <FolderLock size={20} />, link: "/admin/dashboard", type: "admin", items: AdminDropdownData },
];

export default SidebarData;
