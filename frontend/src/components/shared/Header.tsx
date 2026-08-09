import { AiOutlineMenu } from "react-icons/ai";
import { FiUserCheck } from "react-icons/fi";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { useState } from "react";
import { Link } from "react-router-dom";
import { HiUserCircle } from "react-icons/hi2";
import { SidebarTrigger, useSidebar } from "../ui/sidebar";
import { cn } from "@/lib/utils";
import { Notification } from "./Notification";

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
          "print:hidden bg-[#7c8cbc]/10 mt-2 px-5 text-black h-[50px] fixed! top-0 left-2  z-50 transition-all duration-200 right-0  backdrop-blur-sm border border-white/20  rounded-full",
          state === "expanded" ? "lg:right-[16.5rem]" : "lg:right-[4.5rem]",
        )}
      >
        <div className=" flex justify-between items-center h-full!">
          <div id="right-header " className="flex gap-3">
            <SidebarTrigger />
          </div>
          <div id="left-header" className="flex items-center gap-3 relative">
            <Notification />
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
