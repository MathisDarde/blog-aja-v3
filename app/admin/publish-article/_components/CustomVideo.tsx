// CustomYoutube.ts
import Youtube from "@tiptap/extension-youtube";

export const CustomYoutube = Youtube.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      paddingY: {
        default: "32px",
        // On récupère la valeur depuis le style inline s'il existe
        parseHTML: (el) => el.style.paddingTop || "32px",
      },
      paddingX: {
        default: "0px",
        parseHTML: (el) => el.style.paddingLeft || "0px",
      },
      width: {
        default: "100%",
        parseHTML: (el) => el.style.width || "100%",
      },
      aspectRatio: {
        default: "16 / 9",
        parseHTML: (el) => el.style.aspectRatio || "16 / 9",
      },
      textAlign: {
        default: "center",
        parseHTML: (el) => el.style.textAlign || "center",
      },
      borderRadius: {
        default: "12px",
        parseHTML: (el) => el.style.borderRadius || "12px",
      },
    };
  },

  renderHTML({ HTMLAttributes }) {
    const {
      textAlign,
      paddingY,
      paddingX,
      width,
      aspectRatio,
      borderRadius,
      ...rest
    } = HTMLAttributes;

    // Gestion de l'alignement horizontal
    const alignments: Record<string, string> = {
      left: "margin-right: auto !important; margin-left: 0 !important;",
      center: "margin-left: auto !important; margin-right: auto !important;",
      right: "margin-left: auto !important; margin-right: 0 !important;",
    };

    // On construit TOUT le style du wrapper ici
    const wrapperStyle = `
      display: block !important;
      width: ${width || "100%"} !important;
      padding-top: ${paddingY || "0px"} !important;
      padding-bottom: ${paddingY || "0px"} !important;
      padding-left: ${paddingX || "0px"} !important;
      padding-right: ${paddingX || "0px"} !important;
      ${alignments[textAlign] || alignments.center}
    `
      .replace(/\s+/g, " ")
      .trim(); // On nettoie les espaces

    // Style de l'iframe
    const iframeStyle = `
      width: 100% !important;
      height: auto !important;
      aspect-ratio: ${aspectRatio || "16 / 9"} !important;
      border-radius: ${borderRadius || "0px"} !important;
      display: block !important;
    `
      .replace(/\s+/g, " ")
      .trim();

    return [
      "div",
      {
        class: "video-node-wrapper",
        style: wrapperStyle,
      },
      [
        "iframe",
        {
          ...rest,
          style: iframeStyle,
          frameborder: "0",
          allowfullscreen: "true",
        },
      ],
    ];
  },
});
