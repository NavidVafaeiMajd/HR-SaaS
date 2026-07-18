import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useMemo } from "react";

export const useGetData = <TData = unknown>(url: string): UseQueryResult<TData, Error> => {
  const token = useMemo(() => Cookies.get("token"), []);
  
  return useQuery({
    queryKey: [url, token],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/${url}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) {
        throw new Error("عملیات با شکست مواجه شده است");
      }
      return res.json();
    },
    staleTime: 5 * 60_000, // 5 minutes
    refetchOnWindowFocus: false,
    enabled: !!url,
  });
};
