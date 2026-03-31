import { api } from "../../lib/api";

export const fetchMessages = async () => {
    const { data } = await api.get("/api/chat/messages");
    return data.data;
};

export const sendMessage = (text) => api.post("/api/chat/messages", { text });
