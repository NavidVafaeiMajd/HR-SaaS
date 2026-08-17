import { lazy } from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";
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
      <ProtectedRoute permission="Role_view">
        <LayoutRoleMangment />
      </ProtectedRoute>
    }
  >
    <Route index element={<RolesList />} />
  </Route>
);
