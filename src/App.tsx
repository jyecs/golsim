import { useState } from 'react'
import './App.css'
import gol from "./gol"
import Point from './point'
import { useRef, useEffect } from 'react'
import preset from './preset'
import PresetDropdown from './presetDropdown'
import 'bootstrap/dist/css/bootstrap.min.css'
import Button from 'react-bootstrap/Button'

function App() {
  const [gameOfLife, setGameOfLife] = useState(gol());
  const [ctx, setCtx] = useState(null);
  const canvasRef = useRef(null);
  const [isRunning, setIsRunning] = useState(false);
  const [presetGetter, setPresetGetter] = useState(preset());
  const [presetName, setPresetName] = useState<string>("Acorn")

  const nextGeneration = () => {
    const change = gameOfLife.next();
    change.forEach((type: Boolean, cell: string) => {
      drawCell(ctx, cell, type);
    })
  }


  useEffect(() => {
    console.log("First effect called");
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    setCtx(ctx);
    const width = canvas.width;
    const height = canvas.height;
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const eventWrapper = (event) => {
      handleClick(event, ctx);
    }
    canvas.addEventListener("click", eventWrapper);
    drawBoard(presetGetter.getCurrentPreset(),ctx, width, height);

    return () => {
      canvas.removeEventListener("click", eventWrapper);
    }


  },[]);

  useEffect(()=> {
    let drawing = null;
    if (isRunning) {
      drawing = setInterval(nextGeneration, 50);
    }
    return () => {
      clearInterval(drawing)
    }

  },[isRunning])

  const handleClick = (event, ctx: CanvasRenderingContext2D) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    let x = (event.clientX - rect.left);
    let y = (event.clientY - rect.top);
    x = Math.ceil((x - 10)/20) - 1; // Padding = 10, Each cell size = 20, correcting it so that coords are centered at (0,0);
    y = Math.ceil((y - 10)/20) - 1;
    handleClickToPoint(x,y,ctx);
  }

  const handleClickToPoint = (x:number, y:number, ctx: CanvasRenderingContext2D) => {
    const cell = new Point(x,y);
    const coords = cell.toStringKey();
    console.log(cell);
    console.log(coords);
    if (gameOfLife.getCells().has(coords)) {
      console.log("Does not have in GoL");
      gameOfLife.deletePoint(cell);
      drawCell(ctx, coords, false);
    } else {
      console.log("Does exist in GoL");
      gameOfLife.addPoint(cell);
      drawCell(ctx, coords, true);
    }
  }

  const handleDropdownSelect = (preset: string) => {
    setPresetName(preset);
    presetGetter.setCurrentPreset(preset);
    resetBoard();
  }

  const toggleDrawing = ()=> {
    setIsRunning(!isRunning);
  }

  const drawBoard = (points: Array<Point>, ctx: CanvasRenderingContext2D, width: number, height: number) => {
    console.log("Drawn");
    gameOfLife.preLoadPoints(points);
    const cells = gameOfLife.getCells();

    drawGrid(ctx, width, height);
    cells.forEach((cell: string) => {
        drawCell(ctx,cell,true);
    })
  }


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
    console.log("called");
    const canvas = canvasRef.current;
    const width = canvas.width;
    const height = canvas.height;
    setIsRunning(false);
    gameOfLife.clear();
    resetCells();
    console.log(presetGetter.getCurrentPreset());
    drawBoard(presetGetter.getCurrentPreset(),ctx, width, height);
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
      <Button onClick = {nextGeneration}>Next</Button>
      <Button onClick = {toggleDrawing}>Toggle</Button>
      <Button onClick = {resetBoard}>Reset</Button>
      <PresetDropdown presets={presetGetter.listPrests()} onSelect={handleDropdownSelect} currPreset={presetName}></PresetDropdown>
    </>
  )
}

export default App
