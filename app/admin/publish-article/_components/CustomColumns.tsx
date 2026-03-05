import { Node, mergeAttributes } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    columns: {
      addColumn: () => ReturnType;
      addRow: () => ReturnType;
      deleteColumn: () => ReturnType;
    };
  }
}

export const Column = Node.create({
  name: "column",
  content: "block+",
  isolating: true,
  parseHTML() {
    return [{ tag: 'div[data-type="column"]' }];
  },
  addAttributes() {
    return {
      flex: { default: 1 },
      padding: { default: "1.5rem" },
      backgroundColor: { default: "transparent" },
      verticalAlign: { default: "flex-start" }, // flex-start, center, flex-end, stretch
      textAlign: { default: "left" },
    };
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-type": "column",
        style: `
          flex: ${HTMLAttributes.flex};
          padding: ${HTMLAttributes.padding};
          background-color: ${HTMLAttributes.backgroundColor};
          display: flex;
          flex-direction: column;
          justify-content: ${HTMLAttributes.verticalAlign === 'stretch' ? 'flex-start' : HTMLAttributes.verticalAlign};
          align-self: ${HTMLAttributes.verticalAlign === 'stretch' ? 'stretch' : 'auto'};
          text-align: ${HTMLAttributes.textAlign};
          min-height: 48px;
        `,
      }),
      0,
    ];
  },
});

export const Columns = Node.create({
  name: "columns",
  group: "block",
  content: "column+",
  defining: true,
  parseHTML() {
    return [{ tag: 'div[data-type="columns"]' }];
  },
  addAttributes() {
    return {
      gap: { default: "1.5rem" },
      padding: { default: "0px" },
      marginTop: { default: "2rem" },
      marginBottom: { default: "2rem" },
      borderWidth: { default: "0px" },
      borderColor: { default: "#e2e8f0" },
      borderStyle: { default: "solid" },
      borderRadius: { default: "0.75rem" },
      backgroundColor: { default: "transparent" },
      shadow: { default: "none" }, // none, sm, md, lg
      stackOnMobile: { default: true },
    };
  },
  renderHTML({ HTMLAttributes }) {
    const shadowMap: Record<string, string> = {
      none: "none",
      sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      md: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
      lg: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
    };

    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-type": "columns",
        class: HTMLAttributes.stackOnMobile ? "stack-on-mobile" : "",
        style: `
          display: flex;
          width: 100%;
          gap: ${HTMLAttributes.gap};
          padding: ${HTMLAttributes.padding};
          margin-top: ${HTMLAttributes.marginTop};
          margin-bottom: ${HTMLAttributes.marginBottom};
          border: ${HTMLAttributes.borderWidth} ${HTMLAttributes.borderStyle} ${HTMLAttributes.borderColor};
          border-radius: ${HTMLAttributes.borderRadius};
          background-color: ${HTMLAttributes.backgroundColor};
          box-shadow: ${shadowMap[HTMLAttributes.shadow as string] ?? "none"};
        `,
      }),
      0,
    ];
  },
  addCommands() {
    return {
      addColumn:
        () =>
        ({ state, dispatch }) => {
          const { selection } = state;
          const $from = selection.$from;
          let columnsDepth = $from.depth;
          while (columnsDepth > 0) {
            if (state.doc.nodeAt($from.before(columnsDepth))?.type.name === "columns") break;
            columnsDepth--;
          }
          if (columnsDepth <= 0) return false;
          const columnsPos = $from.before(columnsDepth);
          const columnsNode = state.doc.nodeAt(columnsPos);
          if (!columnsNode) return false;
          // Insert inside the columns node, after the last column child
          const insertPos = columnsPos + columnsNode.nodeSize - 1;
          if (dispatch) {
            dispatch(state.tr.insert(insertPos, state.schema.nodes.column.createAndFill()!));
          }
          return true;
        },

      addRow:
        () =>
        ({ state, dispatch }) => {
          const { selection } = state;
          const $from = selection.$from;
          let columnsDepth = $from.depth;
          while (columnsDepth > 0) {
            if (state.doc.nodeAt($from.before(columnsDepth))?.type.name === "columns") break;
            columnsDepth--;
          }
          if (columnsDepth <= 0) return false;
          const columnsPos = $from.before(columnsDepth);
          const columnsNode = state.doc.nodeAt(columnsPos);
          if (!columnsNode) return false;
          // Create a new columns row after the current one with the same number of columns
          const insertPos = columnsPos + columnsNode.nodeSize;
          if (dispatch) {
            const cols = [];
            for (let i = 0; i < columnsNode.childCount; i++) {
              cols.push(state.schema.nodes.column.createAndFill()!);
            }
            const newRow = state.schema.nodes.columns.create(
              { ...columnsNode.attrs },
              cols as any
            );
            dispatch(state.tr.insert(insertPos, newRow));
          }
          return true;
        },

      deleteColumn:
        () =>
        ({ state, dispatch }) => {
          const { selection } = state;
          const $from = selection.$from;
          // Find the column node
          let columnDepth = $from.depth;
          while (columnDepth > 0) {
            if (state.doc.nodeAt($from.before(columnDepth))?.type.name === "column") break;
            columnDepth--;
          }
          if (columnDepth <= 0) return false;
          // Find the parent columns
          let columnsDepth = columnDepth - 1;
          while (columnsDepth > 0) {
            if (state.doc.nodeAt($from.before(columnsDepth))?.type.name === "columns") break;
            columnsDepth--;
          }
          if (columnsDepth <= 0) return false;
          const columnsNode = state.doc.nodeAt($from.before(columnsDepth));
          if (!columnsNode) return false;
          // If only one column left, delete the entire grid
          if (columnsNode.childCount <= 1) {
            if (dispatch) {
              const columnsPos = $from.before(columnsDepth);
              dispatch(state.tr.delete(columnsPos, columnsPos + columnsNode.nodeSize));
            }
            return true;
          }
          // Delete just this column
          if (dispatch) {
            const columnPos = $from.before(columnDepth);
            const columnNode = state.doc.nodeAt(columnPos);
            if (!columnNode) return false;
            dispatch(state.tr.delete(columnPos, columnPos + columnNode.nodeSize));
          }
          return true;
        },
    };
  },
});