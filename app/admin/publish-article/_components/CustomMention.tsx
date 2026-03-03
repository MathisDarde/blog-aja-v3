import Mention from "@tiptap/extension-mention";

export const CustomMention = Mention.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      type: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-type"),
        renderHTML: (attributes) => {
          if (!attributes.type) return {};
          return { "data-type": attributes.type };
        },
      },
    };
  },
}).configure({
  HTMLAttributes: {
    class: "methode-expert",
  },
  deleteTriggerWithBackspace: true,

  renderText({ node }) {
    return `${node.attrs.label ?? node.attrs.id}`;
  },

  renderHTML({ options, node }) {
    return [
      "span",
      {
        class: options.HTMLAttributes.class,
        "data-id": node.attrs.id,
        "data-type": node.attrs.type,
      },
      `${node.attrs.label ?? node.attrs.id}`,
    ];
  },
});
