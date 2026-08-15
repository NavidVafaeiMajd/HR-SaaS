type PayrollOverviewProps = {
  payroll?: {
    salaryEmployees: number;
    paidEmployees: number;
    unpaidEmployees: number;
    paidAmount: {
      parsedValue: number;
    };
    unpaidAmount: number;
    totalAmount: {
      parsedValue: number;
    };
  };
};

const PayrollOverview = ({ payroll }: PayrollOverviewProps) => {
  const formatMoney = (value?: number) => {
    if (value === undefined || value === null) {
      return "-";
    }

    return `${value.toLocaleString("fa-IR")} تومان`;
  };

  return (
    <div className="rounded-xl border bg-white p-5">
      <div className="mb-5">
        <h3 className="text-lg font-bold">وضعیت پرداخت حقوق</h3>

        <p className="mt-1 text-sm text-muted-foreground">
          خلاصه وضعیت حقوق و پرداختی‌های این ماه
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="whitespace-nowrap font-medium">
            تعداد کارکنان حقوق‌بگیر
          </span>

          <div className="flex-1 border-t border-dashed border-muted-foreground/30" />

          <span className="whitespace-nowrap text-sm text-muted-foreground">
            {payroll?.salaryEmployees?.toLocaleString("fa-IR") ?? "-"} نفر
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="whitespace-nowrap font-medium">حقوق پرداخت‌شده</span>

          <div className="flex-1 border-t border-dashed border-muted-foreground/30" />

          <span className="whitespace-nowrap text-sm text-muted-foreground">
            {payroll?.paidEmployees?.toLocaleString("fa-IR") ?? "-"} نفر
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="whitespace-nowrap font-medium">
            حقوق پرداخت‌نشده
          </span>

          <div className="flex-1 border-t border-dashed border-muted-foreground/30" />

          <span className="whitespace-nowrap text-sm text-muted-foreground">
            {payroll?.unpaidEmployees?.toLocaleString("fa-IR") ?? "-"} نفر
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="whitespace-nowrap font-medium">مبلغ پرداخت‌شده</span>

          <div className="flex-1 border-t border-dashed border-muted-foreground/30" />

          <span className="whitespace-nowrap text-sm text-muted-foreground">
            {formatMoney(payroll?.paidAmount)}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="whitespace-nowrap font-medium">
            مبلغ پرداخت‌نشده
          </span>

          <div className="flex-1 border-t border-dashed border-muted-foreground/30" />

          <span className="whitespace-nowrap text-sm text-muted-foreground">
            {formatMoney(
              typeof payroll?.unpaidAmount === "number"
                ? payroll.unpaidAmount
                : payroll?.unpaidAmount,
            )}
          </span>
        </div>

        <div className="flex items-center gap-3 font-bold">
          <span className="whitespace-nowrap">مجموع حقوق</span>

          <div className="flex-1 border-t border-dashed border-muted-foreground/30" />

          <span className="whitespace-nowrap">
            {formatMoney(payroll?.totalAmount)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PayrollOverview;
