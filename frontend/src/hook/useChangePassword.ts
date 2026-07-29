import api from "@/api/axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

type ChangePasswordDto = {
    newPassword: string;
};

export const useChangePassword = (id: string) => {
    return useMutation({
        mutationFn: async (data: ChangePasswordDto) => {
            const res = await api.patch(
                `/employees/${id}/reset-password`,
                data
            );

            return res.data;
        },

        onSuccess: () => {
            toast.success("رمز عبور با موفقیت تغییر کرد.");
        },

        onError: (error: any) => {
            toast.error(
                error?.response?.data?.message ??
                "خطا در تغییر رمز عبور"
            );
        },
    });
};