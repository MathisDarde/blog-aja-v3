import {
  ArticleSchema,
  CommentSchema,
  InscSchema,
  LoginSchema,
  MethodeCoachSchema,
  MethodeJoueurSchema,
  MethodeMatchSchema,
  MethodeSaisonSchema,
} from "@/app/schema";
import { z, ZodIssue } from "zod";

export type LoginSchemaType = z.infer<typeof LoginSchema>;
export type InscSchemaType = z.infer<typeof InscSchema>;
export type ArticleSchemaType = z.infer<typeof ArticleSchema>;
export type CommentSchemaType = z.infer<typeof CommentSchema>;
export type MethodeSaisonSchemaType = z.infer<typeof MethodeSaisonSchema>;
export type MethodeMatchSchemaType = z.infer<typeof MethodeMatchSchema>;
export type MethodeJoueurSchemaType = z.infer<typeof MethodeJoueurSchema>;
export type MethodeCoachSchemaType = z.infer<typeof MethodeCoachSchema>;
export type FormResponse = {
  success: boolean;
  errors?: ZodIssue[];
  message?: string;
  token?: string;
};
