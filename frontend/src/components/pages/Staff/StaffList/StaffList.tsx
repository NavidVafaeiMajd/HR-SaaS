import { useEffect } from "react";
import Table from "./Table";
import SectionAccImg from "@/components/shared/section/SectionAccImg";
import { Form } from "@/components/shared/Form";
import z from "zod";
import { validation } from "./validation";
import { usePostRows } from "@/hook/usePostRows";
import { useDepartments } from "@/hook/useDepartments";
import { useDesignationsts } from "@/hook/useDesignationsts";
import { useShifts } from "@/hook/useShifts";
import { useRoles } from "@/hook/useRoles";

const StaffList: React.FC = () => {
  const title = "پرسنل";
  useEffect(() => {
    document.title = title;
  }, []);

  const defaultValues = {
    firstName: "",
    lastName: "",
    personeliCode: "",
    phoneNumber: "",
    gender: "مرد",
    shift: "",
    department: "1",
    designation: "1",
    position: "فعال",
    image: null,
  };

  const { data: roles, isPending: rolesLoading } = useRoles();
  const { data: departments, isPending: departmentsLoading } = useDepartments();
  const { data: designationsts, isPending: designationstsLoading } =
    useDesignationsts();
  const { data: shifts, isPending: shiftsLoading } = useShifts();

  const departmentsMapped = departments?.data?.map((item) => ({
    value: String(item.id),
    label: item.name,
  }));

  const designationstsMapped = designationsts?.data?.map((item) => ({
    value: String(item.id),
    label: item.name,
  }));
  const rolesMapped = roles?.data?.map((item) => ({
    value: String(item.id),
    label: item.name,
  }));
  const shiftsMapped = shifts?.data?.map((item) => ({
    value: String(item.id),
    label: item.name,
  }));

  const { mutation, form } = usePostRows(
    "employees",
    ["employees"],
    defaultValues,
    validation,
    "پرسنل",
    true,
  );

  const formFields = (
    <div className="relative">
      {mutation.isPending &&
        departmentsLoading &&
        designationstsLoading &&
        shiftsLoading && (
          <div className="flex justify-center items-center absolute p-4 top-0 left-0 right-0 bottom-0 bg-bgBack/90 z-50">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="mr-2">در حال ارسال اطلاعات...</span>
          </div>
        )}
      <div className="flex flex-col md:flex-row gap-5">
        <Form.Input name="firstName" label="نام" required placeholder="نام" />
        <Form.Input
          name="lastName"
          label="نام خانوادگی"
          required
          placeholder="نام خانوادگی"
        />
      </div>
      <div className="flex flex-col md:flex-row gap-5">
        <Form.Input
          name="firstName"
          label="نام کاربری"
          required
          placeholder="نام"
        />
        <Form.Password
          name="lastName"
          label="رمز عبور"
          required
          placeholder="نام خانوادگی"
        />
        <Form.Select
          name="gender"
          label="نوع داشبورد"
          options={[
            { label: "کارمندی", value: "employe" },
            { label: "مدیریتی", value: "managment" },
          ]}
          required
        />
      </div>
      <div className="flex flex-col md:flex-row gap-5">
        <Form.Input
          name="personeliCode"
          label="کد پرسنلی"
          placeholder="کد پرسنلی"
          required
        />
        <Form.Input
          name="phoneNumber"
          label="شماره تماس"
          placeholder="شماره تماس"
          required
        />
        <Form.Select
          name="gender"
          label="جنسیت"
          options={[
            { label: "مرد", value: "مرد" },
            { label: "زن", value: "زن" },
          ]}
          required
        />
      </div>
      <div className="flex flex-col md:flex-row gap-5">
        <Form.Select
          name="shift"
          label="شیفت اداره ای"
          placeholder="شیفت اداره ای"
          options={shiftsMapped || []}
          required
        />
        <Form.Select
          name="position"
          label="وضعیت"
          placeholder="وضعیت"
          options={[
            { label: "ممنوع", value: "ممنوع" },
            { label: "فعال", value: "فعال" },
          ]}
          required
        />
      </div>

      <div className="flex flex-col md:flex-row gap-5">
        <Form.Select
          name="department"
          label="واحد سازمانی"
          placeholder="واحد سازمانی"
          options={departmentsMapped || []}
          required
        />
        <Form.Select
          name="designation"
          label="سمت سازمانی"
          placeholder="سمت سازمانی"
          options={designationstsMapped || []}
          required
        />
        <Form.Select
          name="designation"
          label="نقش کاربری"
          placeholder="نقش کاربری"
          options={rolesMapped  || []}
          required
        />
      </div>
    </div>
  );

  const onSubmit = (data: z.infer<typeof validation>) => {
    const formData = new FormData();
    Object.entries(data as Record<string, any>).forEach(([key, value]) => {
      if (key === "image") {
        if (value instanceof File) {
          formData.append("image", value);
        }
        // skip if null/undefined or already a URL string (server expects file on create)
        return;
      }
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });
    console.log(formData);
    mutation.mutate(formData);
  };

  return (
    <>
      <SectionAccImg
        form={form}
        formFields={formFields}
        file={
          <>
            {" "}
            <Form.Image name="image" label="تصویر پروفایل" />{" "}
          </>
        }
        onSubmit={onSubmit}
        table={<Table />}
        FirstTitle="ثبت جدید کارمند  "
        SecoundTitle="لیست همه پرسنل"
        FileTitle="تصویر پروفایل"
      />
    </>
  );
};

export default StaffList;
