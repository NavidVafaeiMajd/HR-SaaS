import { Button } from "@/components/ui/button";
import { useGetData } from "@/hook/useGetData";
import { Loader2 } from "lucide-react";
import Table from "@/components/shared/section/Table";
import { Form } from "@/components/shared/Form";
import PostLoad from "@/components/ui/postLoad";
import { JsonTable } from "@/components/shared/json-table";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import persian from "react-date-object/calendars/persian";
import { DateObject } from "react-multi-date-picker";
import { EditDialog } from "@/components/shared/EditDialog";
import LeaveTypeMontly from "../charts/LeaveTypeMontly";
import RemainingLeaveChart from "../charts/RemainingLeaveChart";
import { useCreateLeave } from "./hooks/useCreateLeave";
import { useMonthlyLeave } from "./hooks/useMonthlyLeave";
import { createLeaveValidation, validation } from "./validation";
import { monthlyColumns } from "./column";
import type { MonthlyReport } from "./LeaveInterface";

const UserAttendanceDetailsPage = () => {
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

  const form = useForm<z.infer<typeof validation>>({
    resolver: zodResolver(validation),
    defaultValues: {
      date: new Date(),
    },
  });

  const [monthlyRows, setMonthlyRows] = useState<MonthlyReport | null>(null);

  const monthlyMutation = useMonthlyLeave({ setMonthlyRows });

  const onSubmit = (data: z.infer<typeof validation>) => {
    const date = new DateObject(data.date).convert(persian);

    const payload = {
      year: date.year,
      month: date.month.number,
    };

    console.log(payload);

    monthlyMutation.mutate(payload);
  };
  const postReqNewLeave = useCreateLeave();

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
      <h2 className="text-2xl font-bold pb-5">وضعیت حضور و غیاب </h2>
      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <h3 className="flex gap-3 items-center mr-2 text-xl py-2 ">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500" />
            </span>
            مرخصی در حال استفاده اکنون تو شما
          </h3>
          {leaveData?.activeLeave == null ? (
            <div className="flex flex-col justify-center items-center gap-3 h-full!">
              <p className="text-red-500">
                هیچ مرخصی فعالی برای شما وجود ندارد!!!
              </p>
              <EditDialog
                btnTitle="درخواست مرخصی جدید"
                variant="default"
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
                      required
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
            </div>
          ) : (
            <div className="mt-5 overflow-x-scroll! rounded-xl border bg-white">
              <table className="w-full text-right text-sm ">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 font-semibold">نوع مرخصی</th>
                    <th className="px-4 py-3 font-semibold">تاریخ شروع</th>
                    <th className="px-4 py-3 font-semibold">تاریخ پایان</th>
                    <th className="px-4 py-3 font-semibold">مجموع روزها</th>
                    <th className="px-4 py-3 font-semibold">
                      روزهای باقی‌مانده
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr className="border-t">
                    <td className="px-4 py-4">
                      {leaveData?.activeLeave?.leaveType?.name || "—"}
                    </td>

                    <td className="px-4 py-4">
                      {leaveData?.activeLeave?.startDate
                        ? new Date(
                            leaveData.activeLeave.startDate,
                          ).toLocaleDateString("fa-IR")
                        : "—"}
                    </td>

                    <td className="px-4 py-4">
                      {leaveData?.activeLeave?.endDate
                        ? new Date(
                            leaveData.activeLeave.endDate,
                          ).toLocaleDateString("fa-IR")
                        : "—"}
                    </td>

                    <td className="px-4 py-4 font-semibold">
                      {leaveData?.activeLeave?.totalDays ?? 0} روز
                    </td>

                    <td className="px-4 py-4 font-semibold text-green-600">
                      {leaveData?.activeLeave?.remainingDays ?? 0} روز
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div>
          <h3 className="flex gap-3 items-center mr-2 pb-5 text-xl py-2 ">
            وضعیت مرخصی های باقیمانده
          </h3>
          <div className="flex flex-col gap-5">
            {leaveData?.remainingLeaves == null ? (
              <>
                <p>مرخصی در سیستم وجود ندارد!!</p>
              </>
            ) : (
              <RemainingLeaveChart data={leaveData?.remainingLeaves} />
            )}
          </div>
        </div>
      </div>
      <div>
        <h3 className="flex gap-3 items-center mr-2 pb-5 text-xl py-2 ">
          وضعیت مرخصی در هر ماه
        </h3>
        <div className="flex flex-col md:flex-row mt-3 ">
          <div>
            <Form formProp={form} onSubmit={onSubmit}>
              <div className="grid grid-cols-2 bg-white items-end gap-5 p-5  rounded-t-md">
                {monthlyMutation.isPending && <PostLoad />}
                <Form.Date
                  label="جست و جو بر اساس ماه"
                  name="date"
                  onlyMonthPicker
                />
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
          <div className="w-full">
            <div className="flex justify-around">
              <span className="flex flex-col items-center  font-bold border rounded-full p-2 ">
                <h2>مجموع کل مرخصی</h2> {monthlyRows?.summary?.totalRequests}
              </span>
              <span className="flex flex-col items-center  font-bold border rounded-full p-2 ">
                <h2>مجموع کل روزها</h2> {monthlyRows?.summary?.totalDays}
              </span>
            </div>
            <div className="w-full flex justify-center  ">
              {leaveData?.remainingLeaves == null ? (
                <>
                  <p>مرخصی در این ماه وجود ندارد!!</p>
                </>
              ) : (
                <LeaveTypeMontly data={monthlyRows?.byLeaveType ?? []} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAttendanceDetailsPage;
