import React from "react";
import {
  Menu,
  Ellipsis,
  Newspaper,
  ChartBarBig,
  ShoppingCart,
  House,
} from "lucide-react";
import Link from "next/link";

interface SidebarRespProps {
  onToggle: () => void;
}

function SidebarResp({ onToggle }: SidebarRespProps) {
  return (
    <div className="h-screen w-24 fixed bg-white left-0 top-0 z-20 flex flex-col items-center justify-items-start">
      <div id="hamburgerbutton">
        <Menu
          size={32}
          onClick={onToggle}
          className="text-aja-blue outline-none bg-none border-0 text-3xl my-4 cursor-pointer"
        />
      </div>
      <div className="h-h-0.25 w-4/5 bg-gray-400 mx-auto"></div>
      <nav>
        <nav>
          <ul className="list-none">
            <li className="transition-transform bg-none flex flex-col items-center mt-2 mb-2">
              <Link
                href="/"
                className="flex flex-col items-center justify-center"
              >
                <House size={32} className="text-gray-600 py-1" />
                <p className="text-gray-600 text-xs font-semibold italic font-Montserrat">
                  Accueil
                </p>
              </Link>
            </li>
            <li className=" mb-2 transition-transform bg-none flex flex-col items-center">
              <Link
                href="/articles"
                className="flex flex-col items-center justify-center"
              >
                <Newspaper size={32} className="text-gray-600 py-1" />
                <p className="text-gray-600 text-xs font-semibold italic font-Montserrat">
                  Articles
                </p>
              </Link>
            </li>
            <li className="mb-2 transition-transform bg-none flex flex-col items-center">
              <Link
                href="/boutique"
                className="flex flex-col items-center justify-center"
              >
                <ShoppingCart size={32} className="text-gray-600 py-1" />
                <p className="text-gray-600 text-xs font-semibold italic font-Montserrat">
                  Boutique
                </p>
              </Link>
            </li>
            <li
              className="mb-2 transition-transform bg-none flex flex-col items-center cursor-pointer"
              onClick={onToggle}
            >
              <Ellipsis size={32} className="text-gray-600 py-1" />
              <p className="text-gray-600 text-xs font-semibold italic font-Montserrat">
                Autres
              </p>
            </li>
            <li
              className="mb-2 transition-transform bg-none flex flex-col items-center cursor-pointer"
              onClick={onToggle}
            >
              <ChartBarBig size={32} className="text-gray-600 py-1" />
              <p className="text-gray-600 text-xs font-semibold italic font-Montserrat">
                Classement
              </p>
            </li>
          </ul>
        </nav>
      </nav>
    </div>
  );
}

export default SidebarResp;
