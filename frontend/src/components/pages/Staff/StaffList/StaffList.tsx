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
    PersonnelCode: "",
    phoneNumber: "",
    gender: "مرد",
    shiftId: "",
    departmentId: "1",
    positionId: "1",
    isActive: true,
    role: "",
    image: null,
    password: "",
    username : "",
    dashboardType :"employee",
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
    value: String(item.name),
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
          name="username"
          label="نام کاربری"
          required
          placeholder="نام کاربری"
        />
        <Form.Password
          name="password"
          label="رمز عبور"
          required
          placeholder="رمز عبور"
        />
        <Form.Select
          name="dashboardType"
          label="نوع داشبورد"
          options={[
            { label: "کارمندی", value: "employee" },
            { label: "مدیریتی", value: "management" },
          ]}
          required
        />
      </div>
      <div className="flex flex-col md:flex-row gap-5">
        <Form.Input
          name="PersonnelCode"
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
            { label: "مرد", value: "man" },
            { label: "زن", value: "woman" },
          ]}
          required
        />
      </div>
      <div className="flex flex-col md:flex-row gap-5">
        <Form.Select
          name="shiftId"
          label="شیفت اداره ای"
          placeholder="شیفت اداره ای"
          options={shiftsMapped || []}
          required
        />
        <Form.Select
          name="isActive"
          label="وضعیت"
          placeholder="وضعیت"
          options={[
            { label: "ممنوع", value: false },
            { label: "فعال", value: true },
          ]}
          required
        />
      </div>

      <div className="flex flex-col md:flex-row gap-5">
        <Form.Select
          name="departmentId"
          label="واحد سازمانی"
          placeholder="واحد سازمانی"
          options={departmentsMapped || []}
          required
        />
        <Form.Select
          name="positionId"
          label="سمت سازمانی"
          placeholder="سمت سازمانی"
          options={designationstsMapped || []}
          required
        />
        <Form.Select
          name="role"
          label="نقش کاربری"
          placeholder="نقش کاربری"
          options={rolesMapped || []}
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
