import { useEffect, useRef, useState } from "react";
import { useAuth } from "../features/auth/useAuth";
import { useMessages, useSendMessage } from "../features/chat/chat.queries";

const ChatPage = () => {
    const { user } = useAuth();
    const { data: messages = [], isLoading } = useMessages();
    const sendMessageMutation = useSendMessage();
    const [inputText, setInputText] = useState("");
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        sendMessageMutation.mutate(inputText, {
            onSuccess: () => {
                setInputText("");
            },
        });
    };

    if (isLoading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-zinc-950 border-opacity-20"></div>
        </div>
    );

    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-500">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-black text-zinc-950 uppercase tracking-tighter">Внутрішній чат</h1>
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-1">Спілкування між персоналом системи</p>
            </div>

            <div className="bg-white shadow-2xl h-[65vh] rounded-2xl flex flex-col border border-zinc-200 overflow-hidden">
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-zinc-50/30 custom-scrollbar">
                    {messages.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-zinc-300 space-y-3 opacity-40">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em]">Повідомлень поки немає</p>
                        </div>
                    )}
                    {messages.map((msg) => {
                        const isMe = msg.sender === user?.id || msg.senderName === user?.email?.split("@")[0];
                        return (
                            <div
                                key={msg._id || msg.id}
                                className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                            >
                                <div className={`flex items-center space-x-2 mb-1.5 px-2 ${isMe ? "flex-row-reverse space-x-reverse" : ""}`}>
                                    <span className="text-[10px] font-black text-zinc-950 uppercase tracking-wider">
                                        {isMe ? "Ви" : msg.senderName}
                                    </span>
                                    <div className="w-1 h-1 rounded-full bg-zinc-200"></div>
                                    <span className="text-[9px] font-bold text-zinc-400">
                                        {new Date(msg.createdAt).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            hour12: false
                                        })}
                                    </span>
                                </div>
                                <div
                                    className={`max-w-[80%] px-5 py-3 shadow-sm text-sm font-medium ${isMe
                                        ? "bg-zinc-950 text-white rounded-2xl rounded-tr-none shadow-zinc-200"
                                        : "bg-white text-zinc-900 rounded-2xl rounded-tl-none border border-zinc-100"
                                        }`}
                                >
                                    <p className="leading-relaxed">{msg.text}</p>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-6 border-t border-zinc-100 bg-white">
                    <form
                        onSubmit={handleSendMessage}
                        className="flex gap-3"
                    >
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Напишіть повідомлення..."
                            className="flex-1 input-shad !h-14 font-medium px-6"
                            disabled={sendMessageMutation.isLoading}
                        />
                        <button
                            type="submit"
                            disabled={!inputText.trim() || sendMessageMutation.isLoading}
                            className="btn-shad-primary h-14 w-14 !p-0 shadow-xl flex items-center justify-center group"
                        >
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="20" 
                                height="20" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="3" 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                            >
                                <line x1="22" x2="11" y1="2" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
