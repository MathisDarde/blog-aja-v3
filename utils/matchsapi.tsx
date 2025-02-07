export async function fetchMatches(jsonPath: string) {
  return fetch(jsonPath)
    .then((response) => response.json())
    .catch((error) => {
      console.error("Erreur lors du chargement du fichier JSON:", error);
      return [];
    });
}
