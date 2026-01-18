import { AuthGate } from "@/components/AuthGate";
import { DrawCanvas } from "@/components/DrawCanvas";

export default async function CanvasPage({
    params
}: {
    params: {
        roomId: string;
    };
}) {
    const roomId = (await params).roomId;

    return (
        <AuthGate>
            <DrawCanvas roomId={roomId} />
        </AuthGate>
    );
}






































