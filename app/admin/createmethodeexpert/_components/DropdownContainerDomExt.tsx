"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full font-Montserrat border border-gray-300 rounded-lg my-4 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center bg-gray-100 px-4 py-3 font-semibold text-gray-700"
      >
        {title}
        {open ? <ChevronUp /> : <ChevronDown />}
      </button>
      {open && <div className="p-4">{children}</div>}
    </div>
  );
}
