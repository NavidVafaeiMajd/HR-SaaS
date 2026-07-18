import { LearningRecordColumns } from "./column";
import { DataTable } from "@/components/shared/data-table";
import { Form } from "@/components/shared/Form";
import z from "zod";
import { validation } from "./validation";
import SectionAcc from "@/components/shared/section/SectionAcc";
import { usePostRows } from "@/hook/usePostRows";
import { useGetRowsToTable } from "@/hook/useGetRows";
import PostLoad from "@/components/ui/postLoad";
import SkeletonLoading from "@/components/ui/skeleton";
import { useTeachingData } from "@/components/pages/Teachings/Learning/useTeachingData";


export default function LearningPage() {
  const defaultValues = {
    teacher: "",
    skill: "",
    cost: "",
    personnel: "",
    start_date: new Date(),
    end_date: new Date(),
    description: "",
  };

  const { mutation, form } = usePostRows(
    "trainings",
    ["trainings"],
    defaultValues,
    validation,
    "اموزش",
    true
  );

  const { skills: skillsMapped, teachers: teachersMapped, isLoading: teachingDataLoading } = useTeachingData();

  console.log(teachersMapped)

  const formFields = (
    <div className="relative">
      {mutation.isPending && <PostLoad/>}
      <div className="flex flex-col md:flex-row gap-5">
        <Form.Select
          label="مشخصات مدرس "
          name="teacher"
          placeholder=" مشخصات مدرس "
          required
          options={teachersMapped || []}
        />

        <Form.Select
          label="مهارت آموزشی "
          name="skill"
          placeholder="مهارت آموزشی "
          required
          options={skillsMapped || []}
        />

        <Form.PriceInput
          label=" هزینه آموزش"
          name="cost"
          placeholder=" هزینه آموزش"
          required
        />
      </div>
      <div className="flex flex-col md:flex-row gap-5">
        <Form.Input
          label="تعداد دانشجو"
          name="personnel"
          placeholder="تعداد دانشجو"
          required
        />
        <Form.Date label="تاریخ شروع" name="start_date" />
        <Form.Date label="تاریخ پایان" name="end_date" />
      </div>
      <div className="flex flex-col md:flex-row gap-5">
        <Form.RichText label="شرح" name="description" required />
      </div>
    </div>
  );


  const fetchUsers = () => useGetRowsToTable("trainings");

  const onSubmit = (data: z.infer<typeof validation>) => {
    const payload = {
      ...data,
      cost: Number(data.cost),
      personnel: Number(data.personnel),
      start_date: new Date(data.start_date).toISOString().slice(0,19),
      end_date: new Date(data.end_date).toISOString().slice(0,19),
    };
  
    mutation.mutate(payload);
  };
  
  if(teachingDataLoading) return <SkeletonLoading />
  return (
    <div className="flex flex-col  px-4">
      <SectionAcc
        form={form}
        schema={validation}
        defaultValues={defaultValues}
        formFields={formFields}
        onSubmit={onSubmit}
        FirstTitle="ثبت جدید آموزش"
        SecoundTitle="لیست همه آموزش"
        table={
          <DataTable
            columns={LearningRecordColumns}
            queryKey={["trainings"]}
            queryFn={fetchUsers}
            searchableKeys={["infoTecher", "skillslearn"]}
          />
        }
      />
    </div>
  );
}
