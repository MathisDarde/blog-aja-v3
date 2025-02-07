import bcrypt from "bcryptjs";

export async function hashPassword(plainPassword: string) {
  const hashedPassword = await bcrypt.hash(plainPassword, 10);
  return hashedPassword;
}

export async function checkPassword(password: string, hashedPassword: string) {
  const result = await bcrypt.compare(password, hashedPassword);
  return result;
}
