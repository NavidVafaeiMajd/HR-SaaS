import FeedCart from "./FeedCard/FeedCard";
import DepartmentWiseChart from "./Charts/DepartmentWiseChart";
import StaffPositionChart from "./Charts/StaffPositionChart";
// import TicketStatusChart from "./Desk/Charts/TicketStatusChart";
// import TicketPriorityChart from "./Desk/Charts/TicketPriorityChart";
import StaffAttendanceChart from "./Charts/StaffAttendanceChart";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/api/axios";
import EmployeeProfileSection from "./components/EmployeeProfileSection";
import WelcomeSection from "./components/WelcomeSection";
import MonthlyAttendanceChart from "./Charts/MonthlyAttendanceChart";
import LatestAnnouncements from "./components/LatestAnnouncements";

const Desk = () => {
  const title = "پیشخوان";
  useEffect(() => {
    document.title = title;
  }, []);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["employee-dashboard"],
    queryFn: async () => {
      const response = await api.get("/dashboard/me");

      return response.data;
    },
  });

  if (isLoading) return <p>در حال بارگذاری...</p>;
  if (isError) return <p>خطایی رخ داده است</p>;

  console.log(data);
  return (
    <>
      <div className="min-h-200 py-10">
        <div className="grid grid-cols-2  gap-5">
          <div className="flex flex-col justify-between ">
            <WelcomeSection
              firstName={data?.profile?.firstName}
              lastName={data?.profile?.lastName}
              attendanceStatus={data?.today?.status}
            />
            <FeedCart today={data?.today} />
          </div>
          <EmployeeProfileSection profile={data?.profile} />
        </div>
        <div className="grid md:grid-cols-2 items-start mt-10 gap-10">
          <MonthlyAttendanceChart
            absentDays={data?.monthlyAttendance?.absentDays}
            presentDays={data?.monthlyAttendance?.presentDays}
            leaveDays={data?.monthlyAttendance?.leaveDays}
            totalOvertimeHours={data?.monthlyAttendance?.totalOvertimeHours}
            totalWorkedHours={data?.monthlyAttendance?.totalWorkedHours}
            workedDays={data?.monthlyAttendance?.workedDays}
          />
          <LatestAnnouncements announcements={data?.announcements} />
        </div>
      </div>
    </>
  );
};

export default Desk;
