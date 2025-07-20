import {
  ArticleSchema,
  CommentSchema,
  DraftArticleSchema,
  InscSchema,
  LoginSchema,
  MethodeCoachSchema,
  MethodeJoueurSchema,
  MethodeMatchSchema,
  MethodeSaisonSchema,
  UpdateProfileSchema,
  UpdateArticleSchema,
  UpdateMethodeJoueurSchema,
  UpdateMethodeCoachSchema,
  UpdateMethodeMatchSchema,
  UpdateMethodeSaisonSchema,
} from "@/app/schema";
import { z, ZodIssue } from "zod";

export type LoginSchemaType = z.infer<typeof LoginSchema>;
export type InscSchemaType = z.infer<typeof InscSchema>;
export type UpdateProfileSchemaType = z.infer<typeof UpdateProfileSchema>;
export type ArticleSchemaType = z.infer<typeof ArticleSchema>;
export type UpdateArticleSchemaType = z.infer<typeof UpdateArticleSchema>;
export type DraftArticleSchemaType = z.infer<typeof DraftArticleSchema>;
export type CommentSchemaType = z.infer<typeof CommentSchema>;
export type MethodeSaisonSchemaType = z.infer<typeof MethodeSaisonSchema>;
export type UpdateMethodeSaisonSchemaType = z.infer<
  typeof UpdateMethodeSaisonSchema
>;
export type MethodeMatchSchemaType = z.infer<typeof MethodeMatchSchema>;
export type UpdateMethodeMatchSchemaType = z.infer<
  typeof UpdateMethodeMatchSchema
>;
export type MethodeJoueurSchemaType = z.infer<typeof MethodeJoueurSchema>;
export type UpdateMethodeJoueurSchemaType = z.infer<
  typeof UpdateMethodeJoueurSchema
>;
export type MethodeCoachSchemaType = z.infer<typeof MethodeCoachSchema>;
export type UpdateMethodeCoachSchemaType = z.infer<
  typeof UpdateMethodeCoachSchema
>;
export type FormResponse = {
  success: boolean;
  errors?: ZodIssue[];
  message?: string;
  token?: string;
};
