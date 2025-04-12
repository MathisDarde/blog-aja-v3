"use server";

import fs from "fs";
import path from "path";

export async function getTeamLogos() {
  try {
    // Chemin du dossier à parcourir (relatif à la racine du projet)
    const directoryPath = path.join(process.cwd(), "public/_assets/teamlogos");

    // Lecture des fichiers dans le dossier
    const files = fs.readdirSync(directoryPath);

    // Filtrer pour n'obtenir que les fichiers (pas les dossiers)
    const filesList = files.filter((file) => {
      const stats = fs.statSync(path.join(directoryPath, file));
      return stats.isFile();
    });

    return { success: true, files: filesList };
  } catch (error) {
    console.error("Erreur lors de la lecture du dossier:", error);
    return {
      success: false,
      message: "Erreur lors de la lecture des fichiers",
      files: [],
    };
  }
}
