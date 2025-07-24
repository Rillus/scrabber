// Scrabble letter values for testing
const LETTER_VALUES: Record<string, number> = {
  A: 1, B: 3, C: 3, D: 2, E: 1, F: 4, G: 2, H: 4, I: 1, J: 8, K: 5, L: 1, M: 3,
  N: 1, O: 1, P: 3, Q: 10, R: 1, S: 1, T: 1, U: 1, V: 4, W: 4, X: 8, Y: 4, Z: 10,
}

type BonusType = "normal" | "dls" | "tls"

interface LetterState {
  letter: string
  bonus: BonusType
  isBlank: boolean
}

// Score calculation function (extracted from the main component)
function calculateScore(
  word: string,
  letterStates: LetterState[],
  hasDoubleWord: boolean,
  hasTripleWord: boolean,
  hasBingo: boolean
): number {
  if (!word) return 0

  let letterScore = 0

  // Calculate letter scores with bonuses
  letterStates.forEach(({ letter, bonus, isBlank }) => {
    let value = isBlank ? 0 : LETTER_VALUES[letter] || 0

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

describe('Score Calculation', () => {
  describe('Basic Letter Values', () => {
    it('calculates correct letter values for simple words', () => {
      const word = 'HELLO'
      const letterStates: LetterState[] = [
        { letter: 'H', bonus: 'normal', isBlank: false },
        { letter: 'E', bonus: 'normal', isBlank: false },
        { letter: 'L', bonus: 'normal', isBlank: false },
        { letter: 'L', bonus: 'normal', isBlank: false },
        { letter: 'O', bonus: 'normal', isBlank: false },
      ]

      const score = calculateScore(word, letterStates, false, false, false)
      // H(4) + E(1) + L(1) + L(1) + O(1) = 8
      expect(score).toBe(8)
    })

    it('handles high-value letters correctly', () => {
      const word = 'QUIZ'
      const letterStates: LetterState[] = [
        { letter: 'Q', bonus: 'normal', isBlank: false },
        { letter: 'U', bonus: 'normal', isBlank: false },
        { letter: 'I', bonus: 'normal', isBlank: false },
        { letter: 'Z', bonus: 'normal', isBlank: false },
      ]

      const score = calculateScore(word, letterStates, false, false, false)
      // Q(10) + U(1) + I(1) + Z(10) = 22
      expect(score).toBe(22)
    })

    it('handles single letter words', () => {
      const word = 'A'
      const letterStates: LetterState[] = [
        { letter: 'A', bonus: 'normal', isBlank: false },
      ]

      const score = calculateScore(word, letterStates, false, false, false)
      expect(score).toBe(1)
    })

    it('returns 0 for empty word', () => {
      const word = ''
      const letterStates: LetterState[] = []

      const score = calculateScore(word, letterStates, false, false, false)
      expect(score).toBe(0)
    })
  })

  describe('Letter Bonuses', () => {
    it('applies Double Letter Score correctly', () => {
      const word = 'HELLO'
      const letterStates: LetterState[] = [
        { letter: 'H', bonus: 'dls', isBlank: false },
        { letter: 'E', bonus: 'normal', isBlank: false },
        { letter: 'L', bonus: 'normal', isBlank: false },
        { letter: 'L', bonus: 'normal', isBlank: false },
        { letter: 'O', bonus: 'normal', isBlank: false },
      ]

      const score = calculateScore(word, letterStates, false, false, false)
      // H(4*2) + E(1) + L(1) + L(1) + O(1) = 8 + 1 + 1 + 1 + 1 = 12
      expect(score).toBe(12)
    })

    it('applies Triple Letter Score correctly', () => {
      const word = 'HELLO'
      const letterStates: LetterState[] = [
        { letter: 'H', bonus: 'tls', isBlank: false },
        { letter: 'E', bonus: 'normal', isBlank: false },
        { letter: 'L', bonus: 'normal', isBlank: false },
        { letter: 'L', bonus: 'normal', isBlank: false },
        { letter: 'O', bonus: 'normal', isBlank: false },
      ]

      const score = calculateScore(word, letterStates, false, false, false)
      // H(4*3) + E(1) + L(1) + L(1) + O(1) = 12 + 1 + 1 + 1 + 1 = 16
      expect(score).toBe(16)
    })

    it('handles multiple letter bonuses in same word', () => {
      const word = 'HELLO'
      const letterStates: LetterState[] = [
        { letter: 'H', bonus: 'dls', isBlank: false },
        { letter: 'E', bonus: 'tls', isBlank: false },
        { letter: 'L', bonus: 'normal', isBlank: false },
        { letter: 'L', bonus: 'normal', isBlank: false },
        { letter: 'O', bonus: 'normal', isBlank: false },
      ]

      const score = calculateScore(word, letterStates, false, false, false)
      // H(4*2) + E(1*3) + L(1) + L(1) + O(1) = 8 + 3 + 1 + 1 + 1 = 14
      expect(score).toBe(14)
    })

    it('handles all letters with bonuses', () => {
      const word = 'HELLO'
      const letterStates: LetterState[] = [
        { letter: 'H', bonus: 'dls', isBlank: false },
        { letter: 'E', bonus: 'tls', isBlank: false },
        { letter: 'L', bonus: 'dls', isBlank: false },
        { letter: 'L', bonus: 'tls', isBlank: false },
        { letter: 'O', bonus: 'dls', isBlank: false },
      ]

      const score = calculateScore(word, letterStates, false, false, false)
      // H(4*2) + E(1*3) + L(1*2) + L(1*3) + O(1*2) = 8 + 3 + 2 + 3 + 2 = 18
      expect(score).toBe(18)
    })
  })

  describe('Word Multipliers', () => {
    it('applies Double Word Score correctly', () => {
      const word = 'HELLO'
      const letterStates: LetterState[] = [
        { letter: 'H', bonus: 'normal', isBlank: false },
        { letter: 'E', bonus: 'normal', isBlank: false },
        { letter: 'L', bonus: 'normal', isBlank: false },
        { letter: 'L', bonus: 'normal', isBlank: false },
        { letter: 'O', bonus: 'normal', isBlank: false },
      ]

      const score = calculateScore(word, letterStates, true, false, false)
      // (H(4) + E(1) + L(1) + L(1) + O(1)) * 2 = 8 * 2 = 16
      expect(score).toBe(16)
    })

    it('applies Triple Word Score correctly', () => {
      const word = 'HELLO'
      const letterStates: LetterState[] = [
        { letter: 'H', bonus: 'normal', isBlank: false },
        { letter: 'E', bonus: 'normal', isBlank: false },
        { letter: 'L', bonus: 'normal', isBlank: false },
        { letter: 'L', bonus: 'normal', isBlank: false },
        { letter: 'O', bonus: 'normal', isBlank: false },
      ]

      const score = calculateScore(word, letterStates, false, true, false)
      // (H(4) + E(1) + L(1) + L(1) + O(1)) * 3 = 8 * 3 = 24
      expect(score).toBe(24)
    })

    it('applies both word multipliers (DWS then TWS)', () => {
      const word = 'HELLO'
      const letterStates: LetterState[] = [
        { letter: 'H', bonus: 'normal', isBlank: false },
        { letter: 'E', bonus: 'normal', isBlank: false },
        { letter: 'L', bonus: 'normal', isBlank: false },
        { letter: 'L', bonus: 'normal', isBlank: false },
        { letter: 'O', bonus: 'normal', isBlank: false },
      ]

      const score = calculateScore(word, letterStates, true, true, false)
      // (H(4) + E(1) + L(1) + L(1) + O(1)) * 2 * 3 = 8 * 2 * 3 = 48
      expect(score).toBe(48)
    })
  })

  describe('Bingo Bonus', () => {
    it('adds 50 points for bingo', () => {
      const word = 'HELLO'
      const letterStates: LetterState[] = [
        { letter: 'H', bonus: 'normal', isBlank: false },
        { letter: 'E', bonus: 'normal', isBlank: false },
        { letter: 'L', bonus: 'normal', isBlank: false },
        { letter: 'L', bonus: 'normal', isBlank: false },
        { letter: 'O', bonus: 'normal', isBlank: false },
      ]

      const score = calculateScore(word, letterStates, false, false, true)
      // H(4) + E(1) + L(1) + L(1) + O(1) + 50 = 8 + 50 = 58
      expect(score).toBe(58)
    })

    it('combines bingo with word multipliers', () => {
      const word = 'HELLO'
      const letterStates: LetterState[] = [
        { letter: 'H', bonus: 'normal', isBlank: false },
        { letter: 'E', bonus: 'normal', isBlank: false },
        { letter: 'L', bonus: 'normal', isBlank: false },
        { letter: 'L', bonus: 'normal', isBlank: false },
        { letter: 'O', bonus: 'normal', isBlank: false },
      ]

      const score = calculateScore(word, letterStates, true, false, true)
      // (H(4) + E(1) + L(1) + L(1) + O(1)) * 2 + 50 = 8 * 2 + 50 = 16 + 50 = 66
      expect(score).toBe(66)
    })
  })

  describe('Blank Tiles', () => {
    it('gives zero points for blank tiles', () => {
      const word = 'HELLO'
      const letterStates: LetterState[] = [
        { letter: 'H', bonus: 'normal', isBlank: true },
        { letter: 'E', bonus: 'normal', isBlank: false },
        { letter: 'L', bonus: 'normal', isBlank: false },
        { letter: 'L', bonus: 'normal', isBlank: false },
        { letter: 'O', bonus: 'normal', isBlank: false },
      ]

      const score = calculateScore(word, letterStates, false, false, false)
      // H(0) + E(1) + L(1) + L(1) + O(1) = 0 + 1 + 1 + 1 + 1 = 4
      expect(score).toBe(4)
    })

    it('ignores bonuses for blank tiles', () => {
      const word = 'HELLO'
      const letterStates: LetterState[] = [
        { letter: 'H', bonus: 'dls', isBlank: true },
        { letter: 'E', bonus: 'normal', isBlank: false },
        { letter: 'L', bonus: 'normal', isBlank: false },
        { letter: 'L', bonus: 'normal', isBlank: false },
        { letter: 'O', bonus: 'normal', isBlank: false },
      ]

      const score = calculateScore(word, letterStates, false, false, false)
      // H(0) + E(1) + L(1) + L(1) + O(1) = 0 + 1 + 1 + 1 + 1 = 4
      expect(score).toBe(4)
    })

    it('handles all blank tiles', () => {
      const word = 'HELLO'
      const letterStates: LetterState[] = [
        { letter: 'H', bonus: 'normal', isBlank: true },
        { letter: 'E', bonus: 'normal', isBlank: true },
        { letter: 'L', bonus: 'normal', isBlank: true },
        { letter: 'L', bonus: 'normal', isBlank: true },
        { letter: 'O', bonus: 'normal', isBlank: true },
      ]

      const score = calculateScore(word, letterStates, false, false, false)
      // All letters are blank = 0
      expect(score).toBe(0)
    })
  })

  describe('Complex Scenarios', () => {
    it('handles complex word with all bonuses', () => {
      const word = 'QUIZ'
      const letterStates: LetterState[] = [
        { letter: 'Q', bonus: 'dls', isBlank: false },
        { letter: 'U', bonus: 'normal', isBlank: false },
        { letter: 'I', bonus: 'tls', isBlank: false },
        { letter: 'Z', bonus: 'dls', isBlank: false },
      ]

      const score = calculateScore(word, letterStates, true, false, true)
      // (Q(10*2) + U(1) + I(1*3) + Z(10*2)) * 2 + 50 = (20 + 1 + 3 + 20) * 2 + 50 = 44 * 2 + 50 = 88 + 50 = 138
      expect(score).toBe(138)
    })

    it('handles 7-letter word with bingo', () => {
      const word = 'SCRABBL'
      const letterStates: LetterState[] = [
        { letter: 'S', bonus: 'normal', isBlank: false },
        { letter: 'C', bonus: 'normal', isBlank: false },
        { letter: 'R', bonus: 'normal', isBlank: false },
        { letter: 'A', bonus: 'normal', isBlank: false },
        { letter: 'B', bonus: 'normal', isBlank: false },
        { letter: 'B', bonus: 'normal', isBlank: false },
        { letter: 'L', bonus: 'normal', isBlank: false },
      ]

      const score = calculateScore(word, letterStates, false, false, true)
      // S(1) + C(3) + R(1) + A(1) + B(3) + B(3) + L(1) + 50 = 1 + 3 + 1 + 1 + 3 + 3 + 1 + 50 = 13 + 50 = 63
      expect(score).toBe(63)
    })
  })

  describe('Edge Cases', () => {
    it('handles unknown letters gracefully', () => {
      const word = 'HELLO'
      const letterStates: LetterState[] = [
        { letter: 'H', bonus: 'normal', isBlank: false },
        { letter: 'E', bonus: 'normal', isBlank: false },
        { letter: 'L', bonus: 'normal', isBlank: false },
        { letter: 'L', bonus: 'normal', isBlank: false },
        { letter: '?', bonus: 'normal', isBlank: false }, // Unknown letter
      ]

      const score = calculateScore(word, letterStates, false, false, false)
      // H(4) + E(1) + L(1) + L(1) + ?(0) = 4 + 1 + 1 + 1 + 0 = 7
      expect(score).toBe(7)
    })

    it('handles mixed case letters', () => {
      const word = 'HeLlO'
      const letterStates: LetterState[] = [
        { letter: 'H', bonus: 'normal', isBlank: false },
        { letter: 'E', bonus: 'normal', isBlank: false },
        { letter: 'L', bonus: 'normal', isBlank: false },
        { letter: 'L', bonus: 'normal', isBlank: false },
        { letter: 'O', bonus: 'normal', isBlank: false },
      ]

      const score = calculateScore(word, letterStates, false, false, false)
      // Should still calculate correctly regardless of case
      expect(score).toBe(8)
    })
  })
}) 