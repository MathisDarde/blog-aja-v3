import { db } from "@/app/db/db";
import { SelectUser, user } from "@/app/db/schema";
import { InscSchemaType } from "@/types/forms";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

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
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
    admin: boolean | null;
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
  userId: SelectUser["id"],
  data: Partial<Omit<SelectUser, "id">>,
  file?: File
) {
  try {
    const MAX_SIZE = 5 * 2048 * 2048; // 5 Mo
    const ALLOWED_TYPES = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/webp",
    ];

    if (file && file.size > MAX_SIZE) {
      throw new Error(
        "Le fichier est trop grand. La taille maximale est de 5 Mo."
      );
    }

    if (file && !ALLOWED_TYPES.includes(file.type)) {
      throw new Error(
        "Type de fichier non autorisé. Veuillez télécharger une image JPEG, PNG, JPG ou WEBP."
      );
    }

    const uploadDir = path.join(process.cwd(), "/public/uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileExtension = file ? path.extname(file.name) : "";
    const fileName = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(uploadDir, fileName);

    if (file) {
      const buffer = await file.arrayBuffer();
      fs.writeFileSync(filePath, Buffer.from(buffer));
    }

    const imageUrl = `/uploads/${fileName}`;

    const updatedData: Partial<Omit<SelectUser, "id">> = {
      ...data,
      photodeprofil: file ? imageUrl : undefined,
    };

    // Effectuer la mise à jour
    const result = await db
      .update(user)
      .set(updatedData)
      .where(eq(user.id, userId));

    return result;
  } catch (err) {
    console.log(err);
    throw new Error("Erreur lors de la modification de l'article");
  }
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
