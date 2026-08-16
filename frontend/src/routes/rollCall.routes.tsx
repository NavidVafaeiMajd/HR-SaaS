import { lazy } from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";
const UserAttendanceDetailsPage = lazy(() => import("@/components/pages/RollCall/UserAttendanceDetailsPage/UaerAttendanceDetailsPage"));

const LayoutRollCall = lazy(() => import("@/components/pages/RollCall/Layout"));
const AttendanceList = lazy(
  () => import("@/components/pages/RollCall/AttendanceList/AttendanceList"),
);
const MonthlyAttendance = lazy(
  () =>
    import("@/components/pages/RollCall/MonthlyAttendance/MonthlyAttendance"),
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
  </>
);
