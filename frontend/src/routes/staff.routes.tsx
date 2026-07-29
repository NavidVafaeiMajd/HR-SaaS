import LayoutStaffList from "@/components/pages/Staff/LayoutStaffList";
import { lazy } from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";

const StaffList = lazy(
  () => import("../components/pages/Staff/StaffList/StaffList"),
);

const OfficeShifts = lazy(
  () => import("../components/pages/Staff/OfficeShifts/OfficeShifts"),
);

const EmployExit = lazy(
  () => import("@/components/pages/Staff/EmployExit/EmployExit"),
);
const ExitType = lazy(
  () => import("@/components/pages/Staff/EmployExit/ExitType/ExitType"),
);

export const staffRoutes = (
  <>
    {" "}
    <Route
      path="staff"
      element={
        <ProtectedRoute>
          <LayoutStaffList />
        </ProtectedRoute>
      }
    >
      <Route index element={<StaffList />} />
      <Route path="office-shifts" element={<OfficeShifts />} />
      <Route path="employ-exit" element={<EmployExit />} />
    </Route>
    <Route
      path="exit-type"
      element={
        <ProtectedRoute>
          <ProtectedRoute>
            <ExitType />
          </ProtectedRoute>
        </ProtectedRoute>
      }
    />
  </>
);
