import { Navigate } from "react-router-dom";
import { Suspense } from "react";
import type { JSX } from "react";
import SkeletonLoading from "@/components/ui/skeleton";
import { useAuthContext } from "@/Context/AuthContext";

interface Props {
  children: JSX.Element;
}



const PublicRoute = ({ children }: Props) => {
  const { isLoggedIn } = useAuthContext();

  if (isLoggedIn) {
    return <Navigate to="/" replace />; 
  }

  return (
    <Suspense fallback={<SkeletonLoading />}>
      {children}
    </Suspense>
  );
};

export default PublicRoute;