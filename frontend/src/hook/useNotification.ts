import { useQuery } from "@tanstack/react-query";
import api from "@/api/axios";

export interface Notification {
   id: string;
   title: string;
   message: string;
   url?: string;
   isRead: boolean;
   createdAt: string;
}

export interface NotificationResponse {
   items: Notification[];
   count: number;
   unreadCount: number;
}

export const getNotifications = async (): Promise<NotificationResponse> => {
   const { data } = await api.get("/notification");

   return data;
};

export const useNotification = () => {
   return useQuery({
      queryKey: ["notification"],
      queryFn: getNotifications,
      staleTime: 5 * 60_000,
      refetchOnWindowFocus: false,
   });
};


