import { lazy } from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";
import UserAttendanceDetailsPage from "@/components/pages/RollCall/UserAttendanceDetailsPage/UaerAttendanceDetailsPage";

const LayoutRollCall = lazy(() => import("@/components/pages/RollCall/Layout"));
const AttendanceList = lazy(
  () => import("@/components/pages/RollCall/AttendanceList/AttendanceList"),
);
const MonthlyAttendance = lazy(
  () =>
    import("@/components/pages/RollCall/MonthlyAttendance/MonthlyAttendance"),
);
const PayrollListDetails = lazy(
  () =>
    import(
      "@/components/pages/Payroll/PayrollList/PayrollListDetails/PayrollListDetails"
    )
);
const PayslipDetailsPage = lazy(
  () => import("@/components/pages/Payroll/PayslipHistory/PayslipDetailsPage"),
);

export const RollCallRoutes = (
  <>
    <Route
      path="rollcall"
      element={
        <ProtectedRoute>
          <LayoutRollCall />
        </ProtectedRoute>
      }
    >
      <Route
        path="attendance-list"
        element={
          <ProtectedRoute>
            <AttendanceList />
          </ProtectedRoute>
        }
      />
      <Route
        path="monthly-attendance"
        element={
          <ProtectedRoute>
            <MonthlyAttendance />
          </ProtectedRoute>
        }
      />
    </Route>

    <Route
      path="user-attendance/:id"
      element={
        <ProtectedRoute>
          <UserAttendanceDetailsPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="payroll/payroll-list-details/:id"
      element={<PayrollListDetails />}
    />
    <Route
      path="payslip-history/:id"
      element={
        <ProtectedRoute>
          <PayslipDetailsPage />
        </ProtectedRoute>
      }
    />
  </>
);
