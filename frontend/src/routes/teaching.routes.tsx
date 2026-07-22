import { lazy } from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";
const TecherInfo = lazy(
  () => import("@/components/pages/Teachings/TecherInfo/mainTecherInfo"),
);
const TraningSkills = lazy(
  () => import("@/components/pages/Teachings/TrainingSkills/TrainingSkills"),
);
const LayoutTeching = lazy(
  () => import("@/components/pages/Teachings/layoutTeaching"),
);
const LearningPage = lazy(
  () => import("@/components/pages/Teachings/Learning/mainLearing"),
);
const LearningDetailsPage = lazy(
  () => import("@/components/pages/Teachings/Learning/LearningDetailsPage"),
);

export const TeachingRoutes = (
  <>
    {" "}
    <Route
      path="teaching"
      element={
        <ProtectedRoute>
          <LayoutTeching />
        </ProtectedRoute>
      }
    >
      <Route index element={<LearningPage />} />
      <Route path="techerinfo" element={<TecherInfo />} />
      <Route path="traningskills" element={<TraningSkills />} />
    </Route>
    <Route path="learning/details/:id" element={<LearningDetailsPage />} />
  </>
);
