import { useMutation, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useMemo } from "react";
import { toast } from "react-toastify";

type UseDeleteRowsProps = {
  url: string; 
  queryKey?: string[]; 
};

export const useDeleteRows = ({ url, queryKey = [] }: UseDeleteRowsProps) => {
  const queryClient = useQueryClient();
  const token = useMemo(() => Cookies .get("token"), []);

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/${url}/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) {
        let message = "حذف ناموفق بود";
        try {
          const data = await res.json();
          message = data?.message || message;
        } catch {}
        throw new Error(message);
      }
      return true;
    },
    onSuccess: () => {
      toast.success("با موفقیت حذف شد");
      if (queryKey.length > 0) {
        queryClient.invalidateQueries({ queryKey });
      }
    },
    onError: (error: any) => {
      toast.error(error?.message || "خطا در حذف آیتم");
    },
  });
};
