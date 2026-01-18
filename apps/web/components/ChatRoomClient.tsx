"use client";

import { useEffect, useState, useRef } from "react";
import { useSocket } from "../app/hook/userSocket";

type ChatMessage = {
    id?: number;
    message: string;
    oderId?: string;
};

export function ChatRoomClient({
    messages,
    id
}: {
    messages: ChatMessage[];
    id: string;
}) {
    const [chats, setChats] = useState<ChatMessage[]>(messages || []);
    const [currentMessage, setCurrentMessage] = useState("");
    const { socket, loading } = useSocket();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when new messages arrive
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chats]);

    useEffect(() => {
        if (!socket || loading) return;
        if (socket.readyState !== WebSocket.OPEN) return;

        console.log("Joining room:", id);
        socket.send(JSON.stringify({
            type: "join_room",
            roomId: id
        }));

        socket.onmessage = (event: MessageEvent<string>) => {
            console.log("Message received:", event.data);
            const parsedData = JSON.parse(event.data);
            if (parsedData.type === "chat") {
                setChats(c => [...c, { message: parsedData.message }]);
                scrollToBottom();
            }
        };
    }, [socket, loading, id]);

    const handleSendMessage = () => {
        console.log("=== SEND BUTTON CLICKED ===");
        console.log("currentMessage:", currentMessage);
        console.log("socket:", socket);
        console.log("socket.readyState:", socket?.readyState);
        console.log("room id:", id, "type:", typeof id);
        
        if (!currentMessage.trim()) {
            console.log("❌ Message is empty");
            return;
        }
        
        if (!socket) {
            console.log("❌ Socket is null");
            alert("Socket not connected!");
            return;
        }
        
        if (socket.readyState !== WebSocket.OPEN) {
            console.log("❌ Socket not open, state:", socket.readyState);
            alert("Socket not open! State: " + socket.readyState);
            return;
        }

        const payload = {
            type: "chat",
            message: currentMessage,
            roomId: id
        };
        console.log("✓ Sending:", JSON.stringify(payload));
        
        socket.send(JSON.stringify(payload));
        console.log("✓ Message sent!");

        setCurrentMessage("");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSendMessage();
        }
    };

    return (
        <div className="flex flex-col h-screen max-w-2xl mx-auto p-4">
            <h2 className="text-xl font-bold mb-4">Chat Room</h2>
            
            {/* Debug info - remove in production */}
            <div className="text-xs bg-yellow-100 p-2 rounded mb-2">
                <p>Room ID: {id}</p>
                <p>Socket: {socket ? "exists" : "null"}</p>
                <p>Socket state: {socket?.readyState} (0=CONNECTING, 1=OPEN, 2=CLOSING, 3=CLOSED)</p>
                <p>Loading: {loading ? "true" : "false"}</p>
            </div>
            
            {/* Messages container */}
            <div className="flex-1 overflow-y-auto border rounded-lg p-4 mb-4 bg-gray-50">
                {chats.length === 0 ? (
                    <p className="text-gray-500 text-center">No messages yet. Start the conversation!</p>
                ) : (
                    chats.map((m, index) => (
                        <div
                            key={m.id || `msg-${index}`}
                            className="p-2 mb-2 bg-white rounded shadow-sm"
                        >
                            {m.message}
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="flex gap-2">
                <input
                    type="text"
                    value={currentMessage}
                    onChange={e => setCurrentMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Message input"
                />
                <button
                    onClick={handleSendMessage}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    aria-label="Send message"
                >
                    Send
                </button>
            </div>

            {loading && (
                <p className="text-sm text-gray-500 mt-2">Connecting to chat...</p>
            )}
        </div>
    );
}