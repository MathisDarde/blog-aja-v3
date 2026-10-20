import { GameSystems } from "@/components/GameSystems";
import { z } from "zod";

export const LoginSchema = z.object({
  email: z
    .string()
    .email({ message: "Le mail que vous avez entré n'est pas valide." }),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir plus de 8 caractères !")
    .nonempty({ message: "Veuillez entrer un mot de passe." }),
});

export const InscSchema = z
  .object({
    name: z.string().nonempty({ message: "Veuillez renseigner un pseudo." }),
    birthday: z.union([
      z
        .string()
        .refine(
          (val) => {
            const date = new Date(val);
            return !isNaN(date.getTime()) && date < new Date();
          },
          {
            message: "La date de naissance doit être valide et dans le passé.",
          }
        )
        .transform((val) => new Date(val)),
      z.date(),
    ]),
    email: z
      .string()
      .email({ message: "Le mail que vous avez entré n'est pas valide." }),
    password: z
      .string()
      .min(8, "Veuillez entrer plus de 8 caractères !")
      .nonempty({ message: "Veuillez entrer un mot de passe." }),
    confirmPassword: z
      .string()
      .min(8, "Veuillez entrer plus de 8 caractères !")
      .nonempty({ message: "Veuillez confirmer le mot de passe." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas !",
    path: ["confirmPassword"],
  });

export const UpdateProfileSchema = z.object({
  name: z.string().nonempty({ message: "Veuillez renseigner un pseudo." }),
  birthday: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Date de naissance invalide"),
  email: z
    .string()
    .email({ message: "Le mail que vous avez entré n'est pas valide." })
    .nonempty({ message: "Veuillez renseigner un email." }),
  image: z
    .string()
    .url()
    .or(z.instanceof(File))
    .or(z.literal(""))
    .optional()
    .nullable(),
});

export const ArticleSchema = z.object({
  title: z
    .string()
    .nonempty({ message: "Le titre de l'article doit être renseigné." }),
  slug: z
    .string()
    .nonempty({ message: "Le slug de l'article doit être renseigné." }),
  teaser: z
    .string()
    .nonempty({ message: "Le teaser de l'article doit être renseigné." }),
  content: z
    .string()
    .nonempty({ message: "Le contenu de l'article ne peut pas être nul." }),
  author: z
    .string()
    .nonempty({ message: "L'auteur de l'article doit être renseigné." }),
  tags: z.array(
    z.string().nonempty({ message: "Au moins un tag doit être checké." })
  ),
  imageUrl: z.union([z.string().url(), z.instanceof(File)]),
});

export const UpdateArticleSchema = z.object({
  title: z
    .string()
    .nonempty({ message: "Le titre de l'article doit être renseigné." }),
  slug: z
    .string()
    .nonempty({ message: "Le slug de l'article doit être renseigné." }),
  teaser: z
    .string()
    .nonempty({ message: "Le teaser de l'article doit être renseigné." }),
  content: z
    .string()
    .nonempty({ message: "Le contenu de l'article ne peut pas être nul." }),
  author: z
    .string()
    .nonempty({ message: "L'auteur de l'article doit être renseigné." }),
  tags: z.array(
    z.string().nonempty({ message: "Au moins un tag doit être checké." })
  ),
  state: z.string().nonempty(),
  imageUrl: z.union([z.string().url(), z.instanceof(File)]),
});

export const DraftArticleSchema = z.object({
  slug: z.string().optional(),
  title: z.string().optional(),
  teaser: z.string().optional(),
  content: z.string().optional(),
  author: z.string().optional(),
  tags: z.array(z.string().optional()),
  imageUrl: z
    .string()
    .url()
    .or(z.instanceof(File))
    .or(z.literal(""))
    .optional(),
});

export const CommentSchema = z.object({
  stars: z.number(),
  title: z
    .string()
    .nonempty({ message: "Le titre du commentaire ne peut pas être vide." }),
  content: z
    .string()
    .nonempty({ message: "Le contenu du message ne peut pas être vide." }),
});

export const QuizQuestionSchema = z
  .object({
    question: z.string().trim().min(5, { message: "La question est trop courte." }),
    answers: z
      .array(z.string().trim().min(1, { message: "Une réponse ne peut pas être vide." }))
      .min(2, { message: "Il faut au moins deux réponses." })
      .max(6, { message: "Six réponses au maximum." }),
    correctIndex: z.number().int().min(0),
    explanation: z.string().trim().optional(),
    active: z.boolean(),
  })
  .refine((data) => data.correctIndex < data.answers.length, {
    message: "Choisissez la bonne réponse.",
    path: ["correctIndex"],
  });

export const SaisonTitulaireSchema = z.object({
  nom: z.string().default(""),
  numero: z.string().default(""),
  poste: z.string().default(""),
});
export const SaisonRemplacantSchema = z.object({
  nom: z.string().default(""),
  drapeau: z.string().default(""),
  poste: z.string().default(""),
});

export const MethodeSaisonSchema = z.object({
  saison: z.string().nonempty({ message: "La saison doit être renseignée." }),
  coach: z
    .string()
    .nonempty({ message: "Le nom du coach doit être renseigné." }),
  systeme: z.enum(GameSystems, {
    errorMap: () => ({ message: "Veuillez sélectionner un système de jeu." }),
  }),

  titulaires: z.array(SaisonTitulaireSchema),
  remplacants: z.array(SaisonRemplacantSchema),
});
export const UpdateMethodeSaisonSchema = z.object({
  saison: z.string().nonempty({ message: "La saison doit être renseignée." }),
  coach: z
    .string()
    .nonempty({ message: "Le nom du coach doit être renseigné." }),
  systeme: z.enum(GameSystems, {
    errorMap: () => ({ message: "Veuillez sélectionner un système de jeu." }),
  }),
  titulaires: z.array(SaisonTitulaireSchema),
  remplacants: z.array(SaisonRemplacantSchema),
});

export const MatchTitulaireSchema = z.object({
  nom: z.string().default(""),
  numero: z.string().default(""),
  poste: z.string().default(""),
  sortie: z.string().default("").optional(),
  buts: z.string().default("").optional(),
  cartonJaune: z.boolean().default(false).optional(),
  cartonRouge: z.boolean().default(false).optional(),
});
export const MatchRemplacantSchema = z.object({
  nom: z.string().default(""),
  drapeau: z.string().default(""),
  poste: z.string().default(""),
  entree: z.string().default("").optional(),
  buts: z.string().default("").optional(),
  cartonJaune: z.boolean().default(false).optional(),
  cartonRouge: z.boolean().default(false).optional(),
});

// Coach de chaque équipe : obligatoire, enregistré à la fin des remplaçants (poste « Coach »)
const matchCoachSchema = (equipe: string) =>
  z.object({
    nom: z
      .string()
      .trim()
      .nonempty({ message: `Le coach de l'équipe ${equipe} doit être renseigné.` }),
    drapeau: z.string().default(""),
    poste: z.string().default("Coach"),
  });

// Le titre du match est construit à partir de ces champs (buildMatchTitle)
const matchScoreFields = {
  abreviationequipe1: z
    .string()
    .trim()
    .nonempty({ message: "L'abréviation de l'équipe à domicile doit être renseignée." }),
  abreviationequipe2: z
    .string()
    .trim()
    .nonempty({ message: "L'abréviation de l'équipe à l'extérieur doit être renseignée." }),
  scoreequipe1: z
    .string()
    .trim()
    .regex(/^\d+$/, { message: "Le score de l'équipe à domicile doit être un nombre." }),
  scoreequipe2: z
    .string()
    .trim()
    .regex(/^\d+$/, { message: "Le score de l'équipe à l'extérieur doit être un nombre." }),
  tabequipe1: z
    .string()
    .trim()
    .regex(/^\d*$/, { message: "Les tirs au but doivent être des nombres." })
    .default(""),
  tabequipe2: z
    .string()
    .trim()
    .regex(/^\d*$/, { message: "Les tirs au but doivent être des nombres." })
    .default(""),
  prolongation: z.boolean().default(false),
  logoequipe1: z.string().default(""),
  logoequipe2: z.string().default(""),
  coachequipe1: matchCoachSchema("à domicile"),
  coachequipe2: matchCoachSchema("à l'extérieur"),
};

const tabsComplete = (data: { tabequipe1: string; tabequipe2: string }) =>
  !data.tabequipe1 === !data.tabequipe2;
const tabsMessage = {
  message: "Renseigne les tirs au but des deux équipes, ou aucun.",
  path: ["tabequipe2"],
};

export const MethodeMatchSchema = z.object({
  ...matchScoreFields,
  couleur1equipe1: z
    .string()
    .nonempty({ message: "La couleur doit apparaître sous la forme #xxxxxx." }),
  couleur2equipe1: z
    .string()
    .nonempty({ message: "La couleur doit apparaître sous la forme #xxxxxx." }),
  nomequipe1: z
    .string()
    .nonempty({ message: "Le nom de l'équipe doit être renseigné." }),
  systemeequipe1: z.enum(GameSystems, {
    errorMap: () => ({ message: "Veuillez sélectionner un système de jeu." }),
  }),
  couleur1equipe2: z
    .string()
    .nonempty({ message: "La couleur doit apparaître sous la forme #xxxxxx." }),
  couleur2equipe2: z
    .string()
    .nonempty({ message: "La couleur doit apparaître sous la forme #xxxxxx." }),
  nomequipe2: z
    .string()
    .nonempty({ message: "Le nom de l'équipe doit être renseigné." }),
  systemeequipe2: z.enum(GameSystems, {
    errorMap: () => ({ message: "Veuillez sélectionner un système de jeu." }),
  }),
  titulairesequipe1: z.array(MatchTitulaireSchema),
  remplacantsequipe1: z.array(MatchRemplacantSchema),
  titulairesequipe2: z.array(MatchTitulaireSchema),
  remplacantsequipe2: z.array(MatchRemplacantSchema),
  stade: z.string().nonempty({
    message: "Le nom du stade doit être renseigné.",
  }),
  date: z.string().nonempty({
    message: "La date du match doit être renseignée.",
  }),
}).refine(tabsComplete, tabsMessage);
export const UpdateMethodeMatchSchema = z.object({
  ...matchScoreFields,
  couleur1equipe1: z
    .string()
    .nonempty({ message: "La couleur doit apparaître sous la forme #xxxxxx." }),
  couleur2equipe1: z
    .string()
    .nonempty({ message: "La couleur doit apparaître sous la forme #xxxxxx." }),
  nomequipe1: z
    .string()
    .nonempty({ message: "Le nom de l'équipe doit être renseigné." }),
  systemeequipe1: z.enum(GameSystems, {
    errorMap: () => ({ message: "Veuillez sélectionner un système de jeu." }),
  }),
  couleur1equipe2: z
    .string()
    .nonempty({ message: "La couleur doit apparaître sous la forme #xxxxxx." }),
  couleur2equipe2: z
    .string()
    .nonempty({ message: "La couleur doit apparaître sous la forme #xxxxxx." }),
  nomequipe2: z
    .string()
    .nonempty({ message: "Le nom de l'équipe doit être renseigné." }),
  systemeequipe2: z.enum(GameSystems, {
    errorMap: () => ({ message: "Veuillez sélectionner un système de jeu." }),
  }),
  titulairesequipe1: z.array(MatchTitulaireSchema),
  remplacantsequipe1: z.array(MatchRemplacantSchema),
  titulairesequipe2: z.array(MatchTitulaireSchema),
  remplacantsequipe2: z.array(MatchRemplacantSchema),
  stade: z.string().nonempty({
    message: "Le nom du stade doit être renseigné.",
  }),
  date: z.string().nonempty({
    message: "La date du match doit être renseignée.",
  }),
}).refine(tabsComplete, tabsMessage);

export const MethodeJoueurSchema = z.object({
  joueurnom: z
    .string()
    .nonempty({ message: "Le nom du joueur doit être renseigné." }),
  poste: z
    .string()
    .nonempty({ message: "Le poste du joueur doit être renseigné." }),
  taille: z
    .string()
    .nonempty({ message: "La taille du joueur doit être renseignée." }),
  piedfort: z
    .string()
    .nonempty({ message: "Le pied fort du joueur doit être renseigné." }),
  clubs: z.array(
    z.array(
      z.string().nonempty({
        message: "Les clubs du joueur doivent être renseignés.",
      })
    )
  ),
  matchs: z.string().nonempty({
    message: "Le nombre de matchs du joueur doit être renseigné.",
  }),
  buts: z.string().nonempty({
    message: "Le nombre de buts du joueur doit être renseigné.",
  }),
  passesd: z.string().nonempty({
    message: "Le nombre de passes décisives du joueur doit être renseigné.",
  }),
  imagejoueur: z.union([z.string().url(), z.instanceof(File)]),
});

export const UpdateMethodeJoueurSchema = z.object({
  joueurnom: z
    .string()
    .nonempty({ message: "Le nom du joueur doit être renseigné." }),
  poste: z
    .string()
    .nonempty({ message: "Le poste du joueur doit être renseigné." }),
  taille: z
    .string()
    .nonempty({ message: "La taille du joueur doit être renseignée." }),
  piedfort: z
    .string()
    .nonempty({ message: "Le pied fort du joueur doit être renseigné." }),
  clubs: z.array(
    z.array(
      z.string().nonempty({
        message: "Les clubs du joueur doivent être renseignés.",
      })
    )
  ),
  matchs: z.string().nonempty({
    message: "Le nombre de matchs du joueur doit être renseigné.",
  }),
  buts: z.string().nonempty({
    message: "Le nombre de buts du joueur doit être renseigné.",
  }),
  passesd: z.string().nonempty({
    message: "Le nombre de passes décisives du joueur doit être renseigné.",
  }),
  imagejoueur: z.union([z.string().url(), z.instanceof(File)]),
});

export const MethodeCoachSchema = z.object({
  nomcoach: z
    .string()
    .nonempty({ message: "Le nom du coach doit être renseigné." }),
  clubscoach: z.array(
    z.array(
      z.string().nonempty({
        message: "Les clubs du coach doivent être renseignés.",
      })
    )
  ),
  palmares: z.array(
    z.array(
      z.string().nonempty({
        message: "Le palmarès du coach ne peut pas être vide",
      })
    )
  ),
  statistiques: z.string().nonempty({
    message: "Les statistiques du coach doivent être renseignées.",
  }),
  imagecoach: z.union([z.string().url(), z.instanceof(File)]),
});
export const UpdateMethodeCoachSchema = z.object({
  nomcoach: z
    .string()
    .nonempty({ message: "Le nom du coach doit être renseigné." }),
  clubscoach: z.array(
    z.array(
      z.string().nonempty({
        message: "Les clubs du coach doivent être renseignés.",
      })
    )
  ),
  palmares: z.array(
    z.array(
      z.string().nonempty({
        message: "Le palmarès du coach ne peut pas être vide",
      })
    )
  ),
  statistiques: z.string().nonempty({
    message: "Les statistiques du coach doivent être renseignées.",
  }),
  imagecoach: z.union([z.string().url(), z.instanceof(File)]),
});

// Une version du logo d'un club (/admin/logos)
const ClubLogoPeriodSchema = z
  .object({
    legende: z.string().trim().max(80, { message: "Nom de version trop long (80 caractères)." }),
    de: z.number().int().min(1850).max(2100).nullable(),
    a: z.number().int().min(1850).max(2100).nullable(),
    logo: z
      .string()
      .trim()
      .min(1, { message: "Chaque version doit avoir un logo." })
      .refine((value) => /^https:\/\//.test(value) || value.startsWith("/"), {
        message: "Le logo doit être une adresse https:// ou un fichier du site.",
      }),
  })
  .refine((period) => period.de == null || period.a == null || period.de <= period.a, {
    message: "La première saison d'une version doit précéder sa dernière saison.",
  });

export const ClubLogosSchema = z.object({
  // Vide pour un nouveau club, rangé alors sous son nom
  key: z.string().trim(),
  nom: z.string().trim().min(2, { message: "Le nom du club est obligatoire." }).max(80),
  noms: z.array(z.string().trim().min(1).max(80)).max(30),
  periodes: z.array(ClubLogoPeriodSchema).max(40, { message: "40 versions au maximum." }),
});
