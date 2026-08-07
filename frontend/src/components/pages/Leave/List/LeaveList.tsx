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
  UserId: z.string().min(1, "انتخاب کارمند الزامی است"),
  LeaveTypeId: z.string().min(1, "انتخاب نوع مرخصی الزامی است"),
  StartDate: z.date({ error: "تاریخ شروع الزامی است" }),
  EndDate: z.date({ error: "تاریخ پایان الزامی است" }),
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
    UserId: "",
    LeaveTypeId: "",
    StartDate: new Date(),
    EndDate: new Date(),
    reason: "",
  };

  const { mutation, form } = usePostRows(
    "leave-list",
    ["leaves"],
    defaultValues,
    validation,
    "مرخصی",
    true
  );

  const { data: employee, isPending: employeesLoading } = useEmployees();

  const {data : leaveTypes , isPending: leaveTypesLoading} = useGetData<LeaveTypesResponse>("leave-types/options");
  
  const onSubmit = (data: z.infer<typeof validation>) => {
    const formData = {
      ...data,
      StartDate: data.StartDate?.toISOString().slice(0, 10),
      EndDate: data.EndDate?.toISOString().slice(0, 10),
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
                name="UserId"
                placeholder="انتخاب کارمند"
                options={employee || []}
                required
              />

              {/* نوع مرخصی */}
              <Form.Select
                label="نوع مرخصی"
                name="LeaveTypeId"
                placeholder="انتخاب نوع مرخصی"
                required
                options={leaveTypes || []}
              />

              {/* تاریخ‌ها */}
              <div className="flex gap-5">
                <Form.Date label="تاریخ شروع" name="StartDate" />
                <Form.Date label="تاریخ پایان" name="EndDate" />
              </div>

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
