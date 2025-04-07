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

export const ArticleSchema = z.object({
  title: z.string().nonempty(),
  teaser: z.string().nonempty(),
  content: z.string().nonempty(),
  author: z.string().nonempty(),
  tags: z.array(z.string().nonempty()),
});

export const CommentSchema = z.object({
  stars: z.number(),
  comm_title: z.string().nonempty(),
  comm_content: z.string().nonempty(),
});
