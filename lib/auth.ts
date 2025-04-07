import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/app/db/db";
import { schema } from "@/app/db/schema";
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
    },
  },

  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
  }),
  plugins: [nextCookies()],
});
