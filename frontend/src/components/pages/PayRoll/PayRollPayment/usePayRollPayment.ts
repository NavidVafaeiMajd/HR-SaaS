import api from "@/api/axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import type { MonthlyReport } from "../AttendanceInterface";

export const usePayRollPayment = ({ setMonthlyRows }) => {
return useMutation({
    mutationFn: async ({ year, month }: { year: number; month: number }) => {
      const { data } = await api.get<MonthlyReport>(
        `user-attendance//monthly?year=${year}&month=${month}`,
      );

      return data;
    },

    onSuccess: (data) => {
      console.log("MONTHLY REPORT:", data);

      setMonthlyRows(data);
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          error?.response?.data ||
          "دریافت گزارش ناموفق بود",
      );

      setMonthlyRows(null);
    },
  });


}