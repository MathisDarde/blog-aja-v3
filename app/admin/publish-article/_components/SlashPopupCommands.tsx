export const PopupCategories = {
  textelement: { label: "Élément de texte", icon: "T" },
  component: { label: "Composant", icon: "C" },
};

export const PopupOptions = [
  {
    id: "h2",
    title: "Titre 2",
    icon: "H2",
    description: "Gros titre de section",
    parent: "textelement",
  },
  {
    id: "h3",
    title: "Titre 3",
    icon: "H3",
    description: "Sous-titre",
    parent: "textelement",
  },
  {
    id: "bulletList",
    title: "Liste à puces",
    icon: "•",
    description: "Liste simple",
    parent: "textelement",
  },
  {
    id: "citation",
    title: "Citation",
    icon: "“",
    description: "Citer un auteur",
    parent: "textelement",
  },
  {
    id: "image",
    title: "Image",
    icon: "🖼",
    description: "Importer un média",
    parent: "component",
  },
  {
    id: "youtube",
    title: "Vidéo",
    icon: "📺",
    description: "Lien YouTube",
    parent: "component",
  },
  {
    id: "separator",
    title: "Séparateur",
    icon: "—",
    description: "Ligne de rupture",
    parent: "component",
  },
  {
    id: "column",
    title: "Colonnes",
    icon: "◫",
    description: "Layout complexe",
    parent: "component",
  },
];
