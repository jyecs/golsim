import React from "react";
import "./App.css"
import { useRef, useEffect } from "react";
import Point from "./point";

const Renderer = ({ cells }) => {

    const canvasRef = useRef(null);
    let gridIsDrawn = false;

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

        drawGrid(ctx, width, height);
        cells.forEach((cell: String) => {
            const coords = cell.split(" ");
            const x = Number.parseInt(coords[0]);
            const y = Number.parseInt(coords[1]);

            drawCell(ctx,x,y);
        })
        console.log("Effect was called!")

    },[cells]);
    // 1000,800 grid
    const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
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
        gridIsDrawn = true;
    }

    // Make sure that this is change later such that the cells draw okay.
    const drawCell = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
        ctx.fillStyle = "green";
        const scaleFactor = 20;
        ctx.fillRect((x * scaleFactor) + 11,(y * scaleFactor) + 11,18,18);
    }

    return(
        <canvas height="840" width="1040" ref={canvasRef}></canvas>
    );
}

export default Renderer;