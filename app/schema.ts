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
  image: z.string().url().or(z.instanceof(File)).or(z.literal("")).optional(),
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

export const MethodeSaisonSchema = z.object({
  keywords: z
    .array(
      z.object({
        value: z.string().min(1, "Un mot-clé ne peut pas être vide"),
      })
    )
    .min(1, "Ajoute au moins un mot-clé"),
  saison: z.string().nonempty({ message: "La saison doit être renseignée." }),
  coach: z
    .string()
    .nonempty({ message: "Le nom du coach doit être renseigné." }),
  systeme: z
    .string()
    .nonempty({ message: "Le système de jeu doit être renseigné." }),
  remplacants: z.array(
    z.array(
      z.string().nonempty({
        message: "Les remplaçants de jeu doivent être renseignés.",
      })
    )
  ),
});
export const UpdateMethodeSaisonSchema = z.object({
  keywords: z
    .array(
      z.object({
        value: z.string().min(1, "Un mot-clé ne peut pas être vide"),
      })
    )
    .min(1, "Ajoute au moins un mot-clé"),
  saison: z.string().nonempty({ message: "La saison doit être renseignée." }),
  coach: z
    .string()
    .nonempty({ message: "Le nom du coach doit être renseigné." }),
  systeme: z
    .string()
    .nonempty({ message: "Le système de jeu doit être renseigné." }),
  remplacants: z.array(
    z.array(
      z.string().nonempty({
        message: "Les remplaçants de jeu doivent être renseignés.",
      })
    )
  ),
  imgterrain: z.string().optional(),
});

export const MethodeMatchSchema = z.object({
  keywords: z
    .array(
      z.object({
        value: z.string().min(1, "Un mot-clé ne peut pas être vide"),
      })
    )
    .min(1, "Ajoute au moins un mot-clé"),
  titrematch: z
    .string()
    .nonempty({ message: "Le titre du match doit être renseigné." }),
  couleur1equipe1: z
    .string()
    .nonempty({ message: "La couleur doit apparaître sous la forme #xxxxxx." }),
  couleur2equipe1: z
    .string()
    .nonempty({ message: "La couleur doit apparaître sous la forme #xxxxxx." }),
  nomequipe1: z
    .string()
    .nonempty({ message: "Le nom de l'équipe doit être renseigné." }),
  systemeequipe1: z
    .string()
    .nonempty({ message: "Le système de l'équipe doit être renseigné." }),
  couleur1equipe2: z
    .string()
    .nonempty({ message: "La couleur doit apparaître sous la forme #xxxxxx." }),
  couleur2equipe2: z
    .string()
    .nonempty({ message: "La couleur doit apparaître sous la forme #xxxxxx." }),
  nomequipe2: z
    .string()
    .nonempty({ message: "Le nom de l'équipe doit être renseigné." }),
  systemeequipe2: z
    .string()
    .nonempty({ message: "Le système de l'équipe doit être renseigné." }),
  remplacantsequipe1: z.array(
    z
      .array(z.string())
      .min(3, "Chaque remplaçant doit avoir au moins nom, drapeau et poste")
      .refine((arr) => arr[0] && arr[0].length > 0, {
        message: "Le nom du remplaçant doit être renseigné",
        path: [0],
      })
      .refine((arr) => arr[2] && arr[2].length > 0, {
        message: "Le poste du remplaçant doit être renseigné",
        path: [2],
      })
  ),
  remplacantsequipe2: z.array(
    z
      .array(z.string())
      .min(3, "Chaque remplaçant doit avoir au moins nom, drapeau et poste")
      .refine((arr) => arr[0] && arr[0].length > 0, {
        message: "Le nom du remplaçant doit être renseigné",
        path: [0],
      })
      .refine((arr) => arr[2] && arr[2].length > 0, {
        message: "Le poste du remplaçant doit être renseigné",
        path: [2],
      })
  ),
  stade: z.string().nonempty({
    message: "Le nom du stade doit être renseigné.",
  }),
  date: z.string().nonempty({
    message: "La date du match doit être renseignée.",
  }),
});
export const UpdateMethodeMatchSchema = z.object({
  keywords: z
    .array(
      z.object({
        value: z.string().min(1, "Un mot-clé ne peut pas être vide"),
      })
    )
    .min(1, "Ajoute au moins un mot-clé"),
  titrematch: z
    .string()
    .nonempty({ message: "Le titre du match doit être renseigné." }),
  couleur1equipe1: z
    .string()
    .nonempty({ message: "La couleur doit apparaître sous la forme #xxxxxx." }),
  couleur2equipe1: z
    .string()
    .nonempty({ message: "La couleur doit apparaître sous la forme #xxxxxx." }),
  nomequipe1: z
    .string()
    .nonempty({ message: "Le nom de l'équipe doit être renseigné." }),
  systemeequipe1: z
    .string()
    .nonempty({ message: "Le système de l'équipe doit être renseigné." }),
  couleur1equipe2: z
    .string()
    .nonempty({ message: "La couleur doit apparaître sous la forme #xxxxxx." }),
  couleur2equipe2: z
    .string()
    .nonempty({ message: "La couleur doit apparaître sous la forme #xxxxxx." }),
  nomequipe2: z
    .string()
    .nonempty({ message: "Le nom de l'équipe doit être renseigné." }),
  systemeequipe2: z
    .string()
    .nonempty({ message: "Le système de l'équipe doit être renseigné." }),
  remplacantsequipe1: z.array(
    z
      .array(z.string())
      .min(3, "Chaque remplaçant doit avoir au moins nom, drapeau et poste")
      .refine((arr) => arr[0] && arr[0].length > 0, {
        message: "Le nom du remplaçant doit être renseigné",
        path: [0],
      })
      .refine((arr) => arr[2] && arr[2].length > 0, {
        message: "Le poste du remplaçant doit être renseigné",
        path: [2],
      })
  ),
  remplacantsequipe2: z.array(
    z
      .array(z.string())
      .min(3, "Chaque remplaçant doit avoir au moins nom, drapeau et poste")
      .refine((arr) => arr[0] && arr[0].length > 0, {
        message: "Le nom du remplaçant doit être renseigné",
        path: [0],
      })
      .refine((arr) => arr[2] && arr[2].length > 0, {
        message: "Le poste du remplaçant doit être renseigné",
        path: [2],
      })
  ),
  stade: z.string().nonempty({
    message: "Le nom du stade doit être renseigné.",
  }),
  date: z.string().nonempty({
    message: "La date du match doit être renseignée.",
  }),
  imgterrain: z.string().optional(),
});

export const MethodeJoueurSchema = z.object({
  keywords: z
    .array(
      z.object({
        value: z.string().min(1, "Un mot-clé ne peut pas être vide"),
      })
    )
    .min(1, "Ajoute au moins un mot-clé"),
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
});
export const UpdateMethodeJoueurSchema = z.object({
  keywords: z
    .array(
      z.object({
        value: z.string().min(1, "Un mot-clé ne peut pas être vide"),
      })
    )
    .min(1, "Ajoute au moins un mot-clé"),
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
  imagejoueur: z.string().optional(),
});

export const MethodeCoachSchema = z.object({
  keywords: z
    .array(
      z.object({
        value: z.string().min(1, "Un mot-clé ne peut pas être vide"),
      })
    )
    .min(1, "Ajoute au moins un mot-clé"),
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
});
export const UpdateMethodeCoachSchema = z.object({
  keywords: z
    .array(
      z.object({
        value: z.string().min(1, "Un mot-clé ne peut pas être vide"),
      })
    )
    .min(1, "Ajoute au moins un mot-clé"),
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
  imagecoach: z.string().optional(),
});
