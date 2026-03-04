import Button from "@/components/BlueButton";
import { useState } from "react";
import { Editor } from "@tiptap/react";

export const LinkForm = ({
  editor,
  onSuccess,
  currentHref = "",
}: {
  editor: Editor | null;
  onSuccess: () => void;
  currentHref?: string;
}) => {
  const [url, setUrl] = useState(currentHref);
  return (
    <div className="space-y-2 text-left">
      <label className="font-Bai_Jamjuree font-bold text-[10px] text-gray-400 uppercase ml-1">
        URL du lien
      </label>
      <input
        autoFocus
        className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-aja-blue"
        placeholder="https://example.com"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <Button
        type="button"
        onClick={() => {
          editor
            ?.chain()
            .focus()
            .setLink({ href: url, target: "_blank", rel: "noopener noreferrer" })
            .run();
          onSuccess();
        }}
        className="w-full m-0"
      >
        Appliquer le lien
      </Button>
    </div>
  );
};
