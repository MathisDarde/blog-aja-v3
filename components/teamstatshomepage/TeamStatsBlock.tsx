"use client"

import { useGlobalContext } from "@/contexts/GlobalContext";
import ClassementAuxerre from "./ClassementAuxerre";
import LastMatchResult from "./LastMatchResult";
import { useEffect, useState } from "react";
import { MatchAPI } from "@/contexts/Interfaces";

export default function TeamStatsBlock() {
  const { getLastMatch } = useGlobalContext();
  const [lastMatch, setLastMatch] = useState<MatchAPI | null>(null);

  useEffect(() => {
    getLastMatch().then(setLastMatch).catch(console.error);
  }, [getLastMatch]);

  return (
    <div className="bg-white mx-auto max-w-[1300px] h-auto">
      <div className="flex justify-center items-center p-6 rounded-md">
        <div className="flex-1">
          {lastMatch && <LastMatchResult lastMatch={lastMatch} /> }
        </div>
        <div className="flex-1">
          <ClassementAuxerre />
        </div>
      </div>
    </div>
  );
}
