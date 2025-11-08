"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Tile, type BonusType } from "@/components/ui/tile"
import { Users, Trophy, RotateCcw, Plus, SkipForward } from "lucide-react"

// Scrabble letter values
const LETTER_VALUES: Record<string, number> = {
  A: 1,
  B: 3,
  C: 3,
  D: 2,
  E: 1,
  F: 4,
  G: 2,
  H: 4,
  I: 1,
  J: 8,
  K: 5,
  L: 1,
  M: 3,
  N: 1,
  O: 1,
  P: 3,
  Q: 10,
  R: 1,
  S: 1,
  T: 1,
  U: 1,
  V: 4,
  W: 4,
  X: 8,
  Y: 4,
  Z: 10,
}



interface LetterState {
  letter: string
  bonus: BonusType
  isBlank: boolean
}

interface WordEntry {
  word: string
  letterStates: LetterState[]
  score: number
  bonuses: string[]
}

interface Turn {
  player: string
  words: WordEntry[]
  totalScore: number
  hasBingo: boolean
  type: "play" | "skip"
}

interface Player {
  name: string
  score: number
}

const MAX_ADDITIONAL_WORDS = 5

const createEmptyWordEntry = (): WordEntry => ({
  word: "",
  letterStates: [],
  score: 0,
  bonuses: [],
})

export default function ScrabbleScoreKeeper() {
  const [gameStarted, setGameStarted] = useState(false)
  const [playerCount, setPlayerCount] = useState(2)
  const [players, setPlayers] = useState<Player[]>([])
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0)

  // Multiple word state management
  const [currentWords, setCurrentWords] = useState<WordEntry[]>([createEmptyWordEntry()])
  const [hasBingo, setHasBingo] = useState(false)

  const [turnHistory, setTurnHistory] = useState<Turn[]>([])
  const [tempPlayerNames, setTempPlayerNames] = useState<string[]>(["Player 1", "Player 2"])
  const [wordInputRef, setWordInputRef] = useState<HTMLInputElement | null>(null)
  const [editingTurnIndex, setEditingTurnIndex] = useState<number | null>(null)
  const [previousPlayerIndex, setPreviousPlayerIndex] = useState<number | null>(null)

  // Update tempPlayerNames when playerCount changes
  useEffect(() => {
    const newNames = Array.from({ length: playerCount }, (_, i) => `Player ${i + 1}`)
    setTempPlayerNames(newNames)
  }, [playerCount])

  // Focus word input when game starts or player changes
  useEffect(() => {
    if (gameStarted && wordInputRef) {
      wordInputRef.focus()
    }
  }, [gameStarted, currentPlayerIndex, wordInputRef])

  const buildLetterStates = (word: string, previousStates: LetterState[] = []): LetterState[] =>
    word.split('').map((letter, index) => {
      const prevState = previousStates[index]
      return {
        letter: letter.toUpperCase(),
        bonus: prevState?.bonus ?? ("normal" as BonusType),
        isBlank: prevState?.isBlank ?? false,
      }
    })

  const startGame = () => {
    const newPlayers = tempPlayerNames.map((name) => ({ name, score: 0 }))
    setPlayers(newPlayers)
    setGameStarted(true)
    setCurrentPlayerIndex(0)
    setTurnHistory([])
  }

  const newGame = () => {
    setGameStarted(false)
    setPlayers([])
    setCurrentPlayerIndex(0)
    setCurrentWords([createEmptyWordEntry()])
    setHasBingo(false)
    setTurnHistory([])
    setEditingTurnIndex(null)
    setPreviousPlayerIndex(null)
  }

  const toggleLetterBonus = (letterIndex: number, wordIndex: number = 0) => {
    const wordEntry = currentWords[wordIndex]
    if (!wordEntry || !wordEntry.letterStates[letterIndex]) return

    const updatedWords = [...currentWords]
    const newStates = [...updatedWords[wordIndex].letterStates]
    const currentBonus = newStates[letterIndex].bonus

    if (currentBonus === "normal") {
      newStates[letterIndex].bonus = "dls"
    } else if (currentBonus === "dls") {
      newStates[letterIndex].bonus = "tls"
    } else if (currentBonus === "tls") {
      newStates[letterIndex].bonus = "dws"
    } else if (currentBonus === "dws") {
      newStates[letterIndex].bonus = "tws"
    } else {
      newStates[letterIndex].bonus = "normal"
    }

    updatedWords[wordIndex] = {
      ...updatedWords[wordIndex],
      letterStates: newStates
    }
    setCurrentWords(updatedWords)
  }

  // Get the effective bonus for a tile
  const getTileBonus = (letterIndex: number, wordIndex: number = 0): BonusType => {
    const letterState = currentWords[wordIndex]?.letterStates[letterIndex]
    if (!letterState) return "normal"

    return letterState.bonus
  }

  const startEditingTurn = (turnIndex: number) => {
    const turn = turnHistory[turnIndex]
    if (!turn) return
    if (turn.type !== "play") return

    const playerIndex = players.findIndex((player) => player.name === turn.player)
    setPreviousPlayerIndex(currentPlayerIndex)

    if (playerIndex !== -1) {
      setCurrentPlayerIndex(playerIndex)
    }

    const loadedWords = turn.words.length
      ? turn.words.map((wordEntry) => ({
          word: wordEntry.word,
          letterStates: wordEntry.letterStates.map((state) => ({ ...state })),
          score: wordEntry.score,
          bonuses: [...wordEntry.bonuses],
        }))
      : [createEmptyWordEntry()]

    setCurrentWords(loadedWords)
    setHasBingo(turn.hasBingo)
    setEditingTurnIndex(turnIndex)
  }

  const cancelEditingTurn = () => {
    setEditingTurnIndex(null)
    setHasBingo(false)
    setCurrentWords([createEmptyWordEntry()])
    if (previousPlayerIndex !== null) {
      setCurrentPlayerIndex(previousPlayerIndex)
      setPreviousPlayerIndex(null)
    }
  }

  const addWord = () => {
    if (currentWords.length >= MAX_ADDITIONAL_WORDS) return
    setCurrentWords([...currentWords, createEmptyWordEntry()])
  }

  const removeWord = (wordIndex: number) => {
    if (wordIndex === 0 || currentWords.length <= 1) return
    const updatedWords = currentWords.filter((_, index) => index !== wordIndex)
    setCurrentWords(updatedWords)
  }

  const updateWord = (wordIndex: number, word: string) => {
    const updatedWords = [...currentWords]
    const upperWord = word.toUpperCase()
    const newLetterStates = buildLetterStates(upperWord, updatedWords[wordIndex]?.letterStates)

    updatedWords[wordIndex] = {
      ...updatedWords[wordIndex],
      word: upperWord,
      letterStates: newLetterStates
    }
    setCurrentWords(updatedWords)
  }

  const toggleBlankTile = (letterIndex: number, wordIndex: number = 0) => {
    const updatedWords = [...currentWords]
    const letterState = updatedWords[wordIndex]?.letterStates[letterIndex]
    if (!letterState) return

    const newStates = [...updatedWords[wordIndex].letterStates]

    newStates[letterIndex] = {
      ...newStates[letterIndex],
      isBlank: !newStates[letterIndex].isBlank
    }

    updatedWords[wordIndex] = {
      ...updatedWords[wordIndex],
      letterStates: newStates
    }
    setCurrentWords(updatedWords)
  }



  const calculateWordScore = (wordEntry: WordEntry): number => {
    if (!wordEntry.word) return 0

    let letterScore = 0
    let wordMultiplier = 1

    // Calculate letter scores with bonuses
    wordEntry.letterStates.forEach(({ letter, bonus, isBlank }) => {
      let value = isBlank ? 0 : LETTER_VALUES[letter.toUpperCase()] || 0

      if (bonus === "dls") value *= 2
      if (bonus === "tls") value *= 3
      if (bonus === "dws") wordMultiplier *= 2
      if (bonus === "tws") wordMultiplier *= 3

      letterScore += value
    })

    // Apply word multipliers
    letterScore *= wordMultiplier

    return letterScore
  }

  const calculateTotalScore = (): number => {
    let totalScore = 0

    // Calculate score for each word
    currentWords.forEach(wordEntry => {
      if (wordEntry.word.trim()) {
        totalScore += calculateWordScore(wordEntry)
      }
    })

    // Add bingo bonus only when explicitly selected
    if (hasBingo) {
      totalScore += 50
    }

    return totalScore
  }

  // Update individual word scores in real-time (for Phase 3)
  // const updateWordScores = () => {
  //   const updatedWords = currentWords.map(wordEntry => ({
  //     ...wordEntry,
  //     score: calculateWordScore(wordEntry),
  //     bonuses: getWordBonusesText(wordEntry)
  //   }))
  //   setCurrentWords(updatedWords)
  // }

  const getWordBonusesText = (wordEntry: WordEntry): string[] => {
    const bonuses: string[] = []

    wordEntry.letterStates.forEach(({ bonus, isBlank }, index) => {
      if (bonus === "dls") bonuses.push(`${index}:DLS`)
      if (bonus === "tls") bonuses.push(`${index}:TLS`)
      if (bonus === "dws") bonuses.push(`${index}:DWS`)
      if (bonus === "tws") bonuses.push(`${index}:TWS`)
      if (isBlank) bonuses.push(`${index}:Blank`)
    })

    return bonuses
  }

  const createTurn = (player: string): Turn => {
    // Update word scores and bonuses before creating turn
    const finalWords = currentWords
      .filter(word => word.word.trim() !== "") // Only include non-empty words
      .map(wordEntry => ({
        ...wordEntry,
        score: calculateWordScore(wordEntry),
        bonuses: getWordBonusesText(wordEntry)
      }))

    const bingoApplied = hasBingo
    const totalScore = finalWords.reduce((sum, word) => sum + word.score, 0) + (bingoApplied ? 50 : 0)

    return {
      player,
      words: finalWords,
      totalScore,
      hasBingo: bingoApplied,
      type: "play"
    }
  }

  const confirmTurn = () => {
    // Check if at least one word has content
    const hasValidWords = currentWords.some(word => word.word.trim() !== "")
    if (!hasValidWords) return

    if (editingTurnIndex !== null) {
      const existingTurn = turnHistory[editingTurnIndex]
      if (!existingTurn) return

      const updatedTurn = createTurn(existingTurn.player)
      const playerIndex = players.findIndex((player) => player.name === existingTurn.player)
      const scoreDifference = updatedTurn.totalScore - existingTurn.totalScore

      const updatedPlayers = [...players]
      if (playerIndex !== -1) {
        updatedPlayers[playerIndex] = {
          ...updatedPlayers[playerIndex],
          score: updatedPlayers[playerIndex].score + scoreDifference,
        }
      }

      const updatedHistory = [...turnHistory]
      updatedHistory[editingTurnIndex] = updatedTurn

      setPlayers(updatedPlayers)
      setTurnHistory(updatedHistory)
      setCurrentWords([createEmptyWordEntry()])
      setHasBingo(false)
      setEditingTurnIndex(null)

      if (previousPlayerIndex !== null) {
        setCurrentPlayerIndex(previousPlayerIndex)
        setPreviousPlayerIndex(null)
      }

      setTimeout(() => {
        if (wordInputRef) {
          wordInputRef.focus()
        }
      }, 100)

      return
    }

    // Create the turn with multiple words
    const newTurn = createTurn(players[currentPlayerIndex].name)

    // Update player score
    const newPlayers = [...players]
    newPlayers[currentPlayerIndex].score += newTurn.totalScore
    setPlayers(newPlayers)

    // Add to turn history
    setTurnHistory([...turnHistory, newTurn])

    // Reset turn state
    setCurrentWords([createEmptyWordEntry()])
    setHasBingo(false)

    // Move to next player
    setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length)

    // Refocus the input after a short delay to ensure state updates
    setTimeout(() => {
      if (wordInputRef) {
        wordInputRef.focus()
      }
    }, 100)
  }

  const skipCurrentTurn = () => {
    if (editingTurnIndex !== null) return
    if (players.length === 0) return

    const playerName = players[currentPlayerIndex]?.name
    if (!playerName) return

    const skipTurn: Turn = {
      player: playerName,
      words: [],
      totalScore: 0,
      hasBingo: false,
      type: "skip",
    }

    setTurnHistory([...turnHistory, skipTurn])
    setCurrentWords([createEmptyWordEntry()])
    setHasBingo(false)
    setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length)

    setTimeout(() => {
      if (wordInputRef) {
        wordInputRef.focus()
      }
    }, 100)
  }

  if (!gameStarted) {
    return (
      <div className="Page">
        <div className="Page__container">
          <Card>
            <CardHeader className="CardHeader--center">
              <CardTitle className="Page__title">
                <Trophy className="Page__icon Page__icon--trophy" />
                Scrabber: score keeper for Scrabble
              </CardTitle>
            </CardHeader>
            <CardContent className="Page__section">
              <div className="Page__form-group">
                <label className="Page__label">Number of Players</label>
                <div className="Page__form-row">
                  {[1, 2, 3, 4].map((count) => (
                    <Button
                      key={count}
                      variant={playerCount === count ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPlayerCount(count)}
                      className="Button--flex"
                    >
                      {count}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="Page__form-group">
                <label className="Page__label">Player Names</label>
                {tempPlayerNames.slice(0, playerCount).map((name, index) => (
                  <Input
                    key={index}
                    value={name}
                    onChange={(e) => {
                      const newNames = [...tempPlayerNames]
                      newNames[index] = e.target.value
                      setTempPlayerNames(newNames)
                    }}
                    placeholder={`Player ${index + 1}`}
                  />
                ))}
              </div>

              <Button onClick={startGame} className="Button--full" size="lg">
                <Users className="Page__icon" />
                Start Game
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const hasValidWords = currentWords.some(word => word.word.trim())
  const bingoAppliedPreview = hasBingo
  const totalScorePreview = hasValidWords ? calculateTotalScore() : 0
  const isEditingTurn = editingTurnIndex !== null

  return (
    <div className="Page">
      <div className="Page__container--wide">
        {/* Header */}
        <div className="Page__header">
          <h1 className="Page__title">
            <Trophy className="Page__icon Page__icon--trophy" />
            Scrabber: score keeper for Scrabble
          </h1>
          <Button onClick={newGame} variant="outline" size="sm">
            <RotateCcw className="Page__icon" />
            New Game
          </Button>
        </div>

        <div className="Page__content--two-column">
          {/* Left Column - Score Entry */}
          <div className="Page__section">
            {/* Current Player */}
            <Card>
              <CardHeader>
                <CardTitle className="CardTitle--lg">Current Turn: {players[currentPlayerIndex]?.name}</CardTitle>
              </CardHeader>
              <CardContent className="Page__section Page__word-list">
                {currentWords.map((wordEntry, wordIndex) => {
                  const wordScore = wordEntry.word.trim() ? calculateWordScore(wordEntry) : 0
                  return (
                    <div
                      key={`word-entry-${wordIndex}`}
                      className="Page__word-entry"
                      data-testid={`word-entry-${wordIndex}`}
                    >
                      <div className="Page__word-entry-header">
                        <label className="Page__label">Word {wordIndex + 1}</label>
                        {wordIndex > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeWord(wordIndex)}
                            aria-label={`Remove Word ${wordIndex + 1}`}
                          >
                            Remove Word {wordIndex + 1}
                          </Button>
                        )}
                      </div>

                      <div className="Page__form-group">
                  <Input
                          ref={wordIndex === 0 ? setWordInputRef : undefined}
                          value={wordEntry.word}
                          onChange={(e) => updateWord(wordIndex, e.target.value)}
                    onKeyDown={(e) => {
                            if (e.key === 'Enter' && currentWords.some(word => word.word.trim())) {
                        confirmTurn()
                      }
                    }}
                    placeholder="Enter word..."
                          className="Input--lg"
                  />
                </div>

                      {wordEntry.word && (
                        <>
                          <div className="Page__form-group">
                            <label className="Page__label Page__label--subtle">Letter Bonuses</label>
                            <div className="Page__input-group">
                              {wordEntry.letterStates.map((letterState, letterIndex) => (
                                <div key={letterIndex} className="Page__tile-group">
                          <Tile
                            letter={letterState.letter}
                            points={LETTER_VALUES[letterState.letter] || 0}
                                    bonus={getTileBonus(letterIndex, wordIndex)}
                            isBlank={letterState.isBlank}
                                    onClick={() => toggleLetterBonus(letterIndex, wordIndex)}
                          />
                                  <div className="Page__checkbox-group">
                            <Checkbox
                              checked={letterState.isBlank}
                              onCheckedChange={(checked) => {
                                if (typeof checked === 'boolean') {
                                          toggleBlankTile(letterIndex, wordIndex)
                                }
                              }}
                                      className="Checkbox--sm"
                            />
                                    <span className="Page__help-text">Blank</span>
                          </div>
                        </div>
                      ))}
                    </div>
                            <p className="Page__help-text">Click tiles to cycle: Normal → DLS → TLS → DWS → TWS</p>
                  </div>

                          <div className="Page__word-score">Word Score: {wordScore} points</div>
                        </>
                      )}
                  </div>
                  )
                })}

                <div className="Page__word-actions">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addWord}
                    disabled={currentWords.length >= MAX_ADDITIONAL_WORDS}
                  >
                    Add Word
                  </Button>
                  {isEditingTurn && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={cancelEditingTurn}
                    >
                      Cancel Edit
                    </Button>
                  )}
                </div>

                {/* Bingo Bonus */}
                <div className="Page__checkbox-group">
                  <Checkbox 
                    checked={hasBingo} 
                    onCheckedChange={(checked) => {
                      if (typeof checked === 'boolean') setHasBingo(checked)
                    }} 
                  />
                  <label className="Page__label--inline">7-Letter Bingo (+50 points)</label>
                </div>

                {/* Score Preview */}
                {hasValidWords && (
                  <div className="Page__score-preview">
                    <div className="Page__score-label">Total Turn Score:</div>
                    <div className="Page__score-value">{totalScorePreview} points</div>
                    <ul className="Page__score-breakdown">
                      {currentWords
                        .map((wordEntry, wordIndex) => ({
                          word: wordEntry.word.trim(),
                          index: wordIndex,
                          score: wordEntry.word.trim() ? calculateWordScore(wordEntry) : 0,
                        }))
                        .filter(({ word }) => word)
                        .map(({ word, index, score }) => (
                          <li key={`score-breakdown-${index}`}>
                            Word {index + 1}: {word} ({score} pts)
                          </li>
                        ))}
                      {bingoAppliedPreview && (
                        <li>Bingo bonus: +50 pts</li>
                      )}
                    </ul>
                  </div>
                )}

                <Button
                  onClick={confirmTurn}
                  disabled={!hasValidWords}
                  className="Button--full"
                  size="lg"
                >
                  <Plus className="Page__icon" />
                  {isEditingTurn ? "Update Turn" : "Confirm Turn"}
                </Button>
                <Button
                  onClick={skipCurrentTurn}
                  variant="outline"
                  className="Button--full"
                  size="lg"
                  disabled={isEditingTurn}
                >
                  <SkipForward className="Page__icon" />
                  Skip Turn
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Scores & History */}
          <div className="Page__section">
            {/* Current Scores */}
            <Card>
              <CardHeader>
                <CardTitle>Current Scores</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="Page__section">
                  {players.map((player, index) => (
                    <div
                      key={index}
                      className={`Page__player-score ${
                        index === currentPlayerIndex ? "Page__player-score--current" : ""
                      }`}
                    >
                      <span className="Page__player-name">{player.name}</span>
                      <span className="Page__player-points">{player.score}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Turn History */}
            <Card>
              <CardHeader>
                <CardTitle>Turn History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="Page__history">
                  {turnHistory.length === 0 ? (
                    <p className="Page__empty-state">No turns played yet</p>
                  ) : (
                    turnHistory
                      .slice()
                      .reverse()
                          .map((turn, index) => {
                            const bingoApplied = turn.hasBingo
                            const actualIndex = turnHistory.length - 1 - index
                            if (turn.type === "skip") {
                              return (
                                <div key={index} className="Page__history-item">
                                  <div className="Page__history-header">
                                    <div className="Page__history-player">{turn.player}</div>
                                    <div className="Page__history-score">+0</div>
                                  </div>
                                  <div className="Page__history-skip">Skipped turn (tile exchange)</div>
                                </div>
                              )
                            }
                            return (
                              <div key={index} className="Page__history-item">
                                <div className="Page__history-header">
                                  <div className="Page__history-player">{turn.player}</div>
                                  <div className="Page__history-score">+{turn.totalScore}</div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => startEditingTurn(actualIndex)}
                                    aria-label={`Edit turn for ${turn.player}`}
                                  >
                                    Edit Turn
                                  </Button>
                          </div>

                                {turn.words.map((wordEntry, wordIndex) => (
                                  <div key={`history-word-${wordIndex}`} className="Page__history-word-group">
                                    <div className="Page__history-word-header">
                                      <span className="Page__history-word-title">
                                        Word {wordIndex + 1}: {wordEntry.word}
                                      </span>
                                      <span className="Page__history-word-score">{wordEntry.score} pts</span>
                                    </div>
                                    <div className="Page__history-word">
                                      {wordEntry.word.split("").map((letter, letterIndex) => {
                                        const letterBonus = wordEntry.bonuses.find((b) =>
                                          b.startsWith(`${letterIndex}:`)
                                        )
                              let bonus: BonusType = "normal"
                              let isBlank = false

                              if (letterBonus) {
                                          if (letterBonus.includes(":DLS")) bonus = "dls"
                                          else if (letterBonus.includes(":TLS")) bonus = "tls"
                                          else if (letterBonus.includes(":DWS")) bonus = "dws"
                                          else if (letterBonus.includes(":TWS")) bonus = "tws"
                                          if (letterBonus.includes(":Blank")) isBlank = true
                              }

                              return (
                                <Tile
                                  key={letterIndex}
                                  letter={letter}
                                  points={LETTER_VALUES[letter.toUpperCase()] || 0}
                                  bonus={bonus}
                                  isBlank={isBlank}
                                            className="Tile--sm"
                                />
                              )
                            })}
                          </div>
                                  </div>
                                ))}

                                {bingoApplied && (
                                  <div className="Page__history-bonuses">
                                    <Badge className="Badge--bingo" variant="secondary">
                                      Bingo +50
                                    </Badge>
                            </div>
                          )}
                        </div>
                            )
                          })
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
