import ProgressBar from "@/components/shared/ProgressBar";
import { Button } from "@/components/ui/button";
import { useGetData } from "@/hook/useGetData";
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";

type LeaveStatus = "Pending" | "Approved" | "Rejected" | "Canceled";

interface LeaveDetails {
  id: string;

  user?: {
    id: string;
    userName?: string;
    email?: string;
  };

  leaveType?: {
    id: string;
    name: string;
    color?: string;
    isHourly?: boolean;
  };

  startDate?: string;
  endDate?: string;

  totalDays: number;

  reason?: string | null;

  attachment?: string | null;

  status: LeaveStatus;

  approvedBy?: {
    id: string;
    userName?: string;
  } | null;

  approvalComment?: string | null;

  approvedAt?: string | null;

  createdAt: string;
}

const UserLeaveDetailsPage = () => {

  const {
    data: leaveData,
    isLoading,
    isError,
  } = useGetData<LeaveDetails>(`leave-list/my/report`);

    const { data: leaveDataReport } = useGetData<LeaveDetails>(
      `leave-list/user/monthly?year=1405&month=5`,
    );

  console.log("API DATA:", leaveDataReport);

  const getStatusInfo = (status: LeaveStatus) => {
    switch (status) {
      case "Pending":
        return {
          label: "در حال بررسی",
          color: "text-yellow-600",
          progress: 50,
        };
      case "Approved":
        return { label: "تایید شده", color: "text-green-600", progress: 100 };
      case "Rejected":
        return { label: "رد شده", color: "text-red-600", progress: 100 };
      case "Canceled":
        return { label: "لغو شده", color: "text-gray-500", progress: 100 };
      default:
        return { label: "نامشخص", color: "text-gray-500", progress: 0 };
    }
  };

  const formatDate = (date?: string | null) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleDateString("fa-IR");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="size-6 animate-spin" />
      </div>
    );
  }

  if (isError || !leaveData) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="rounded-md border p-6 text-center">
          <p className="text-sm text-red-600">
            اطلاعات درخواست مرخصی پیدا نشد.
          </p>
        </div>
      </div>
    );
  }


  return (
    <div className="" dir="rtl">
      <h2 className="text-2xl font-bold pb-5">مرخصی من</h2>
      <div className="grid grid-cols-2">
        <div>
          <h3 className="flex gap-3 items-center mr-2 text-xl py-2 ">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500" />
            </span>
            مرخصی در حال استفاده اکنون تو شما
          </h3>
          {leaveData?.activeLeave == null ? (
            <>
              <Button>درخواست مرخصی جدید</Button>
            </>
          ) : (
            <div className="flex gap-5">
              <span>
                نوع مرخصی: {leaveData?.activeLeave?.leaveType?.name || ""}
              </span>
              <span>
                روز شروع :{" "}
                {new Date(leaveData?.activeLeave?.startDate).toLocaleDateString(
                  "fa-IR",
                ) || ""}
              </span>
              <span>
                روز پایان :{" "}
                {new Date(leaveData?.activeLeave?.endDate).toLocaleDateString(
                  "fa-IR",
                ) || ""}
              </span>
              <span>
                مجموع روز ها : {leaveData?.activeLeave?.totalDays || 0}
              </span>
              <span>
               روز های باقی مانده:{" "}
                {leaveData?.activeLeave?.remainingDays || 0}
              </span>
            </div>
          )}
        </div>
        <div>
          <h3 className="flex gap-3 items-center mr-2 text-xl py-2 ">
            وضعیت مرخصی های باقیمانده
          </h3>
          <div className="flex flex-col gap-5">
            {leaveData?.remainingLeaves == null ? (
              <>
                <p>مرخصی در سیستم وجود ندارد!!</p>
              </>
            ) : (
              leaveData?.remainingLeaves.map((item) => (
                <div className="flex flex-row gap-5">
                  <span>نوع مرخصی: {item?.leaveTypeName || ""}</span>
                  <span>
                    تعداد روز های قابل دریافت : {item?.annualLimit || ""}
                  </span>
                  <span>روز های استفاده شده : {item?.usedDays}</span>
                  <span>تعداد روز باقی مانده : {item?.remainingDays || 0}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLeaveDetailsPage;
