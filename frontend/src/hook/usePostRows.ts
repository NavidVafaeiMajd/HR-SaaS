import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import api from "@/api/axios";

export const usePostRows = (
  url: string,
  queryKey: string[],
  defaultValues: any,
  validation: any,
  message: string,
  reset?: boolean
) => {
  const form = useForm<z.infer<typeof validation>>({
    resolver: zodResolver(validation as any),
    defaultValues,
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof validation> | FormData) => {
      const isFormData = data instanceof FormData;

      const res = await api.post(
        `/${url}`,
        isFormData ? data : data
      );

      return res.data;
    },

    onSuccess: () => {
      toast.success(`${message} با موفقیت ثبت شد`);

      queryClient.invalidateQueries({ queryKey });

      if (reset) {
        form.reset(defaultValues);
      }

      setTimeout(() => {
        const accordionElement = document.querySelector(
          '[data-accordion="form"]'
        ) as HTMLElement | null;

        if (accordionElement) {
          accordionElement.style.display = "none";
        }
      }, 100);
    },

    onError: (error: any) => {
      const messageError =
        error.response?.data?.message ||
        error.response?.data?.title ||
        error.response?.data ||
        error.message;

      toast.error(messageError ?? `ثبت ${message} ناموفق بود`);
    },
  });
  return { mutation, form };
};