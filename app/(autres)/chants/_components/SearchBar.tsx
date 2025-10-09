"use client"

import React from "react";
import { Search } from "lucide-react";
import { SearchInputProps } from "@/contexts/Interfaces";

export default function SearchBar({
    value,
    onChange,
    onSubmit,
}: {
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (event: React.FormEvent) => void;
}) {
    return (
        <div className="w-full relative z-10">
            <form onSubmit={onSubmit}>
                <span>
                    <Search className="absolute hidden md:block left-4 top-1/2 -translate-y-1/2 text-lg text-gray-600 cursor-pointer" />
                </span>
                <input
                    type="text"
                    value={value}
                    onChange={onChange}
                    className="w-full h-12 rounded-full md:pl-14 pl-4 pr-4 text-xs sm:text-sm border border-gray-600 font-Montserrat"
                    placeholder="Rechercher un chant..."
                />
            </form>
        </div>
    );
};
