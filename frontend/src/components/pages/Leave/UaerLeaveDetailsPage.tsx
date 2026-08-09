import ProgressBar from "@/components/shared/ProgressBar";
import { Button } from "@/components/ui/button";
import { useGetData } from "@/hook/useGetData";
import { Link, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Table from "@/components/shared/section/Table";
import { Form } from "@/components/shared/Form";
import PostLoad from "@/components/ui/postLoad";
import { JsonTable } from "@/components/shared/json-table";
import { useEffect, useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import api from "@/api/axios";
import { toast } from "react-toastify";
import persian from "react-date-object/calendars/persian";
import { DateObject } from "react-multi-date-picker";
import { EditDialog } from "@/components/shared/EditDialog";
import { useUpdateRows } from "@/hook/useUpdateRows";

type LeaveStatus = "Pending" | "Approved" | "Rejected" | "Canceled";

interface ActiveLeave {
  id: string;

  leaveType: {
    id: string;
    name: string;
  };

  startDate: string;
  endDate: string;

  totalDays: number;
  remainingDays: number;
}

interface RemainingLeave {
  leaveTypeId: string;
  leaveTypeName: string;
  annualLimit: number;
  usedDays: number;
  remainingDays: number;
}

interface LeaveReport {
  activeLeave: ActiveLeave | null;
  remainingLeaves: RemainingLeave[];
}

interface MonthlyLeave {
  id: string;

  leaveType: {
    id: string;
    name: string;
  };

  startDate: string;
  endDate: string;

  totalDays: number;

  reason?: string | null;

  status: LeaveStatus;

  approvalComment?: string | null;

  approvedAt?: string | null;

  createdAt: string;
}
interface MonthlyReport {
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

const UserLeaveDetailsPage = () => {
  const {
    data: leaveData,
    isLoading,
    isError,
  } = useGetData<LeaveDetails>(`leave-list/my/report`);

  useEffect(() => {
    const today = new DateObject({
      date: new Date(),
      calendar: persian,
    });

    const year = today.year;
    const month = today.month.number;

    form.setValue("date", new Date());

    monthlyMutation.mutate({
      year,
      month,
    });
  }, []);

  const getStatusInfo = (status: LeaveStatus) => {
    switch (status) {
      case "Pending":
        return {
          label: "در حال بررسی",
          className: "bg-yellow-100 text-yellow-800",
        };

      case "Approved":
        return {
          label: "تایید شده",
          className: "bg-green-100 text-green-800",
        };

      case "Rejected":
        return {
          label: "رد شده",
          className: "bg-red-100 text-red-800",
        };

      case "Canceled":
        return {
          label: "لغو شده",
          className: "bg-gray-100 text-gray-800",
        };

      default:
        return {
          label: "نامشخص",
          className: "bg-gray-100 text-gray-800",
        };
    }
  };

  const validation = z.object({
    date: z
      .any()
      .refine((d: unknown) => d instanceof Date && !isNaN(d.getTime()), {
        message: "تاریخ الزامی است و یا معتبر نیست",
      }),
  });

  const form = useForm<z.infer<typeof validation>>({
    resolver: zodResolver(validation),
    defaultValues: {
      date: new Date(),
    },
  });

  const [monthlyRows, setMonthlyRows] = useState<MonthlyReport | null>(null);

  const monthlyMutation = useMutation({
    mutationFn: async ({ year, month }: { year: number; month: number }) => {
      const { data } = await api.get<MonthlyReport>(
        `leave-list/my/monthly?year=${year}&month=${month}`,
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

  const onSubmit = (data: z.infer<typeof validation>) => {
    const date = new DateObject(data.date).convert(persian);

    const payload = {
      year: date.year,
      month: date.month.number,
    };

    console.log(payload);

    monthlyMutation.mutate(payload);
  };

  const postReqNewLeave = useMutation({
    mutationFn: async (data: {
      leaveTypeId: string;
      startDate: string;
      endDate: string;
      reason?: string;
    }) => {
      const { data: response } = await api.post("leave-list/my", data);

      return response;
    },

    onSuccess: () => {
      toast.success("درخواست مرخصی با موفقیت ثبت شد");

      window.location.reload();
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          error?.response?.data ||
          "ثبت درخواست مرخصی ناموفق بود",
      );
    },
  });


  const monthlyColumns: ColumnDef<MonthlyLeave>[] = useMemo(
    () => [
      {
        accessorKey: "leaveType",
        header: "نوع مرخصی",

        cell: ({ row }) => {
          return <span>{row.original.leaveType?.name || "—"}</span>;
        },
      },

      {
        accessorKey: "startDate",
        header: "تاریخ شروع",

        cell: ({ row }) => {
          return new Date(row.original.startDate).toLocaleDateString("fa-IR");
        },
      },

      {
        accessorKey: "endDate",
        header: "تاریخ پایان",

        cell: ({ row }) => {
          return new Date(row.original.endDate).toLocaleDateString("fa-IR");
        },
      },

      {
        accessorKey: "totalDays",
        header: "تعداد روز",

        cell: ({ row }) => {
          return <span>{row.original.totalDays} روز</span>;
        },
      },

      {
        accessorKey: "status",
        header: "وضعیت",

        cell: ({ row }) => {
          const status = getStatusInfo(row.original.status);

          return (
            <span
              className={`rounded-full px-2 py-1 text-xs font-medium ${status.className}`}
            >
              {status.label}
            </span>
          );
        },
      },

      {
        accessorKey: "createdAt",
        header: "تاریخ درخواست",

        cell: ({ row }) => {
          return new Date(row.original.createdAt).toLocaleDateString("fa-IR");
        },
      },

      {
        id: "actions",

        header: "عملیات",

        cell: ({ row }) => {
                                const { mutation: UpdateCancel } =
                                  useUpdateRows(
                                    `leave-list/${row.original.id}/cancel`,
                                    ["leaves"],
                                    {},
                                    "لغو",
                                  );
          return (
            <>
              <Link to={`/leave/details/${row.original.id}`}>
                <Button size="sm">نمایش جزئیات</Button>
              </Link>
              {row?.original.status === "Pending" && (
                <Button
                  onClick={() => {

                    UpdateCancel.mutate({});
                  }}
                >
                  لغو کردن
                </Button>
              )}
            </>
          );
        },
      },
    ],
    [],
  );

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

  const createLeaveValidation = z
    .object({
      leaveTypeId: z.string().min(1, "نوع مرخصی را انتخاب کنید"),

      startDate: z.date({
        message: "تاریخ شروع را انتخاب کنید",
      }),

      endDate: z.date({
        message: "تاریخ پایان را انتخاب کنید",
      }),

      reason: z.string().optional(),
    })
    .refine((data) => data.endDate >= data.startDate, {
      message: "تاریخ پایان نمی‌تواند قبل از تاریخ شروع باشد",
      path: ["endDate"],
    });

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
              <EditDialog
                btnTitle="درخواست مرخصی جدید"
                title="فرم درخواست مرخصی جدید"
                triggerLabel="درخواست مرخصی جدید"
                fields={
                  <>
                    <Form.Select
                      label="نوع مرخصی"
                      name="leaveTypeId"
                      placeholder="نوع مرخصی را انتخاب کنید"
                      required
                      options={
                        leaveData?.remainingLeaves?.map((item) => ({
                          value: String(item.leaveTypeId),
                          label: `${item.leaveTypeName} - ${item.remainingDays} روز باقی‌مانده`,
                        })) ?? []
                      }
                    />

                    <div className="flex gap-5">
                      <Form.Date label="تاریخ شروع" name="startDate" />

                      <Form.Date label="تاریخ پایان" name="endDate" />
                    </div>

                    <Form.Textarea
                      label="دلیل درخواست"
                      name="reason"
                      placeholder="دلیل درخواست مرخصی را وارد کنید"
                    />
                  </>
                }
                defaultValues={{
                  leaveTypeId: "",
                  startDate: new Date(),
                  endDate: new Date(),
                  reason: "",
                }}
                onSave={(data) => {
                  const payload = {
                    leaveTypeId: data.leaveTypeId,

                    // DateOnly در ASP.NET
                    startDate: data.startDate.toISOString().slice(0, 10),

                    endDate: data.endDate.toISOString().slice(0, 10),

                    reason: data.reason || null,
                  };

                  console.log("CREATE LEAVE:", payload);

                  postReqNewLeave.mutate(payload);
                }}
                schema={createLeaveValidation}
              />
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
                روز های باقی مانده: {leaveData?.activeLeave?.remainingDays || 0}
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
      <div className="flex ">
        <div>
          <Form formProp={form} onSubmit={onSubmit}>
            <div className="flex bg-white items-end gap-5 p-5 mb-5 rounded-sm">
              {monthlyMutation.isPending && <PostLoad />}
              <Form.Date label="ماه" name="date" onlyMonthPicker />
              <Button
                type="submit"
                className="py-6!"
                disabled={monthlyMutation.isPending ? true : false}
              >
                {monthlyMutation.isPending
                  ? "در حال جست و جو ...."
                  : " جست و جو"}{" "}
              </Button>
            </div>
          </Form>

          <Table
            table={
              <JsonTable
                columns={monthlyColumns}
                data={monthlyRows?.requests ?? []}
              />
            }
            Title="لیست گزارش"
          />
        </div>
        <div>
          <span className="flex flex-col items-center  font-bold">
            <h2>مجموع کل مرخصی</h2> {monthlyRows?.summary?.totalRequests}
          </span>
          <span className="flex flex-col items-center  font-bold">
            <h2>مجموع کل روزها</h2> {monthlyRows?.summary?.totalDays}
          </span>
          <div>
            {leaveData?.remainingLeaves == null ? (
              <>
                <p>مرخصی در این ماه وجود ندارد!!</p>
              </>
            ) : (
              monthlyRows?.byLeaveType?.map((item) => (
                <div key={item.leaveTypeId} className="flex flex-row gap-5">
                  <span>نوع مرخصی: {item.leaveTypeName}</span>

                  <span>تعداد درخواست: {item.requestCount}</span>

                  <span>مجموع روزها: {item.totalDays}</span>
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
