// css
import './App.css'

// react
import { useEffect, useState, useCallback } from 'react'

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

const guessesQty = 3

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name)
  const [word] = useState(wordList)

  const [pickedWord, setPickedWord] = useState("")
  const [pickedCategory, setPickedCategory] = useState("")
  const [letters, setLetters] = useState([])

  const [guessedLetters, setGuessedLetters] = useState([])
  const [wrongLetters, setWrongLetters] = useState([])
  const [guesses, setGuesses] = useState(guessesQty)
  const [score, setScore] = useState(0)

  const pickWordAndPickCategory = useCallback(() => {
    // pick a random category
    const categories = Object.keys(word)
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)]

    //pick a random word
    const words = word[category][Math.floor(Math.random() * word[category].length)]

    return { words, category }

  }, [word])

  // start secret word game
  const startGame = useCallback(() => {
    // clear all letter
    clearletterStates()

    // pick word and pick category
    const { words, category } = pickWordAndPickCategory()

    // create an array of letters
    let wordLetters = words.split("")
    wordLetters = wordLetters.map((l) => l.toLowerCase())

    // fill states
    setPickedWord(word)
    setPickedCategory(category)
    setLetters(wordLetters)

    setGameStage(stages[1].name)
  }, [pickWordAndPickCategory])

  // process the letter input
  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase()

    // Check if letter has already been utilized
    if (guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)) {
      return
    }

    // push guessed letter or remove a guess
    if (letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter
      ])
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter
      ])

      // handle try
      setGuesses((actualGuesses) => actualGuesses - 1)
    }
  }

  const clearletterStates = () => {
    setGuessedLetters([])
    setWrongLetters([])
  }

  // check of guesses ended
  useEffect(() => {
    // reset all game
    clearletterStates()

    if (guesses <= 0) {
      setGameStage(stages[2].name)
    }

  }, [guesses])

  // check win condition
  useEffect(() => {

    const uniqueLetters = [... new Set(letters)]

    // win condition
    if (guessedLetters.length === uniqueLetters.length) {
      // add score
      setScore((actualScore) => actualScore += 100)

      // restart game with new word
      startGame()
    }

  }, [guessedLetters, letters, startGame])

  // restart game
  const restart = () => {
    setScore(0)
    setGuesses(guessesQty)

    setGameStage(stages[0].name)
  }

  return (
    <div className='app'>
      {gameStage == 'start' && <StartScreen startGame={startGame} />}
      {gameStage == 'game' &&
        <Game
          verifyLetter={verifyLetter}
          pickedWord={pickedWord}
          pickedCategory={pickedCategory}
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
        />
      }
      {gameStage == 'end' && <GameOver restart={restart} score={score} />}
    </div>
  )
}

export default App
