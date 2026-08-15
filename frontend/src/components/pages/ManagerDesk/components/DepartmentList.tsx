import type { DepartmentOverview } from "../types/DepartmentOverview";

type DepartmentListProps = {
  departments: DepartmentOverview[];
};

const DepartmentList = ({ departments }: DepartmentListProps) => {
  return (
    <div className="rounded-xl border bg-white p-5">
      <div className="mb-5">
        <h3 className="text-lg font-bold">کارکنان بر اساس دپارتمان</h3>

        <p className="mt-1 text-sm text-muted-foreground">
          تعداد کارکنان در هر بخش
        </p>
      </div>

      <div className="space-y-3">
        {departments.length === 0 ? (
          <p className="py-5 text-center text-sm text-muted-foreground">
            دپارتمانی ثبت نشده است.
          </p>
        ) : (
          departments.map((department) => (
            <div key={department.id} className="flex items-center gap-3">
              <span className="font-medium whitespace-nowrap">
                {department.name}
              </span>

              <div className="flex-1 border-t border-dashed border-muted-foreground/30" />

              <span className="text-sm text-muted-foreground whitespace-nowrap">
                {department.employeeCount.toLocaleString("fa-IR")} نفر
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DepartmentList;
