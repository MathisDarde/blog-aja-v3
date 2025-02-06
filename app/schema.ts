import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, "Veuillez entrer plus de 8 caractères !")
    .nonempty(),
});

export const InscSchema = z
  .object({
    pseudo: z.string().nonempty(),
    birthday: z.date(),
    email: z.string().email(),
    password: z
      .string()
      .min(8, "Veuillez entrer plus de 8 caractères !")
      .nonempty(),
    confirmPassword: z
      .string()
      .min(8, "Veuillez entrer plus de 8 caractères !"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const ArticleSchema = z.object({
  imageUrl: z.string().nonempty(),
  title: z.string().nonempty(),
  teaser: z.string().nonempty(),
  content: z.string().nonempty(),
  author: z.string().nonempty(),
  tags: z.string().nonempty(),
});

export const CommentSchema = z.object({
  stars: z.number(),
  comm_title: z.string().nonempty(),
  comm_content: z.string().nonempty(),
});
