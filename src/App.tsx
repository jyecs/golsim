import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import gol from "./gol"
import Point from './point'
import { useRef, useEffect } from 'react'

function App() {
  const gameOfLife = gol();
  const cells = gameOfLife.getCells();
  const [ctx, setCtx] = useState(null);
  const canvasRef = useRef(null);

  const nextGeneration = () => {
    const change = gameOfLife.next();
    console.log(change);
    change.forEach((type: Boolean, cell: String) => {
      drawCell(ctx, cell, type);
    })
  }

  let gridIsDrawn = false;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    setCtx(ctx);
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width;
    const height = canvas.height;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    drawGrid(ctx, width, height);
    cells.forEach((cell: String) => {
        drawCell(ctx,cell,true);
    })
    ctx.fillStyle = "red";

    const scaleFactor = 20;
    ctx.fillRect((25 * scaleFactor) + 11,(16 * scaleFactor) + 11,18,18)

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
  const drawCell = (ctx: CanvasRenderingContext2D, cell: String, type: Boolean) => {
    const coords = cell.split(" ");
    const x = Number.parseInt(coords[0]);
    const y = Number.parseInt(coords[1]);
    const scaleFactor = 20;
    if (type) {
      ctx.fillStyle = "green";
      ctx.fillRect((x * scaleFactor) + 11,(y * scaleFactor) + 11,18,18);
    } else {
      ctx.fillStyle = "white";
      ctx.fillRect((x * scaleFactor) + 11,(y * scaleFactor) + 11,18,18);
    }
  }

  let tp1 = new Point(20,14);
  let tp2 = new Point(21,14);
  let tp3 = new Point(22,14);
  let tp4 = new Point(25,14);
  let tp5 = new Point(26,14);
  let tp6 = new Point(25,15);
  let tp7 = new Point(26,15);
  let tp8 = new Point(26,16);


  gameOfLife.preLoadPoints([tp1,tp2,tp3,tp4,tp5,tp6,tp7,tp8]);

  return (
    <>
      <canvas height="840" width="1040" ref={canvasRef}></canvas>
      <button onClick = {nextGeneration}>Next</button>
    </>
  )
}

export default App
