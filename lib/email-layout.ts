// Habillage commun des mails du site (newsletter, compte, alertes admin).
// Mise en page en tableaux et styles en ligne : seule façon d'être rendu correctement
// par Gmail et Outlook. Gmail ignore les polices web : les piles de polices se replient
// sur la police système moderne de chaque appareil (Segoe UI, San Francisco, Roboto)
// plutôt que sur Arial, et Outlook Windows est forcé sur Arial (sans ça, il affiche
// Times New Roman dès que la première police de la pile lui est inconnue).

// URL absolue de prod, même en dev : les images doivent rester chargeables depuis
// la boîte mail du destinataire
export const EMAIL_SITE_URL = "https://memoiredauxerrois.fr";
export const EMAIL_FROM = "Mémoire d'Auxerrois <contact@memoiredauxerrois.fr>";

// aja-blue, orange-third et gris Tailwind (gray-50/100/200/400/500/700/900)
export const BLUE = "#3c77b4";
const BLUE_DARK = "#1f438f";
const BLUE_LIGHT = "#c9dcf0";
export const ORANGE = "#f76200";
const GRAY_50 = "#f9fafb";
const GRAY_100 = "#f3f4f6";
export const GRAY_200 = "#e5e7eb";
export const GRAY_400 = "#9ca3af";
export const GRAY_500 = "#6b7280";
export const GRAY_700 = "#374151";
export const GRAY_900 = "#111827";

const SYSTEM_FONTS =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Helvetica, Arial, sans-serif";
export const TITLE_FONT = `'Bai Jamjuree', ${SYSTEM_FONTS}`;
export const TEXT_FONT = `Montserrat, ${SYSTEM_FONTS}`;

const FONTS_CSS =
  "https://fonts.googleapis.com/css2?family=Bai+Jamjuree:wght@600;700&family=Montserrat:wght@400;600;700&display=swap";

export const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export function paragraph(html: string, style = "") {
  return `<p style="margin:0 0 16px; font-family:${TEXT_FONT}; font-size:15px; line-height:1.7; color:${GRAY_700}; ${style}">${html}</p>`;
}

export function button(href: string, label: string) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td align="center" bgcolor="${BLUE}" style="border-radius:12px;">
      <a href="${href}" style="display:inline-block; padding:14px 30px; font-family:${TITLE_FONT}; font-size:13px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:#ffffff; text-decoration:none; border-radius:12px;">${label}&nbsp;&rarr;</a>
    </td>
  </tr>
</table>`;
}

interface EmailLayoutOptions {
  title: string;
  // Aperçu affiché par la boîte mail à côté de l'objet
  preheader: string;
  body: string;
  // Raison de l'envoi, en bas du mail
  footerNote: string;
}

export function emailLayout({ title, preheader, body, footerNote }: EmailLayoutOptions) {
  return `<!DOCTYPE html>
<html lang="fr" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>${escapeHtml(title)}</title>
  <!--[if mso]>
  <style>* { font-family: Arial, sans-serif !important; }</style>
  <![endif]-->
  <!--[if !mso]><!-->
  <link href="${FONTS_CSS}" rel="stylesheet">
  <style>@import url("${FONTS_CSS}");</style>
  <!--<![endif]-->
  <style>
    @media (max-width: 620px) {
      .px { padding-left: 22px !important; padding-right: 22px !important; }
      .title { font-size: 22px !important; }
    }
  </style>
</head>
<body style="margin:0; padding:0; background-color:${GRAY_100}; -webkit-text-size-adjust:100%;">
  <div style="display:none; max-height:0; overflow:hidden; opacity:0;">${escapeHtml(preheader)}&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${GRAY_100};">
    <tr>
      <td align="center" style="padding:28px 12px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px; background-color:#ffffff; border-radius:24px; overflow:hidden; border:1px solid ${GRAY_200};">
          <tr>
            <td bgcolor="${BLUE}" style="background-color:${BLUE}; background-image:linear-gradient(135deg, ${BLUE} 0%, ${BLUE_DARK} 100%); padding:22px 32px;" class="px">
              <a href="${EMAIL_SITE_URL}" style="text-decoration:none;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td valign="middle" style="padding-right:14px;">
                      <img src="${EMAIL_SITE_URL}/icons/email-crest.png" width="38" height="48" alt="" style="display:block; border:0;">
                    </td>
                    <td valign="middle">
                      <p style="margin:0; font-family:${TITLE_FONT}; font-size:19px; font-weight:700; letter-spacing:1px; text-transform:uppercase; color:#ffffff;">Mémoire d'Auxerrois</p>
                      <p style="margin:2px 0 0; font-family:${TEXT_FONT}; font-size:12px; color:${BLUE_LIGHT};">L'histoire de l'AJ Auxerre</p>
                    </td>
                  </tr>
                </table>
              </a>
            </td>
          </tr>
          <tr>
            <td height="4" bgcolor="${ORANGE}" style="font-size:0; line-height:0; background-color:${ORANGE};">&nbsp;</td>
          </tr>
          <tr>
            <td style="padding:32px 32px 12px;" class="px">
${body}
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:22px 32px 26px; background-color:${GRAY_50}; border-top:1px solid ${GRAY_200};" class="px">
              <p style="margin:0 0 10px; font-family:${TITLE_FONT}; font-size:12px; font-weight:700; letter-spacing:1px; text-transform:uppercase;">
                <a href="${EMAIL_SITE_URL}" style="color:${BLUE}; text-decoration:none;">Le site</a>
                <span style="color:${GRAY_200};">&nbsp;&nbsp;|&nbsp;&nbsp;</span>
                <a href="${EMAIL_SITE_URL}/articles" style="color:${BLUE}; text-decoration:none;">Les articles</a>
                <span style="color:${GRAY_200};">&nbsp;&nbsp;|&nbsp;&nbsp;</span>
                <a href="${EMAIL_SITE_URL}/moncompte" style="color:${BLUE}; text-decoration:none;">Mon compte</a>
              </p>
              <p style="margin:0; font-family:${TEXT_FONT}; font-size:12px; line-height:1.6; color:${GRAY_400};">${footerNote}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
