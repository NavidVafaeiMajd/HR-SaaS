import { lazy } from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";
const LayoutDisciplinaryCases = lazy(
  () => import("@/components/pages/DisciplinaryCases"),
);
const DisciplinaryList = lazy(
  () => import("@/components/pages/DisciplinaryCases/List"),
);
const ViolationType = lazy(
  () => import("@/components/pages/DisciplinaryCases/ViolationType"),
);

export const DisciplinaryRoutes = (
  <Route
    path="disciplinary"
    element={
      <ProtectedRoute>
        <LayoutDisciplinaryCases />
      </ProtectedRoute>
    }
  >
    <Route path="list" element={<DisciplinaryList />} />
    <Route path="type" element={<ViolationType />} />
  </Route>
);
