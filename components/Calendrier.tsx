import React, { useEffect, useState } from "react";
import { fetchMatches } from "../utils/matchsapi";

interface Match {
  equipedom: string;
  equipeext: string;
  date: string;
  logoequipedom: string;
  logoequipeext: string;
  statut: string;
  resultatdom: string;
  resultatext: string;
}

function Calendrier() {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    fetchMatches("./data/calendrierapilocal.json").then((data) => {
      setMatches(data);
    });
  }, []);

  return (
    <div className="w-8/12 bg-white h-56 my-3 mx-auto rounded-xl">
      <h3 className="inline-block text-sm p-3 ml-6 mt-2 border border-gray-600 rounded-full font-bold">
        Calendrier
      </h3>
      <div className="relative">
        <div
          className="flex flex-row w-6/6 my-2 mx-6 overflow-x-auto whitespace-nowrap"
          id="matchs-container"
        >
          {matches.map((match: Match, index: number) => (
            <div
              key={index}
              className="w-48 h-28 m-2 border border-gray-600 rounded-xl box-border flex-shrink-0 bg-white match"
            >
              <div className="flex flex-row justify-between my-2 mx-4">
                <p className="font-bold font-Montserrat text-sm uppercase italic">
                  {match.statut}
                </p>
                <p className="font-Montserrat">{match.date}</p>
              </div>
              <div className="flex flex-row justify-between my-2">
                <img
                  src={match.logoequipedom}
                  alt="Logo Club 1"
                  className="w-12 h-6 object-contain"
                />
                <p className="font-Montserrat font-bold text-lg">
                  {match.equipedom}
                </p>
                <p className="font-Montserrat font-bold text-lg ml-auto px-4">
                  {match.resultatdom}
                </p>
              </div>
              <div className="flex flex-row justify-between my-2">
                <img
                  src={match.logoequipeext}
                  alt="Logo Club 2"
                  className="w-12 h-6 object-contain"
                />
                <p className="font-Montserrat font-bold text-lg">
                  {match.equipeext}
                </p>
                <p className="font-Montserrat font-bold text-lg ml-auto px-4">
                  {match.resultatext}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Calendrier;
