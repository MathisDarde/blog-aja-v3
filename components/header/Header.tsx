import HeaderLarge from "./HeaderLG";
import RespHeader from "./RespHeader";
import { User } from "@/contexts/Interfaces";

export default function Header({ user }: { user?: User }) {
  return (
    <>
      <div className="block lg:hidden">
        <RespHeader user={user} />
      </div>
      <div className="hidden lg:block">
        <HeaderLarge user={user} />
      </div>
    </>
  );
}
