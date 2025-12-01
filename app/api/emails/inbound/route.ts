import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    // 1. Vérifier si c'est bien un événement de réception
    if (payload.type !== 'email.received') {
        return NextResponse.json({ status: "ignored" });
    }

    // 2. Récupérer l'ID du mail depuis la notification
    const emailId = payload.data.email_id;
    
    if (!emailId) {
        console.error("Pas d'ID d'email trouvé dans le payload");
        return NextResponse.json({ status: "error", message: "No email ID" }, { status: 400 });
    }

    // 3. 🔍 ALLER CHERCHER LE CONTENU DU MAIL (C'est l'étape qui manquait)
    const { data: emailContent, error } = await resend.emails.get(emailId);

    if (error || !emailContent) {
        console.error("Impossible de récupérer le contenu du mail:", error);
        return NextResponse.json({ status: "error" }, { status: 500 });
    }

    // 4. Préparer les variables pour le transfert
    const originalSender = emailContent.from; // ex: mathis.darde@...
    const subject = emailContent.subject;
    const htmlBody = emailContent.html;
    const textBody = emailContent.text;

    console.log(`📨 Transfert du mail ${emailId} de ${originalSender}`);

    // 5. Transférer le mail
    await resend.emails.send({
      from: "contact@memoiredauxerrois.fr", 
      to: "dardemathis@gmail.com", // 👈 Votre adresse perso
      subject: `[FWD] ${subject}`,
      replyTo: originalSender, // Pour répondre directement à l'envoyeur
      html: `
        <div style="background-color: #f3f4f6; padding: 20px;">
          <div style="background-color: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb;">
            <h2 style="color: #111827; margin-top: 0;">Nouveau message reçu</h2>
            <p style="color: #4b5563;"><strong>De :</strong> ${originalSender}</p>
            <p style="color: #4b5563;"><strong>Sujet :</strong> ${subject}</p>
            <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
            
            <div>${htmlBody || textBody || "Contenu vide"}</div>
          </div>
        </div>
      `
    });

    return NextResponse.json({ status: "success" });
  } catch (err) {
    console.error("Erreur critique:", err);
    return NextResponse.json({ status: "error" }, { status: 500 });
  }
}