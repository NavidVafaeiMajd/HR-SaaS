import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Breadcrumb from "../../shared/breadcrumb";
import { Outlet } from "react-router-dom";
const LayoutRoleMangment = () => {
   const location = useLocation();
   const [title, setTitle] = useState(document.title);

   useEffect(() => {
      setTitle(document.title);
   }, [location.pathname]);

   return (
      <>
         <Breadcrumb>{title}</Breadcrumb>
         <div className="">
            <div className="">

            </div>
            <div>
               <Outlet />
            </div>
         </div>
      </>
   );
};

export default LayoutRoleMangment;
