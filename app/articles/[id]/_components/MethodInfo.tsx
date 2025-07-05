import PlayerMethodeExpert from "./MethodDetails/MethodeExpertJoueur";
import SeasonMethodeExpert from "./MethodDetails/MethodeExpertSaison";
import GameMethodeExpert from "./MethodDetails/MethodeExpertMatch";
import CoachMethodeExpert from "./MethodDetails/MethodeExpertCoach";
import {
  MethodeCoach,
  MethodeJoueur,
  MethodeMatch,
  MethodeSaison,
  MethodeProps,
} from "@/contexts/Interfaces";

const MethodInfo: React.FC<MethodeProps> = ({ methode, onClose }) => {
  if (!methode) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg relative w-96">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-red-600 text-xl font-bold"
        >
          ✖
        </button>

        {methode.typemethode === "joueur" && (
          <PlayerMethodeExpert
            methode={methode as MethodeJoueur}
            onClose={onClose}
          />
        )}
        {methode.typemethode === "saison" && (
          <SeasonMethodeExpert
            methode={methode as MethodeSaison}
            onClose={onClose}
          />
        )}
        {methode.typemethode === "match" && (
          <GameMethodeExpert
            methode={methode as MethodeMatch}
            onClose={onClose}
          />
        )}
        {methode.typemethode === "coach" && (
          <CoachMethodeExpert
            methode={methode as MethodeCoach}
            onClose={onClose}
          />
        )}
      </div>
    </div>
  );
};

export default MethodInfo;
