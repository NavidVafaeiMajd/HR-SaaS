import api from "@/api/axios";
import { useQuery } from "@tanstack/react-query";


export const useUsersQuery = (
    positionIds: string[]
) => {

    return useQuery({

        queryKey: [
            "users",
            positionIds
        ],


        queryFn: async () => {

            const res = await api.get("/users/by-positions", {
                params: {
                    positionIds
                },
                paramsSerializer: {
                    indexes: null
                }
            });


            return res.data;
        },


        enabled:
            positionIds.length > 0,

    });
};