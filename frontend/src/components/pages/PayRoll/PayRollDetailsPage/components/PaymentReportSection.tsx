import Table from "@/components/shared/section/Table";
import { JsonTable } from "@/components/shared/json-table";
import type { PayrollDetails } from "../types";
import { money, number } from "../utils";
import { salaryPaymentColumns } from "./salaryPaymentColumns";

const SummaryCard = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-lg border bg-white p-3">
    <p className="text-sm text-muted-foreground">{label}</p>
    <p className="mt-2 text-lg font-bold">{value}</p>
  </div>
);

const PaymentReportSection = ({
  summary,
  payments,
}: Pick<PayrollDetails, "paymentSummary" | "paidPayments">) => (
  <section>
    <h3 className="text-xl font-bold">گزارش حقوق‌های پرداخت‌شده</h3>
    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <SummaryCard
        label="تعداد پرداخت‌های انجام‌شده"
        value={number(summary.paidCount)}
      />
      <SummaryCard label="جمع خالص پرداختی" value={money(summary.paidAmount)} />
      <SummaryCard
        label="جمع مزایای پرداخت‌شده"
        value={money(summary.totalAllowances)}
      />
      <SummaryCard
        label="جمع کسورات پرداخت‌شده"
        value={money(summary.totalDeductions)}
      />
      <SummaryCard
        label="در انتظار پرداخت"
        value={number(summary.pendingCount)}
      />
      <SummaryCard
        label="پرداخت‌های لغوشده"
        value={number(summary.cancelledCount)}
      />
    </div>
    <div className="mt-6">
      <Table
        Title="لیست حقوق‌های پرداخت‌شده"
        table={<JsonTable columns={salaryPaymentColumns} data={payments} />}
      />
    </div>
  </section>
);

export default PaymentReportSection;
