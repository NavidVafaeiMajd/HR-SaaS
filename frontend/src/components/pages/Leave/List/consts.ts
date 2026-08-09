import {
   CircleDollarSign,
   ClipboardCheck,
   Database,
   DollarSign,
} from "lucide-react";
import { useGetData } from "@/hook/useGetData";

interface LeaveReport {
  total: number;
  approved: number;
  rejected: number;
  pending: number;
  canceled: number;
}

export const useLeaveStats = () => {
  const { data: reportData, isLoading } = useGetData<LeaveReport>("leave-list/report");
  

  const stats = [
    {
      id: 0,
      title: "مجموع مرخصی",
      count: reportData?.total || 0,
      color: "#3ec9d6",
      icon: CircleDollarSign,
    },
    {
      id: 1,
      title: "تایید شده",
      count: parseInt(reportData?.approved.toString() || "0"),
      color: "#89b0fa",
      icon: Database,
    },
    {
      id: 2,
      title: "رد شده",
      count: parseInt(reportData?.rejected.toString() || "0"),
      color: "#98db63",
      icon: DollarSign,
    },
    {
      id: 3,
      title: " لغو شده ",
      count: parseInt(reportData?.canceled.toString() || "0"),
      color: "#f3c156",
      icon: ClipboardCheck,
    },
        {
      id: 4,
      title: "درحال بررسی",
      count: parseInt(reportData?.pending.toString() || "0"),
      color: "#f3c156",
      icon: ClipboardCheck,
    },
  ];

  return { stats, isLoading };
};
