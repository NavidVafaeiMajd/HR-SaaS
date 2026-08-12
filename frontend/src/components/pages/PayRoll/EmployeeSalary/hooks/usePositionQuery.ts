import api from "@/api/axios";
import { useQuery } from "@tanstack/react-query";


export const usePositionQuery = (
    departmentIds: string[]
) => {

    return useQuery({

        queryKey: [
            "positions",
            departmentIds
        ],

        queryFn: async () => {

            const res = await api.get("designations/by-departments", {
                params: {
                    departmentIds
                },
                paramsSerializer: {
                    indexes: null
                }
            });

            return res.data;
        },


        enabled:
            departmentIds.length > 0,

    });
};