import Mention from "@tiptap/extension-mention";

export const CustomMention = Mention.extend({
  parseHTML() {
    return [{ tag: "span.methode-expert" }];
  },

  addAttributes() {
    return {
      ...this.parent?.(),
      id: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-id"),
        renderHTML: (attributes) => {
          if (!attributes.id) return {};
          return { "data-id": attributes.id };
        },
      },
      label: {
        default: null,
        parseHTML: (element) => element.textContent,
        renderHTML: () => ({}),
      },
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
