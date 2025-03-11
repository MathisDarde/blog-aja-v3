import PlayerMethodeExpert from "./MethodDetails/MethodeExpertJoueur";
import SeasonMethodeExpert from "./MethodDetails/MethodeExpertSaison";
import GameMethodeExpert from "./MethodDetails/MethodeExpertMatch";
import CoachMethodeExpert from "./MethodDetails/MethodeExpertCoach";

interface BaseMethodeData {
  typemethode: "joueur" | "saison" | "match" | "coach";
}

interface MethodeJoueur extends BaseMethodeData {
  typemethode: "joueur";
  imagejoueur: string;
  joueurnom: string;
  poste: string;
  taille: string;
  piedfort: string;
  clubs: [string, string, string][];
  matchs: number;
  buts: number;
  passesd: number;
}

interface MethodeSaison extends BaseMethodeData {
  typemethode: "saison";
  saison: string;
  imgterrain: string;
  coach: string;
  systeme: string;
  remplacants: [string, string, string][];
}

interface MethodeMatch extends BaseMethodeData {
  typemethode: "match";
  titrematch: string;
  imgterrain: string;
  couleur1equipe1: string;
  couleur2equipe1: string;
  nomequipe1: string;
  systemeequipe1: string;
  couleur1equipe2: string;
  couleur2equipe2: string;
  nomequipe2: string;
  systemeequipe2: string;
  remplacantsequipe1: [string, string, string, string?, string?][];
  remplacantsequipe2: [string, string, string, string?, string?][];
  stade: string;
  date: string;
}

interface MethodeCoach extends BaseMethodeData {
  typemethode: "coach";
  imagecoach: string;
  nomcoach: string;
  clubscoach: [string, string, string][];
  palmares: string[];
  statistiques: string;
}

type MethodeData = MethodeJoueur | MethodeSaison | MethodeMatch | MethodeCoach;

interface Props {
  methodData: MethodeData | null;
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
          <PlayerMethodeExpert
            methode={methodData as MethodeJoueur}
            onClose={onClose}
          />
        )}
        {methodData.typemethode === "saison" && (
          <SeasonMethodeExpert
            methode={methodData as MethodeSaison}
            onClose={onClose}
          />
        )}
        {methodData.typemethode === "match" && (
          <GameMethodeExpert
            methode={methodData as MethodeMatch}
            onClose={onClose}
          />
        )}
        {methodData.typemethode === "coach" && (
          <CoachMethodeExpert
            methode={methodData as MethodeCoach}
            onClose={onClose}
          />
        )}
      </div>
    </div>
  );
};

export default MethodInfo;
