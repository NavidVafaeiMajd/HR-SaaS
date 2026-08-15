import type { CurrentSalary } from "../types";
import { money, monthLabels } from "../utils";

const salaryRows: Array<{ label: string; key: keyof CurrentSalary }> = [
  { label: "حقوق پایه", key: "baseSalary" },
  { label: "کمک‌هزینه مسکن", key: "housingAllowance" },
  { label: "کمک‌هزینه غذا", key: "foodAllowance" },
  { label: "کمک‌هزینه ایاب‌وذهاب", key: "transportationAllowance" },
  { label: "حق اولاد", key: "childAllowance" },
  { label: "حق سنوات", key: "seniorityAllowance" },
  { label: "مجموع مزایا", key: "totalAllowances" },
  { label: "نرخ اضافه‌کاری ساعتی", key: "overtimePerHour" },
  { label: "کسری تأخیر ساعتی", key: "latePerHour" },
  { label: "کسری مرخصی روزانه", key: "leavePerDay" },
  { label: "کسری غیبت روزانه", key: "absentPerDay" },
  { label: "مالیات", key: "tax" },
  { label: "بیمه", key: "insurance" },
  { label: "حقوق ناخالص ماهانه", key: "grossSalary" },
];

const CurrentSalarySection = ({
  salary,
  asOf,
}: {
  salary: CurrentSalary;
  asOf: { year: number; month: number };
}) => (
  <section>
    <h3 className="text-xl font-bold">وضعیت فعلی حقوق</h3>
    <p className="mt-1 text-sm text-muted-foreground">
      مبلغ‌ها بر اساس آخرین حکم مؤثر تا {monthLabels[asOf.month]} {asOf.year}{" "}
      نمایش داده می‌شوند.
    </p>
    <div className="mt-4 overflow-x-auto rounded-xl border bg-white">
      <table className="w-full min-w-[520px] text-right text-sm">
        <tbody>
          {salaryRows.map(({ label, key }) => (
            <tr
              key={key}
              className={key === "grossSalary" ? "font-bold" : "border-b"}
            >
              <td className="w-1/2 bg-muted/50 p-3">{label}</td>
              <td className="p-3">{money(salary[key] as number)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);

export default CurrentSalarySection;
