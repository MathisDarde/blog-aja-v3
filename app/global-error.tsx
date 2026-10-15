"use client";

// Filet de sécurité si le layout racine lui-même plante : pas de polices ni de styles globaux ici.
export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="fr">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          background: "#f3f4f6",
          color: "#3c77b4",
          textAlign: "center",
          padding: "2rem",
        }}
      >
        <h1>Une erreur est survenue</h1>
        <p>Le site n&apos;a pas pu se charger. Réessayez dans quelques instants.</p>
        <button type="button" onClick={() => reset()} style={{ padding: "0.75rem 1.5rem", cursor: "pointer" }}>
          Réessayer
        </button>
      </body>
    </html>
  );
}
