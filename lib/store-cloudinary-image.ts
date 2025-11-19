export const ensureCloudinaryUrl = (value: unknown): string => {
  if (!value) {
    return value as string;
  }

  if (typeof value !== "string") {
    throw new Error("L'image doit être une URL Cloudinary (string).");
  }

  if (!value.startsWith("https://res.cloudinary.com")) {
    throw new Error("L'image doit être une URL Cloudinary valide.");
  }

  return value;
};
