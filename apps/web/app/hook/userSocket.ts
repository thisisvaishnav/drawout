import { useEffect, useRef, useState } from "react";
import { AUTH_TOKEN, WS_URL } from "../room/config";   

export function useSocket() {
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const socketRef = useRef<WebSocket | null>(null);
    const isConnecting = useRef(false);

    useEffect(() => {
        // Prevent multiple connections (React Strict Mode runs useEffect twice)
        if (socketRef.current || isConnecting.current) {
            return;
        }

        isConnecting.current = true;

        const ws = new WebSocket(`${WS_URL}?token=${AUTH_TOKEN}`);
        
        ws.onopen = () => {
            console.log("WebSocket connected!");
            socketRef.current = ws;
            setSocket(ws);
            setLoading(false);
            isConnecting.current = false;
        };

        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
            isConnecting.current = false;
        };

        ws.onclose = () => {
            console.log("WebSocket closed");
            socketRef.current = null;
            setSocket(null);
            setLoading(true);
            isConnecting.current = false;
        };

        // Cleanup function - DON'T close the socket here in dev mode
        // Only close if component truly unmounts (not Strict Mode re-render)
        return () => {
            // We keep the connection alive
        };
    }, []);

    return {
        socket,
        loading
    };
}