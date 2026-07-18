import StatBox from "@/components/shared/StatBox";
import { useLeaveStats } from "./consts";
import LeaveTable from "./LeaveTable";
import { Form } from "@/components/shared/Form";
import z from "zod";
import SectionAcc from "@/components/shared/section/SectionAcc";
import { usePostRows } from "@/hook/usePostRows";
import { useEmployees } from "@/hook/useEmployees";
import SkeletonLoading from "@/components/ui/skeleton";
import PostLoad from "@/components/ui/postLoad";
import { useGetData } from "@/hook/useGetData";

const validation = z.object({
  employee: z.string().min(1, "انتخاب کارمند الزامی است"),
  leave_type: z.string().min(1, "انتخاب نوع مرخصی الزامی است"),
  start_date: z.date({ error: "تاریخ شروع الزامی است" }),
  end_date: z.date({ error: "تاریخ پایان الزامی است" }),
  considerations: z.string().optional(),
  reason: z.string().min(1, "دلیل مرخصی الزامی است"),
});

interface LeaveType {
  id: number;
  type_name: string;
}

interface LeaveTypesResponse {
  data: LeaveType[];
}


const LeaveList = () => {
  const { stats, isLoading: statsLoading } = useLeaveStats();
  
  const defaultValues = {
    employee: "",
    leave_type: "",
    start_date: new Date(),
    end_date: new Date(),
    considerations: "",
    reason: "",
  };

  const { mutation, form } = usePostRows(
    "leaves",
    ["leaves"],
    defaultValues,
    validation,
    "مرخصی",
    true
  );

  const { data: employee, isPending: employeesLoading } = useEmployees();

  const {data : leaveTypes , isPending: leaveTypesLoading} = useGetData<LeaveTypesResponse>("leave-types");
  
  const leaveMapped = leaveTypes?.map((item) => ({
    value: String(item.id),
    label: item.type_name, // بستگی به API داره
  }));

  const mapped = employee?.data?.map((item) => ({
    value: String(item.id),
    label: item.firstName +" "+ item.lastName,
  }));

  console.log(leaveTypes)

  const onSubmit = (data: z.infer<typeof validation>) => {
    const formData = {
      ...data,
      start_date: data.start_date?.toISOString().slice(0, 19),
      end_date: data.end_date?.toISOString().slice(0, 19),
    }
    mutation.mutate(formData)
  };

  if(employeesLoading || statsLoading || leaveTypesLoading) return <SkeletonLoading />
  return (
    <div className="flex flex-col gap-y-10 relative">
      <div>
        <StatBox data={stats} />
      </div>
      <div className="overflow-x-auto w-full!">
        <SectionAcc
          form={form}
          defaultValues={defaultValues}
          table={<LeaveTable />}
          onSubmit={onSubmit}
          FirstTitle="افزودن مرخصی"
          SecoundTitle="  لیست همه مرخصی ها "
          schema={validation}
          formFields={
            <div className="relative">
              {(mutation.isPending || employeesLoading) && <PostLoad />}

              <Form.Select
                label="کارمند"
                name="employee"
                placeholder="انتخاب کارمند"
                options={mapped || []}
                required
              />

              {/* نوع مرخصی */}
              <Form.Select
                label="نوع مرخصی"
                name="leave_type"
                placeholder="انتخاب نوع مرخصی"
                required
                options={leaveMapped || []}
              />

              {/* تاریخ‌ها */}
              <div className="flex gap-5">
                <Form.Date label="تاریخ شروع" name="start_date" />
                <Form.Date label="تاریخ پایان" name="end_date" />
              </div>

              {/* ملاحظات */}
              <Form.Textarea label="ملاحظات" name="considerations" placeholder="..." />

              {/* دلیل مرخصی */}
              <Form.Input
                label="دلیل مرخصی"
                name="reason"
                placeholder="دلیل مرخصی"
                required
              />
            </div>
          }
        />
      </div>

    </div>
  );
};

export default LeaveList;
