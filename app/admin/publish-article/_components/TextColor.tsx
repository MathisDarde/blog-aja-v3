import { Editor } from "@tiptap/react";

export const TextColorPicker = ({
  editor,
  onSuccess,
}: {
  editor: Editor | null;
  onSuccess: () => void;
}) => {
  const colors = [
    "#3c77b4",
    "#f76200",
    "#000000",
    "#ff9fae",
    "#fde995",
    "#a6e1c5",
    "#a7e0f6",
    "#ffffff",
  ];
  return (
    <div className="grid grid-cols-3 gap-2">
      {colors.map((c) => (
        <button
          type="button"
          key={c}
          className="flex flex-col items-center gap-1 p-2 hover:bg-slate-50 rounded-lg transition-colors"
          onClick={() => {
            editor?.chain().focus().setColor(c).run();
            onSuccess();
          }}
        >
          <div
            className="w-8 h-8 rounded-full border border-slate-200"
            style={{ backgroundColor: c }}
          />
        </button>
      ))}
      <button
        className="col-span-3 text-xs py-2 text-slate-500 hover:text-slate-800"
        type="button"
        onClick={() => {
          editor?.chain().focus().unsetColor().run();
          onSuccess();
        }}
      >
        Réinitialiser la couleur
      </button>
    </div>
  );
};
