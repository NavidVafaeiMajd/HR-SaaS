import { toast } from "react-toastify";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import api from "@/api/axios";

export const useUpdateRows = (url: string, queryKey: string[], validation: any, message: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof validation> | FormData) => {
      const res = api.patch(url, data)
      if (!res.ok) {
        toast.error(`ثبت ${message} ناموفق بود`);
      }
      return (await res).data;
    },
    onSuccess: () => {
      toast.success(`${message} با موفقیت ثبت شد`);
      queryClient.invalidateQueries({ queryKey });
    },
    onError: () => {
      toast.error("ثبت پرسنل ناموفق بود");
    },
  });
  return { mutation };
};
