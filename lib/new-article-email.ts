// Mail envoyé aux abonnés à la publication d'un article (lib/newsletter.ts,
// actions/article/send-new-article-mail).
import {
  button,
  EMAIL_SITE_URL,
  emailLayout,
  escapeHtml,
  GRAY_200,
  GRAY_400,
  GRAY_500,
  GRAY_900,
  ORANGE,
  paragraph,
  TEXT_FONT,
  TITLE_FONT,
} from "@/lib/email-layout";
import { readingMinutes } from "@/lib/reading-time";
import { tagLabels } from "@/lib/seo";

export interface NewArticleEmailData {
  title: string;
  teaser: string;
  slug: string;
  imageUrl: string | null;
  tags: string[] | null;
  content: string;
}

export function newArticleEmail(article: NewArticleEmailData, recipientName?: string | null) {
  const link = `${EMAIL_SITE_URL}/articles/${encodeURIComponent(article.slug)}`;
  const title = escapeHtml(article.title);
  const teaser = escapeHtml(article.teaser);
  const greeting = recipientName ? `Bonjour ${escapeHtml(recipientName)},` : "Bonjour,";
  const minutes = readingMinutes(article.content);
  const meta = [
    ...tagLabels(article.tags).slice(0, 2).map((t) => escapeHtml(t)),
    `${minutes} min de lecture`,
  ].join(`&nbsp;&nbsp;&middot;&nbsp;&nbsp;`);

  const body = `${paragraph(greeting, "font-size:16px; font-weight:600;")}
${paragraph("Un nouvel article vient de paraître sur Mémoire d'Auxerrois. Prenez quelques minutes, on vous raconte tout&nbsp;:", "margin-bottom:24px;")}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid ${GRAY_200}; border-radius:18px; overflow:hidden;">
  ${
    article.imageUrl
      ? `<tr>
    <td>
      <a href="${link}"><img src="${escapeHtml(article.imageUrl)}" alt="${title}" width="534" style="display:block; width:100%; height:auto; border:0;"></a>
    </td>
  </tr>`
      : ""
  }
  <tr>
    <td style="padding:22px 24px 26px;">
      <p style="margin:0 0 10px; font-family:${TITLE_FONT}; font-size:11px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:${ORANGE};">${meta}</p>
      <h1 class="title" style="margin:0 0 12px; font-family:${TITLE_FONT}; font-size:24px; line-height:1.25; font-weight:700; color:${GRAY_900};">
        <a href="${link}" style="color:${GRAY_900}; text-decoration:none;">${title}</a>
      </h1>
      <p style="margin:0 0 22px; font-family:${TEXT_FONT}; font-size:15px; line-height:1.7; color:${GRAY_500};">${teaser}</p>
      ${button(link, "Lire l'article")}
    </td>
  </tr>
</table>
<p style="margin:28px 0 4px; font-family:${TEXT_FONT}; font-size:15px; line-height:1.7; color:${GRAY_500};">Bonne lecture, et allez l'AJA&nbsp;!</p>
<p style="margin:0 0 20px; font-family:${TITLE_FONT}; font-size:15px; font-weight:700; color:${GRAY_900};">L'équipe de Mémoire d'Auxerrois</p>`;

  const html = emailLayout({
    title: article.title,
    preheader: article.teaser,
    body,
    footerNote: `Une question, un souvenir à partager&nbsp;? Répondez simplement à ce mail, on lit tout.<br>
Vous recevez cet email car vous êtes abonné aux nouveaux articles.
<a href="${EMAIL_SITE_URL}/moncompte" style="color:${GRAY_400}; text-decoration:underline;">Se désabonner</a>`,
  });

  const text = [
    recipientName ? `Bonjour ${recipientName},` : "Bonjour,",
    "",
    "Un nouvel article vient de paraître sur Mémoire d'Auxerrois :",
    "",
    article.title,
    article.teaser,
    "",
    `Lire l'article (${minutes} min) : ${link}`,
    "",
    "Bonne lecture, et allez l'AJA !",
    "L'équipe de Mémoire d'Auxerrois",
    "",
    `Se désabonner : ${EMAIL_SITE_URL}/moncompte`,
  ].join("\n");

  return { subject: `Nouvel article : ${article.title}`, html, text };
}
