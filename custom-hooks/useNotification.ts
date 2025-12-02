import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getNotifications, markAllNotificationsAsRead } from "../services/notification";

export function useGetNotifications(){
    return useQuery({
        queryFn:getNotifications,
        queryKey:["notifications"],
        staleTime:30 * 60 * 1000
    })
}

export function useMarkAllNotificationsAsRead(){
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn:markAllNotificationsAsRead,
        onSuccess:() => {
            queryClient.invalidateQueries({queryKey:["notifications"]})
        }
    })
}