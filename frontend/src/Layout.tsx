import Header from "./components/shared/Header";
import { Navbar } from "./components/Navbar/Navbar";
import { lazy, useEffect } from "react";
import { useBootstrapData } from "./hook/useBootstrapData";
import { LoadingProvider, useLoading } from "./Context/LoadingContext";
const Desk = lazy(() => import("./components/pages/Desk"));
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
  Outlet,
} from "react-router-dom";
import { useNavbar } from "./Context/NavbarContext";
import ProtectedRoute from "./routes/ProtectedRoute/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute/PublicRoute";
import AuthProvider, { useAuthContext } from "./Context/AuthContext";
import { Loader2 } from "lucide-react";
import { RouteProgress } from "./components/ui/RouteProgress";
import { staffRoutes } from "./routes/staff.routes";
import { HrRoutes } from "./routes/hr.routes";
import { ToastContainer } from "react-toastify";
import { RollCallRoutes } from "./routes/rollCall.routes";
import { LeaveRoutes } from "./routes/leave.routes";
import { DisciplinaryRoutes } from "./routes/disciplinary.routes";
import { PerformanceRoutes } from "./routes/performance.routes";
import { TeachingRoutes } from "./routes/teaching.routes";
import { DocumentsRoutes } from "./routes/documents.routes";
import { SidebarInset, SidebarProvider } from "./components/ui/sidebar";
import { RolesRoutes } from "./routes/role.routes";
import { NewsListRoutes } from "./routes/News.routes";
import { PayRollRoutes } from "./routes/payRoll.routes";
import CompanyPage from "./components/pages/Company/CompanyPage";
// Documents components - now lazy loaded

const LoginPage = lazy(() => import("./components/pages/login/LoginPage"));

const UsersDetaile = lazy(
  () => import("./components/pages/UserPage/UserPage"),
);
const NotFound = lazy(() => import("./NotFound"));


const NewsListDetailes = lazy(
  () =>
    import("./components/pages/NewsList/NewaListDetailes/NewsListDetailes"),
);

const AppLayout = () => {
  useBootstrapData();
  const { toggleNavbar, isNavbarOpen } = useNavbar();
  const location = useLocation();
  const { isLoggedIn, authLoading } = useAuthContext();
  const { isLoadingNavbar } = useLoading();

  if (authLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            در حال بررسی حساب کاربری...
          </p>
        </div>
      </div>
    );
  }

  const isLoginPage = location.pathname === "/login";

  console.log("login", isLoggedIn);
  // Prevent dashboard flash for unauthenticated users
  if (!isLoginPage && !isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  const handleDataFromChild = () => {
    toggleNavbar();
  };

  return (
    <>
      <ToastContainer toastClassName="custom-toast-font" position="top-right" />
      <Navbar />
      <SidebarInset className="h-[calc(100dvh-15px)] max-w-full! overflow-auto">
        {" "}
        <main className="h-full p-6 bg-background rounded-2xl flex flex-col overflow-hidden mb-3 ">
          {" "}
          <Header />
          <div className="flex-1 min-h-0 overflow-scroll " dir="ltr">
            <div dir="rtl">
              <Outlet />
            </div>
          </div>
        </main>
      </SidebarInset>
    </>
  );
};

const Layout = () => {
  return (
    <AuthProvider>
      <SidebarProvider>
        <LoadingProvider>
          <Router>
            <Routes>
              <Route
                path="login"
                element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                }
              />
              {/* صفحات محافظت‌شده */}
              <Route element={<AppLayout />}>
                {/* Public Routes */}

                {/* Protected Routes */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Desk />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="account"
                  element={
                    <ProtectedRoute>
                      <UsersDetaile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="users/:id"
                  element={
                    <ProtectedRoute>
                      <UsersDetaile />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="news-list/:id"
                  element={
                    <ProtectedRoute>
                      <NewsListDetailes />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="company"
                  element={
                    <ProtectedRoute>
                      <CompanyPage />
                    </ProtectedRoute>
                  }
                />

                {staffRoutes}
                {HrRoutes}
                {RollCallRoutes}
                {LeaveRoutes}
                {DisciplinaryRoutes}
                {PerformanceRoutes}
                {TeachingRoutes}
                {DocumentsRoutes}
                {RolesRoutes}
                {NewsListRoutes}
                {PayRollRoutes}
                {/* Not Found */}
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Router>
        </LoadingProvider>
      </SidebarProvider>
    </AuthProvider>
  );
};

export default Layout;
