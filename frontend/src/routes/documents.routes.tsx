import { lazy } from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";

const DocumentsLayout = lazy(
  () => import("@/components/pages/Documents/DocumentsLayout"),
);
const PublicDocuments = lazy(
  () => import("@/components/pages/Documents/PublicDocuments/PublicDocuments"),
);
const PrivateDocuments = lazy(
  () =>
    import("@/components/pages/Documents/PrivateDocuments/PrivateDocuments"),
);
export const DocumentsRoutes = (
  <>
    <Route
      path="documents"
      element={
        <ProtectedRoute>
          <DocumentsLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<PublicDocuments />} />
      <Route path="private" element={<PrivateDocuments />} />
    </Route>
  </>
);
