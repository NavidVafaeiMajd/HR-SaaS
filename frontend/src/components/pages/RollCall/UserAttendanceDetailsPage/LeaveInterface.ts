export type LeaveStatus =
  | "Pending"
  | "Approved"
  | "Rejected"
  | "Canceled";

export interface LeaveType {
  id: string;
  name: string;
}

export interface ActiveLeave {
  id: string;

  leaveType: LeaveType;

  startDate: string;
  endDate: string;

  totalDays: number;
  remainingDays: number;
}

export interface RemainingLeave {
  leaveTypeId: string;
  leaveTypeName: string;

  annualLimit: number;
  usedDays: number;
  remainingDays: number;
}

export interface LeaveReport {
  activeLeave: ActiveLeave | null;
  remainingLeaves: RemainingLeave[];
}

export interface MonthlyLeave {
  id: string;

  leaveType: LeaveType;

  startDate: string;
  endDate: string;

  totalDays: number;

  reason?: string | null;

  status: LeaveStatus;

  approvalComment?: string | null;

  approvedAt?: string | null;

  createdAt: string;
}

export interface MonthlyReport {
  user: {
    id: string;
    name: string;
  };

  month: {
    year: number;
    month: number;
  };

  summary: {
    totalRequests: number;
    totalDays: number;
  };

  byLeaveType: {
    leaveTypeId: string;
    leaveTypeName: string;
    requestCount: number;
    totalDays: number;
  }[];

  requests: MonthlyLeave[];
}