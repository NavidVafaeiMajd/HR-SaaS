import { lazy } from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";

const LayoutHumanResource = lazy(
  () =>
    import("@/components/pages/HumanResourceManagement/LayoutHumanResource"),
);

const OrganizationalUnit = lazy(
  () =>
    import("@/components/pages/HumanResourceManagement/OrganizationalUnit/OrganizationalUnit"),
);

const OrganizationalPosition = lazy(
  () =>
    import("@/components/pages/HumanResourceManagement/OrganizationalPosition/OrganizationalPosition"),
);

const OfficeShifts = lazy(
  () => import("@/components/pages/Staff/OfficeShifts/OfficeShifts"),
);

const Policies = lazy(
  () => import("@/components/pages/HumanResourceManagement/Policies/Policies"),
);

const NewsList = lazy(
  () => import("@/components/pages/HumanResourceManagement/NewsList/NewsList"),
);


export const HrRoutes = (
  <Route
    path="hr"
    element={
      <ProtectedRoute>
        <LayoutHumanResource />
      </ProtectedRoute>
    }
  >
    <Route path="departments-list" element={<OrganizationalUnit />} />
    <Route path="designation-list" element={<OrganizationalPosition />} />
    <Route path="office-shifts" element={<OfficeShifts />} />
    <Route path="policies-list" element={<Policies />} />
    <Route path="news-list" element={<NewsList />} />
  </Route>
);
