import api from "@/api/axios";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";

export const useGetData = <TData = unknown>(url: string): UseQueryResult<TData, Error> => {  
  return useQuery({
    queryKey: [url],
    queryFn: async () => {
      const res = api.get(`${url}`);
      return (await res).data;
    },
    refetchOnWindowFocus: false,
    enabled: !!url,
  });
};
