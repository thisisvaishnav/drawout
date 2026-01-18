"use client";

import { useEffect, useRef, useState } from "react";

type Point = {
    x: number;
    y: number;
};

type Rect = {
    x: number;
    y: number;
    width: number;
    height: number;
};

type Circle = {
    x: number;
    y: number;
    radius: number;
};

type ShapeType = "rectangle" | "circle";

type DrawCanvasProps = {
    roomId: string;
};

const CANVAS_SIZE = 1000;

export const DrawCanvas = ({ roomId }: DrawCanvasProps) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const startPointRef = useRef<Point | null>(null);
    const isDrawingRef = useRef(false);
    const rectanglesRef = useRef<Rect[]>([]);
    const circlesRef = useRef<Circle[]>([]);
    const [activeShape, setActiveShape] = useState<ShapeType>("rectangle");
    const activeShapeRef = useRef<ShapeType>("rectangle");

    const drawScene = (previewRect?: Rect, previewCircle?: Circle) => {
        const canvas = canvasRef.current;
        if (!canvas) {
            return;
        }

        const ctx = canvas.getContext("2d");
        if (!ctx) {
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = "#f8fafc";
        ctx.lineWidth = 2;
        rectanglesRef.current.forEach(rect => {
            ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
        });

        circlesRef.current.forEach(circle => {
            ctx.beginPath();
            ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
            ctx.stroke();
        });

        if (previewRect) {
            ctx.setLineDash([6, 4]);
            ctx.strokeStyle = "#818cf8";
            ctx.strokeRect(
                previewRect.x,
                previewRect.y,
                previewRect.width,
                previewRect.height
            );
            ctx.setLineDash([]);
        }

        if (previewCircle) {
            ctx.setLineDash([6, 4]);
            ctx.strokeStyle = "#a5b4fc";
            ctx.beginPath();
            ctx.arc(previewCircle.x, previewCircle.y, previewCircle.radius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);
        }
    };

    const getCanvasPoint = (event: MouseEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) {
            return null;
        }

        const rect = canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    };

    const getRectFromPoints = (start: Point, end: Point): Rect => {
        const x = Math.min(start.x, end.x);
        const y = Math.min(start.y, end.y);
        const width = Math.abs(end.x - start.x);
        const height = Math.abs(end.y - start.y);
        return { x, y, width, height };
    };

    const getCircleFromPoints = (start: Point, end: Point): Circle => {
        const radius = Math.sqrt((end.x - start.x) ** 2 + (end.y - start.y) ** 2);
        return {
            x: start.x,
            y: start.y,
            radius
        };
    };

    const handleMouseDown = (event: MouseEvent) => {
        const point = getCanvasPoint(event);
        if (!point) {
            return;
        }

        startPointRef.current = point;
        isDrawingRef.current = true;
    };

    const handleMouseMove = (event: MouseEvent) => {
        if (!isDrawingRef.current || !startPointRef.current) {
            return;
        }

        const point = getCanvasPoint(event);
        if (!point) {
            return;
        }

        if (activeShapeRef.current === "rectangle") {
            const previewRect = getRectFromPoints(startPointRef.current, point);
            drawScene(previewRect);
            return;
        }

        const previewCircle = getCircleFromPoints(startPointRef.current, point);
        drawScene(undefined, previewCircle);
    };

    const handleMouseUp = (event: MouseEvent) => {
        if (!isDrawingRef.current || !startPointRef.current) {
            return;
        }

        const point = getCanvasPoint(event);
        if (!point) {
            return;
        }

        if (activeShapeRef.current === "rectangle") {
            const rect = getRectFromPoints(startPointRef.current, point);
            if (rect.width > 4 && rect.height > 4) {
                rectanglesRef.current = [...rectanglesRef.current, rect];
            }
        } else {
            const circle = getCircleFromPoints(startPointRef.current, point);
            if (circle.radius > 4) {
                circlesRef.current = [...circlesRef.current, circle];
            }
        }

        startPointRef.current = null;
        isDrawingRef.current = false;
        drawScene();
    };

    const handleMouseLeave = () => {
        if (!isDrawingRef.current) {
            return;
        }

        startPointRef.current = null;
        isDrawingRef.current = false;
        drawScene();
    };

    const handleSave = () => {
        const canvas = canvasRef.current;
        if (!canvas) {
            return;
        }

        const url = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = url;
        link.download = `canvas-${roomId}.png`;
        link.click();
    };

    const handleButtonKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
        if (event.key !== "Enter" && event.key !== " ") {
            return;
        }

        event.preventDefault();
        handleSave();
    };

    const handleShapeSelect = (shape: ShapeType) => {
        setActiveShape(shape);
        activeShapeRef.current = shape;
    };

    const handleShapeKeyDown = (
        event: React.KeyboardEvent<HTMLButtonElement>,
        shape: ShapeType
    ) => {
        if (event.key !== "Enter" && event.key !== " ") {
            return;
        }

        event.preventDefault();
        handleShapeSelect(shape);
    };

    useEffect(() => {
        drawScene();

        const canvas = canvasRef.current;
        if (!canvas) {
            return;
        }

        const handleMouseDownBound = (event: MouseEvent) => handleMouseDown(event);
        const handleMouseMoveBound = (event: MouseEvent) => handleMouseMove(event);
        const handleMouseUpBound = (event: MouseEvent) => handleMouseUp(event);
        const handleMouseLeaveBound = () => handleMouseLeave();

        canvas.addEventListener("mousedown", handleMouseDownBound);
        canvas.addEventListener("mousemove", handleMouseMoveBound);
        canvas.addEventListener("mouseup", handleMouseUpBound);
        canvas.addEventListener("mouseleave", handleMouseLeaveBound);

        return () => {
            canvas.removeEventListener("mousedown", handleMouseDownBound);
            canvas.removeEventListener("mousemove", handleMouseMoveBound);
            canvas.removeEventListener("mouseup", handleMouseUpBound);
            canvas.removeEventListener("mouseleave", handleMouseLeaveBound);
        };
    }, []);

    return (
        <div className="flex min-h-screen w-full flex-col items-center gap-4 bg-slate-950 px-4 py-8 text-white">
            <div className="w-full max-w-5xl">
                <h1 className="text-2xl font-semibold">Canvas Room {roomId}</h1>
                <p className="mt-1 text-sm text-white/70">
                    Select a shape, then drag on the canvas to draw it.
                </p>
            </div>

            <div className="flex w-full max-w-5xl flex-wrap gap-3">
                <button
                    type="button"
                    onClick={() => handleShapeSelect("rectangle")}
                    onKeyDown={event => handleShapeKeyDown(event, "rectangle")}
                    className={`rounded-lg border px-4 py-2 text-sm font-semibold transition-colors ${
                        activeShape === "rectangle"
                            ? "border-indigo-300 bg-indigo-500 text-white"
                            : "border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
                    }`}
                    aria-label="Select rectangle tool"
                    tabIndex={0}
                >
                    Rectangle
                </button>
                <button
                    type="button"
                    onClick={() => handleShapeSelect("circle")}
                    onKeyDown={event => handleShapeKeyDown(event, "circle")}
                    className={`rounded-lg border px-4 py-2 text-sm font-semibold transition-colors ${
                        activeShape === "circle"
                            ? "border-indigo-300 bg-indigo-500 text-white"
                            : "border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
                    }`}
                    aria-label="Select circle tool"
                    tabIndex={0}
                >
                    Circle
                </button>
            </div>

            <canvas
                ref={canvasRef}
                width={CANVAS_SIZE}
                height={CANVAS_SIZE}
                className="w-full max-w-5xl rounded-xl border border-white/10 bg-slate-900 shadow-2xl"
                aria-label="Drawing canvas"
                tabIndex={0}
            />

            <button
                type="button"
                onClick={handleSave}
                onKeyDown={handleButtonKeyDown}
                className="rounded-lg bg-indigo-500 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                aria-label="Save canvas as image"
                tabIndex={0}
            >
                Save
            </button>
        </div>
    );
};

