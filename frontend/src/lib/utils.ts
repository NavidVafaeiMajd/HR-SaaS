import { DAYS } from "@/components/pages/Staff/OfficeShifts/Form";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const mapShiftToTable = (shift: any) => {
  const row: Record<string, any> = {
    id: shift.id,
    name: shift.name,
  };

  DAYS.forEach((day) => {
    const time = shift.shiftTimes.find(
      (x: any) => x.dayOfWeek === day.value
    );

    row[day.key] = time
      ? `${time.startTime} - ${time.endTime}`
      : "";
  });

  return row;
};