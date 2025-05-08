import React from "react";
import { House, Newspaper, ShoppingCart, Ellipsis } from "lucide-react";

export const SidebarData = [
  {
    title: "Accueil",
    icon: <House size={20} />,
    link: "/",
    type: "vanilla",
    dropdown: false,
  },
  {
    title: "Articles & Histoires",
    icon: <Newspaper size={20} />,
    link: "/articles",
    type: "vanilla",
    dropdown: false,
  },
  {
    title: "Boutique",
    icon: <ShoppingCart size={20} />,
    link: "/boutique",
    type: "vanilla",
    dropdown: false,
  },
  {
    title: "Divers",
    icon: <Ellipsis size={20} />,
    link: "/dropdowndivers",
    type: "vanilla",
    dropdown: true,
  },
  {
    title: "Admin",
    icon: <Ellipsis size={20} />,
    link: "/dropdownadmin",
    type: "admin",
    dropdown: true,
  },
];

export const AutresDropdownData = [
  {
    title: "Palmarès et Records",
    image: "/_assets/img/djibrilcisserecords.avif",
    description:
      "Découvrez le palmarès et les records de l'AJ Auxerre, notamment durant les années d'or de l'histoire du club.",
    link: "/palmares",
    dropdown: false,
  },
  {
    title: "Effectif Actuel",
    image: "/_assets/img/gawet.webp",
    description:
      "Vous avez accès à l'ensemble des membres de l'effectif de l'AJA et leurs informations personnelles, ainsi que les membres du staff.",
    link: "/effectifactuel",
    dropdown: false,
  },
  {
    title: "Quiz",
    image: "/_assets/img/martins.webp",
    description:
      "Essayez-vous au quiz 100% AJA et testez vos connaissances sur le plus grand club bourguignon.",
    link: "/quiz",
    dropdown: false,
  },
];

export const AdminDropdownData = [
  {
    title: "Publier un article",
    image: "/_assets/img/writingpaper.jpg",
    description: "Je souhaite rédiger un article",
    link: "/publisharticle",
    dropdown: false,
  },
  {
    title: "Créer une méthode expert",
    image: "/_assets/img/methodeexpertpic.jpg",
    description: "Accéder au formulaire de création d'une méthode expert",
    link: "/createmethodeexpert",
    dropdown: false,
  },
  {
    title: "Dashboard Admin",
    image: "/_assets/img/adminicon.jpg",
    description:
      "Vous avez accès à l'ensemble des outils administratifs de Mémoire d'Auxerrois.",
    link: "/admindashboard",
    dropdown: false,
  },
];

export default SidebarData;
