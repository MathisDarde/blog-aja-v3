"use client";

import { useScreenSize } from "@/utils/use-screen-size";
import HeaderLarge from "./HeaderLG";
import { User } from "@/contexts/Interfaces";
import RespHeader from "./RespHeader";
import { useEffect, useState } from "react";

export default function Header({ user }: { user: User | undefined }) {
  const [isMobileHeader, setIsMobileHeader] = useState(false);

  const { width } = useScreenSize();

  useEffect(() => {
    setIsMobileHeader(width < 1024);
    console.log("width:", width, "isMobileHeader:", width < 1024);
  }, [width]);

  if (isMobileHeader) {
    return <RespHeader user={user} />;
  } else {
    return <HeaderLarge user={user} />;
  }
}
