import FeedCart from "./FeedCard/FeedCard";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/api/axios"
import LatestAnnouncements from "./components/LatestAnnouncements";
import AttendanceManagementChart from "./Charts/AttendanceManagementChart";
import LatestRequests from "./components/LatestRequests";
import LatestSalaryIncreaseRequests from "./components/LatestSalaryIncreaseRequests";
import DepartmentList from "./components/DepartmentList";
import PayrollOverview from "./components/PayrollOverview";
import PayrollChart from "./Charts/PayrollChart";

const ManagerDesk = () => {
  const title = "پیشخوان";
  useEffect(() => {
    document.title = title;
  }, []);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["manager-dashboard"],
    queryFn: async () => {
      const response = await api.get("/dashboard/management");

      return response.data;
    },
  });

  if (isLoading) return <p>در حال بارگذاری...</p>;
  if (isError) return <p>خطایی رخ داده است</p>;

  console.log(data);
  return (
    <>
      <div className="min-h-200 py-10">
        <div className="grid grid-cols-4 items-start gap-5">
          <FeedCart summary={data?.today} />{" "}
          <section className="rounded-xl border col-span-3 bg-white p-5">
            <div className="mb-5">
              <h3 className="text-lg font-bold">وضعیت حضور و غیاب</h3>

              <p className="mt-1 text-sm text-muted-foreground">
                آمار حضور، غیبت و مرخصی کارکنان در ماه جاری
              </p>
            </div>

            <AttendanceManagementChart data={data?.monthlyAttendance?.chart} />
          </section>
        </div>
        <div className="grid md:grid-cols-2 items-start mt-10 gap-10">
          <PayrollOverview payroll={data?.payroll} />
          <PayrollChart data={data?.payrollChart ?? []} />{" "}
        </div>
        <div className="grid md:grid-cols-2 items-start mt-10 gap-10">
          <LatestRequests requests={data?.requests?.latest ?? []} />
          <LatestAnnouncements announcements={data?.announcements} />
        </div>
        <div className="grid md:grid-cols-2 items-start mt-10 gap-10">
          <LatestSalaryIncreaseRequests
            requests={data?.salaryIncreaseRequests ?? []}
          />{" "}
          <DepartmentList departments={data?.departments ?? []} />{" "}
        </div>
      </div>
    </>
  );
};

export default ManagerDesk;
