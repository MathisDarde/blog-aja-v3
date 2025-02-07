import React, { useState } from "react";
import { Search } from "lucide-react";

const SearchBar = () => {
  const [searchInput, setSearchInput] = useState("");

  const keywords = [
    { name: "Avant 1980", link: "/search/avant1980" },
    { name: "1981-1980", link: "/search/1981-1990" },
    { name: "1991-2000", link: "/search/1991-2000" },
    { name: "2001-2010", link: "/search/2001-2010" },
    { name: "2011-2020", link: "/search/2011-2020" },
    { name: "2021-aujourd'hui", link: "/search/2021-aujourdhui" },
  ];

  return (
    <div className="relative flex flex-col items-center p-5">
      <input
        className="relative w-full border border-black text-xs text-gray-500 font-['Montserrat'] py-2 pl-4 pr-10 rounded-full shadow-lg"
        placeholder="Rechercher un article..."
      />
      <Search size={16} className="absolute right-9 bottom-7 text-gray-500" />
    </div>
  );
};

export default SearchBar;
