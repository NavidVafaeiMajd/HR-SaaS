import { useQuery } from "@tanstack/react-query";
import { useGetRowsToTable } from "./useGetRows";

interface useRoles {
   data: any[];
}

export const useRoles = () => {
   return useQuery<useRoles>({
      queryKey: ["roles"],
      queryFn: () => useGetRowsToTable("roles"),
      staleTime: 5 * 60_000,
      refetchOnWindowFocus: false,
   });
};


