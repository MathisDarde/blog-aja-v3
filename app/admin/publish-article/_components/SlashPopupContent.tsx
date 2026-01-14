import { PopupCategories, PopupOptions } from "./SlashPopupCommands";
import { Editor } from "@tiptap/react";

interface Props {
  slashMenu: {
    show: boolean;
    top: number;
    left: number;
    selectedParent: string | null;
  };
  setSlashMenu: React.Dispatch<
    React.SetStateAction<{
      show: boolean;
      top: number;
      left: number;
      selectedParent: string | null;
    }>
  >;
  editor: Editor | null;
}

export default function SlashPopupContent({
  slashMenu,
  setSlashMenu,
  editor,
}: Props) {
  const executeSlashCommand = (id: string) => {
    if (!editor) return;

    // Supprimer le slash
    editor
      .chain()
      .focus()
      .deleteRange({
        from: editor.state.selection.from - 1,
        to: editor.state.selection.from,
      })
      .run();

    // Exécuter l'action correspondante
    switch (id) {
      case "h2":
        editor.chain().focus().toggleHeading({ level: 2 }).run();
        break;
      case "h3":
        editor.chain().focus().toggleHeading({ level: 3 }).run();
        break;
      case "bulletList":
        editor.chain().focus().toggleBulletList().run();
        break;
      case "underline":
        editor.chain().focus().toggleUnderline().run();
        break;
    }
    setSlashMenu((prev) => ({ ...prev, show: false }));
  };

  return (
    <div
      onMouseDown={(e) => e.preventDefault()}
      style={{
        position: "absolute",
        top: `${slashMenu.top}px`,
        left: `${slashMenu.left}px`,
        zIndex: 110,
      }}
      className="menu-container w-64 bg-white border border-gray-200 rounded-lg shadow-2xl overflow-hidden py-2 animate-in fade-in zoom-in duration-200"
    >
      {/* ENTÊTE / NAVIGATION */}
      <div className="px-3 py-1 flex items-center justify-between border-b border-gray-50 mb-1">
        <span className="text-xs font-bold text-gray-400 uppercase">
          {slashMenu.selectedParent ? "Options" : "Insérer un élément"}
        </span>
        {slashMenu.selectedParent && (
          <button
            onClick={() =>
              setSlashMenu((prev) => ({ ...prev, selectedParent: null }))
            }
            className="text-[10px] font-Montserrat bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded text-slate-500 transition-colors"
          >
            ← Retour
          </button>
        )}
      </div>

      <div className="max-h-80 overflow-y-auto px-1">
        {/* VUE 1 : LISTE DES CATÉGORIES (si selectedParent est null) */}
        {!slashMenu.selectedParent &&
          Object.entries(PopupCategories).map(([key, cat]) => (
            <button
              key={key}
              onClick={() =>
                setSlashMenu((prev) => ({ ...prev, selectedParent: key }))
              }
              className="w-full flex items-center px-3 py-3 hover:bg-slate-50 text-left rounded-lg transition-all group"
            >
              <div className="w-10 h-10 flex items-center justify-center bg-blue-50 text-blue-600 rounded-lg mr-3 text-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                {cat.icon}
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-slate-900 font-Montserrat">
                  {cat.label}
                </div>
                <div className="text-[11px] text-slate-400 font-Montserrat">
                  Voir les éléments
                </div>
              </div>
              <span className="text-slate-300">›</span>
            </button>
          ))}

        {/* VUE 2 : LISTE DES ÉLÉMENTS DE LA CATÉGORIE SÉLECTIONNÉE */}
        {slashMenu.selectedParent &&
          PopupOptions.filter(
            (opt) => opt.parent === slashMenu.selectedParent
          ).map((option) => (
            <button
              key={option.id}
              onClick={() => executeSlashCommand(option.id)}
              className="w-full flex items-center px-3 py-2 hover:bg-slate-50 text-left rounded-lg transition-colors"
            >
              <div className="w-8 h-8 flex items-center justify-center bg-slate-100 rounded text-slate-600 mr-3 font-bold text-sm">
                {option.icon}
              </div>
              <div>
                <div className="text-sm font-medium font-Montserrat text-slate-900">
                  {option.title}
                </div>
                <div className="text-[11px] font-Montserrat text-slate-500">
                  {option.description}
                </div>
              </div>
            </button>
          ))}
      </div>
    </div>
  );
}
