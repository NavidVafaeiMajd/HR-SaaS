import api from "@/api/axios";
import { useQuery } from "@tanstack/react-query";

export const useEmployees = () => {
  return useQuery({
    queryKey: ["users"],

    queryFn: async () => {
      const res = await api.get("/users");
      return res.data;
    },
  });
};