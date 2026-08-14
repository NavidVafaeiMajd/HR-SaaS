import { Loader2 } from "lucide-react";
import Table from "@/components/shared/section/Table";
import { JsonTable } from "@/components/shared/json-table";
import { useGetData } from "@/hook/useGetData";
import type { PayrollDetails } from "../types";
import CurrentSalarySection from "./CurrentSalarySection";
import PaymentReportSection from "./PaymentReportSection";
import { salaryHistoryColumns } from "./salaryHistoryColumns";
import PostLoad from "@/components/ui/postLoad";

const SalaryStatus = ({ userId }: { userId?: string }) => {
  const { data, isLoading, isError } = useGetData<PayrollDetails>(
    userId ? `payroll-details/${userId}` : "",
  );

  if (isLoading) return <PostLoad />;
  if (isError || !data) {
    return (
      <div className="h-[calc(100dvh-150px)] w-full flex items-center  justify-center">
        <p className="text-sm text-muted-foreground">
          اطلاعات حقوقی برای شما ثبت نشده است.
        </p>
      </div>
    );
  }

  return (
    <section className="space-y-10">
      <div className="grid gap-8 xl:grid-cols-2">
        <CurrentSalarySection salary={data.currentSalary} asOf={data.asOf} />
        <PaymentReportSection summary={data.paymentSummary} payments={data.paidPayments} />
      </div>
      <div className="overflow-x-auto">
        <Table
          Title="تاریخچه تغییرات حقوق"
          table={<JsonTable columns={salaryHistoryColumns} data={data.salaryHistory} />}
        />
      </div>
    </section>
  );
};

export default SalaryStatus;
