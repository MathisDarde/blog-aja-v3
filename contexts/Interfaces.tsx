// Interfaces Article

import { ArticleSchemaType, InscSchemaType } from "@/types/forms";
import { ReactNode } from "react";

export interface Article {
  id_article: string;
  title: string;
  teaser: string;
  imageUrl: string;
  content: string;
  author: string;
  userId: string;
  publishedAt: Date;
  updatedAt: Date;
  tags: string[];
}

export type ArticleSortKey = keyof Pick<
  Article,
  "title" | "author" | "publishedAt"
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
  keywords: string[];
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
  articleData: ArticleSchemaType;
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
  id: string;
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

export interface MethodeProps {
  methode: BaseMethodeData;
  onClose: () => void;
}

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

export interface MethodeSaison extends BaseMethodeData {
  typemethode: "saison";
  saison: string;
  imgterrain: string;
  coach: string;
  systeme: string;
  remplacants: [string, string, string][];
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

export interface MethodeCoach extends BaseMethodeData {
  typemethode: "coach";
  imagecoach: string;
  nomcoach: string;
  clubscoach: [string, string, string][];
  palmares: string[];
  statistiques: string;
}

// Interfaces Comment

export interface Comment {
  id_comment: string;
  stars: string;
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
  userData: InscSchemaType;
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
  age: number;
  poste: string;
  nationalite: string;
  natflag: string;
  number: number;
  imagejoueur: string;
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
