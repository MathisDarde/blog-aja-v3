"use server";

import { db } from "@/db/db";
import { SelectUser, user } from "@/db/schema";
import { InscSchemaType } from "@/types/forms";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { ensureCloudinaryUrl } from "@/lib/store-cloudinary-image";
import { requireAdmin, requireSelfOrAdmin } from "@/lib/auth-guard";

export async function getUserbyId(id: SelectUser["id"]): Promise<SelectUser[]> {
  await requireSelfOrAdmin(id);
  return db.select().from(user).where(eq(user.id, id));
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
  await requireSelfOrAdmin(userId);

  try {
    const imageUrl = ensureCloudinaryUrl(data.image);

    // Champs sensibles jamais modifiables via ce endpoint
    // (l'email passe par authClient.changeEmail, avec vérification)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { admin, email, emailVerified, createdAt, ...safeData } = data;

    const updateData = {
      ...safeData,
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
  await requireSelfOrAdmin(id);
  await db.delete(user).where(eq(user.id, id));
}

export async function getUserPicName(id: SelectUser["id"]) {
  await requireSelfOrAdmin(id);
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
  await requireSelfOrAdmin(id);
  const userPic = await getUserPicName(id);
  if (userPic && userPic.image) {
    await db.update(user).set({ image: null }).where(eq(user.id, id));
    return true;
  } else {
    return false;
  }
}

export async function setUserAdmin(id: SelectUser["id"]) {
  await requireAdmin();
  const result = await db
    .update(user)
    .set({ admin: true })
    .where(eq(user.id, id));

  return result;
}

export async function removeUserAdmin(id: SelectUser["id"]) {
  await requireAdmin();
  const result = await db
    .update(user)
    .set({ admin: false })
    .where(eq(user.id, id));

  return result;
}

export async function toggleNewsletterSubscription(userId: string, shouldEnable: boolean) {
  try {
    if (!userId) {
      return { success: false, error: "Utilisateur non identifié." };
    }

    await requireSelfOrAdmin(userId);

    await db.update(user).set({ mailArticle: shouldEnable }).where(eq(user.id, userId));

    return { success: true };

  } catch (error) {
    console.error("Erreur lors de la mise à jour de la newsletter:", error);
    return { success: false, error: "Une erreur est survenue lors de la mise à jour." };
  }
}
