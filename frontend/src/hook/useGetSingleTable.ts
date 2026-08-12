import api from "@/api/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetSingleTable = <T = any>(url: string) => {
  return useQuery<T[]>({
    queryKey: [url],

    queryFn: async () => {
      const res = await api.get(url);

      const result = res.data;

      if (Array.isArray(result?.data)) {
        return result.data;
      }

      if (Array.isArray(result)) {
        return result;
      }

      return [];
    },

    staleTime: 30_000,
  });
};