import type { NextRequest } from "next/server";
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

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("❌ RESEND_WEBHOOK_SECRET manquant : webhook refusé.");
    return NextResponse.json({ status: "error" }, { status: 500 });
  }

  // Le corps brut est nécessaire pour vérifier la signature (svix)
  const rawBody = await request.text();
  let payload: ResendWebhookPayload;
  try {
    payload = resend.webhooks.verify({
      payload: rawBody,
      headers: {
        id: request.headers.get("svix-id") ?? "",
        timestamp: request.headers.get("svix-timestamp") ?? "",
        signature: request.headers.get("svix-signature") ?? "",
      },
      webhookSecret,
    }) as unknown as ResendWebhookPayload;
  } catch {
    return NextResponse.json({ status: "invalid signature" }, { status: 401 });
  }

  try {

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

    const finalHtml = fetchedHtml || (fetchedText ? `<p>${escapeHtml(fetchedText).replace(/\n/g, "<br>")}</p>` : "<p><em>Contenu vide ou non récupérable.</em></p>");
    const finalText = fetchedText || "Contenu vide";

    console.log("✅ Contenu récupéré. Transfert en cours...");

    const { error: sendError } = await resend.emails.send({
      from: "Contact Mémoire d'Auxerrois <contact@memoiredauxerrois.fr>", 
      to: "dardemathis@gmail.com",
      replyTo: from, 
      subject: `[FWD] ${subject}`,
      text: finalText,
      html: `
        <div style="background-color: #f3f4f6; padding: 20px; font-family: sans-serif;">
          <div style="background-color: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb;">
            <div style="border-bottom: 1px solid #eee; padding-bottom: 15px; margin-bottom: 15px;">
                <h3 style="margin:0; color:#333;">Message transféré</h3>
                <p style="margin: 5px 0 0; color: #666; font-size: 14px;"><strong>De :</strong> ${escapeHtml(from)}</p>
                <p style="margin: 0; color: #666; font-size: 14px;"><strong>Sujet :</strong> ${escapeHtml(subject)}</p>
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