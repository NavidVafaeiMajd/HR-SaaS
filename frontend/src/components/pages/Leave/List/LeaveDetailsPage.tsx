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

const LeaveDetailsPage = () => {
  const { id } = useParams<{ id: string }>();

  const {
    data: leaveData,
    isLoading,
    isError,
  } = useGetData<LeaveDetails>(`leave-list/details/${id}`);

  console.log("API DATA:", leaveData);
  console.log("TYPE:", typeof leaveData);

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

  const status = getStatusInfo(leaveData.status);

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 p-4" dir="rtl">
      {/* Reason */}
      <div className="rounded-md border overflow-hidden">
        <div className="bg-gray-100 px-4 py-3 font-semibold">دلیل مرخصی</div>

        <div className="p-4">
          <div className="flex items-start gap-3">
            <span className="text-lg">🔒</span>

            <p className="text-sm leading-7 text-gray-700">
              {leaveData.reason || "دلیل مشخص نشده"}
            </p>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="rounded-md border overflow-hidden">
        <div className="bg-gray-100 px-4 py-3 font-semibold">جزئیات مرخصی</div>

        <div className="space-y-4 p-4 text-sm">
          {/* Employee */}
          <div className="flex items-center justify-between gap-4">
            <span className="text-gray-600">کارمند:</span>

            <span className="font-medium text-gray-800">
              {leaveData.user?.userName || leaveData.user?.email || "نامشخص"}
            </span>
          </div>
          {/* Leave Type */}
          <div className="flex items-center justify-between gap-4">
            <span className="text-gray-600">نوع مرخصی:</span>

            <span className="font-medium text-gray-800">
              {leaveData.leaveType?.name || "نامشخص"}
            </span>
          </div>
          {/* Request Date */}
          <div className="flex items-center justify-between gap-4">
            <span className="text-gray-600">تاریخ درخواست:</span>

            <span className="text-gray-800">
              {formatDate(leaveData.createdAt)}
            </span>
          </div>
          {/* Start Date */}
          <div className="flex items-center justify-between gap-4">
            <span className="text-gray-600">شروع:</span>

            <span className="text-gray-800">
              {formatDate(leaveData.startDate)}
            </span>
          </div>
          {/* End Date */}
          <div className="flex items-center justify-between gap-4">
            <span className="text-gray-600">پایان:</span>

            <span className="text-gray-800">
              {formatDate(leaveData.endDate)}
            </span>
          </div>
          {/* Duration */}
          <div className="flex items-center justify-between gap-4">
            <span className="text-gray-600">کل روزها:</span>

            <span className="font-medium text-gray-800">
              {leaveData.totalDays} روز
            </span>
          </div>
          {/* Attachment */}
          <div className="flex items-center justify-between gap-4">
            <span className="text-gray-600">پیوست:</span>

            {leaveData.attachment ? (
              <a
                href={leaveData.attachment}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                مشاهده فایل
              </a>
            ) : (
              <span className="text-gray-800">—</span>
            )}
          </div>
          {/* Status */}
          <div className="pt-2">
            {" "}
            <div className="mb-2 text-gray-700"> وضعیت </div>{" "}
            <div className="flex items-center gap-3">
              {" "}
              <div className="flex-1">
                {" "}
                <ProgressBar value={status.progress} />{" "}
              </div>{" "}
              <span className={`text-xs font-medium ${status.color}`}>
                {" "}
                {status.label}{" "}
              </span>{" "}
            </div>{" "}
          </div>

          {/* Approval information */}
          {leaveData.approvedBy && (
            <div className="space-y-3 border-t pt-4">
              <div className="flex items-center justify-between gap-4">
                <span className="text-gray-600">بررسی کننده:</span>

                <span className="text-gray-800">
                  {leaveData.approvedBy.userName || "نامشخص"}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-gray-600">تاریخ بررسی:</span>

                <span className="text-gray-800">
                  {formatDate(leaveData.approvedAt)}
                </span>
              </div>
            </div>
          )}
          {/* Approval comment */}
          {leaveData.approvalComment && (
            <div>
              <div className="mb-1 text-gray-700">ملاحظات</div>

              <div className="min-h-24 rounded border p-3 leading-7 text-gray-700">
                {leaveData.approvalComment}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Print */}
      <div className="flex justify-center py-2 print:hidden">
        <Button onClick={() => window.print()} className="w-auto!">
          چاپ
        </Button>
      </div>
    </div>
  );
};

export default LeaveDetailsPage;
