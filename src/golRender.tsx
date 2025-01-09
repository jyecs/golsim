import React from "react";
import { useRef, useEffect } from "react";

const Renderer = () => {

    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        ctx.fillStyle = "#000000";
        ctx.fillRect(10,10,150,150);
    },[])

    return(
        <canvas ref={canvasRef}></canvas>
    );
}

export default Renderer;