import { lazy } from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";
import EmployeeProtectRoute from "./ProtectedRoute/EmployeeProtectRoute";
const LayoutRoleMangment = lazy(
  () => import("@/components/pages/RoleManagment/LayoutRoleMangment"),
);
const RolesList = lazy(
  () => import("@/components/pages/RoleManagment/RoleList/RolesList"),
);

export const RolesRoutes = (
  <Route
    path="roles"
    element={
      <EmployeeProtectRoute>
        <ProtectedRoute>
          <LayoutRoleMangment />
        </ProtectedRoute>
      </EmployeeProtectRoute>
    }
  >
    <Route index element={<RolesList />} />
  </Route>
);
