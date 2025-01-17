import { useState } from 'react'
import gol from "./gol"
import Point from './point'
import { useRef, useEffect } from 'react'
import preset from './preset'
import PresetDropdown from './presetDropdown'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import Button from 'react-bootstrap/Button'

function App() {
  const [gameOfLife, setGameOfLife] = useState(gol());
  const [ctx, setCtx] = useState(null);
  const canvasRef = useRef(null);
  const [isRunning, setIsRunning] = useState(false);
  const [presetGetter, setPresetGetter] = useState(preset());
  const [presetName, setPresetName] = useState<string>("Presets")
  const [playButton, setPlayButton] = useState<string>("Start");
  const [numGenerations, setNumGenerations] = useState<number>(0);
  const [offset, setOffset] = useState({x: 0, y: 0});
  const [dragging, setDragging] = useState(false);
  const [lastMousePosition, setLastMousePosition] = useState<{x: number; y: number} | null>(null);

  const nextGeneration = () => {
    const change = gameOfLife.next();
    setNumGenerations((prev) => prev + 1);
    change.forEach((type: Boolean, cell: string) => {
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
    gameOfLife.preLoadPoints(presetGetter.getCurrentPreset());
    const eventWrapper = (event) => {
      handleClick(event, ctx);
    }
    canvas.addEventListener("click", eventWrapper);

    return () => {
      canvas.removeEventListener("click", eventWrapper);
    }


  },[]);

  useEffect(()=> {
    let drawing = null;
    if (isRunning) {
      drawing = setInterval(nextGeneration, 100);
    }
    return () => {
      clearInterval(drawing)
    }

  },[isRunning])

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    drawBoard(ctx, offset.x, offset.y);
  }, [offset])

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
    if (gameOfLife.getCells().has(coords)) {
      gameOfLife.deletePoint(cell);
      drawCell(ctx, coords, false);
    } else {
      gameOfLife.addPoint(cell);
      drawCell(ctx, coords, true);
    }
  }

  const handleDropdownSelect = (preset: string) => {
    setPresetName(preset);
    presetGetter.setCurrentPreset(preset);
    resetBoard();
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    setLastMousePosition({x: e.clientX, y: e.clientY});
  }

  const handleMouseUp = () => {
    setDragging(false);
    setLastMousePosition(null);
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragging && lastMousePosition) {
      const deltaX = e.clientX - lastMousePosition.x;
      const deltaY = e.clientY - lastMousePosition.y;

      setOffset((prev) => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));

      setLastMousePosition({x: e.clientX, y: e.clientY})
    }
  }

  const toggleDrawing = ()=> {
    (playButton === "Start") ? setPlayButton("Pause") : setPlayButton("Start")
    setIsRunning(!isRunning);
  }

  const drawBoard = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const cells = gameOfLife.getCells();

    drawGrid(ctx, width, height);
    cells.forEach((cell: string) => {
        drawCell(ctx,cell,true);
    })
  }


  // 1000,800 grid
  const drawGrid = (ctx: CanvasRenderingContext2D, offsetX: number, offsetY: number) => {
    const height = ctx.canvas.height;
    const width = ctx.canvas.width;
    const gridSize = 20;
    const padding = 10;

    ctx.clearRect(0,0, width, height);
    const startX = (offsetX % gridSize) + padding;
    const startY = (offsetY % gridSize) + padding;

    ctx.lineWidth = 1;
    ctx.strokeStyle = "grey";
    for (let x = startX; x < width - padding; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.closePath();
      ctx.stroke();
    }
    for (let y = startY; y < height - padding; y+= gridSize) {
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y)
      ctx.closePath();
      ctx.stroke()
    }
  }

  const resetBoard = () => {
    const canvas = canvasRef.current;
    const width = canvas.width;
    const height = canvas.height;
    setNumGenerations(0);
    setIsRunning(false);
    gameOfLife.clear();
    resetCells();
    setPlayButton("Start");
    drawBoard(ctx, width, height);
  }

  const clearBoard = () => {
    setNumGenerations(0);
    gameOfLife.clear();
    setIsRunning(false);
    setPlayButton("Start");
    resetCells();
  }

  const resetCells = () => {
    for (let x = 0; x < 51; x++) {
      for (let y = 0; y < 41; y++) {
        drawCell(ctx,`${x} ${y}`,false);
      }
    }
  }

  // Make sure that this is change later such that the cells draw okay.
  const drawCell = (ctx: CanvasRenderingContext2D, cell: String, type: Boolean) => {
    const coords = cell.split(" ");
    const x = Number.parseInt(coords[0]) + offset.x;
    const y = Number.parseInt(coords[1]) + offset.y;
    if (x > 50 || x < 0) { return; }
    if (y < 0 || y > 40) { return; }

    const scaleFactor = 20;
    if (type) {
      ctx.fillStyle = "green";
      ctx.fillRect((x * scaleFactor) + 11,(y * scaleFactor) + 11,18,18);
    } else {
      ctx.fillStyle = "lightgrey";
      ctx.fillRect((x * scaleFactor) + 11,(y * scaleFactor) + 11,18,18);
    }
  }

  return (
    <div className="MainContainer">
      <canvas height="840" width="1040" ref={canvasRef} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove}
       onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}></canvas>
      <div className="RightContainer">
        <h1>
          <div>Conway's</div>
          <div>Game of Life</div>
        </h1>
        <div>
          <div className="ControlContainer">
            <Button size="lg" onClick = {nextGeneration}>Next</Button>
            <Button size="lg" onClick = {toggleDrawing}>{playButton}</Button>
            <Button size="lg" onClick = {clearBoard}>Clear</Button>
          </div>
          <div className="Separator"></div>
          <div className="PresetController">
            <PresetDropdown presets={presetGetter.listPrests()} onSelect={handleDropdownSelect} currPreset={presetName}></PresetDropdown>
            <Button size="lg" onClick = {resetBoard}>Reset</Button>
          </div>
          <div>Generations: {numGenerations}</div>
        </div>
      </div>
    </div>
  )
}

export default App
