import { Node, mergeAttributes, RawCommands } from "@tiptap/core";

// 1. Déclaration des types pour TypeScript (Autocomplete et types globaux)
declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    columns: {
      addColumn: () => ReturnType;
      addColumnsRow: () => ReturnType;
    };
  }
}

export const Column = Node.create({
  name: "column",
  content: "block+",
  isolating: true,

  addAttributes() {
    return {
      padding: { default: "1rem" },
      borderRadius: { default: "0px" },
      backgroundColor: { default: "transparent" },
      verticalAlign: { default: "stretch" },
    };
  },

  renderHTML({ HTMLAttributes }) {
    const { padding, borderRadius, backgroundColor, verticalAlign } =
      HTMLAttributes;
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-type": "column",
        style: `padding: ${padding}; border-radius: ${borderRadius}; background-color: ${backgroundColor}; align-self: ${verticalAlign}; flex: 1; min-width: 0; border: 1px solid #000000; margin: -0.5px;`,
      }),
      0,
    ];
  },
});

export const Columns = Node.create({
  name: "columns",
  group: "block",
  content: "column+",

  addAttributes() {
    return {
      borderWidth: { default: "1px" },
      borderColor: { default: "#000000" },
      gap: { default: "0px" },
    };
  },

  // 2. Correction des types des commandes
  addCommands() {
    return {
      addColumn:
        () =>
        ({ chain }) => {
          return chain()
            .insertContent({ type: "column", content: [{ type: "paragraph" }] })
            .run();
        },
      addColumnsRow:
        () =>
        ({ chain, state }) => {
          return chain()
            .insertContentAt(state.selection.to + 1, {
              type: "columns",
              content: [
                { type: "column", content: [{ type: "paragraph" }] },
                { type: "column", content: [{ type: "paragraph" }] },
              ],
            })
            .focus()
            .run();
        },
    } as RawCommands; // On force le type RawCommands pour TypeScript
  },

  renderHTML({ HTMLAttributes }) {
    const { borderWidth, borderColor, gap } = HTMLAttributes;
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-type": "columns",
        style: `display: flex; border: ${borderWidth} solid ${borderColor}; gap: ${gap}; width: 100%;`,
      }),
      0,
    ];
  },
});
