import React from "react";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { useGetData } from "@/hook/useGetData";

export interface PayslipData {
  userId: string;

  firstName: string;
  lastName: string;
  personnelCode?: string | null;

  year: number;
  month: number;

  baseSalary: number;

  housingAllowance: number;
  foodAllowance: number;
  transportationAllowance: number;
  childAllowance: number;
  seniorityAllowance: number;

  totalAllowances: number;

  overtimeAmount: number;

  lateDeduction: number;
  leaveDeduction: number;
  absentDeduction: number;

  tax: number;
  insurance: number;

  totalDeductions: number;

  grossSalary: number;
  netSalary: number;

  status?: "Pending" | "IsPaid" | "Canceled" | "Unknown";
}

const monthLabels: Record<number, string> = {
  1: "فروردین",
  2: "اردیبهشت",
  3: "خرداد",
  4: "تیر",
  5: "مرداد",
  6: "شهریور",
  7: "مهر",
  8: "آبان",
  9: "آذر",
  10: "دی",
  11: "بهمن",
  12: "اسفند",
};

const formatPrice = (value: number | null | undefined) => {
  if (value === null || value === undefined) {
    return "—";
  }

  return new Intl.NumberFormat("fa-IR").format(value);
};

const SalaryRow = ({ title, value }: { title: string; value: number }) => {
  return (
    <div className="flex items-center justify-between border-b py-3 last:border-b-0">
      <span className="text-sm text-muted-foreground">{title}</span>

      <span className="font-medium">{formatPrice(value)} تومان</span>
    </div>
  );
};

 const Payslip = () => {

      const { id } = useParams();
      const { data, isLoading, isError } = useGetData<PayslipData>(
        `payroll-payment/${id}`,
      );

        if (isLoading) {
          return <div>در حال دریافت اطلاعات فیش...</div>;
        }

        if (isError) {
          return <div>خطا در دریافت فیش</div>;
        }

        if (!data) {
          return <div>اطلاعات فیش پیدا نشد.</div>;
        }
  const month = monthLabels[data.month] ?? data?.month;

  return (
    <div
      id="payslip"
      dir="rtl"
      className="mx-auto w-full max-w-4xl bg-white p-6 text-black"
    >
      {/* Header */}
      <div className="mb-6 border-b-2 pb-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">فیش حقوقی</h1>

            <p className="mt-2 text-sm text-gray-500">
              دوره حقوق: {month} {data.year}
            </p>
          </div>

          <div className="text-left">
            <p className="text-sm text-gray-500">کد پرسنلی</p>

            <p className="font-bold">{data.personnelCode ?? "—"}</p>
          </div>
        </div>
      </div>

      {/* Employee Information */}
      <section className="mb-6">
        <h2 className="mb-3 text-lg font-bold">اطلاعات کارمند</h2>

        <div className="grid grid-cols-2 gap-4 rounded-lg border p-4 md:grid-cols-4">
          <div>
            <p className="text-xs text-gray-500">نام و نام خانوادگی</p>

            <p className="mt-1 font-medium">
              {data.firstName} {data.lastName}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">کد پرسنلی</p>

            <p className="mt-1 font-medium">{data.personnelCode ?? "—"}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500">سال</p>

            <p className="mt-1 font-medium">{data.year}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500">ماه</p>

            <p className="mt-1 font-medium">{month}</p>
          </div>
        </div>
      </section>

      {/* Salary */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Earnings */}
        <section className="rounded-lg border p-4">
          <h2 className="mb-2 border-b pb-3 text-lg font-bold">حقوق و مزایا</h2>

          <SalaryRow title="حقوق پایه" value={data.baseSalary} />

          <SalaryRow title="کمک هزینه مسکن" value={data.housingAllowance} />

          <SalaryRow title="کمک هزینه غذا" value={data.foodAllowance} />

          <SalaryRow
            title="کمک هزینه ایاب و ذهاب"
            value={data.transportationAllowance}
          />

          <SalaryRow title="حق اولاد" value={data.childAllowance} />

          <SalaryRow title="حق سنوات" value={data.seniorityAllowance} />

          <SalaryRow title="اضافه کاری" value={data.overtimeAmount} />

          <div className="mt-3 flex justify-between border-t-2 pt-3 font-bold">
            <span>مجموع دریافتی</span>

            <span>{formatPrice(data.grossSalary)} تومان</span>
          </div>
        </section>

        {/* Deductions */}
        <section className="rounded-lg border p-4">
          <h2 className="mb-2 border-b pb-3 text-lg font-bold">کسورات</h2>

          <SalaryRow title="کسری تأخیر" value={data.lateDeduction} />

          <SalaryRow title="کسری مرخصی" value={data.leaveDeduction} />

          <SalaryRow title="کسری غیبت" value={data.absentDeduction} />

          <SalaryRow title="مالیات" value={data.tax} />

          <SalaryRow title="بیمه" value={data.insurance} />

          <div className="mt-3 flex justify-between border-t-2 pt-3 font-bold">
            <span>مجموع کسورات</span>

            <span>{formatPrice(data.totalDeductions)} تومان</span>
          </div>
        </section>
      </div>

      {/* Net Salary */}
      <div className="mt-6 rounded-lg border-2 p-5">
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold">خالص پرداختی</span>

          <span className="text-2xl font-bold">
            {formatPrice(data.netSalary)} تومان
          </span>
        </div>
      </div>

      {/* Status */}
      {data.status && (
        <div className="mt-4 text-center text-sm text-gray-500">
          وضعیت پرداخت:{" "}
          {data.status === "Pending"
            ? "در انتظار پرداخت"
            : data.status === "IsPaid"
              ? "پرداخت شده"
              : data.status === "Canceled"
                ? "لغو شده"
                : "نامشخص"}
        </div>
      )}

      {/* Print */}
      <div className="mt-6 flex justify-end print:hidden">
        <Button type="button" variant="outline" onClick={() => window.print()}>
          <Printer className="ml-2 h-4 w-4" />
          چاپ فیش حقوقی
        </Button>
      </div>
    </div>
  );
};

export default Payslip;