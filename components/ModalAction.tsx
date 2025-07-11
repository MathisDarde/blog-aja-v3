import { useGlobalContext } from "@/contexts/GlobalContext";

type ModalActionProps = {
  object: string;
  type: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export const ModalAction = ({
  object,
  type,
  onConfirm,
  onCancel,
}: ModalActionProps) => {
  const { setModalParams } = useGlobalContext();

  const handleCancel = () => {
    if (onCancel) onCancel();
    setModalParams(null);
  };

  const handleConfirm = () => {
    onConfirm();
    setModalParams(null);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 font-Montserrat">
        <div className="bg-white p-6 rounded-xl shadow-lg w-96 text-center">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            {type === "delete"
              ? `Supprimer l'objet suivant : ${object} ?`
              : type === "edit"
              ? `Modifier l'objet suivant : ${object} ?`
              : type === "leaveChanges"
              ? `Ne pas enregistrer les modifications de l'objet suivant : ${object} ?`
              : type === "publish"
              ? `Publier l'objet suivant : ${object}`
              : type === "save"
              ? `Sauvegarder l'objet suivant : ${object}`
              : `${object}`}
          </h3>
          <p className="text-gray-600 mb-6">
            {type === "delete" || type === "edit"
              ? "Cette action est irréversible. Êtes-vous sûr de vouloir continuer ?"
              : type === "leaveChanges"
              ? "Vous perdrez toutes vos modifications, souhaitez-vous continuer ?"
              : type === "publish"
              ? "Souhaitez vous publier cet élément ?"
              : type === "save"
              ? "Souhaitez vous sauvegarder cet élément ?"
              : ""}
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg transition-colors hover:bg-gray-500 hover:text-white"
            >
              Annuler
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-lg transition-colors hover:bg-red-800"
            >
              Confirmer
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
