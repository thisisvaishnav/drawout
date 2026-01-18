import { ChatRoom } from "../../../components/CharRoom";
import axios from "axios";  
import { AUTH_TOKEN, BACKEND_URL } from "../../room/config";

async function getRoomId(slug: string) {
    try {
        const response = await axios.get(`${BACKEND_URL}/room/${slug}`);
        return response.data.room?.id;
    } catch (error) {
        console.error("Failed to get room:", error);
        return null;
    }
}

async function createRoom(slug: string) {
    try {
        const response = await axios.post(
            `${BACKEND_URL}/room`,
            { name: slug },
            {
                headers: {
                    authorization: AUTH_TOKEN
                }
            }
        );
        return response.data.roomId ?? null;
    } catch (error) {
        console.error("Failed to create room:", error);
        return null;
    }
}

export default async function({
    params
}: {
    params: {
        slug: string
    }
}) {
    const slug = (await params).slug;
    const existingRoomId = await getRoomId(slug);
    if (existingRoomId) {
        return <ChatRoom id={existingRoomId} />;
    }

    const createdRoomId = await createRoom(slug);
    if (!createdRoomId) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-2xl font-bold text-red-500">Room unavailable</h1>
                <p className="text-gray-600 mt-2">Could not create or load "{slug}".</p>
            </div>
        );
    }

    return <ChatRoom id={createdRoomId} />;
}
