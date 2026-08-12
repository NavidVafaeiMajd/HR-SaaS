export type AttendanceStatus =
  | "Present"
  | "Absent"
  | "Leave"
  | "Late"
  | "EarlyLeave"
  | "OutOfShift"
  | "Unknown";


export interface MonthlyAttendance {
  id: number;

  date: string;

  status: AttendanceStatus;

  checkIn: string | null;
  checkOut: string | null;

  workedMinutes: number;
  lateMinutes: number;
  earlyLeaveMinutes: number;
  overtimeMinutes: number;

  description?: string | null;

  createdAt: string;
  updatedAt?: string | null;
}


export interface AttendanceByStatus {
  status: AttendanceStatus;

  count: number;

  workedMinutes: number;
  lateMinutes: number;
  overtimeMinutes: number;
}


export interface MonthlyAttendanceSummary {
  totalDays: number;

  presentDays: number;
  absentDays: number;
  leaveDays: number;

  unknownDays: number;
  outOfShiftDays: number;

  totalWorkedMinutes: number;
  totalLateMinutes: number;
  totalEarlyLeaveMinutes: number;
  totalOvertimeMinutes: number;
}


export interface MonthlyAttendanceReport {
  user: {
    id: string;
    name: string;
  };

  month: {
    year: number;
    month: number;
  };

  summary: MonthlyAttendanceSummary;

  byStatus: AttendanceByStatus[];

  requests: MonthlyAttendance[];
}