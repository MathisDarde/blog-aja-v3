import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/db";
import { schema } from "@/db/schema";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },

  user: {
    additionalFields: {
      birthday: {
        type: "date",
        required: true,
        defaultValue: "",
      },
      admin: {
        type: "boolean",
        required: true,
        defaultValue: "false",
      },
      photodeprofil: {
        type: "string",
        required: false,
        defaultValue: null,
      },
    },
  },

  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
  }),
  plugins: [nextCookies()],
});
