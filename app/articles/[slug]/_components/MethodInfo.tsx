import PlayerMethodeExpert from "./MethodDetails/MethodeExpertJoueur";
import SeasonMethodeExpert from "./MethodDetails/MethodeExpertSaison";
import GameMethodeExpert from "./MethodDetails/MethodeExpertMatch";
import CoachMethodeExpert from "./MethodDetails/MethodeExpertCoach";
import {
  MethodeCoach,
  MethodeJoueur,
  MethodeMatch,
  MethodeSaison,
  Methodes,
} from "@/contexts/Interfaces";

interface MethodeProps {
  methode: Methodes[];
}

const MethodInfo: React.FC<MethodeProps> = ({ methode }) => {
  if (!methode || methode.length === 0) return null;

  return (
    <>
      {methode.map((m, index) => {
        switch (m.typemethode) {
          case "joueur":
            return <PlayerMethodeExpert key={index} methode={m as unknown as MethodeJoueur} />;
          case "saison":
            return <SeasonMethodeExpert key={index} methode={m as unknown as MethodeSaison} />;
          case "match":
            return <GameMethodeExpert key={index} methode={m as unknown as MethodeMatch} />;
          case "coach":
            return <CoachMethodeExpert key={index} methode={m as unknown as MethodeCoach} />;
          default:
            return null;
        }
      })}
    </>
  );
};

export default MethodInfo;
