"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Tile, type BonusType } from "@/components/ui/tile"
import { Users, Trophy, RotateCcw, Plus } from "lucide-react"

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

interface Turn {
  player: string
  word: string
  score: number
  bonuses: string[]
}

interface Player {
  name: string
  score: number
}

export default function ScrabbleScoreKeeper() {
  const [gameStarted, setGameStarted] = useState(false)
  const [playerCount, setPlayerCount] = useState(2)
  const [players, setPlayers] = useState<Player[]>([])
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0)
  const [word, setWord] = useState("")
  const [letterStates, setLetterStates] = useState<LetterState[]>([])
  const [hasDoubleWord, setHasDoubleWord] = useState(false)
  const [hasTripleWord, setHasTripleWord] = useState(false)
  const [hasBingo, setHasBingo] = useState(false)
  const [turnHistory, setTurnHistory] = useState<Turn[]>([])
  const [tempPlayerNames, setTempPlayerNames] = useState<string[]>(["Player 1", "Player 2"])
  const [wordInputRef, setWordInputRef] = useState<HTMLInputElement | null>(null)

  // Update tempPlayerNames when playerCount changes
  useEffect(() => {
    const newNames = Array.from({ length: playerCount }, (_, i) => `Player ${i + 1}`)
    setTempPlayerNames(newNames)
  }, [playerCount])

  // Update letterStates when word changes
  useEffect(() => {
    const newStates = word.split('').map((letter) => ({
      letter: letter.toUpperCase(),
      bonus: 'normal' as BonusType,
      isBlank: false,
    }))
    setLetterStates(newStates)
  }, [word])

  // Focus word input when game starts or player changes
  useEffect(() => {
    if (gameStarted && wordInputRef) {
      wordInputRef.focus()
    }
  }, [gameStarted, currentPlayerIndex, wordInputRef])

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
    setWord("")
    setLetterStates([])
    setHasDoubleWord(false)
    setHasTripleWord(false)
    setHasBingo(false)
    setTurnHistory([])
  }

  const toggleLetterBonus = (index: number) => {
    const newStates = [...letterStates]
    const currentBonus = newStates[index].bonus

    if (currentBonus === "normal") {
      newStates[index].bonus = "dls"
    } else if (currentBonus === "dls") {
      newStates[index].bonus = "tls"
    } else {
      newStates[index].bonus = "normal"
    }

    setLetterStates(newStates)
  }



  const calculateScore = () => {
    if (!word) return 0

    let letterScore = 0

    // Calculate letter scores with bonuses
    letterStates.forEach(({ letter, bonus, isBlank }) => {
      let value = isBlank ? 0 : LETTER_VALUES[letter.toUpperCase()] || 0

      if (bonus === "dls") value *= 2
      if (bonus === "tls") value *= 3

      letterScore += value
    })

    // Apply word multipliers
    if (hasDoubleWord) letterScore *= 2
    if (hasTripleWord) letterScore *= 3

    // Add bingo bonus
    if (hasBingo) letterScore += 50

    return letterScore
  }

  const getBonusesText = () => {
    const bonuses = []

    letterStates.forEach(({ bonus, isBlank }, index) => {
      if (bonus === "dls") bonuses.push(`${letterStates[index].letter}(DLS)`)
      if (bonus === "tls") bonuses.push(`${letterStates[index].letter}(TLS)`)
      if (isBlank) bonuses.push(`${letterStates[index].letter}(Blank)`)
    })

    if (hasDoubleWord) bonuses.push("DWS")
    if (hasTripleWord) bonuses.push("TWS")
    if (hasBingo) bonuses.push("Bingo +50")

    return bonuses
  }



  const confirmTurn = () => {
    if (!word.trim()) return

    const score = calculateScore()
    const bonuses = getBonusesText()

    // Update player score
    const newPlayers = [...players]
    newPlayers[currentPlayerIndex].score += score
    setPlayers(newPlayers)

    // Add to turn history
    const newTurn: Turn = {
      player: players[currentPlayerIndex].name,
      word: word.toUpperCase(),
      score,
      bonuses,
    }
    setTurnHistory([...turnHistory, newTurn])

    // Reset turn state
    setWord("")
    setLetterStates([])
    setHasDoubleWord(false)
    setHasTripleWord(false)
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

  const getWordBonusColor = (bonusText: string) => {
    if (bonusText === "DWS") return "dws"
    if (bonusText === "TWS") return "tws"
    if (bonusText === "Bingo +50") return "bingo"
    return "default"
  }

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
              <CardContent className="Page__section">
                <div className="Page__form-group">
                  <label className="Page__label">Word</label>
                  <Input
                    ref={setWordInputRef}
                    value={word}
                    onChange={(e) => setWord(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && word.trim()) {
                        confirmTurn()
                      }
                    }}
                    placeholder="Enter word..."
                    className="Input--lg"
                  />
                </div>

                {/* Letter Bonuses */}
                {word && (
                  <div className="Page__form-group">
                    <label className="Page__label">Letter Bonuses</label>
                    <div className="Page__input-group">
                      {letterStates.map((letterState, index) => (
                        <div key={index} className="Page__tile-group">
                          <Tile
                            letter={letterState.letter}
                            points={LETTER_VALUES[letterState.letter] || 0}
                            bonus={letterState.bonus}
                            isBlank={letterState.isBlank}
                            onClick={() => toggleLetterBonus(index)}
                          />
                          <div className="Page__checkbox-group">
                            <Checkbox
                              checked={letterState.isBlank}
                              onCheckedChange={(checked) => {
                                if (typeof checked === 'boolean') {
                                  const newStates = [...letterStates]
                                  newStates[index].isBlank = checked
                                  setLetterStates(newStates)
                                }
                              }}
                              className="Checkbox--sm"
                            />
                            <span className="Page__help-text">Blank</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="Page__help-text">Click tiles to cycle: Normal → DLS → TLS</p>
                  </div>
                )}

                {/* Word Multipliers */}
                <div className="Page__form-row--equal">
                  <div className="Page__checkbox-group">
                    <Checkbox 
                      checked={hasDoubleWord} 
                      onCheckedChange={(checked) => {
                        if (typeof checked === 'boolean') setHasDoubleWord(checked)
                      }} 
                    />
                    <label className="Page__label--inline">
                      <span className="Page__bonus-indicator Page__bonus-indicator--dws"></span>
                      Double Word Score
                    </label>
                  </div>
                  <div className="Page__checkbox-group">
                    <Checkbox 
                      checked={hasTripleWord} 
                      onCheckedChange={(checked) => {
                        if (typeof checked === 'boolean') setHasTripleWord(checked)
                      }} 
                    />
                    <label className="Page__label--inline">
                      <span className="Page__bonus-indicator Page__bonus-indicator--tws"></span>
                      Triple Word Score
                    </label>
                  </div>
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
                {word && (
                  <div className="Page__score-preview">
                    <div className="Page__score-label">Calculated Score:</div>
                    <div className="Page__score-value">{calculateScore()} points</div>
                  </div>
                )}

                <Button onClick={confirmTurn} disabled={!word.trim()} className="Button--full" size="lg">
                  <Plus className="Page__icon" />
                  Confirm Turn
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
                      .map((turn, index) => (
                        <div key={index} className="Page__history-item">
                          <div className="Page__history-header">
                            <div className="Page__history-player">{turn.player}</div>
                            <div className="Page__history-score">+{turn.score}</div>
                          </div>

                          {/* Word displayed as tiles */}
                          <div className="Page__history-word">
                            {turn.word.split("").map((letter, letterIndex) => {
                              // Determine if this letter had bonuses based on the bonuses array
                              const letterBonus = turn.bonuses.find((b) => b.startsWith(`${letter}(`))
                              let bonus: BonusType = "normal"
                              let isBlank = false

                              if (letterBonus) {
                                if (letterBonus.includes("DLS")) bonus = "dls"
                                else if (letterBonus.includes("TLS")) bonus = "tls"
                                if (letterBonus.includes("Blank")) isBlank = true
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

                          {/* Other bonuses */}
                          {turn.bonuses.length > 0 && (
                            <div className="Page__history-bonuses">
                              {turn.bonuses
                                .filter((bonus) => !bonus.includes("(") || bonus.includes("Bingo"))
                                .map((bonus, bonusIndex) => (
                                  <Badge
                                    key={bonusIndex}
                                    className={`Badge--${getWordBonusColor(bonus)}`}
                                    variant="secondary"
                                  >
                                    {bonus}
                                  </Badge>
                                ))}
                            </div>
                          )}
                        </div>
                      ))
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
