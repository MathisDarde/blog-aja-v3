"use client"

import HeaderLarge from "./HeaderLG";
import RespHeader from "./RespHeader";

export default function Header() {
  return (
    <>
      <div className="block lg:hidden">
        <RespHeader />
      </div>
      <div className="hidden lg:block">
        <HeaderLarge />
      </div>
    </>
  );
}
