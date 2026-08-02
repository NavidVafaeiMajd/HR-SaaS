import { readAllNotifications, readNotification } from "@/api/notification";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export const useReadNotification = () => {
    const queryClient = useQueryClient();

    const readMutation = useMutation({
        mutationFn: readNotification,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notification"] });
        },
    });

    const readAllMutation = useMutation({
        mutationFn: readAllNotifications,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notification"] });
        },
    });
    return {readAllMutation,readMutation}
}