import { betterAuth } from "better-auth";
import type { BetterAuthPlugin } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/db";
import { schema } from "@/db/schema";
import { nextCookies } from "better-auth/next-js";
import { Resend } from "resend";
import { resetPasswordEmail, verifyNewEmailEmail } from "@/lib/account-emails";
import { EMAIL_FROM } from "@/lib/email-layout";
import { notifySignup } from "@/lib/activity-notifications";

const resend = new Resend(process.env.RESEND_API_KEY as string);

export const auth = betterAuth({
  trustedOrigins: [process.env.NEXT_PUBLIC_SITE_URL!, "http://localhost:3000"],
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      await resend.emails.send({
        from: EMAIL_FROM,
        to: user.email,
        ...resetPasswordEmail(user.name, url),
      });
    },
  },

  // Utilisé uniquement pour le changement d'email : le lien est envoyé à la
  // nouvelle adresse et l'email n'est modifié qu'une fois ce lien cliqué.
  // (pas d'envoi à l'inscription : sendOnSignUp / requireEmailVerification restent à false)
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await resend.emails.send({
        from: EMAIL_FROM,
        to: user.email,
        ...verifyNewEmailEmail(user.name, url),
      });
    },
  },

  user: {
    changeEmail: {
      enabled: true,
    },
    additionalFields: {
      // Facultatif ici : Google ne fournit pas de date de naissance, et better-auth refuse
      // la création d'un compte social si un champ requis manque (MISSING_FIELD).
      // L'inscription par email l'exige toujours via InscSchema (actions/user/insc-form.ts).
      birthday: {
        type: "date",
        required: false,
      },
      admin: {
        type: "boolean",
        required: true,
        defaultValue: false,
        // Empêche un client de s'auto-attribuer le rôle via sign-up / update-user
        input: false,
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
  // Session gardée 5 min dans un cookie signé : pages, actions et middleware la lisent sans
  // interroger la base. Contrepartie : un changement de rôle ou une session révoquée met
  // jusqu'à 5 min à s'appliquer (une déconnexion sur le même navigateur est immédiate).
  session: {
    cookieCache: { enabled: true, maxAge: 5 * 60 },
  },
  // Inscription annoncée dans le salon Discord des inscriptions (lib/activity-notifications)
  databaseHooks: {
    user: {
      create: {
        after: async (createdUser) => notifySignup(createdUser),
      },
    },
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
  }),
  plugins: [nextCookies() as unknown as BetterAuthPlugin],
});
