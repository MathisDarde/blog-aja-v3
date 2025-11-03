import { betterAuth } from "better-auth";
import type { BetterAuthPlugin } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/db";
import { schema } from "@/db/schema";
import { nextCookies } from "better-auth/next-js";
import { Resend } from "resend";
import ResetPasswordEmail from "@/components/emails/forgot-password";

const resend = new Resend(process.env.RESEND_API_KEY as string);

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      await resend.emails.send({
        from: "onboarding@resend.dev", // remplacer par mon adresse mail avec mon domaine perso sinon marche pas
        to: user.email,
        subject: "Réinitialisation de votre mot de passe",
        react: ResetPasswordEmail({ user, resetUrl: url }),
      });
    },
  },

  user: {
    additionalFields: {
      birthday: {
        type: "date",
        required: true,
      },
      admin: {
        type: "boolean",
        required: true,
        defaultValue: false,
      },
    },
  },

  socialProviders: {
    google: {
      prompt: "select_account",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
  }),
  plugins: [nextCookies() as unknown as BetterAuthPlugin],
});
