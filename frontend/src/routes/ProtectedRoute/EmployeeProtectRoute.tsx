import React, { type ReactNode, Suspense } from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "@/Context/AuthContext";
import SkeletonLoading from "@/components/ui/skeleton";
import 'react-loading-skeleton/dist/skeleton.css'

interface EmployeeProtectRouteProps {
  children: ReactNode;
}

const EmployeeProtectRoute: React.FC<EmployeeProtectRouteProps> = ({ children }) => {
  const { user } = useAuthContext();

  if (user?.roles[0]!== "Admin" && user?.dashboardType == "employee") {
    return <Navigate to="/403"/>;
  }

  return (
    <Suspense fallback={<SkeletonLoading />}>
      {children}
    </Suspense>
  );
};

export default EmployeeProtectRoute;