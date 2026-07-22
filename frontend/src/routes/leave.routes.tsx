import { lazy } from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";


const LayoutLeave = lazy(() => import("@/components/pages/Leave/Layout"));
const LeaveList = lazy(() => import("@/components/pages/Leave/List/LeaveList"));
const LeaveType = lazy(() => import("@/components/pages/Leave/LeaveType"));
const LeaveDetailsPage = lazy(
  () => import("@/components/pages/Leave/List/LeaveDetailsPage"),
);
export const LeaveRoutes = (
  <>
    {" "}
    <Route
      path="leave"
      element={
        <ProtectedRoute>
          <LayoutLeave />
        </ProtectedRoute>
      }
    >
      <Route path="list" element={<LeaveList />} />
      <Route path="type" element={<LeaveType />} />
    </Route>
    <Route path="leave/details/:id" element={<LeaveDetailsPage />} />
  </>
);
