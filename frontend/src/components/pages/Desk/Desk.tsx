import { lazy, Suspense, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import api from "@/api/axios";

import FeedCart from "./FeedCard/FeedCard";
import EmployeeProfileSection from "./components/EmployeeProfileSection";
import WelcomeSection from "./components/WelcomeSection";
import LatestAnnouncements from "./components/LatestAnnouncements";

const MonthlyAttendanceChart = lazy(
  () => import("./Charts/MonthlyAttendanceChart"),
);

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

  if (isLoading) {
    return <p>در حال بارگذاری...</p>;
  }

  if (isError) {
    return <p>خطایی رخ داده است</p>;
  }

  return (
    <div className="min-h-200 py-10">
      <div className="grid grid-cols-2 gap-5">
        <div className="flex flex-col justify-between">
          <WelcomeSection
            firstName={data?.profile?.firstName}
            lastName={data?.profile?.lastName}
            attendanceStatus={data?.today?.status}
          />

          <FeedCart today={data?.today} />
        </div>

        <EmployeeProfileSection profile={data?.profile} />
      </div>

      <div className="mt-10 grid items-start gap-10 md:grid-cols-2">
        <Suspense
          fallback={
            <div className="flex h-80 items-center justify-center">
              در حال بارگذاری نمودار...
            </div>
          }
        >
          <MonthlyAttendanceChart
            absentDays={data?.monthlyAttendance?.absentDays}
            presentDays={data?.monthlyAttendance?.presentDays}
            leaveDays={data?.monthlyAttendance?.leaveDays}
            totalOvertimeHours={data?.monthlyAttendance?.totalOvertimeHours}
            totalWorkedHours={data?.monthlyAttendance?.totalWorkedHours}
            workedDays={data?.monthlyAttendance?.workedDays}
          />
        </Suspense>

        <LatestAnnouncements announcements={data?.announcements} />
      </div>
    </div>
  );
};

export default Desk;
  