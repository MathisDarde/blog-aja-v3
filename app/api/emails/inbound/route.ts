import { NextResponse } from "next/server";
import { Resend } from "resend";

interface ResendWebhookPayload {
  type: string;
  data: {
    email_id: string;
    from: string;
    subject: string;
  };
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as ResendWebhookPayload;

    // Vérification de sécurité
    if (payload.type !== 'email.received') {
        return NextResponse.json({ status: "ignored" });
    }

    const { email_id, from, subject } = payload.data;
    console.log(`📨 Webhook reçu. ID: ${email_id} | De: ${from}`);

    const { data: emailContent, error: contentError } = await resend.emails.receiving.get(email_id);

    if (contentError) {
        console.error("❌ Erreur récupération contenu:", contentError);
        return NextResponse.json({ status: "error", error: contentError }, { status: 200 });
    }

    const fetchedHtml = emailContent?.html;
    const fetchedText = emailContent?.text;

    const finalHtml = fetchedHtml || (fetchedText ? `<p>${fetchedText.replace(/\n/g, "<br>")}</p>` : "<p><em>Contenu vide ou non récupérable.</em></p>");
    const finalText = fetchedText || "Contenu vide";

    console.log("✅ Contenu récupéré. Transfert en cours...");

    const { error: sendError } = await resend.emails.send({
      from: "contact@memoiredauxerrois.fr", 
      to: "dardemathis@gmail.com",
      replyTo: from, 
      subject: `[FWD] ${subject}`,
      text: finalText,
      html: `
        <div style="background-color: #f3f4f6; padding: 20px; font-family: sans-serif;">
          <div style="background-color: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb;">
            <div style="border-bottom: 1px solid #eee; padding-bottom: 15px; margin-bottom: 15px;">
                <h3 style="margin:0; color:#333;">Message transféré</h3>
                <p style="margin: 5px 0 0; color: #666; font-size: 14px;"><strong>De :</strong> ${from}</p>
                <p style="margin: 0; color: #666; font-size: 14px;"><strong>Sujet :</strong> ${subject}</p>
            </div>
            
            <div style="color: #111;">
              ${finalHtml}
            </div>
          </div>
        </div>
      `
    });

    if (sendError) {
        console.error("❌ Erreur lors de l'envoi :", sendError);
        return NextResponse.json({ status: "error", error: sendError }, { status: 500 });
    }

    return NextResponse.json({ status: "success", forwarded: true });

  } catch (error: unknown) {
    let errorMessage = "Une erreur inconnue est survenue";

    if (error instanceof Error) {
        errorMessage = error.message;
    } else if (typeof error === "string") {
        errorMessage = error;
    }

    console.error("❌ Crash serveur :", errorMessage);
    return NextResponse.json({ status: "error", message: errorMessage }, { status: 200 });
  }
}