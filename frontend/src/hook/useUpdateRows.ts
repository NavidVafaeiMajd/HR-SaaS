import { toast } from "react-toastify";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useMemo } from "react";

export const useUpdateRows = (url: string, queryKey: string[], validation: any, message: string) => {
  const queryClient = useQueryClient();
  const token = useMemo(() => Cookies.get("token"), []);

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof validation> | FormData) => {
      const isFormData = data instanceof FormData;
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/${url}`, {
        method: "PATCH",
        headers: {
          ...(isFormData ? {} : { "Content-Type": "application/json" }),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: isFormData ? data : JSON.stringify(data),
      });
      if (!res.ok) {
        toast.error(`ثبت ${message} ناموفق بود`);
      }
      return res.json();
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
