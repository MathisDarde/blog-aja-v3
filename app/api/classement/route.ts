import { NextResponse } from "next/server";

export async function GET() {
  const url =
    "https://mathisdarde.github.io/AJA-Website-Scrapers/classement.json";
  const response = await fetch(url);

  if (!response.ok) {
    return NextResponse.json(
      { error: "Impossible de récupérer le classement" },
      { status: 500 }
    );
  }

  const data = await response.json();

  // On renvoie le JSON avec CORS pour n'importe quel domaine
  return NextResponse.json(data, {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
}
