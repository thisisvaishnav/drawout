import { DrawCanvas } from "@/components/DrawCanvas";

export default async function CanvasPage({
    params
}: {
    params: {
        roomId: string;
    };
}) {
    const roomId = (await params).roomId;

    return <DrawCanvas roomId={roomId} />;
}






































