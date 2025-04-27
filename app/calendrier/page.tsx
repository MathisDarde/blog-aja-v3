"use client";

import Calendar from "./_components/Calendar";

export default function CalendrierPage() {
  return (
    <div className="bg-gray-100 h-screen w-full p-0 m-0 box-border">
      <div className="m-auto h-full">
        <h1 className="text-center font-Montserrat text-4xl font-bold uppercase pt-10 mb-10">
          Calendrier de la saison
        </h1>
        <Calendar />
      </div>
    </div>
  );
}
