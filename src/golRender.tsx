import React from "react";
import "./App.css"
import { useRef, useEffect } from "react";

const Renderer = () => {

    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        const dpr = window.devicePixelRatio || 1;
        const width = canvas.width;
        const height = canvas.height;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        drawGrid(ctx);
        drawCell(ctx, 0, 0);
        drawCell(ctx, 1, 2);
        drawCell(ctx, 3, 4);



    },[])
    // 1000,800 grid
    const drawGrid = (ctx: CanvasRenderingContext2D) => {
        const width = 1040;
        const height  = 840;
        const padding = 10;

        ctx.lineWidth = 1;
        ctx.strokeStyle = "grey";
        for (let x = 0; x < width; x += 10 + padding) {
            ctx.beginPath();
            ctx.moveTo(x + padding, padding);
            ctx.lineTo(x + padding, height - padding);
            ctx.closePath();
            ctx.stroke();
        }

        for (let y = 0; y < height; y+= 10 + padding) {
            ctx.beginPath();
            ctx.moveTo(padding, y + padding);
            ctx.lineTo(width - padding, y + padding)
            ctx.closePath();
            ctx.stroke()
        }
    }

    const drawCell = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
        ctx.fillStyle = "green";
        const scaleFactor = 20;
        ctx.fillRect((x * scaleFactor) + 10,(y * scaleFactor) + 10,20,20);
    }

    return(
        <canvas height="840" width="1040" ref={canvasRef}></canvas>
    );
}

export default Renderer;