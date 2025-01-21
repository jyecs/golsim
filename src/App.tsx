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
  const [movedDuringDrag, setMovedDuringDrag] = useState(false);
  const animationFrameRef = useRef<number | null>(null);
  const lastUpdateTime = useRef(0);

  // Responsible for actually driving the requestAnimationFrame function
  // TODO: Make it such that you can change how fast you can animate.
  const nextGeneration = (timestamp: number) => {
    if (isRunning) {
      const timeTillLastAnimation = timestamp - lastUpdateTime.current;
      if (timeTillLastAnimation >= 100) {
        gameOfLife.next();
        lastUpdateTime.current = timestamp;
        setNumGenerations((prev) => prev + 1);
      }
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    drawBoard(ctx);

    animationFrameRef.current = requestAnimationFrame(nextGeneration);
  }

  // Advances the generation one time
  const oneNextGeneration = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    setNumGenerations((prev) => prev + 1);

    gameOfLife.next();
    drawBoard(ctx);
  }

  // On first load, makes sure all the variables are set right.
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

  },[]);

  // Gives the canvas the ability to auto-draw
  // Tries to make sure that there are no animationframe objects left to lag grid.
  useEffect(() => {
    if (isRunning) {
      animationFrameRef.current = requestAnimationFrame(nextGeneration);
    } else if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    const ctx = canvasRef.current.getContext("2d");
    drawBoard(ctx);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
  }, [offset, isRunning])

  // Figure out where the cell coordinates are relative to the offset.
  // Converts coordinates on grid to cell coordinates
  const handleClick = (event) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    let x = (event.clientX - rect.left);
    let y = (event.clientY - rect.top);
    x = Math.floor((x - offset.x) / 20);
    y = Math.floor((y - offset.y) / 20);
    handleClickToPoint(x,y,ctx);
  }

  // Add / Remove the cell to the game of life DS.
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

  // Use preset selected from the dropdown.
  const handleDropdownSelect = (preset: string) => {
    setPresetName(preset);
    presetGetter.setCurrentPreset(preset);
    resetBoard();
  }

  // Start offset calculation.
  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    setLastMousePosition({x: e.clientX, y: e.clientY});
    setMovedDuringDrag(false);
  }

  // If mouse was not dragged, treat it as if it was a click.
  // Reset a variable used to calculate drag distance
  const handleMouseUp = (e: React.MouseEvent) => {
    setDragging(false);
    if (!movedDuringDrag) {
      handleClick(e);
    }
    setLastMousePosition(null);
  }

  // Calculates the drag distance so we know how much to change the offset.
  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragging && lastMousePosition) {
      const deltaX = e.clientX - lastMousePosition.x;
      const deltaY = e.clientY - lastMousePosition.y;

      if(Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) { setMovedDuringDrag(true); }

      setOffset((prev) => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));

      setLastMousePosition({x: e.clientX, y: e.clientY})
    }
  }

  // Switches between auto-drawing or not drawing.
  const toggleDrawing = ()=> {
    (playButton === "Start") ? setPlayButton("Pause") : setPlayButton("Start")
    setIsRunning((prev) => !prev);
  }

  // Draws the board (calls grid and cell)
  const drawBoard = (ctx: CanvasRenderingContext2D) => {
    const cells = gameOfLife.getCells();

    drawGrid(ctx, offset.x, offset.y);
    cells.forEach((cell: string) => {
        drawCell(ctx,cell,true);
    })
  }

  // Draws the grid
  const drawGrid = (ctx: CanvasRenderingContext2D, offsetX: number, offsetY: number) => {
    const height = ctx.canvas.height;
    const width = ctx.canvas.width;
    const gridSize = 20;
    const padding = 0;

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

  // Resets the entire board, moves everything back to center.
  const resetBoard = () => {
    setOffset({x:0,y:0})
    setNumGenerations(0);
    setIsRunning(false);
    gameOfLife.clear();
    gameOfLife.preLoadPoints(presetGetter.getCurrentPreset());
    setPlayButton("Start");
    drawBoard(ctx);
  }

  // Entirely clears the board, and removes all cells from the game.
  const clearBoard = () => {
    setOffset({x:0, y:0});
    setNumGenerations(0);
    gameOfLife.clear();
    setIsRunning(false);
    setPlayButton("Start");
    drawBoard(ctx);
  }

  // Draws a cell,
  // TODO: Change gridSize to be an actual useState variable.
  const drawCell = (ctx: CanvasRenderingContext2D, cell: String, type: Boolean) => {
    const coords = cell.split(" ");
    const gridSize = 20
    const x = (Number.parseInt(coords[0]) * gridSize) + offset.x + 1;
    const y = (Number.parseInt(coords[1]) * gridSize) + offset.y + 1;

    if (type) {
      ctx.fillStyle = "green";
      ctx.fillRect(x, y, 18, 18);
    } else {
      ctx.fillStyle = "lightgrey";
      ctx.fillRect(x, y, 18, 18);
    }
  }

  return (
    <div className="MainContainer">
      <canvas height="840" width="1040" ref={canvasRef} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove}
       onMouseUp={handleMouseUp}></canvas>
      <div className="RightContainer">
        <h1>
          <div>Conway's</div>
          <div>Game of Life</div>
        </h1>
        <div>
          <div className="ControlContainer">
            <Button size="lg" onClick = {oneNextGeneration}>Next</Button>
            <Button size="lg" onClick = {toggleDrawing}>{playButton}</Button>
            <Button size="lg" onClick = {clearBoard}>Clear</Button>
          </div>
          <div className="PresetController">
            <PresetDropdown presets={presetGetter.listPrests()} onSelect={handleDropdownSelect} currPreset={presetName}></PresetDropdown>
            <Button size="lg" onClick = {resetBoard}>Reset</Button>
          </div>
          <div className="Generations">Generations: {numGenerations}</div>
        </div>
      </div>
    </div>
  )
}

export default App
