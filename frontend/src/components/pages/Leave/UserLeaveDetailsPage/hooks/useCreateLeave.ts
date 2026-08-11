import api from "@/api/axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
export const useCreateLeave = () => {
    return useMutation({
        mutationFn: async (data: {
            leaveTypeId: string;
            startDate: string;
            endDate: string;
            reason?: string;
        }) => {
            const { data: response } = await api.post("leave-list/my", data);

            return response;
        },

        onSuccess: () => {
            toast.success("درخواست مرخصی با موفقیت ثبت شد");

            window.location.reload();
        },

        onError: (error: any) => {
            toast.error(
                error?.response?.data?.message ||
                error?.response?.data ||
                "ثبت درخواست مرخصی ناموفق بود",
            );
        },
    });
}