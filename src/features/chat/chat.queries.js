import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchMessages, sendMessage } from "./chat.api";

export const useMessages = () =>
    useQuery({
        queryKey: ["messages"],
        queryFn: fetchMessages,
        refetchInterval: 3000, // Polling every 3 seconds as a simple real-time fallback
    });

export const useSendMessage = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: sendMessage,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["messages"] });
        },
    });
};
