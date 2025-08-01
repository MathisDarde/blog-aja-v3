import React from "react";
import { Search, ArrowDown } from "lucide-react";
import { SearchInputProps } from "@/contexts/Interfaces";

const SearchInput = ({
  value,
  onChange,
  onFilterClick,
  onSubmit,
}: SearchInputProps) => {
  return (
    <div className="relative z-20">
      <form onSubmit={onSubmit}>
        <span>
          <Search className="absolute hidden md:block left-4 top-1/2 -translate-y-1/2 text-lg text-gray-600 cursor-pointer" />
        </span>
        <input
          type="text"
          value={value}
          onChange={onChange}
          className="md:w-[750px] h-12 rounded-full md:pl-14 pl-4 pr-28 text-sm border border-gray-600 font-Montserrat"
          placeholder="Rechercher un article..."
        />

        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-lg text-gray-600 cursor-pointer border-l border-gray-600 pl-4">
          <button
            type="button"
            className="flex gap-2 items-center text-sm font-Montserrat"
            onClick={onFilterClick}
          >
            Filtrer <ArrowDown size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchInput;
