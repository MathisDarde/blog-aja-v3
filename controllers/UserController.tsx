import { db } from "@/app/db/db";
import { SelectUser, user } from "@/app/db/schema";
import { InscSchemaType } from "@/types/forms";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function getUserbyId(id: SelectUser["id"]): Promise<
  Array<{
    id: string;
    name: string;
    photodeprofil: string | null;
    birthday: Date;
    email: string;
    createdAt: Date;
    updatedAt: Date;
  }>
> {
  return db.select().from(user).where(eq(user.id, id));
}

export async function getAllUsers(): Promise<
  Array<{
    id: string;
    name: string;
    photodeprofil: string | null;
    birthday: Date;
    email: string;
    createdAt: Date;
    updatedAt: Date;
  }>
> {
  return db.select().from(user);
}

export const signUp = async (data: InscSchemaType) => {
  console.log(data);
  await auth.api.signUpEmail({
    body: {
      name: data.name,
      birthday:
        typeof data.birthday === "string"
          ? new Date(data.birthday)
          : data.birthday,
      email: data.email,
      password: data.password,
    },
  });
};

export async function updateUser(
  id: SelectUser["id"],
  data: Partial<Omit<SelectUser, "id_user">>
) {
  await db.update(user).set(data).where(eq(user.id, id));
}

export async function deleteUser(id: SelectUser["id"]) {
  await db.delete(user).where(eq(user.id, id));
}

export async function getUserPicName(id: SelectUser["id"]) {
  const users = await db
    .select({
      pdp: user.photodeprofil,
      username: user.name,
    })
    .from(user)
    .where(eq(user.id, id))
    .limit(1);

  return users[0] || null;
}
