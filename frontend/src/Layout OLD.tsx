import Header from "./components/shared/Header";
import Navbar from "./components/Navbar/Navbar";
import { lazy, useEffect } from "react";
import { useBootstrapData } from "./hook/useBootstrapData";
import { LoadingProvider, useLoading } from "./Context/LoadingContext";
const Desk = lazy(() => import("./components/pages/Desk/Desk"));
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
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
// Documents components - now lazy loaded


const LoginPage = lazy(() => import("./components/pages/login/LoginPage"));

const EmployeDetailse = lazy(
  () => import("./components/pages/UserPage/UserPage"),
);
const NotFound = lazy(() => import("./NotFound"));
const AccountPage = lazy(
  () => import("./components/pages/AccountPage/AccountPage")
);

const NewsListDetailes = lazy(
  () =>
    import(
      "./components/pages/HumanResourceManagement/NewsList/NewaListDetailes/NewsListDetailes"
    )
);




const LayoutContent = () => {
  useBootstrapData();
  const { toggleNavbar, isNavbarOpen } = useNavbar();
  const location = useLocation();
  const { isLoggedIn , authLoading } = useAuthContext();
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

  console.log("login" , isLoggedIn);
  // Prevent dashboard flash for unauthenticated users
  if (!isLoginPage && !isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  const handleDataFromChild = () => {
    toggleNavbar();
  };

  return (
    <main className="w-full! min-h-screen flex flex-col">
      {/* فقط وقتی صفحه login نیست، هدر نمایش داده می‌شود */}
      {!isLoginPage && (
        <div className="fixed z-100 w-full">
          <Header headerMenu={handleDataFromChild} />
        </div>
      )}

      <ToastContainer toastClassName="custom-toast-font" position="top-right" />

      <div
        className={`flex flex-1 gap-[3.5rem] py-5 ${
          !isLoginPage ? "lg:mt-[75px] mt-[60px]" : ""
        } max-lg:flex-col`}
      >
        {/* فقط وقتی صفحه login نیست، نوبار نمایش داده می‌شود */}
        {!isLoginPage && (
          <div
            className={`w-[25%] overflow-auto ${
              isNavbarOpen ? "show" : "max-lg:hidden"
            } ${isLoadingNavbar ? "pointer-events-none opacity-50" : ""}`}
          >
            <Navbar />
            <div
              onClick={toggleNavbar}
              className="max-lg:bg-black/50 md:hidden fixed h-full w-full z-9"
            />
          </div>
        )}

        <div
          className={`${
            !isLoginPage ? "lg:w-[100%] overflow-auto px-5 md:px-10" : "w-full"
          }`}
        >
          <Routes>
            {/* Public Routes */}
            <Route
              path="login"
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              }
            />

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
                  <AccountPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="users/:id"
              element={
                <ProtectedRoute>
                  <EmployeDetailse />
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

            {staffRoutes}
            {HrRoutes}
            {RollCallRoutes}
            {LeaveRoutes}
            {DisciplinaryRoutes}
            {PerformanceRoutes}
            {TeachingRoutes}
              {DocumentsRoutes}
            {/* Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </main>
  );
};

const Layout = () => {
  return (
    <AuthProvider>
      <LoadingProvider>
        <Router>
          <RouteProgress />
          <Routes>
            <Route path="/*" element={<LayoutContent />} />
          </Routes>
        </Router>
      </LoadingProvider>
    </AuthProvider>
  );
};

export default Layout;
