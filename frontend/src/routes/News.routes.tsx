import { lazy } from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";

const NewsList = lazy(
  () => import("@/components/pages/NewsList/NewsList"),
);

export const NewsListRoutes = (
  <>
    <Route
      path="news-list"
      element={
        <ProtectedRoute>
          <NewsList />{" "}
        </ProtectedRoute>
      }
    />
  </>
);
