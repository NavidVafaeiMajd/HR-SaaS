import { AiOutlineMenu } from "react-icons/ai";
import { FiUserCheck } from "react-icons/fi";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { useState } from "react";
import { Link } from "react-router-dom";
import { HiUserCircle } from "react-icons/hi2";
import { SidebarTrigger, useSidebar } from "../ui/sidebar";
import { cn } from "@/lib/utils";

interface ChildProps {
  headerMenu?: () => void;
}
const Header: React.FC<ChildProps> = ({ headerMenu }) => {
  const [fisrtMenu, setFisrtMenu] = useState(false);
  const [secoundMenu, setSecoundMenu] = useState(false);
  const { state } = useSidebar();

  return (
    <>
      <div
        className={cn(
          "bg-[#7c8cbc]/10 mt-2 px-5 text-black h-[50px] fixed! top-0 left-2  z-50 transition-all duration-200 right-0  backdrop-blur-sm border border-white/20  rounded-full",
          state === "expanded" ? "lg:right-[16.5rem]" : "lg:right-[4.5rem]",
        )}
      >
        <div className=" flex justify-between items-center h-full!">
          <div id="right-header " className="flex gap-3">
            <SidebarTrigger />
          </div>
          <div id="left-header" className="flex items-center gap-3 relative">
            <div
              id="header-icon "
              className={`flex flex-row items-center gap-2 ${
                secoundMenu ? "show" : "max-md:hidden"
              } max-md:fixed max-md:top-0 max-md:right-0 max-md:w-full max-md:h-20 max-md:mt-15 max-md:bg-[#161C25]`}
            >
              <span className="relative group">
                <Link to={"/account"}>
                  <FiUserCheck className="w-8 h-8 bg-white/20 p-1 rounded-full" />
                </Link>
                <span className="absolute bottom-[-30px] left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                  حساب کاربری
                </span>
              </span>
            </div>
            <div id="mobile-menu-header">
              <AiOutlineMenu
                onClick={headerMenu}
                className="w-8 h-8 lg:hidden"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
