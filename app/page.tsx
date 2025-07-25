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
  }

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <div className="max-w-md mx-auto pt-20">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                <Trophy className="w-6 h-6 text-yellow-600" />
                Scrabber: score keeper for Scrabble
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Number of Players</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4].map((count) => (
                    <Button
                      key={count}
                      variant={playerCount === count ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPlayerCount(count)}
                      className="flex-1"
                    >
                      {count}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium">Player Names</label>
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

              <Button onClick={startGame} className="w-full" size="lg">
                <Users className="w-4 h-4 mr-2" />
                Start Game
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const getWordBonusColor = (bonusText: string) => {
    if (bonusText === "DWS") return "bg-orange-400 text-orange-900"
    if (bonusText === "TWS") return "bg-red-500 text-white"
    if (bonusText === "Bingo +50") return "bg-yellow-400 text-yellow-900"
    return "bg-gray-200 text-gray-800"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-600" />
            Scrabber: score keeper for Scrabble
          </h1>
          <Button onClick={newGame} variant="outline" size="sm">
            <RotateCcw className="w-4 h-4 mr-2" />
            New Game
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column - Score Entry */}
          <div className="space-y-6">
            {/* Current Player */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Current Turn: {players[currentPlayerIndex]?.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Word</label>
                  <Input
                    value={word}
                    onChange={(e) => setWord(e.target.value)}
                    placeholder="Enter word..."
                    className="text-lg"
                  />
                </div>

                {/* Letter Bonuses */}
                {word && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Letter Bonuses</label>
                    <div className="flex flex-wrap gap-3">
                      {letterStates.map((letterState, index) => (
                        <div key={index} className="flex flex-col items-center gap-2">
                          <Tile
                            letter={letterState.letter}
                            points={LETTER_VALUES[letterState.letter] || 0}
                            bonus={letterState.bonus}
                            isBlank={letterState.isBlank}
                            onClick={() => toggleLetterBonus(index)}
                          />
                          <div className="flex items-center gap-1">
                            <Checkbox
                              checked={letterState.isBlank}
                              onCheckedChange={(checked) => {
                                if (typeof checked === 'boolean') {
                                  const newStates = [...letterStates]
                                  newStates[index].isBlank = checked
                                  setLetterStates(newStates)
                                }
                              }}
                              className="w-3 h-3"
                            />
                            <span className="text-xs">Blank</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-600 mt-2">Click tiles to cycle: Normal → DLS → TLS</p>
                  </div>
                )}

                {/* Word Multipliers */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      checked={hasDoubleWord} 
                      onCheckedChange={(checked) => {
                        if (typeof checked === 'boolean') setHasDoubleWord(checked)
                      }} 
                    />
                    <label className="text-sm font-medium flex items-center gap-2">
                      <span className="w-4 h-4 bg-orange-400 border border-orange-500 rounded"></span>
                      Double Word Score
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      checked={hasTripleWord} 
                      onCheckedChange={(checked) => {
                        if (typeof checked === 'boolean') setHasTripleWord(checked)
                      }} 
                    />
                    <label className="text-sm font-medium flex items-center gap-2">
                      <span className="w-4 h-4 bg-red-500 border border-red-600 rounded"></span>
                      Triple Word Score
                    </label>
                  </div>
                </div>

                {/* Bingo Bonus */}
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    checked={hasBingo} 
                    onCheckedChange={(checked) => {
                      if (typeof checked === 'boolean') setHasBingo(checked)
                    }} 
                  />
                  <label className="text-sm font-medium">7-Letter Bingo (+50 points)</label>
                </div>

                {/* Score Preview */}
                {word && (
                  <div className="bg-gray-50 p-3 rounded">
                    <div className="text-sm text-gray-600">Calculated Score:</div>
                    <div className="text-2xl font-bold text-green-600">{calculateScore()} points</div>
                  </div>
                )}

                <Button onClick={confirmTurn} disabled={!word.trim()} className="w-full" size="lg">
                  <Plus className="w-4 h-4 mr-2" />
                  Confirm Turn
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Scores & History */}
          <div className="space-y-6">
            {/* Current Scores */}
            <Card>
              <CardHeader>
                <CardTitle>Current Scores</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {players.map((player, index) => (
                    <div
                      key={index}
                      className={`flex justify-between items-center p-3 rounded ${
                        index === currentPlayerIndex ? "bg-blue-50 border border-blue-200" : "bg-gray-50"
                      }`}
                    >
                      <span className="font-medium">{player.name}</span>
                      <span className="text-xl font-bold">{player.score}</span>
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
                <div className="max-h-96 overflow-y-auto space-y-3">
                  {turnHistory.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No turns played yet</p>
                  ) : (
                    turnHistory
                      .slice()
                      .reverse()
                      .map((turn, index) => (
                        <div key={index} className="border rounded-lg p-4 bg-white">
                          <div className="flex justify-between items-start mb-3">
                            <div className="font-medium text-sm text-gray-600">{turn.player}</div>
                            <div className="text-xl font-bold text-green-600">+{turn.score}</div>
                          </div>

                          {/* Word displayed as tiles */}
                          <div className="flex flex-wrap gap-1 mb-2">
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
                                  className="scale-75"
                                />
                              )
                            })}
                          </div>

                          {/* Other bonuses */}
                          {turn.bonuses.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {turn.bonuses
                                .filter((bonus) => !bonus.includes("(") || bonus.includes("Bingo"))
                                .map((bonus, bonusIndex) => (
                                  <Badge
                                    key={bonusIndex}
                                    className={`text-xs ${getWordBonusColor(bonus)}`}
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
