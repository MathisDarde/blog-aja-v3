"use client";

import { useState, useEffect } from "react";
import { ArrowLeftIcon } from "lucide-react";
import Image from "next/image";
import { Trophee, RecordType } from "@/contexts/Interfaces";

const Palmares = () => {
  const [trophees, setTrophees] = useState<Trophee[]>([]);
  const [records, setRecords] = useState<RecordType[]>([]);
  const [selectedRecordIndex, setSelectedRecordIndex] = useState<number | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Palmarès et records - Mémoire d'Auxerrois";

    if (!document.getElementById("favicon")) {
      const link = document.createElement("link");
      link.id = "favicon";
      link.rel = "icon";
      link.href = "/_assets/teamlogos/logoauxerre.svg";
      document.head.appendChild(link);
    }
  }, []);

  useEffect(() => {
    fetch("/data/records.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors du chargement des données JSON");
        }
        return response.json();
      })
      .then((data) => {
        if (
          Array.isArray(data) &&
          data.every((item) => item.title && item.image)
        ) {
          setRecords(data);
        } else {
          throw new Error("Format des données invalide");
        }
      })
      .catch((error) => {
        console.error("Erreur :", error);
        setError(error.message);
      });
  }, []);

  useEffect(() => {
    fetch("/data/palmares.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors du chargement du fichier JSON");
        }
        return response.json();
      })
      .then((data: Trophee[]) => setTrophees(data))
      .catch((error) =>
        console.error("Erreur lors du chargement JSON :", error)
      );
  }, []);

  return (
    <>
      <div className="text-center bg-gray-100 min-h-screen w-screen box-border p-10">
        <div className="max-w-[1500px] mx-auto">
          <h1 className="text-center font-Bai_Jamjuree text-4xl font-bold uppercase mb-10">
            Palmarès
          </h1>

          <div className="pb-12">
            <div className="grid grid-cols-3">
              {trophees.map((trophee, index) => (
                <div key={index} className="flex flex-col items-center w-full">
                  <div className="flex flex-row items-center">
                    <Image
                      width={512}
                      height={512}
                      src={trophee.img}
                      alt={trophee.title}
                      className="m-2 w-24 h-24 object-contain"
                    />
                    <p className="text-5xl font-Bai_Jamjuree font-bold italic pt-4 m-4 cursor-default">
                      x {trophee.nombre}
                    </p>
                  </div>
                  <div className="flex flex-col justify-center items-center">
                    <p className="text-2xl mt-2 w-72 text-center cursor-default font-semibold font-Montserrat">
                      {trophee.title}
                    </p>
                    <p className="text-xl mt-2 w-72 text-center cursor-default pb-4">
                      ({trophee.annee})
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-[1500px] mx-auto">
          <h3 className="text-center font-Bai_Jamjuree text-4xl font-bold uppercase mb-10">
            Records
          </h3>

          <div
            className={`grid ${
              selectedRecordIndex === null ? "grid-cols-2" : "grid-cols-1"
            } gap-12 mx-auto w-3/4 mt-12 mb-6 place-items-center transition-all duration-300`}
          >
            {error ? (
              <p className="text-red-500 text-center text-lg">{error}</p>
            ) : (
              records.map((list, index) => {
                const isActive = selectedRecordIndex === index;

                return (
                  <div
                    key={index}
                    className={`w-full transition-opacity duration-300 ${
                      selectedRecordIndex !== null && !isActive
                        ? "opacity-0 hidden"
                        : "opacity-100"
                    }`}
                  >
                    {/* Image et titre cliquable */}
                    {!isActive && (
                      <div
                        className="relative group flex items-center justify-center h-72 w-full rounded-3xl overflow-hidden bg-gray-200 shadow-md transition-transform cursor-pointer"
                        onClick={() =>
                          setSelectedRecordIndex(isActive ? null : index)
                        }
                      >
                        <Image
                          width={512}
                          height={512}
                          src={list.image}
                          alt={`Image de ${list.title}`}
                          className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale transition-transform duration-300 group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0"
                        />
                        <h4 className="relative z-10 text-3xl font-bold text-black bg-white bg-opacity-75 px-4 py-2 rounded-lg uppercase text-center transition-colors group-hover:text-white group-hover:bg-aja-blue">
                          {list.title}
                        </h4>
                      </div>
                    )}

                    {isActive && (
                      <>
                        <div className="relative mt-4 bg-white p-14 rounded-3xl">
                          <ArrowLeftIcon
                            height={40}
                            width={40}
                            className="p-2 text-red-600 bg-gray-100 rounded-full absolute text-2xl top-3 left-3 cursor-pointer transition-colors hover:text-red-800"
                            onClick={() => setSelectedRecordIndex(null)}
                          />
                          <h3 className="font-semibold uppercase text-3xl text-center mb-5">
                            {list.title}
                          </h3>
                          <table className="table border-collapse w-full">
                            <thead>
                              <tr>
                                <th className="p-2 border-2 border-gray-600 text-left align-middle font-bold bg-aja-blue text-white font-Montserrat text-sm">
                                  Record
                                </th>
                                <th className="p-2 border-2 border-gray-600 text-left align-middle font-bold bg-aja-blue text-white font-Montserrat text-sm">
                                  Détenteur
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {list.rows.map((rowlist, rowIndex) => (
                                <tr key={rowIndex}>
                                  <td className="p-2 border-2 border-gray-600 text-left align-middle font-Montserrat text-sm font-medium bg-white text-black">
                                    {rowlist.record}
                                  </td>
                                  <td className="p-2 border-2 border-gray-600 text-left align-middle font-Montserrat text-sm bg-white">
                                    {rowlist.player}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Palmares;
