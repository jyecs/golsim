import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import gol from "./gol"
import Point from './point'
import Renderer from './golRender'

function App() {
  const gameOfLife = gol();
  const [cells, setCells] = useState(gameOfLife.getCells());

  const nextGeneration = () => {
    gameOfLife.next();
    const nextGen = gameOfLife.getCells();
    setCells(nextGen);
    console.log(gameOfLife.getCells());
  }

  let tp1 = new Point(5,5);
  let tp2 = new Point(5,4);
  let tp3 = new Point(5,3);

  gameOfLife.preLoadPoints([tp1,tp2,tp3]);

  return (
    <>
      <Renderer cells={cells}></Renderer>
      <button onClick = {nextGeneration}></button>
    </>
  )
}

export default App
