// css
import './App.css'

// react
import { useCallback, useEffect, useState } from 'react'

// data
import { wordList } from './data/words'

// components
import StartScreen from './components/StartScreen/StartScreen'
import Game from './components/Game/Game'
import GameOver from './components/GameOver/GameOver'

const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" }
]

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name)

  return (
    <div className='app'>
      {gameStage == 'start' && <StartScreen />}
      {gameStage == 'game' && <Game />}
      {gameStage == 'end' && <GameOver />}
    </div>
  )
}

export default App
