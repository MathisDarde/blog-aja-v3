import bcrypt from "bcryptjs";

export function hashPassword(plainPassword: string) {
  return bcrypt.hash(plainPassword, 10).then((hashedPassword: string) => {
    return hashedPassword;
  });
}

export function checkPassword(password: string, hashedPassword: string) {
  return bcrypt.compare(password, hashedPassword).then((result: boolean) => {
    return result;
  });
}
