import React from "react";
import "./App.css"
import { useRef, useEffect } from "react";

const Renderer = () => {

    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        drawGrid(ctx);
        drawCell(ctx, 500, 250);



    },[])
    // 1000,800 grid
    // what type is a canvas context???
    const drawGrid = (ctx) => {
        const width = 1000;
        const height  = 800;
        const padding = 5;
        ctx.lineWidth = 1;
        ctx.strokeStyle = "grey";
        for (let x = 0; x <= width; x += 10) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.closePath();
            ctx.stroke();
        }

        for (let y = 0; y <= height; y+= 10) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y)
            ctx.closePath();
            ctx.stroke()
        }
    }

    const drawCell = (ctx, x, y) => {
        ctx.strokeStyle = "black";
        ctx.fillStyle = "green";
        ctx.fillRect(x+0.6,y+0.6,8.3,8.3);
    }

    return(
        <canvas height="800" width="1000" ref={canvasRef}></canvas>
    );
}

export default Renderer;