"use server";

import { db } from "@/db/db";
import { SelectUser, user } from "@/db/schema";
import { InscSchemaType } from "@/types/forms";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { ensureCloudinaryUrl } from "@/lib/store-cloudinary-image";

export async function getUserbyId(id: SelectUser["id"]): Promise<SelectUser[]> {
  return db.select().from(user).where(eq(user.id, id));
}

export async function getAllUsers(): Promise<SelectUser[]> {
  return db.select().from(user);
}

export const signUp = async (data: InscSchemaType) => {
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
  userId: SelectUser["id"],
  data: Partial<Omit<SelectUser, "id">>
) {
  try {
    const imageUrl = ensureCloudinaryUrl(data.image);

    const updateData = {
      ...data,
      imageUrl,
    };

    // Effectuer la mise à jour
    const result = await db
      .update(user)
      .set(updateData)
      .where(eq(user.id, userId));

    return result;
  } catch (err) {
    console.error(err);
    throw new Error("Erreur lors de la modification de l'article");
  }
}

export async function deleteUser(id: SelectUser["id"]) {
  await db.delete(user).where(eq(user.id, id));
}

export async function getUserPicName(id: SelectUser["id"]) {
  const users = await db
    .select({
      image: user.image,
      username: user.name,
    })
    .from(user)
    .where(eq(user.id, id))
    .limit(1);

  return users[0] || null;
}

export async function deleteUserPic(id: SelectUser["id"]) {
  const userPic = await getUserPicName(id);
  if (userPic && userPic.image) {
    await db.update(user).set({ image: null }).where(eq(user.id, id));
    return true;
  } else {
    return false;
  }
}

export async function setUserAdmin(id: SelectUser["id"]) {
  const result = await db
    .update(user)
    .set({ admin: true })
    .where(eq(user.id, id));

  return result;
}

export async function removeUserAdmin(id: SelectUser["id"]) {
  const result = await db
    .update(user)
    .set({ admin: false })
    .where(eq(user.id, id));

  return result;
}
