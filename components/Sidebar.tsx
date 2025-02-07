import React, { useState } from "react";
import SidebarData from "./SidebarData";
import SearchBar from "./SidebarSearchbar";
import { ChevronDown } from "lucide-react";
import { X } from "lucide-react";
import Classement from "./Classement";
import { AutresDropdownData } from "./SidebarData";

interface SidebarProps {
  onToggle: () => void;
}

function Sidebar({ onToggle }: SidebarProps) {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <>
      <div
        className="z-30 fixed left-0 top-0 w-screen h-screen bg-nav-overlay-color cursor-pointer"
        onClick={onToggle}
      ></div>
      <div
        className="h-screen w-80 left-0 top-0 fixed bg-white overflow-y-auto z-40"
        id="sidebar"
      >
        <div className="flex pt-3 pr-3" onClick={onToggle}>
          <X size={24} className="cursor-pointer ml-auto text-red-600" />
        </div>
        <SearchBar />
        <ul className="h-auto p-0 mx-3">
          {SidebarData.map((val, key) => (
            <React.Fragment key={key}>
              <li
                className="w-full h-8 bg-white list-none mb-1 flex flex-row text-gray-500 items-center font-Montserrat text-sm font-semibold cursor-pointer hover:scale-scale-102 hover:transition-transform duration-200 ease-in-out"
                onClick={() => {
                  if (val.dropdown) {
                    toggleDropdown();
                  } else {
                    window.location.pathname = val.link;
                  }
                }}
              >
                <div className="mx-3">{val.icon}</div>
                <div className="mx-1">{val.title}</div>
                {val.dropdown && (
                  <ChevronDown
                    className={`mx-3 transition-transform ${
                      dropdownVisible ? "rotate-180" : ""
                    }`}
                  />
                )}
              </li>

              {val.dropdown && dropdownVisible && (
                <ul className="ml-6">
                  {AutresDropdownData.map((dropdownVal, dropdownKey) => (
                    <li
                      key={dropdownKey}
                      className="group relative w-full h-10 bg-white list-none flex flex-row mb-1 text-gray-600 items-center font-['Montserrat'] text-sm font-normal cursor-pointer hover:text-aja-blue hover:font-semibold hover:transition-colors"
                      onClick={() => {
                        window.location.pathname = dropdownVal.link;
                      }}
                    >
                      <div className="mx-3">{dropdownVal.icon}</div>
                      <div className="mx-1">{dropdownVal.title}</div>
                      <span
                        className="absolute -bottom-1 left-4 w-12 transition-all bg-gray-600 group-hover:w-32"
                        style={{ height: "1px" }}
                      ></span>
                    </li>
                  ))}
                </ul>
              )}
            </React.Fragment>
          ))}
        </ul>

        <div className="mt-5">
          <h3 className="text-lg text-black font-bold font-['Montserrat'] text-center">
            Classement Ligue 1
          </h3>
          <Classement />
        </div>
      </div>
    </>
  );
}

export default Sidebar;
