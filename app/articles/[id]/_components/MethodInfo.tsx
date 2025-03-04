import PlayerMethodeExpert from "./MethodDetails/MethodeExpertJoueur";
import SeasonMethodeExpert from "./MethodDetails/MethodeExpertSaison";
import GameMethodeExpert from "./MethodDetails/MethodeExpertMatch";
import CoachMethodeExpert from "./MethodDetails/MethodeExpertCoach";

interface Props {
  methodData: any;
  onClose: () => void;
}

const MethodInfo: React.FC<Props> = ({ methodData, onClose }) => {
  if (!methodData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg relative w-96">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-red-600 text-xl font-bold"
        >
          ✖
        </button>

        {methodData.typemethode === "joueur" && (
          <PlayerMethodeExpert methode={methodData} onClose={onClose} />
        )}
        {methodData.typemethode === "saison" && (
          <SeasonMethodeExpert methode={methodData} onClose={onClose} />
        )}
        {methodData.typemethode === "match" && (
          <GameMethodeExpert methode={methodData} onClose={onClose} />
        )}
        {methodData.typemethode === "coach" && (
          <CoachMethodeExpert methode={methodData} onClose={onClose} />
        )}
      </div>
    </div>
  );
};

export default MethodInfo;
