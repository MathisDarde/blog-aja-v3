import Image from "@tiptap/extension-image";

export const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: "100%",
        parseHTML: (el) => el.style.width || "100%",
        renderHTML: (attr) => ({ style: `width: ${attr.width}` }),
      },
      aspectRatio: {
        default: "auto",
        parseHTML: (el) => el.style.aspectRatio || "auto",
        renderHTML: (attr) => ({ style: `aspect-ratio: ${attr.aspectRatio}` }),
      },
      textAlign: {
        default: "center",
        parseHTML: (el) => el.style.textAlign || "center",
        renderHTML: (attr) => {
          const alignments: Record<string, string> = {
            left: "margin-right: auto; margin-left: 0;",
            center: "margin-left: auto; margin-right: auto;",
            right: "margin-left: auto; margin-right: 0;",
          };
          return {
            style: `display: block; ${alignments[attr.textAlign] || alignments.center}`,
          };
        },
      },
      objectFit: {
        default: "cover",
        parseHTML: (el) => el.style.objectFit || "cover",
        renderHTML: (attr) => ({ style: `object-fit: ${attr.objectFit}` }),
      },
      objectPosition: {
        default: "center",
        parseHTML: (el) => el.style.objectPosition || "center",
        renderHTML: (attr) => ({
          style: `object-position: ${attr.objectPosition}`,
        }),
      },
    };
  },
});
