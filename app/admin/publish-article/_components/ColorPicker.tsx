import { Editor } from "@tiptap/react";

export const ColorPicker = ({
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
  ];
  return (
    <div className="flex justify-center gap-2">
      {colors.map((color) => (
        <button
          key={color}
          type="button"
          className="w-10 h-10 rounded-full border border-slate-200 shadow-sm transition-transform hover:scale-110"
          style={{ backgroundColor: color }}
          onClick={() => {
            editor?.chain().focus().setHighlight({ color }).run();
            onSuccess();
          }}
        />
      ))}
      <button
        type="button"
        onClick={() => {
          editor?.chain().focus().unsetHighlight().run();
          onSuccess();
        }}
      >
        <div className="h-10 w-10 border-slate-200 border rounded-full bg-white"></div>
      </button>
    </div>
  );
};
