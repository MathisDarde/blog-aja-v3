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
  trustedOrigins: [process.env.NEXT_PUBLIC_SITE_URL!, "http://localhost:3000"],
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      await resend.emails.send({
        from: "Contact Mémoire d’Auxerrois <contact@memoiredauxerrois.fr>",
        to: user.email,
        subject: "Réinitialisation de votre mot de passe",
        react: ResetPasswordEmail({ user, resetUrl: url }),
      });
    },
  },

  // Utilisé uniquement pour le changement d'email : le lien est envoyé à la
  // nouvelle adresse et l'email n'est modifié qu'une fois ce lien cliqué.
  // (pas d'envoi à l'inscription : sendOnSignUp / requireEmailVerification restent à false)
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await resend.emails.send({
        from: "Contact Mémoire d’Auxerrois <contact@memoiredauxerrois.fr>",
        to: user.email,
        subject: "Confirmez votre nouvelle adresse email",
        html: `<p>Bonjour,</p>
<p>Une modification de l'adresse email de votre compte Mémoire d'Auxerrois a été demandée.</p>
<p><a href="${url}">Cliquez ici pour confirmer cette nouvelle adresse</a>.</p>
<p>Si vous n'êtes pas à l'origine de cette demande, ignorez simplement cet email.</p>`,
      });
    },
  },

  user: {
    changeEmail: {
      enabled: true,
    },
    additionalFields: {
      birthday: {
        type: "date",
        required: true,
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
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
  }),
  plugins: [nextCookies() as unknown as BetterAuthPlugin],
});
