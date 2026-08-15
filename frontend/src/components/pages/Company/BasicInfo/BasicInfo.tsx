import { Form } from "@/components/shared/Form";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import type z from "zod";
import { validation } from "./validation";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import PostLoad from "@/components/ui/postLoad";
import api from "@/api/axios";
import { IoBusinessOutline } from "react-icons/io5";

type CompanyQueryData = {
  id?: string;
  name?: string;
  legalName?: string;
  nationalId?: string;
  registrationNumber?: string;
  economicCode?: string;
  companyType?: string;
  foundedDate?: string | Date;
  logo?: string;
  description?: string;
  phone?: string;
  mobile?: string;
  email?: string;
  website?: string;
  fax?: string;
  country?: string;
  province?: string;
  city?: string;
  address?: string;
  postalCode?: string;
};

const CompanyInfo = ({ queryData }: { queryData?: CompanyQueryData }) => {
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof validation>>({
    resolver: zodResolver(validation),
    defaultValues: {
      Name: queryData?.name ?? "",
      LegalName: queryData?.legalName ?? "",
      NationalId: queryData?.nationalId ?? "",
      RegistrationNumber: queryData?.registrationNumber ?? "",
      EconomicCode: queryData?.economicCode ?? "",
      CompanyType: queryData?.companyType ?? "",
      FoundedDate: queryData?.foundedDate
        ? new Date(queryData.foundedDate)
        : null,
      Description: queryData?.description ?? "",
      Phone: queryData?.phone ?? "",
      Mobile: queryData?.mobile ?? "",
      Email: queryData?.email ?? "",
      Website: queryData?.website ?? "",
      Fax: queryData?.fax ?? "",
      Country: queryData?.country ?? "",
      Province: queryData?.province ?? "",
      City: queryData?.city ?? "",
      Address: queryData?.address ?? "",
      PostalCode: queryData?.postalCode ?? "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof validation>) => {
      const apiData = {
        Name: data.Name,
        LegalName: data.LegalName || null,
        NationalId: data.NationalId || null,
        RegistrationNumber: data.RegistrationNumber || null,
        EconomicCode: data.EconomicCode || null,
        CompanyType: data.CompanyType || null,
        FoundedDate: data.FoundedDate ? data.FoundedDate.toISOString() : null,
        Description: data.Description || null,
        Phone: data.Phone || null,
        Mobile: data.Mobile || null,
        Email: data.Email || null,
        Website: data.Website || null,
        Fax: data.Fax || null,
        Country: data.Country || null,
        Province: data.Province || null,
        City: data.City || null,
        Address: data.Address || null,
        PostalCode: data.PostalCode || null,
      };

      const res = await api.patch("/company", apiData);

      return res.data;
    },

    onSuccess: () => {
      toast.success("اطلاعات شرکت با موفقیت به‌روزرسانی شد");

      queryClient.invalidateQueries({
        queryKey: ["company"],
      });
    },

    onError: (error: any) => {
      const message =
        error.response?.data?.title || error.response?.data || error.message;

      toast.error(message || "به‌روزرسانی اطلاعات شرکت ناموفق بود");
    },
  });

  const onSubmit = (data: z.infer<typeof validation>) => {
    mutation.mutate(data);
  };

  return (
    <div className="relative">
      {mutation.isPending && <PostLoad />}

      <div>
        <div className="flex gap-2 border-b-red-500 border-b-2 p-3">
          <span>
            <IoBusinessOutline className="w-7 h-7" />
          </span>

          <span>اطلاعات شرکت</span>
        </div>

        <div className="p-3">
          <Form
            formProp={form}
            onSubmit={onSubmit}
            className="flex flex-col gap-5"
          >
            <div className="flex gap-5">
              <Form.Input
                label="نام شرکت"
                name="Name"
                placeholder="نام شرکت"
                required
              />

              <Form.Input
                label="نام رسمی"
                name="LegalName"
                placeholder="نام رسمی شرکت"
              />
            </div>

            <div className="flex gap-5">
              <Form.Input
                label="شناسه ملی"
                name="NationalId"
                placeholder="شناسه ملی"
              />

              <Form.Input
                label="شماره ثبت"
                name="RegistrationNumber"
                placeholder="شماره ثبت"
              />

              <Form.Input
                label="کد اقتصادی"
                name="EconomicCode"
                placeholder="کد اقتصادی"
              />
            </div>

            <div className="flex gap-5">
              <Form.Select
                label="نوع شرکت"
                name="CompanyType"
                placeholder="انتخاب نوع شرکت"
                options={[
                  { label: "خصوصی", value: "Private" },
                  { label: "دولتی", value: "Public" },
                  { label: "تعاونی", value: "Cooperative" },
                  { label: "غیردولتی", value: "NonProfit" },
                  { label: "سایر", value: "Other" },
                ]}
              />

              <Form.Date label="تاریخ تأسیس" name="FoundedDate" />
            </div>

            <div className="flex gap-5">
              <Form.Input label="تلفن" name="Phone" placeholder="شماره تلفن" />

              <Form.Input
                label="موبایل"
                name="Mobile"
                placeholder="شماره موبایل"
              />

              <Form.Input label="فکس" name="Fax" placeholder="شماره فکس" />
            </div>

            <div className="flex gap-5">
              <Form.Input label="ایمیل" name="Email" placeholder="ایمیل شرکت" />

              <Form.Input
                label="وب‌سایت"
                name="Website"
                placeholder="https://example.com"
              />
            </div>

            <div className="flex gap-5">
              <Form.Input label="کشور" name="Country" placeholder="کشور" />

              <Form.Input label="استان" name="Province" placeholder="استان" />

              <Form.Input label="شهر" name="City" placeholder="شهر" />
            </div>

            <div className="flex gap-5">
              <Form.Input
                label="کدپستی"
                name="PostalCode"
                placeholder="کدپستی"
              />
            </div>

            <div className="flex gap-5">
              <Form.Input
                label="نشانی"
                name="Address"
                placeholder="نشانی کامل شرکت"
              />
            </div>

            <div className="flex gap-5">
              <Form.Input
                label="توضیحات"
                name="Description"
                placeholder="توضیحات مربوط به شرکت"
              />
            </div>

            <div className="flex gap-x-2 mt-5">
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending
                  ? "در حال به‌روزرسانی..."
                  : "به‌روزرسانی اطلاعات شرکت"}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default CompanyInfo;
