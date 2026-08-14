import { lazy } from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";
import SalaryIncreaseRequest from "@/components/pages/PayRoll/SalaryIncreaseRequest/SalaryIncreaseRequest";
const LayoutPayRoll = lazy(() => import("@/components/pages/PayRoll/Layout"));
const PayRollPeriod = lazy(
  () => import("@/components/pages/PayRoll/PayRollPeriod/PayRollPeriod"),
);
const PayRollPayment = lazy(
  () => import("@/components/pages/PayRoll/PayRollPayment/PayRollPayment"),
);
const EmployeeSalary = lazy(
  () => import("@/components/pages/PayRoll/EmployeeSalary/EmployeeSalary"),
);
const PayRollDetailsPage = lazy(
  () =>
    import("@/components/pages/PayRoll/PayRollDetailsPage/PayRollDetailsPage"),
);
const Payslip = lazy(() => import("@/components/pages/PayRoll/Payslip"));

export const PayRollRoutes = (
  <>
    <Route
      path="pay-roll"
      element={
        <ProtectedRoute>
          <LayoutPayRoll />
        </ProtectedRoute>
      }
    >
      <Route
        path="pay-roll-period"
        element={
          <ProtectedRoute>
            <PayRollPeriod />
          </ProtectedRoute>
        }
      />
      <Route
        path="pay-roll-payment"
        element={
          <ProtectedRoute>
            <PayRollPayment />
          </ProtectedRoute>
        }
      />
      <Route
        path="employee-salary"
        element={
          <ProtectedRoute>
            <EmployeeSalary />
          </ProtectedRoute>
        }
      />
    </Route>

    <Route
      path="user-pay-roll/:id"
      element={
        <ProtectedRoute>
          <PayRollDetailsPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="salary-increase-request"
      element={
        <ProtectedRoute>
          <SalaryIncreaseRequest />
        </ProtectedRoute>
      }
    />
    <Route
      path="payslip/:id"
      element={
        <ProtectedRoute>
          <Payslip />
        </ProtectedRoute>
      }
    />
  </>
);
