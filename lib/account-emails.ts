// Mails liés au compte, envoyés par better-auth (lib/auth.ts)
import {
  button,
  emailLayout,
  escapeHtml,
  GRAY_400,
  paragraph,
} from "@/lib/email-layout";

const SECURITY_NOTE =
  "Vous recevez cet email suite à une action sur votre compte Mémoire d'Auxerrois. Si vous n'en êtes pas à l'origine, ignorez-le : rien ne sera modifié.";

function fallbackLink(url: string) {
  return paragraph(
    `Le bouton ne fonctionne pas&nbsp;? Copiez ce lien dans votre navigateur&nbsp;:<br><a href="${url}" style="color:${GRAY_400}; word-break:break-all;">${url}</a>`,
    `margin-top:24px; font-size:12px; color:${GRAY_400};`
  );
}

function greeting(name?: string | null) {
  return paragraph(name ? `Bonjour ${escapeHtml(name)},` : "Bonjour,", "font-size:16px; font-weight:600;");
}

export function resetPasswordEmail(name: string | null | undefined, url: string) {
  const subject = "Réinitialisation de votre mot de passe";
  const html = emailLayout({
    title: subject,
    preheader: "Choisissez un nouveau mot de passe pour votre compte.",
    body: `${greeting(name)}
${paragraph("Vous avez demandé à réinitialiser le mot de passe de votre compte. Cliquez sur le bouton ci-dessous pour en choisir un nouveau&nbsp;:", "margin-bottom:24px;")}
${button(url, "Nouveau mot de passe")}
${fallbackLink(url)}`,
    footerNote: SECURITY_NOTE,
  });
  const text = [
    name ? `Bonjour ${name},` : "Bonjour,",
    "",
    "Vous avez demandé à réinitialiser le mot de passe de votre compte Mémoire d'Auxerrois.",
    `Choisissez-en un nouveau ici : ${url}`,
    "",
    "Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.",
  ].join("\n");
  return { subject, html, text };
}

export function verifyNewEmailEmail(name: string | null | undefined, url: string) {
  const subject = "Confirmez votre nouvelle adresse email";
  const html = emailLayout({
    title: subject,
    preheader: "Un clic pour confirmer votre nouvelle adresse.",
    body: `${greeting(name)}
${paragraph("Vous avez demandé à changer l'adresse email de votre compte. Confirmez cette nouvelle adresse pour terminer&nbsp;:", "margin-bottom:24px;")}
${button(url, "Confirmer l'adresse")}
${fallbackLink(url)}`,
    footerNote: SECURITY_NOTE,
  });
  const text = [
    name ? `Bonjour ${name},` : "Bonjour,",
    "",
    "Vous avez demandé à changer l'adresse email de votre compte Mémoire d'Auxerrois.",
    `Confirmez cette nouvelle adresse ici : ${url}`,
    "",
    "Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.",
  ].join("\n");
  return { subject, html, text };
}
