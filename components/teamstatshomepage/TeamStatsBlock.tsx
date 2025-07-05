import ClassementAuxerre from "./ClassementAuxerre";
import LastMatchResult from "./LastMatchResult";

export default function TeamStatsBlock() {
  return (
    <div className="bg-white mx-auto max-w-[1300px] h-auto">
      <div className="flex justify-center items-center p-6 rounded-md">
        <div className="flex-1">
          <LastMatchResult />
        </div>
        <div className="flex-1">
          <ClassementAuxerre />
        </div>
      </div>
    </div>
  );
}
