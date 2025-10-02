"use client";

import { useState } from "react";
import { ArrowLeftIcon } from "lucide-react";
import Image from "next/image";
import records from "@/public/data/records.json";
import trophees from "@/public/data/palmares.json"

const Palmares = () => {
  const [selectedRecordIndex, setSelectedRecordIndex] = useState<number | null>(
    null
  );

  return (
    <>
      <div className="text-center bg-gray-100 min-h-screen w-screen box-border p-10">
        <div className="max-w-[1500px] mx-auto">
          <h1 className="text-center font-Bai_Jamjuree text-3xl sm:text-4xl font-bold uppercase mb-4 sm:mb-10">
            Palmarès
          </h1>

          <div className="pb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {trophees.map((trophee, index) => (
                <div key={index} className="flex flex-col items-center w-full">
                  <div className="flex flex-row items-center">
                    <Image
                      width={512}
                      height={512}
                      src={trophee.img}
                      alt={trophee.title}
                      className="m-2 w-20 xl:w-24 h-20 xl:h-24 object-contain"
                    />
                    <p className="text-4xl xl:text-5xl font-Bai_Jamjuree font-bold italic pt-4 m-4 cursor-default">
                      x {trophee.nombre}
                    </p>
                  </div>
                  <div className="flex flex-col justify-center items-center">
                    <p className="text-xl xl:text-2xl mt-2 w-72 text-center cursor-default font-semibold font-Montserrat">
                      {trophee.title}
                    </p>
                    <p className="text-lg xl:text-xl font-Montserrat mt-2 w-72 text-center cursor-default pb-4">
                      ({trophee.annee})
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-[1500px] mx-auto">
          <h3 className="text-center font-Bai_Jamjuree text-3xl sm:text-4xl font-bold uppercase mb-4 sm:mb-10">
            Records
          </h3>

          <div
            className={`grid gap-12 mx-auto w-full lg:w-5/6 xl:w-3/4 mt-0 sm:mt-12 mb-6 place-items-center transition-all duration-300
    ${selectedRecordIndex === null ? "lg:grid-cols-2 grid-cols-1" : "grid-cols-1"}`}
          >
            {
              records.map((list, index) => {
                const isActive = selectedRecordIndex === index;

                return (
                  <div
                    key={index}
                    className={`w-full transition-opacity duration-300 ${selectedRecordIndex !== null && !isActive
                      ? "opacity-0 hidden"
                      : "opacity-100"
                      }`}
                  >
                    {/* Image et titre cliquable */}
                    {!isActive && (
                      <div
                        className="relative group flex items-center justify-center h-72 w-full md:w-3/4 mx-auto lg:w-full rounded-3xl overflow-hidden bg-gray-200 shadow-md transition-transform cursor-pointer"
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
                        <h4 className="relative font-Bai_Jamjuree z-10 w-3/4 xl:w-fit text-2xl xl:text-3xl font-bold text-black bg-white bg-opacity-75 px-4 py-2 rounded-lg uppercase text-center transition-colors group-hover:text-white group-hover:bg-aja-blue">
                          {list.title}
                        </h4>
                      </div>
                    )}

                    {isActive && (
                      <div className="w-full mx-auto">
                        <div className="relative mt-4 bg-white py-14 px-6 md:p-14 rounded-3xl">
                          <ArrowLeftIcon
                            height={40}
                            width={40}
                            className="p-2 text-red-600 bg-gray-100 rounded-full absolute text-2xl top-3 left-3 cursor-pointer transition-colors hover:text-red-800"
                            onClick={() => setSelectedRecordIndex(null)}
                          />
                          <h3 className="font-semibold font-Bai_Jamjuree uppercase text-xl sm:text-3xl text-center mb-3 sm:mb-5">
                            {list.title}
                          </h3>
                          <table className="table border-collapse w-full">
                            <thead>
                              <tr>
                                <th className="p-2 border-2 border-gray-600 text-left align-middle font-bold bg-aja-blue text-white font-Montserrat text-xs sm:text-sm">
                                  Record
                                </th>
                                <th className="p-2 border-2 border-gray-600 text-left align-middle font-bold bg-aja-blue text-white font-Montserrat text-xs sm:text-sm">
                                  Détenteur
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {list.rows.map((rowlist, rowIndex) => (
                                <tr key={rowIndex}>
                                  <td className="p-2 border-2 border-gray-600 text-left align-middle font-Montserrat text-xs sm:text-sm font-medium bg-white text-black">
                                    {rowlist.record}
                                  </td>
                                  <td className="p-2 border-2 border-gray-600 text-left align-middle font-Montserrat text-xs sm:text-sm bg-white">
                                    {rowlist.player}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            }
          </div>
        </div>
      </div>
    </>
  );
};

export default Palmares;
