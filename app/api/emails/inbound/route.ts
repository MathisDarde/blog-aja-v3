import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    
    const { from, subject, html, text } = payload;

    await resend.emails.send({
      from: "contact@memoiredauxerrois.fr", // Doit être votre domaine vérifié
      to: "dardemathis@gmail.com",    // 👈 Mettez votre adresse perso ici
      subject: `[FWD] ${subject}`,          // On ajoute un préfixe pour repérer le transfert
      // On construit un petit corps de mail pour vous donner le contexte
      html: `
        <div style="border: 1px solid #ccc; padding: 20px; border-radius: 8px;">
          <h2>Vous avez reçu un message sur contact@memoiredauxerrois.fr</h2>
          <p><strong>De :</strong> ${from}</p>
          <p><strong>Sujet :</strong> ${subject}</p>
          <hr />
          <div>${html || text}</div>
        </div>
      `,
    });

    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("Erreur lors du traitement de l'email entrant:", error);
    return NextResponse.json({ status: "error" }, { status: 500 });
  }
}