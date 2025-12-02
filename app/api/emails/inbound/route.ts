import { NextResponse } from "next/server";
import { Resend } from "resend";

interface ResendPayload {
  type: string;
  created_at: string;
  data: {
    created_at: string;
    email_id: string;
    from: string;
    to: string[];
    subject: string;
    html: string;
    text: string;
  };
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as ResendPayload;

    // Vérification de sécurité
    if (payload.type !== 'email.received') {
        return NextResponse.json({ status: "ignored" });
    }

    const { from, subject, html, text } = payload.data;

    // --- ZONE DE DEBUG ---
    console.log("🔍 INSPECTION DU CONTENU REÇU :");
    console.log("1. From:", from);
    console.log("2. Subject:", subject);
    console.log("3. Type of HTML:", typeof html, "| Value:", html ? html.substring(0, 50) + "..." : "VIDE/NULL");
    console.log("4. Type of Text:", typeof text, "| Value:", text ? text.substring(0, 50) + "..." : "VIDE/NULL");
    // ---------------------

    // Logique de récupération plus robuste (gère null et undefined)
    let bodyContent = "<p><em>Contenu vide.</em></p>";

    if (html && html.trim().length > 0) {
        bodyContent = html;
    } else if (text && text.trim().length > 0) {
        // Convertit les sauts de ligne texte en <br> HTML
        bodyContent = `<p>${text.replace(/\n/g, "<br>")}</p>`;
    }

    // 3. Transfert
    const dataRes = await resend.emails.send({
      from: "contact@memoiredauxerrois.fr", 
      to: "dardemathis@gmail.com",
      replyTo: from, 
      subject: `[FWD] ${subject}`,
      html: `
        <div style="background-color: #f3f4f6; padding: 20px; font-family: sans-serif;">
          <div style="background-color: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb;">
            <div style="border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 15px;">
                <h3 style="margin:0; color:#333;">Nouveau message reçu</h3>
                <p style="margin: 5px 0 0; color: #666; font-size: 14px;"><strong>De :</strong> ${from}</p>
                <p style="margin: 0; color: #666; font-size: 14px;"><strong>Sujet Original :</strong> ${subject}</p>
            </div>
            
            <div style="color: #111;">
              ${bodyContent}
            </div>
          </div>
        </div>
      `
    });

    if (dataRes.error) {
      console.error("❌ Erreur Resend API:", dataRes.error);
      return NextResponse.json({ status: "error", error: dataRes.error }, { status: 500 });
    }

    return NextResponse.json({ status: "success", data: dataRes.data });

  } catch (error: unknown) {
    let errorMessage = "Une erreur inconnue est survenue";
    
    if (error instanceof Error) {
        errorMessage = error.message;
    } else if (typeof error === "string") {
        errorMessage = error;
    }

    console.error("❌ Erreur lors du transfert :", errorMessage);
    
    // On retourne un succès (200) pour que Resend arrête de réessayer
    return NextResponse.json({ status: "error", error: errorMessage }, { status: 200 });
  }
}