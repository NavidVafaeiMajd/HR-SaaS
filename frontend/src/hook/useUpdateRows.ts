import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import api from "@/api/axios";

export const useUpdateRows = (
  url: string,
  queryKey: string[],
  message: string
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: unknown) => {
      const response = await api.patch(url, data);

      return response.data;
    },

    onSuccess: () => {
      toast.success(`${message} با موفقیت ویرایش شد`);

      queryClient.invalidateQueries({
        queryKey,
      });
    },

    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data ||
        `ویرایش ${message} ناموفق بود`;

      toast.error(errorMessage);
    },
  });

  return { mutation };
};