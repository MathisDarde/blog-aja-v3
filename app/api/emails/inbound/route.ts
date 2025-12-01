import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    // Vérification de sécurité
    if (payload.type !== 'email.received') {
        return NextResponse.json({ status: "ignored" });
    }

    // 1. On récupère tout depuis payload.data
    // Note : On utilise 'any' ici temporairement pour éviter les erreurs TS si les types manquent
    const data = payload.data as any;
    
    const { from, subject, html, text } = data;

    console.log("📨 E-mail entrant reçu de :", from);
    console.log("📝 Sujet :", subject);
    
    // Debug pour voir si le texte est vraiment vide
    if (!text && !html) {
        console.warn("⚠️ ATTENTION : Le contenu (text/html) semble vide dans le payload !");
        console.log("Payload complet reçu :", JSON.stringify(payload, null, 2));
    }

    // 2. On prépare le contenu du transfert
    // Si html/text sont vides, on met un message par défaut pour ne pas envoyer un mail vide
    const finalHtml = html || `<p>${text}</p>` || "<p><em>Contenu de l'e-mail vide ou non récupéré.</em></p>";
    const finalText = text || "Contenu vide";

    // 3. Transfert immédiat
    await resend.emails.send({
      from: "contact@memoiredauxerrois.fr", 
      to: "dardemathis@gmail.com", // ⚠️ Vérifiez que c'est bien votre mail perso ici
      replyTo: from, 
      subject: `[FWD] ${subject}`,
      text: finalText, // Important pour éviter les filtres anti-spam
      html: `
        <div style="background-color: #f3f4f6; padding: 20px; font-family: sans-serif;">
          <div style="background-color: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb;">
            <div style="border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 15px;">
                <h3 style="margin:0; color:#333;">Nouveau message reçu</h3>
                <p style="margin: 5px 0 0; color: #666; font-size: 14px;"><strong>De :</strong> ${from}</p>
                <p style="margin: 0; color: #666; font-size: 14px;"><strong>Sujet Original :</strong> ${subject}</p>
            </div>
            
            <div style="color: #111;">
              ${finalHtml}
            </div>
          </div>
        </div>
      `
    });

    return NextResponse.json({ status: "success" });

  } catch (err: any) {
    console.error("❌ Erreur lors du transfert :", err.message);
    // On retourne quand même un succès à Resend pour qu'il ne réessaie pas en boucle
    return NextResponse.json({ status: "error", error: err.message }, { status: 200 });
  }
}