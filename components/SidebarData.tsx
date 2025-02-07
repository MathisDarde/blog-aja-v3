import React from "react";
import {
  House,
  Newspaper,
  ShoppingCart,
  Ellipsis,
  Trophy,
  Clipboard,
  MessageCircleMore,
} from "lucide-react";

export const SidebarData = [
  {
    title: "Accueil",
    icon: <House size={20} />,
    link: "/",
    dropdown: false,
  },
  {
    title: "Articles & Histoires",
    icon: <Newspaper size={20} />,
    link: "/articles",
    dropdown: false,
  },
  {
    title: "Boutique",
    icon: <ShoppingCart size={20} />,
    link: "/boutique",
    dropdown: false,
  },
  {
    title: "Autres",
    icon: <Ellipsis size={20} />,
    link: "/dropdown",
    dropdown: true,
  },
];

export const AutresDropdownData = [
  {
    title: "Palmarès et Records",
    icon: <Trophy size={20} />,
    link: "/palmares",
    dropdown: false,
  },
  {
    title: "Effectif Actuel",
    icon: <Clipboard size={20} />,
    link: "/effectifactuel",
    dropdown: false,
  },
  {
    title: "Quiz",
    icon: <MessageCircleMore size={20} />,
    link: "/quiz",
    dropdown: false,
  },
];

export default SidebarData;
