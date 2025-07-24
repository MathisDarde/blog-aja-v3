import { chants } from "@/contexts/Chants";

export default async function PageChants() {
  function formatChantText(text: string) {
    return text.split(",").map((part, index, arr) => {
      // Trim et majuscule 1re lettre
      const formatted =
        part.trim().charAt(0).toUpperCase() + part.trim().slice(1);

      return (
        <span key={index}>
          {formatted}
          {index < arr.length - 1 && ","}
          {index < arr.length - 1 && <br />}
        </span>
      );
    });
  }

  return (
    <div className="text-center bg-gray-100 min-h-screen w-screen box-border p-10">
      <h1 className="text-center font-Bai_Jamjuree text-4xl font-bold uppercase mb-10">
        Chants auxerrois
      </h1>

      <div className="flex flex-col gap-2 m-4">
        {chants.map((chant, index) => (
          <div key={index}>
            <p className="font-Montserrat text-lg font-semibold">
              {chant.title}
            </p>
            <p className="font-Montserrat">{formatChantText(chant.chant)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
