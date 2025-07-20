// Interfaces Article

import { ArticleSchemaType, CommentSchemaType } from "@/types/forms";
import { ReactNode } from "react";

export interface Article {
  id_article: string;
  title: string;
  teaser: string;
  imageUrl: string;
  content: string;
  author: string;
  userId: string;
  state: string;
  publishedAt: Date;
  updatedAt: Date;
  tags: string[];
}

export type ArticleSortKey = keyof Pick<
  Article,
  "title" | "author" | "publishedAt" | "state"
>;

export interface GetURLParams {
  query?: string;
  year?: string;
  player?: string;
  league?: string;
}

export interface Keyword {
  id_methode: string;
  typemethode: string;
  keywordsList: string[];
}

export interface KeywordProps {
  text: string;
  keywords: Keyword[];
  onKeywordClick: (id: string, type: string) => void;
}

export interface Tags {
  tag: string;
  value: string;
  img: string;
  type: string;
}

export interface UpdateArticleFormProps {
  articleData: {
    title: string;
    imageUrl: string;
    teaser: string;
    content: string;
    author: string;
    tags: string[];
    state: string;
  };
}

export interface UpdateBrouillonFormProps {
  articleData: ArticleSchemaType;
  setIsEditing: React.Dispatch<boolean>;
  id_article: string;
}

export interface UpdateCommentFormProps {
  commentId: string;
  commentData: CommentSchemaType;
}

export interface Filter {
  id: number;
  tag: string;
  value: string;
  img: string;
  type: string;
}

export interface SearchInputProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFilterClick: () => void;
  onSubmit: (event: React.FormEvent) => void;
}

// Interfaces Methode

export interface Methode {
  id_methode: string;
  typemethode: BaseMethodeData["typemethode"];
  keywords: string[];
  nomcoach: string | null;
  joueurnom: string | null;
  titrematch: string | null;
  saison: string | null;
  created_at: Date;
  updated_at: Date;
}

export type MethodeSortKey = keyof Pick<
  Methode,
  | "typemethode"
  | "nomcoach"
  | "joueurnom"
  | "titrematch"
  | "saison"
  | "created_at"
>;

export interface BaseMethodeData {
  typemethode: "joueur" | "saison" | "match" | "coach";
  id_methode: string;
  keywords: string[];
}

export interface MethodeJoueur extends BaseMethodeData {
  typemethode: "joueur";
  imagejoueur: string;
  joueurnom: string;
  poste: string;
  taille: string;
  piedfort: string;
  clubs: [string, string, string][];
  matchs: number;
  buts: number;
  passesd: number;
}

export interface UpdateMethodeJoueurFromProps {
  selectedMethode: {
    id_methode: string;
    keywords: string[];
    imagejoueur: string | null;
    joueurnom: string;
    poste: string;
    taille: string;
    piedfort: string;
    clubs: [string, string, string][];
    matchs: number;
    buts: number;
    passesd: number;
  };
}

export interface MethodeSaison extends BaseMethodeData {
  typemethode: "saison";
  saison: string;
  imgterrain: string;
  coach: string;
  systeme: string;
  remplacants: [string, string, string][];
}

export interface UpdateMethodeSaisonFromProps {
  selectedMethode: {
    id_methode: string;
    keywords: string[];
    saison: string;
    imgterrain: string | null;
    coach: string;
    systeme: string;
    remplacants: [string, string, string][];
  };
}

export interface MethodeMatch extends BaseMethodeData {
  typemethode: "match";
  titrematch: string;
  imgterrain: string;
  couleur1equipe1: string;
  couleur2equipe1: string;
  nomequipe1: string;
  systemeequipe1: string;
  couleur1equipe2: string;
  couleur2equipe2: string;
  nomequipe2: string;
  systemeequipe2: string;
  remplacantsequipe1: [string, string, string, string?, string?][];
  remplacantsequipe2: [string, string, string, string?, string?][];
  stade: string;
  date: string;
}

export interface UpdateMethodeMatchFromProps {
  selectedMethode: {
    id_methode: string;
    keywords: string[];
    titrematch: string;
    imgterrain: string | null;
    couleur1equipe1: string;
    couleur2equipe1: string;
    nomequipe1: string;
    systemeequipe1: string;
    couleur1equipe2: string;
    couleur2equipe2: string;
    nomequipe2: string;
    systemeequipe2: string;
    remplacantsequipe1: [string, string, string, string?, string?][];
    remplacantsequipe2: [string, string, string, string?, string?][];
    stade: string;
    date: string;
  };
}

export interface MethodeCoach extends BaseMethodeData {
  typemethode: "coach";
  imagecoach: string;
  nomcoach: string;
  clubscoach: [string, string, string][];
  palmares: [string, string, string][];
  statistiques: string;
}

export interface UpdateMethodeCoachFromProps {
  selectedMethode: {
    id_methode: string;
    keywords: string[];
    nomcoach: string;
    imagecoach: string | null;
    clubscoach: string[][];
    palmares: string[][];
    statistiques: string;
  };
}

// Interfaces Comment

export interface Comment {
  id_comment: string;
  stars: number;
  title: string;
  content: string;
  pseudo: string;
  photodeprofil: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CommentSortKey = keyof Pick<
  Comment,
  "title" | "stars" | "pseudo" | "createdAt"
>;

//Interfaces User

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  photodeprofil?: string | null;
  birthday: Date;
  admin?: boolean;
}

export type UserSortKey = keyof Pick<
  User,
  "name" | "email" | "birthday" | "createdAt" | "admin"
>;

export interface UpdateUserFromProps {
  userData: {
    name: string;
    email: string;
    birthday: Date;
    photodeprofil: string | null;
  };
}

//Others

export interface DashboardElementProps {
  id: string;
  type: string;
}

export interface TabContentContainerProps {
  activeMenu: string;
}

export interface MatchAPI {
  round: string;
  date: string;
  time: string;
  team1: string;
  team2: string;
  score: {
    ht: string[];
    ft: string[];
  };
}

export interface Category {
  tag: string;
  value: string;
  img: string;
  type?: string;
}

export interface Answer {
  text: string;
  correct: boolean;
}

export interface Question {
  question: string;
  answers: Answer[];
}

export interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: "submit" | "reset" | "button";
  className?: string;
  disabled?: boolean;
}

export interface Team {
  idTeam: string;
  intRank: number;
  strTeam: string;
  intPlayed: number;
  intWin: number;
  intDraw: number;
  intLoss: number;
  intGoalsFor: number;
  intGoalsAgainst: number;
  intGoalDifference: number;
  intPoints: number;
  strDescription: string;
}

export interface SortParams<T> {
  elements: T[];
  sortKey: keyof T;
  sortOrder: "asc" | "desc";
}

export type Joueur = {
  nom: string;
  poste: string;
  numéro: number;
  fiche_url: string;
  image_url: string;
  date_naissance: string;
  age: number;
  ville: string;
  nationalite: string;
  taille: string;
  poids: string;
  pied: string;
};

export type Trophee = {
  id: number;
  title: string;
  img: string;
  annee: string;
  nombre: number;
};

export type RecordType = {
  title: string;
  image: string;
  alt: string;
  rows: RecordRow[];
};

export type RecordRow = {
  category: string;
  record: string;
  player: string;
};

export type ModalParamsType = {
  object: string;
  type: string;
  onConfirm: () => void;
  onCancel: () => void;
} | null;
