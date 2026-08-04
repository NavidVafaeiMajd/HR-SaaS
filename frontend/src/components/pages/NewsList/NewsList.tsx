import { useEffect } from "react";
import Table from "./Table";
import SectionAcc from "@/components/shared/section/SectionAcc";
import { validation } from "./validation";
import { Form } from "@/components/shared/Form";
import type z from "zod";
import { usePostRows } from "@/hook/usePostRows";
import { useDepartments } from "@/hook/useDepartments";
import { usePositionQuery } from "./hooks/usePositionQuery";
import { useUsersQuery } from "./hooks/useUsersQuery";

const NewsList: React.FC = () => {
  const title = " ابلاغیه ";
  useEffect(() => {
    document.title = title;
  }, []);


  const { data: departments, isPending: departmentsLoading } = useDepartments();

const defaultValues = {
  title: "",
  publish_date: null,
  end_date: null,
  departmentIds: [],
  positionIds: [],
  userIds: [],
  content: "",
};
  const { mutation, form } = usePostRows(
    "hr-news",
    ["hr-news"],
    defaultValues,
    validation,
    "ابلاغیه",
    true,
  );

  const selectedDepartments = form.watch("departmentIds");
  const selectedPositions = form.watch("positionIds");

    useEffect(() => {
      form.setValue("positionIds", []);
      form.setValue("userIds", []);
    }, [selectedDepartments]);

    useEffect(() => {
      form.setValue("userIds", []);
    }, [selectedPositions]);
  
  const { data: positions, isPending: positionsLoading } =
    usePositionQuery(selectedDepartments);

  const { data: users, isPending: usersLoading } = useUsersQuery(selectedPositions);
  const departmentsMapped =
    departments?.data?.map((item) => ({
      value: String(item.id),
      label: item.name,
    })) || [];

  const positionsMapped =
    positions?.map((item) => ({
      value: item.value,
      label: item.label,
    })) || [];

  const usersMapped =
    users?.map((item) => ({
      value: item.value,
      label: item.label,
    })) || [];
  const formFields = (
    <div className="relative">
      {(mutation.isPending || departmentsLoading) && (
        <div className="flex justify-center items-center absolute p-4 top-0 left-0 right-0 bottom-0 bg-bgBack/90 z-50">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="mr-2">در حال بارگذاری...</span>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Form.Input
          name="title"
          label="عنوان ابلاغیه"
          required
          placeholder="عنوان ابلاغیه"
        />
        <div className="flex flex-col md:flex-row gap-5">
          <Form.Date name="publish_date" label="تاریخ شروع" />
          <Form.Date name="end_date" label="تاریخ پایان" />
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-5"></div>

      <div className="flex flex-col md:flex-row gap-5">
        <Form.MultiSelect
          name="departmentIds"
          label="واحد سازمانی"
          options={departmentsMapped || []}
          required
          placeholder="انتخاب واحد سازمانی"
        />
        <Form.MultiSelect
          name="positionIds"
          label="سمت شغلی"
          options={positionsMapped}
          disabled={!selectedDepartments?.length}
        />
        <Form.MultiSelect
          name="userIds"
          label="کارمند"
          options={usersMapped}
          disabled={!selectedPositions?.length}
        />
      </div>
      <Form.RichText name="content" label="متن ابلاغیه" required />
    </div>
  );

const onSubmit = (data: z.infer<typeof validation>) => {
  const formData = {
    title: data.title,
    content: data.content,

    departmentIds: data.departmentIds,
    positionIds: data.positionIds,
    userIds: data.userIds,

    startDate: data.publish_date
      ? data.publish_date.toISOString().slice(0, 19)
      : null,

    endDate: data.end_date ? data.end_date.toISOString().slice(0, 19) : null,
  };

  console.log(formData);

  mutation.mutate(formData);
};

  return (
    <>
      <SectionAcc
        form={form}
        defaultValues={defaultValues}
        schema={validation}
        formFields={formFields}
        onSubmit={onSubmit}
        table={<Table />}
        FirstTitle="ثبت جدید ابلاغیه"
        SecoundTitle="لیست همه ابلاغیه ها"
      />
    </>
  );
};

export default NewsList;
