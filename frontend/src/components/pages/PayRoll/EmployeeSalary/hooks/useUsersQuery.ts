import api from "@/api/axios";
import { useQuery } from "@tanstack/react-query";


export const useUsersQuery = (
) => {

    return useQuery({

        queryKey: [
            "users",
        ],


        queryFn: async () => {

            const res = await api.get("/users/for-options");


            return res.data;
        },


    });
};