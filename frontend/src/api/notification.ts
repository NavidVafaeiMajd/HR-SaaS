import api from "./axios";

export const readNotification = async (id: string) => {
    await api.put(`/notification/${id}/read`);
};

export const readAllNotifications = async () => {
    await api.put("/notification/read-all");
};