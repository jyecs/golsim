import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import gol from "./gol"
import Point from './point'
import Renderer from './golRender'

function App() {
  const gameOfLife = gol();

  let tp1 = new Point(0,0);
  let tp2 = new Point(-1,0);
  let tp3 = new Point(1,0);

  gameOfLife.preLoadPoints([tp1,tp2,tp3]);
  gameOfLife.next();
  console.log(gameOfLife.getCells());

  return (
    <Renderer></Renderer>
  )
}

export default App
