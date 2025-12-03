// Interfaces Article

import { CommentSchemaType, DraftArticleSchemaType } from "@/types/forms";
import { ReactNode } from "react";

export interface Article {
  id_article: string;
  slug: string;
  title: string;
  teaser: string;
  imageUrl: string;
  content: string;
  author: string;
  userId: string;
  state: "pending" | "published" | "archived";
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}

export interface Draft {
  id_draft: string;
  slug: string | null | undefined;
  title: string | null | undefined;
  teaser: string | null | undefined;
  imageUrl: string | null | undefined;
  content: string | null | undefined;
  author: string | null | undefined;
  userId: string;
  state: "pending" | "published" | "archived";
  createdAt: Date;
  updatedAt: Date;
  tags: string[] | null | undefined;
}

export type ArticleSortKey = keyof Pick<
  Article,
  "title" | "author" | "createdAt" | "updatedAt" | "state"
>;

export interface GetURLParams {
  q?: string;
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
  id_article: string;
  articleData: {
    title: string;
    imageUrl: string;
    slug: string;
    teaser: string;
    content: string;
    author: string;
    tags: string[];
    state: string;
  };
}

export interface UpdateBrouillonFormProps {
  articleData: DraftArticleSchemaType;
  id_article: string;
  user: User | null;
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
export type Methodes =
  | MethodeCoach
  | MethodeJoueur
  | MethodeMatch
  | MethodeSaison;

export interface Methode {
  id_methode: string;
  typemethode: BaseMethodeData["typemethode"];
  keywords: string[];
  nomcoach: string | null;
  joueurnom: string | null;
  titrematch: string | null;
  saison: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type MethodeSortKey = keyof Pick<
  Methode,
  "typemethode" | "createdAt" | "updatedAt"
>;

export interface BaseMethodeData {
  typemethode: "joueur" | "saison" | "match" | "coach";
  id_methode: string;
  keywords: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MethodeJoueur extends BaseMethodeData {
  typemethode: "joueur";
  imagejoueur: string;
  joueurnom: string;
  poste: string;
  taille: string;
  piedfort: string;
  clubs: [string, string, string][];
  matchs: string;
  buts: string;
  passesd: string;
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
    matchs: string;
    buts: string;
    passesd: string;
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
  couleur1equipe1: string;
  couleur2equipe1: string;
  nomequipe1: string;
  systemeequipe1: string;
  couleur1equipe2: string;
  couleur2equipe2: string;
  nomequipe2: string;
  systemeequipe2: string;
  titulairesequipe1: [string, string, string, string?, string?, boolean?, boolean?][];
  titulairesequipe2: [string, string, string, string?, string?, boolean?, boolean?][];
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
  articleId: string;
  stars: number;
  title: string;
  content: string;
  pseudo: string;
  image: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CommentSortKey = keyof Pick<
  Comment,
  "title" | "stars" | "pseudo" | "createdAt" | "updatedAt"
>;

//Interfaces User

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  image?: string | null;
  birthday: Date | null;
  admin: boolean | null;
  mailArticle: boolean;
}

export type UserSortKey = keyof Pick<
  User,
  "name" | "email" | "birthday" | "createdAt" | "updatedAt" | "admin"
>;

export interface UpdateUserFromProps {
  userData: {
    name: string;
    email: string;
    birthday: Date;
    image: string | null;
  };
}

//Others

export interface DashboardElementProps {
  id: string;
  type: string;
  state?: string;
  isAdmin?: boolean | null;
}

export interface TabContentContainerProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<string>;
  users: User[];
  articles: Article[];
  methodes: Methodes[];
  comments: Comment[];
  isLoading: boolean;
}

export interface MatchAPI {
  journee: string;
  date: string;
  horaire: string;
  dom_ext: string;
  classement: string;
  contre: string;
  formation: string;
  spectateurs: string;
  resultat: string;
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
  position: number;
  equipe: string;
  matchs_joues: number;
  gagnes: number;
  nuls: number;
  perdus: number;
  buts_marques: number;
  buts_encaisses: number;
  difference: number;
  points: number;
  positionStatus: string;
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

export interface ArticleLikes {
  id: string;
  userId: string;
  likedAt: Date;
}

export interface PlayerStats {
  numero: string;
  nom: string;
  age: string;
  position: string;
  matches: string;
  titularisations: string;
  goals: number;
  assists: number;
  yellow_cards: string;
  red_cards: number;
  substitutions_in: string;
  substitutions_out: string;
  points_per_match: string;
  minutes: string;
}

export type ClassementSortKey = keyof Pick<
  Team,
  | "buts_encaisses"
  | "buts_marques"
  | "difference"
  | "equipe"
  | "gagnes"
  | "matchs_joues"
  | "nuls"
  | "perdus"
  | "points"
  | "position"
>;

export type StatsSortKey = keyof Pick<
  PlayerStats,
  | "assists"
  | "goals"
  | "matches"
  | "minutes"
  | "nom"
  | "numero"
  | "position"
  | "red_cards"
  | "substitutions_in"
  | "titularisations"
  | "yellow_cards"
>;
