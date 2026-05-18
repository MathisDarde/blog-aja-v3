import Button from "@/components/BlueButton";
import { Editor } from "@tiptap/react";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  editor: Editor | null;
  onSuccess: () => void;
}

export default function VideoUrlPopup({ editor, onSuccess }: Props) {
  const [url, setUrl] = useState("");

  const insertVideo = () => {
    if (!editor || !url) return;

    // Fonction pour extraire l'ID Youtube (gère watch?v=, youtu.be/, embed/, etc.)
    const getYouTubeID = (url: string) => {
      const regExp =
        /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      return match && match[2].length === 11 ? match[2] : null;
    };

    const videoId = getYouTubeID(url);

    if (!videoId) {
      toast.error("L'URL de la vidéo est invalide.");
      return;
    }

    // ON FORCE LE FORMAT EMBED
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;

    editor
      .chain()
      .focus()
      .setYoutubeVideo({
        src: embedUrl,
      })
      .run();

    onSuccess();
  };

  return (
    <div className="p-4 space-y-3">
      <input
        type="text"
        placeholder="https://www.youtube.com/watch?v=..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-aja-blue"
        autoFocus
      />

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" onClick={insertVideo}>
          Insérer
        </Button>
      </div>
    </div>
  );
}
