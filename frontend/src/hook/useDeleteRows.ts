import api from "@/api/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

type UseDeleteRowsProps = {
  url: string;
  queryKey?: string[];
};

export const useDeleteRows = ({
  url,
  queryKey = [],
}: UseDeleteRowsProps) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string | number) => {
      const response = await api.delete(`${url}/${id}`);

      return response.data;
    },

    onSuccess: (data) => {
      toast.success(
        data?.message || "با موفقیت حذف شد"
      );

      if (queryKey.length) {
        queryClient.invalidateQueries({
          queryKey,
        });
      }
    },

    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.response?.data ||
        "خطا در حذف آیتم";

      toast.error(message);
    },
  });
};