import { lazy } from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";

const IndicatorRatingDetails = lazy(
  () =>
    import("@/components/pages/Performance/PerformanceDetails/IndicatorRatingDetails"),
);
const EmployeeRatingDetailes = lazy(
  () =>
    import("@/components/pages/Performance/PerformanceDetails/EmployeeRatingDetailes"),
);
const EmployeeRating = lazy(
  () => import("@/components/pages/Performance/Employee/EmployeeRating"),
);
const TrackGoals = lazy(
  () => import("@/components/pages/Performance/TrackGoals/TrackGoals"),
);
const TechnicalIndicator = lazy(
  () =>
    import("@/components/pages/Performance/SetupIndicator/TechnicalIndicator"),
);
const BehavioralIndicator = lazy(
  () =>
    import("@/components/pages/Performance/SetupIndicator/BehavioralIndicator"),
);
const GoalType = lazy(
  () => import("@/components/pages/Performance/GoalType/GoalType"),
);
const PerformanceRating = lazy(
  () => import("@/components/pages/Performance/Rating/PerformanceRating"),
);
const LayoutPerformance = lazy(
  () => import("@/components/pages/Performance/Layout"),
);

export const PerformanceRoutes = (
  <Route
    path="performance"
    element={
      <ProtectedRoute>
        <LayoutPerformance />
      </ProtectedRoute>
    }
  >
    <Route path="indicator-rating" element={<PerformanceRating />} />
    <Route element={<IndicatorRatingDetails />} path="indicator-rating/:id" />
    <Route element={<EmployeeRatingDetailes />} path="employee-rating/:id" />
    <Route path="employee-rating" element={<EmployeeRating />} />
    <Route path="track-goals" element={<TrackGoals />} />
    <Route path="setup-indicator" element={<TechnicalIndicator />} />
    <Route path="behavioral" element={<BehavioralIndicator />} />
    <Route path="goals-type" element={<GoalType />} />
  </Route>
);
