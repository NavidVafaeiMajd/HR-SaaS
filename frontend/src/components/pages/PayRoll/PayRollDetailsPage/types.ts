import type { SalaryHistoryRow } from "./components/salaryHistoryColumns";
import type { SalaryPaymentRow } from "./components/salaryPaymentColumns";

export interface CurrentSalary {
  baseSalary: number;
  housingAllowance: number;
  foodAllowance: number;
  transportationAllowance: number;
  childAllowance: number;
  seniorityAllowance: number;
  totalAllowances: number;
  grossSalary: number;
  latePerHour: number;
  leavePerDay: number;
  absentPerDay: number;
  overtimePerHour: number;
  tax: number;
  insurance: number;
  effectiveYear: number;
  effectiveMonth: number;
}

export interface PayrollDetails {
  asOf: { year: number; month: number };
  currentSalary: CurrentSalary;
  paymentSummary: {
    paidCount: number;
    paidAmount: number;
    totalAllowances: number;
    totalDeductions: number;
    pendingCount: number;
    cancelledCount: number;
  };
  paidPayments: SalaryPaymentRow[];
  salaryHistory: SalaryHistoryRow[];
}
