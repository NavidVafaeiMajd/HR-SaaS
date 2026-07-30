import { Form } from "@/components/shared/Form";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import type z from "zod";
import { validation } from "./validation";
import { useForm } from "react-hook-form";
import { IoDocumentTextOutline } from "react-icons/io5";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useDepartments } from "@/hook/useDepartments";
import { useDesignationsts } from "@/hook/useDesignationsts";
import PostLoad from "@/components/ui/postLoad";
import { useShifts } from "@/hook/useShifts";
import Cookies from "js-cookie";
import { useProfileApi } from "@/hook/useProfileApi";
import api from "@/api/axios";

type BasicInfoQueryData = {
  id?: string | number;
  firstName?: string;
  email?: string;
  lastName?: string;
  phoneNumber?: string;
  gender?: string;
  personeliCode?: string;
  birthDate?: string | Date;
  department?: { id?: number | string };
  position?: { id?: number | string; name?: string };
  shift?: { id?: number | string };
  isActive?: boolean;
  province?: string;
  city?: string;
  postalCode?: string;
  religion?: string;
  bloodGroup?: string;
  nationality?: string;
  citizenship?: string;
  address1?: string;
  address2?: string;
  maritalStatus?: string;
  dashboardType?: string;
};

const BasicInfo = ({ queryData }: { queryData?: BasicInfoQueryData }) => {
  const { data: departments, isPending: departmentsLoading } = useDepartments();
  const { data: position, isPending: positionLoading } = useDesignationsts();
  const { data: shifts, isPending: shiftsLoading } = useShifts();

  const { queryKey, url } = useProfileApi(queryData?.id);
  const departmentsMapped = departments?.data?.map((item) => ({
    value: String(item.id),
    label: item.name,
  }));

  const positionMapped = position?.data?.map((item) => ({
    value: String(item.id),
    label: item.name,
  }));

  const shiftsMapped = shifts?.data?.map((item) => ({
    value: String(item.id),
    label: item.name,
  }));

  const form = useForm<z.infer<typeof validation>>({
    resolver: zodResolver(validation),
    defaultValues: {
      FirstName: queryData?.firstName == null ? "" : queryData?.firstName,
      LastName: queryData?.lastName == null ? "" : queryData?.lastName,
      PhoneNumber: queryData?.phoneNumber == null ? "" : queryData?.phoneNumber,
      Gender: queryData?.gender == null ? "" : queryData?.gender,
      PersonnelCode:
        queryData?.personnelCode == null
          ? ""
          : String(queryData?.personnelCode),
      birthDate: queryData?.birthDate
        ? new Date(queryData.birthDate)
        : new Date(),

      DepartmentId: queryData?.departmentId
        ? String(queryData.departmentId)
        : "",

      PositionId: queryData?.positionId ? String(queryData.positionId) : "",
      ShiftId: queryData?.shiftId ? String(queryData.shiftId) : "",
      IsActive: queryData?.isActive ?? true,
      province: queryData?.province == null ? "" : queryData?.province,
      city: queryData?.city == null ? "" : queryData?.city,
      postalCode: queryData?.postalCode == null ? "" : queryData?.postalCode,
      religion: queryData?.religion == null ? "" : queryData?.religion,
      bloodGroup: queryData?.bloodGroup == null ? "" : queryData?.bloodGroup,
      nationality: queryData?.nationality == null ? "" : queryData?.nationality,
      citizenship: queryData?.citizenship == null ? "" : queryData?.citizenship,
      address1: queryData?.address1 == null ? "" : queryData?.address1,
      address2: queryData?.address2 == null ? "" : queryData?.address2,
      maritalStatus:
        queryData?.maritalStatus == null ? "" : queryData?.maritalStatus,
      email: queryData?.email == null ? "" : queryData?.email,
      dashboardType: queryData?.dashboardType == null ? "" : queryData?.dashboardType,
    },
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof validation>) => {
      const apiData = {
        FirstName: data.FirstName,
        Email: data.email,
        LastName: data.LastName,
        PhoneNumber: data.PhoneNumber,
        Gender: data.Gender,
        PersonnelCode: data.PersonnelCode,
        BirthDate: data.birthDate?.toISOString().slice(0, 19) ?? null,
        IsActive: data.IsActive,
        MaritalStatus: data.maritalStatus ?? "",
        Province: data.province ?? "",
        City: data.city ?? "",
        PostalCode: data.postalCode ?? "",
        Religion: data.religion ?? "",
        BloodGroup: data.bloodGroup ?? "",
        Nationality: data.nationality ?? "",
        Citizenship: data.citizenship ?? "",
        Address1: data.address1 ?? "",
        Address2: data.address2 ?? "",
        DepartmentId: data.DepartmentId ? parseInt(data.DepartmentId) : null,
        PositionId: data.PositionId ? parseInt(data.PositionId) : null,
        ShiftId: data.ShiftId ? parseInt(data.ShiftId) : null,
        dashboardType: data.dashboardType ? data.dashboardType : "",
      };

      const res = await api.put(url, apiData);

      return res.data;
    },

    onSuccess: () => {
      toast.success("اطلاعات با موفقیت به‌روزرسانی شد");

      queryClient.invalidateQueries({
        queryKey: [{ queryKey }],
      });
    },

    onError: (error: any) => {
      const message =
        error.response?.data?.title || error.response?.data || error.message;

      toast.error(message || "به‌روزرسانی ناموفق بود");
    },
  });

  const onSubmit = (data: z.infer<typeof validation>) => {
    mutation.mutate(data);
  };

  return (
    <div className="relative">
      {mutation.isPending && <PostLoad />}
      {(departmentsLoading || positionLoading || shiftsLoading) && <PostLoad />}

      <div>
        <div className="flex gap-2 border-b-red-500 border-b-2 p-3">
          <span>
            <IoDocumentTextOutline className="w-7 h-7" />
          </span>
          <span> اطلاعات اولیه</span>
        </div>
        <div className="p-3">
          <Form
            formProp={form}
            onSubmit={onSubmit}
            className="flex flex-col gap-5"
          >
            <div className="flex gap-5">
              <Form.Input
                label="نام"
                name="FirstName"
                placeholder="نام"
                required
              />
              <Form.Input
                label="نام خانوادگی"
                name="LastName"
                placeholder="نام خانوادگی"
                required
              />
            </div>
            <div className="flex gap-5">
              <Form.Input
                label="شماره تماس"
                name="PhoneNumber"
                placeholder="شماره تماس"
                required
              />
              <Form.Select
                label="جنسیت"
                name="Gender"
                placeholder="انتخاب جنسیت"
                options={[
                  { label: "مرد", value: "man" },
                  { label: "زن", value: "woman" },
                ]}
                required
              />
            </div>
            <div className="flex gap-5">
              <Form.Input
                label="کدپرسنلی"
                name="PersonnelCode"
                placeholder="کدپرسنلی"
                required
              />
              <Form.Date label="تاریخ تولد" name="birthDate" />
              <Form.Select
                label="وضعیت"
                name="IsActive"
                placeholder="انتخاب وضعیت"
                options={[
                  { label: "فعال", value: true },
                  { label: "ممنوع", value: false },
                ]}
                required
              />
            </div>
            <div className="flex gap-5">
              <Form.Select
                label="وضعیت تاهل"
                name="maritalStatus"
                placeholder="انتخاب وضعیت تاهل"
                options={[
                  { label: "مجرد", value: "مجرد" },
                  { label: "متاهل", value: "متاهل" },
                  { label: "بیوه", value: "بیوه" },
                  {
                    label: "طلاق گرفته یا جدا شده",
                    value: "طلاق گرفته یا جدا شده",
                  },
                ]}
                required
              />
              <Form.Select
                name="ShiftId"
                label="ساعت کاری"
                placeholder="ساعت کاری"
                options={shiftsMapped || []}
                required
              />
              <Form.Input
                label="ایمیل"
                name="email"
                placeholder="ایمیل"
                required
              />
            </div>
            <div className="flex flex-col md:flex-row gap-5">
              <Form.Select
                name="DepartmentId"
                label="واحد سازمانی"
                placeholder="واحد سازمانی"
                options={departmentsMapped || []}
                required
              />
              <Form.Select
                name="PositionId"
                label="سمت سازمانی"
                placeholder="سمت سازمانی"
                options={positionMapped || []}
                required
              />
              <Form.Select
                name="dashboardType"
                label="نوع داشبورد"
                placeholder="سمت سازمانی"
                options={[
                  { label: "کارمندی", value: "employee" },
                  { label: "مدیر", value: "manager" },
                ]}
                required
              />
            </div>
            <div className="flex gap-5">
              <Form.Input placeholder="استان" label="استان" name="province" />
              <Form.Input placeholder="شهر" label="شهر" name="city" />
              <Form.Input
                placeholder="کدپستی"
                label="کدپستی"
                name="postalCode"
              />
            </div>
            <div className="flex gap-5">
              <Form.Select
                label="مذهب"
                name="religion"
                placeholder="انتخاب مذهب"
                options={[
                  { label: "اسلام", value: "اسلام" },
                  { label: "مسیحیت", value: "مسیحیت" },
                  { label: "یهودیت", value: "یهودیت" },
                  { label: "زرتشتی", value: "زرتشتی" },
                  { label: "سایر", value: "سایر" },
                ]}
              />
              <Form.Select
                label="گروه خونی"
                name="bloodGroup"
                placeholder="انتخاب گروه خونی"
                options={[
                  { label: "A+", value: "A+" },
                  { label: "A-", value: "A-" },
                  { label: "B+", value: "B+" },
                  { label: "B-", value: "B-" },
                  { label: "AB+", value: "AB+" },
                  { label: "AB-", value: "AB-" },
                  { label: "O+", value: "O+" },
                  { label: "O-", value: "O-" },
                ]}
              />
            </div>
            <div className="flex gap-5">
              <Form.Select
                label="ملیت"
                name="nationality"
                placeholder="انتخاب ملیت"
                options={[
                  { label: "ایرانی", value: "ایرانی" },
                  { label: "افغانستانی", value: "افغانستانی" },
                  { label: "عراقی", value: "عراقی" },
                  { label: "پاکستانی", value: "پاکستانی" },
                  { label: "ترک", value: "ترک" },
                  { label: "سایر", value: "سایر" },
                ]}
              />
              <Form.Select
                label="تابعیت"
                name="citizenship"
                placeholder="انتخاب تابعیت"
                options={[
                  { label: "ایران", value: "ایران" },
                  { label: "افغانستان", value: "افغانستان" },
                  { label: "عراق", value: "عراق" },
                  { label: "پاکستان", value: "پاکستان" },
                  { label: "ترکیه", value: "ترکیه" },
                  { label: "سایر", value: "سایر" },
                ]}
              />
            </div>
            <div className="flex gap-5">
              <Form.Input
                label="نشانی 1"
                name="address1"
                placeholder="نشانی 1"
              />
              <Form.Input
                label="نشانی 2"
                name="address2"
                placeholder="نشانی 2"
              />
            </div>

            <div className="flex gap-x-2 mt-5">
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending
                  ? "در حال به‌روزرسانی..."
                  : "به‌روزرسانی پروفایل"}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default BasicInfo;
