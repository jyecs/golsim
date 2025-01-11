import React from "react";
import "./App.css"
import { useRef, useEffect } from "react";

const Renderer = () => {

    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        drawGrid(ctx);



    },[])
    // 1000,800 grid
    // what type is a canvas context???
    const drawGrid = (ctx) => {
        const width = 1000;
        const height  = 800;
        const padding = 5;
        for (let x = 0; x <= width; x += 10) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
        }

        for (let y = 0; y < height; y+= 10) {
            ctx.moveTo(0, y);
            ctx.lineTo(width, y)
        }
        ctx.lineWidth = 2;
        ctx.strokeStyle = "black";
        ctx.stroke();
    }

    return(
        <canvas height="800" width="1000" ref={canvasRef}></canvas>
    );
}

export default Renderer;