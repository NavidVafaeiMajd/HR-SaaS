import { Form } from "@/components/shared/Form";

import z from "zod";

import DisciplinaryTable from "./DisciplinaryTable";
import { usePostRows } from "@/hook/usePostRows";
import SectionAcc from "@/components/shared/section/SectionAcc";
import { useEmployees } from "@/hook/useEmployees";
import PostLoad from "@/components/ui/postLoad";
import { useGetData } from "@/hook/useGetData";

const validation = z.object({
  employee: z.string(),
  disciplinary_type: z.string().min(1, "انتخاب نوع پرونده الزامی است"),
  title: z.string().min(1, "موضوع الزامی است"),
  case_date: z.date({ error: "تاریخ پرونده الزامی است" }),
  description: z.string().min(1, "شرح الزامی است"),
});

interface DisciplinaryTypes {
  id: number;
  name: string;
}

const DisciplinaryList = () => {
  const defaultValues = {
    employee: "",
    disciplinary_type: "",
    title: "",
    case_date: new Date(),
    description: "",
  };

  const { mutation, form } = usePostRows(
    "disciplinary-cases",
    ["disciplinary-cases"],
    defaultValues,
    validation,
    "تخلف",
    true
  );

  const { data: employee, isPending: employeesLoading } = useEmployees();
  const {data : disciplinaryTypes} = useGetData<DisciplinaryTypes[]>("disciplinary-types")
  
  const disciplinaryMapped = disciplinaryTypes?.map((item) => ({
    value: String(item.id),
    label: item.name, //
  }));


  const mapped = employee?.data?.map((item) => ({
    value: String(item.id),
    label: item.firstName+" "+ item.lastName,
  }));

  const onSubmit = (data: z.infer<typeof validation>) => {
    const formData = {
      ...data,
      case_date: data.case_date?.toISOString().slice(0, 19),
      employee: data.employee || parseInt(data.employee),
    };

    console.log(formData);
    mutation.mutate(formData);
  };

  return (
    <div>
      <SectionAcc
        form={form}
        FirstTitle="پیوست پرونده"
        onSubmit={onSubmit}
        table={<DisciplinaryTable />}
        SecoundTitle="ثبت جدید مورد"
        defaultValues={defaultValues}
        schema={validation}
        formFields={
          <div className="relative">
            {(mutation.isPending || employeesLoading) && <PostLoad />}
            <div className="flex gap-5">
              <Form.Select
                label="کارمند"
                name="employee"
                placeholder="انتخاب کارمند"
                options={mapped || []}
                required
              />

              {/* نوع پرونده */}
              <Form.Select
                label="نوع پرونده"
                name="disciplinary_type"
                placeholder="انتخاب نوع پرونده"
                options={disciplinaryMapped || []}
                required
              />
            </div>
            <div className="flex gap-5">
              <Form.Input
                label="موضوع"
                name="title"
                placeholder="موضوع پرونده را وارد کنید"
                required
              />
              <Form.Date label="تاریخ پرونده" name="case_date" />
            </div>
            <Form.Textarea
              label="شرح"
              name="description"
              placeholder="شرح کامل پرونده را وارد کنید"
              required
            />
          </div>
        }
      />
    </div>
  );
};

export default DisciplinaryList;
