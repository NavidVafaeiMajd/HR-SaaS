import { Form } from "@/components/shared/Form";
import { Button } from "@/components/ui/button";
import { IoBusinessOutline } from "react-icons/io5";
import { validation } from "./validation";
import { usePostRows } from "@/hook/usePostRows";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import api from "@/api/axios";

const CompanyLogo = ({ queryData }: { queryData: any }) => {
  const defaultValues = {
    logo: queryData?.logo ?? undefined,
  };

  const { form, mutation } = usePostRows(
    "company/logo",
    ["company"],
    defaultValues,
    validation,
    "لوگوی شرکت",
  );

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await api.delete("/company/logo");
    },

    onSuccess: () => {
      toast.success("لوگوی شرکت با موفقیت حذف شد");

      queryClient.invalidateQueries({
        queryKey: ["company"],
      });

      form.setValue("logo", undefined);
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ?? error?.message ?? "خطا در حذف لوگو",
      );
    },
  });

  const onSubmit = (data: any) => {
    const formData = new FormData();

    if (data.logo) {
      formData.append("logo", data.logo);
    }

    mutation.mutate(formData);
  };

  const onDelete = () => {
    deleteMutation.mutate();
  };

  return (
    <div>
      <div className="flex gap-2 border-b-red-500 border-b-2 p-3">
        <IoBusinessOutline className="w-7 h-7" />
        <span>لوگوی شرکت</span>
      </div>

      <div className="p-3">
        <Form
          formProp={form}
          onSubmit={onSubmit}
          className="flex flex-col gap-5"
        >
          <Form.Image name="logo" label="لوگوی شرکت" required />

          <div>
            <Button
              type="submit"
              className="mt-4"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "در حال ذخیره..." : "ذخیره"}
            </Button>
          </div>
        </Form>
      </div>

      {queryData?.logo && (
        <div className="flex gap-2 items-center p-4">
          <img
            src={`http://localhost:5000/uploads/${queryData.logo}`}
            className="w-40 h-40 object-contain"
            alt="لوگوی شرکت"
          />

          <Button
            type="button"
            variant="destructive"
            onClick={onDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "در حال حذف..." : "حذف لوگو"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default CompanyLogo;
