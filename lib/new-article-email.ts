// Mail envoyé aux abonnés à la publication d'un article (actions/article/send-new-article-mail).
// Mise en page en tableaux et styles en ligne : seule façon d'être rendu correctement
// par Gmail et Outlook. Couleurs et polices de l'app (tailwind.config.ts) ; les clients qui
// ignorent les polices web (Gmail) affichent la police de repli, Arial, comme le site.

const SITE_URL = "https://memoiredauxerrois.fr";
// aja-blue, orange-third et gris Tailwind (gray-100/200/400/500/900)
const BLUE = "#3c77b4";
const ORANGE = "#f76200";
const GRAY_100 = "#f3f4f6";
const GRAY_200 = "#e5e7eb";
const GRAY_400 = "#9ca3af";
const GRAY_500 = "#6b7280";
const GRAY_900 = "#111827";
const TITLE_FONT = "'Bai Jamjuree', Arial, sans-serif";
const TEXT_FONT = "Montserrat, Arial, sans-serif";

export interface NewArticleEmailData {
  title: string;
  teaser: string;
  slug: string;
  imageUrl: string;
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export function newArticleEmail(article: NewArticleEmailData) {
  const link = `${SITE_URL}/articles/${encodeURIComponent(article.slug)}`;
  const title = escapeHtml(article.title);
  const teaser = escapeHtml(article.teaser);

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light">
  <title>${title}</title>
  <link href="https://fonts.googleapis.com/css2?family=Bai+Jamjuree:wght@600;700&family=Montserrat:wght@400;600&display=swap" rel="stylesheet">
  <style>
    @import url("https://fonts.googleapis.com/css2?family=Bai+Jamjuree:wght@600;700&family=Montserrat:wght@400;600&display=swap");
  </style>
</head>
<body style="margin:0; padding:0; background-color:${GRAY_100};">
  <!-- Aperçu affiché par la boîte mail à côté de l'objet -->
  <div style="display:none; max-height:0; overflow:hidden; opacity:0;">${teaser}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${GRAY_100};">
    <tr>
      <td align="center" style="padding:32px 12px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px; background-color:#ffffff; border:1px solid ${GRAY_200}; border-radius:24px; overflow:hidden;">
          <tr>
            <td align="center" style="background-color:#ffffff; padding:22px 24px; border-bottom:1px solid ${GRAY_200};">
              <a href="${SITE_URL}" style="font-family:${TITLE_FONT}; font-size:20px; font-weight:700; text-transform:uppercase; color:${BLUE}; text-decoration:none;">Mémoire d'Auxerrois</a>
            </td>
          </tr>
          ${
            article.imageUrl
              ? `<tr>
            <td>
              <a href="${link}"><img src="${escapeHtml(article.imageUrl)}" alt="${title}" width="600" style="display:block; width:100%; max-width:600px; height:auto; border:0;"></a>
            </td>
          </tr>`
              : ""
          }
          <tr>
            <td style="padding:32px 32px 8px;">
              <p style="margin:0 0 12px; font-family:${TITLE_FONT}; font-size:12px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:${ORANGE};">Nouvel article</p>
              <h1 style="margin:0 0 16px; font-family:${TITLE_FONT}; font-size:26px; line-height:1.25; font-weight:700; color:${GRAY_900};">
                <a href="${link}" style="color:${GRAY_900}; text-decoration:none;">${title}</a>
              </h1>
              <p style="margin:0; font-family:${TEXT_FONT}; font-size:15px; line-height:1.7; color:${GRAY_500};">${teaser}</p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:28px 32px 36px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" bgcolor="${BLUE}" style="border-radius:12px;">
                    <a href="${link}" style="display:inline-block; padding:14px 32px; font-family:${TITLE_FONT}; font-size:13px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:#ffffff; text-decoration:none; border-radius:12px;">Lire l'article</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:20px 32px; background-color:${GRAY_100}; border-top:1px solid ${GRAY_200};">
              <p style="margin:0; font-family:${TEXT_FONT}; font-size:12px; line-height:1.6; color:${GRAY_400};">
                Vous recevez cet email car vous êtes abonné aux nouveaux articles de Mémoire d'Auxerrois.<br>
                <a href="${SITE_URL}/moncompte" style="color:${BLUE}; text-decoration:underline;">Gérer mes notifications</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = [
    `Nouvel article : ${article.title}`,
    "",
    article.teaser,
    "",
    `Lire l'article : ${link}`,
    "",
    `Gérer mes notifications : ${SITE_URL}/moncompte`,
  ].join("\n");

  return { subject: `Nouvel article : ${article.title}`, html, text };
}
