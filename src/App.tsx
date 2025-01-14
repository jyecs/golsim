import { useState } from 'react'
import './App.css'
import gol from "./gol"
import Point from './point'
import { useRef, useEffect } from 'react'
import preset from './preset'

function App() {
  const [gameOfLife, setGameOfLife] = useState(gol());
  const [ctx, setCtx] = useState(null);
  const canvasRef = useRef(null);
  const [isRunning, setIsRunning] = useState(false);
  const [presetGetter, setPresetGetter] = useState(preset());
  const [currentPreset, setCurrentPreset] = useState(presetGetter.getPreset("Diehard"));

  const nextGeneration = () => {
    const change = gameOfLife.next();
    console.log(change);
    change.forEach((type: Boolean, cell: String) => {
      drawCell(ctx, cell, type);
    })
  }


  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    setCtx(ctx);
    const width = canvas.width;
    const height = canvas.height;
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    drawBoard(currentPreset,ctx, width, height);

  },[]);

  const toggleDrawing = ()=> {
    setIsRunning(!isRunning);
  }

  const drawBoard = (points: Array<Point>, ctx: CanvasRenderingContext2D, width: number, height: number) => {
    gameOfLife.preLoadPoints(points);
    const cells = gameOfLife.getCells();

    drawGrid(ctx, width, height);
    cells.forEach((cell: String) => {
        drawCell(ctx,cell,true);
    })
  }

  useEffect(()=> {
    let drawing = null;
    console.log("called");
    if (isRunning) {
      drawing = setInterval(nextGeneration, 50);
    }
    return () => {
      if (isRunning) { clearInterval(drawing); }
    }

  },[isRunning, ctx])

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
  }

  const resetBoard = () => {
    const canvas = canvasRef.current;
    const width = canvas.width;
    const height = canvas.height;
    setIsRunning(false);
    gameOfLife.clear();
    resetCells();
    drawBoard(currentPreset,ctx, width, height);
  }

  const resetCells = () => {
    for (let x = 0; x < 51; x++) {
      for (let y = 0; y < 40; y++) {
        drawCell(ctx,`${x} ${y}`,false);
      }
    }
  }

  // Make sure that this is change later such that the cells draw okay.
  const drawCell = (ctx: CanvasRenderingContext2D, cell: String, type: Boolean) => {
    const coords = cell.split(" ");
    const x = Number.parseInt(coords[0]);
    const y = Number.parseInt(coords[1]);
    if (x > 50 || x < 0) { return; }
    if (y < 0 || y > 40) { return; }

    const scaleFactor = 20;
    if (type) {
      ctx.fillStyle = "green";
      ctx.fillRect((x * scaleFactor) + 11,(y * scaleFactor) + 11,18,18);
    } else {
      ctx.fillStyle = "white";
      ctx.fillRect((x * scaleFactor) + 11,(y * scaleFactor) + 11,18,18);
    }
  }

  return (
    <>
      <canvas height="840" width="1040" ref={canvasRef}></canvas>
      <button onClick = {nextGeneration}>Next</button>
      <button onClick = {toggleDrawing}>Toggle</button>
      <button onClick = {resetBoard}>Reset</button>
    </>
  )
}

export default App
