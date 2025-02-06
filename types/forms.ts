import {
  ArticleSchema,
  CommentSchema,
  InscSchema,
  LoginSchema,
} from "@/app/schema";
import { z, ZodIssue } from "zod";

export type LoginSchemaType = z.infer<typeof LoginSchema>;
export type InscSchemaType = z.infer<typeof InscSchema>;
export type ArticleSchemaType = z.infer<typeof ArticleSchema>;
export type CommentSchemaType = z.infer<typeof CommentSchema>;
export type FormResponse = {
  success: boolean;
  errors?: ZodIssue[];
  message?: string;
};
