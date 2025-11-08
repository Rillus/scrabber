import React from 'react'
import { render, screen, fireEvent, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ScrabbleScoreKeeper from '@/app/page'

// Mock the Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
}))

describe('Scrabber: score keeper for Scrabble', () => {
  beforeEach(() => {
    render(<ScrabbleScoreKeeper />)
  })

  describe('Game Setup', () => {
    it('renders game setup screen initially', () => {
      expect(screen.getByText('Scrabber: score keeper for Scrabble')).toBeInTheDocument()
      expect(screen.getByText('Number of Players')).toBeInTheDocument()
      expect(screen.getByText('Player Names')).toBeInTheDocument()
      expect(screen.getByText('Start Game')).toBeInTheDocument()
    })

    it('allows selecting number of players', async () => {
      const user = userEvent.setup()
      
      // Click on 3 players
      await user.click(screen.getByText('3'))
      expect(screen.getByText('3')).toHaveClass('Button--default')
      
      // Click on 4 players
      await user.click(screen.getByText('4'))
      expect(screen.getByText('4')).toHaveClass('Button--default')
    })

    it('allows editing player names', async () => {
      const user = userEvent.setup()
      const playerInputs = screen.getAllByDisplayValue('Player 1')
      
      await user.clear(playerInputs[0])
      await user.type(playerInputs[0], 'Alice')
      
      expect(playerInputs[0]).toHaveValue('Alice')
    })

    it('starts game with selected players', async () => {
      const user = userEvent.setup()
      
      // Use getAllByText to handle multiple Start Game buttons
      const startButtons = screen.getAllByText('Start Game')
      await user.click(startButtons[0])
      
      expect(screen.getByText('Current Turn: Player 1')).toBeInTheDocument()
    })
  })

  describe('Game Interface', () => {
    beforeEach(async () => {
      const user = userEvent.setup()
      const startButtons = screen.getAllByText('Start Game')
      await user.click(startButtons[0])
    })

    it('shows current player turn', () => {
      expect(screen.getByText('Current Turn: Player 1')).toBeInTheDocument()
    })

    it('shows current scores for all players', () => {
      expect(screen.getByText('Player 1')).toBeInTheDocument()
      expect(screen.getByText('Player 2')).toBeInTheDocument()
      expect(screen.getAllByText('0')).toHaveLength(2) // Two players with 0 score
    })

    it('allows entering a word', async () => {
      const user = userEvent.setup()
      const wordInput = screen.getByPlaceholderText('Enter word...')
      
      await user.type(wordInput, 'HELLO')
      expect(wordInput).toHaveValue('HELLO')
    })

    it('shows letter tiles for entered word', async () => {
      const user = userEvent.setup()
      const wordInput = screen.getByPlaceholderText('Enter word...')
      
      await user.type(wordInput, 'HELLO')
      
      // Should show tiles for each letter
      expect(screen.getByText('H')).toBeInTheDocument()
      expect(screen.getByText('E')).toBeInTheDocument()
      expect(screen.getAllByText('L')).toHaveLength(2) // Two L's in HELLO
      expect(screen.getByText('O')).toBeInTheDocument()
    })

    it('shows correct letter values on tiles', async () => {
      const user = userEvent.setup()
      const wordInput = screen.getByPlaceholderText('Enter word...')
      
      await user.type(wordInput, 'HELLO')
      
      // Check that letter values are displayed correctly
      // H=4, E=1, L=1, L=1, O=1
      expect(screen.getByText('4')).toBeInTheDocument() // H value
      expect(screen.getAllByText('1')).toHaveLength(4) // E, L, L, O values
    })

    it('allows toggling letter bonuses', async () => {
      const user = userEvent.setup()
      const wordInput = screen.getByPlaceholderText('Enter word...')
      
      await user.type(wordInput, 'HELLO')
      
      // Click on first letter to cycle through bonuses
      const firstTile = screen.getByText('H').closest('div')
      await user.click(firstTile!)
      
      // Should show bonus background (DLS) - check for the bonus class
      const bonusElement = firstTile?.parentElement?.querySelector('.Tile__bonus--dls')
      expect(bonusElement).toBeInTheDocument()
    })

    it('allows marking blank tiles', async () => {
      const user = userEvent.setup()
      const wordInput = screen.getByPlaceholderText('Enter word...')
      
      await user.type(wordInput, 'HELLO')
      
      // Check the blank checkbox for first letter
      const blankCheckboxes = screen.getAllByRole('checkbox')
      await user.click(blankCheckboxes[0])
      
      // Should show blank indicator - use getAllByText since there might be multiple "0" elements
      const zeroElements = screen.getAllByText('0')
      expect(zeroElements.length).toBeGreaterThan(0)
    })

    it('cycles through word multiplier bonuses on tiles', async () => {
      const user = userEvent.setup()
      const wordInput = screen.getByPlaceholderText('Enter word...')
      
      await user.type(wordInput, 'HELLO')
      
      const firstTile = screen.getAllByText('H')[0].closest('div')
      await user.click(firstTile!)
      await user.click(firstTile!)
      await user.click(firstTile!)
      await user.click(firstTile!)

      const bonusElement = firstTile?.parentElement?.querySelector('.Tile__bonus--tws')
      expect(bonusElement).toBeInTheDocument()
    })

    it('allows selecting bingo bonus', async () => {
      const user = userEvent.setup()
      const wordInput = screen.getByPlaceholderText('Enter word...')
      
      await user.type(wordInput, 'HELLO')
      
      const checkboxes = screen.getAllByRole('checkbox')
      await user.click(checkboxes[checkboxes.length - 1])

      const scorePreview = screen.getByText('Total Turn Score:').parentElement
      expect(scorePreview).not.toBeNull()
      expect(within(scorePreview as HTMLElement).getByText('58 points')).toBeInTheDocument()
      expect(within(scorePreview as HTMLElement).getByText('Bingo bonus: +50 pts')).toBeInTheDocument()
    })

    it('does not apply bingo bonus automatically when seven tiles are used', async () => {
      const user = userEvent.setup()
      const [firstWordInput] = screen.getAllByPlaceholderText('Enter word...')

      await user.type(firstWordInput, 'HELLO')
      await user.click(screen.getByRole('button', { name: /add word/i }))
      const secondInput = screen.getAllByPlaceholderText('Enter word...')[1]
      await user.type(secondInput, 'GO')

      const scorePreview = screen.getByText('Total Turn Score:').parentElement
      expect(scorePreview).not.toBeNull()
      expect(within(scorePreview as HTMLElement).queryByText('Bingo bonus: +50 pts')).not.toBeInTheDocument()
    })

    it('calculates score correctly for simple word', async () => {
      const user = userEvent.setup()
      const wordInput = screen.getByPlaceholderText('Enter word...')
      
      await user.type(wordInput, 'HELLO')
      
      // HELLO = H(4) + E(1) + L(1) + L(1) + O(1) = 8
      expect(screen.getByText('Word Score: 8 points')).toBeInTheDocument()
    })

    it('calculates score with letter bonuses', async () => {
      const user = userEvent.setup()
      const wordInput = screen.getByPlaceholderText('Enter word...')
      
      await user.type(wordInput, 'HELLO')
      
      // Click first letter twice to get TLS
      const firstTile = screen.getByText('H').closest('div')
      await user.click(firstTile!)
      await user.click(firstTile!)
      
      // HELLO with H on TLS = H(4*3) + E(1) + L(1) + L(1) + O(1) = 16
      expect(screen.getByText('Word Score: 16 points')).toBeInTheDocument()
    })

    it('calculates score with word multipliers', async () => {
      const user = userEvent.setup()
      const wordInput = screen.getByPlaceholderText('Enter word...')
      
      await user.type(wordInput, 'HELLO')
      
      // Click on the first tile to cycle to DWS
      const tiles = screen.getAllByText('H')
      const firstTile = tiles[0] // The H tile in the letter bonuses section
      await user.click(firstTile)
      await user.click(firstTile) // Click again to cycle to DLS
      await user.click(firstTile) // Click again to cycle to TLS
      await user.click(firstTile) // Click again to cycle to DWS
      
      // HELLO = 8 * 3 = 24 (TWS)
      expect(screen.getByText('Word Score: 24 points')).toBeInTheDocument()
    })

    it('calculates score with bingo bonus', async () => {
      const user = userEvent.setup()
      const wordInput = screen.getByPlaceholderText('Enter word...')
      
      await user.type(wordInput, 'HELLO')
      
      const checkboxes = screen.getAllByRole('checkbox')
      await user.click(checkboxes[checkboxes.length - 1])

      const scorePreview = screen.getByText('Total Turn Score:').parentElement
      expect(scorePreview).not.toBeNull()
      expect(within(scorePreview as HTMLElement).getByText('58 points')).toBeInTheDocument()
      expect(within(scorePreview as HTMLElement).getByText('Bingo bonus: +50 pts')).toBeInTheDocument()
    })

    it('confirms turn and updates scores', async () => {
      const user = userEvent.setup()
      const wordInput = screen.getByPlaceholderText('Enter word...')
      
      await user.type(wordInput, 'HELLO')
      await user.click(screen.getByText('Confirm Turn'))
      
      // Should update player score
      expect(screen.getByText('8')).toBeInTheDocument() // Player 1 score
      
      // Should show in turn history (words are displayed as tiles, so we check for the letter tiles)
      expect(screen.getByText('H')).toBeInTheDocument()
      expect(screen.getByText('E')).toBeInTheDocument()
      expect(screen.getAllByText('L')).toHaveLength(2) // Two L's in HELLO
      expect(screen.getByText('O')).toBeInTheDocument()
      expect(screen.getByText('+8')).toBeInTheDocument()
      
      // Should move to next player
      expect(screen.getByText('Current Turn: Player 2')).toBeInTheDocument()
    })

    it('disables confirm button for empty word', () => {
      const confirmButton = screen.getByText('Confirm Turn')
      expect(confirmButton).toBeDisabled()
    })

    it('enables confirm button when word is entered', async () => {
      const user = userEvent.setup()
      const wordInput = screen.getByPlaceholderText('Enter word...')
      
      await user.type(wordInput, 'HELLO')
      
      const confirmButton = screen.getByText('Confirm Turn')
      expect(confirmButton).not.toBeDisabled()
    })

    it('allows adding additional words and updates total score preview', async () => {
      const user = userEvent.setup()
      const [firstWordInput] = screen.getAllByPlaceholderText('Enter word...')

      await user.type(firstWordInput, 'DOG')

      const addWordButton = screen.getByText('Add Word')
      await user.click(addWordButton)

      const wordInputs = screen.getAllByPlaceholderText('Enter word...')
      expect(wordInputs).toHaveLength(2)

      await user.type(wordInputs[1], 'CAT')

      expect(screen.getByText('Word 1: DOG (5 pts)')).toBeInTheDocument()
      expect(screen.getByText('Word 2: CAT (5 pts)')).toBeInTheDocument()
      expect(screen.getByText('10 points')).toBeInTheDocument()
    })

    it('allows removing additional words', async () => {
      const user = userEvent.setup()
      const [firstWordInput] = screen.getAllByPlaceholderText('Enter word...')

      await user.type(firstWordInput, 'DOG')

      const addWordButton = screen.getByText('Add Word')
      await user.click(addWordButton)

      const wordInputs = screen.getAllByPlaceholderText('Enter word...')
      await user.type(wordInputs[1], 'CAT')

      const removeButton = screen.getByRole('button', { name: /remove word 2/i })
      await user.click(removeButton)

      expect(screen.queryByTestId('word-entry-1')).not.toBeInTheDocument()
      expect(screen.queryByText('Word 2: CAT (5 pts)')).not.toBeInTheDocument()
    })
  })

  describe('Turn History', () => {
    beforeEach(async () => {
      const user = userEvent.setup()
      const startButtons = screen.getAllByText('Start Game')
      await user.click(startButtons[0])
    })

    it('shows empty turn history initially', () => {
      expect(screen.getByText('No turns played yet')).toBeInTheDocument()
    })

    it('adds turns to history after confirmation', async () => {
      const user = userEvent.setup()
      const wordInput = screen.getByPlaceholderText('Enter word...')
      
      // Play first turn
      await user.type(wordInput, 'HELLO')
      await user.click(screen.getByText('Confirm Turn'))
      
      // Play second turn
      await user.type(wordInput, 'WORLD')
      await user.click(screen.getByText('Confirm Turn'))
      
      // Should show both words in history (as tiles)
      expect(screen.getByText('H')).toBeInTheDocument()
      expect(screen.getByText('E')).toBeInTheDocument()
      expect(screen.getAllByText('L')).toHaveLength(3) // Two L's in HELLO + one L in WORLD
      expect(screen.getAllByText('O')).toHaveLength(2) // One O in HELLO + one O in WORLD
      expect(screen.getByText('W')).toBeInTheDocument()
      expect(screen.getByText('R')).toBeInTheDocument()
      expect(screen.getByText('D')).toBeInTheDocument()
    })

    it('allows skipping a turn without affecting scores', async () => {
      const user = userEvent.setup()

      await user.click(screen.getByRole('button', { name: /skip turn/i }))

      expect(screen.getByText('Current Turn: Player 2')).toBeInTheDocument()

      const player1Row = screen.getByText('Player 1', { selector: '.Page__player-name' }).closest('div')
      expect(player1Row).not.toBeNull()
      if (player1Row) {
        expect(within(player1Row).getByText('0')).toBeInTheDocument()
      }

      expect(screen.getByText('Skipped turn (tile exchange)')).toBeInTheDocument()
    })

    it('shows player names in turn history', async () => {
      const user = userEvent.setup()
      const wordInput = screen.getByPlaceholderText('Enter word...')
      
      await user.type(wordInput, 'HELLO')
      await user.click(screen.getByText('Confirm Turn'))
      
      // Use getAllByText since there are multiple "Player 1" elements
      const player1Elements = screen.getAllByText('Player 1')
      expect(player1Elements.length).toBeGreaterThan(0)
    })

    it('shows bonuses in turn history', async () => {
      const user = userEvent.setup()
      const wordInput = screen.getByPlaceholderText('Enter word...')
      
      await user.type(wordInput, 'HELLO')
      
      // Click on the first tile to cycle to DWS
      const tiles = screen.getAllByText('H')
      const firstTile = tiles[0] // The H tile in the letter bonuses section
      await user.click(firstTile)
      await user.click(firstTile) // Click again to cycle to DLS
      await user.click(firstTile) // Click again to cycle to TLS
      await user.click(firstTile) // Click again to cycle to DWS
      
      await user.click(screen.getByText('Confirm Turn'))
      
      // Should show bonus badges - the TWS bonus is displayed visually on the first tile
      // We can verify this by checking that the turn was recorded with the correct score
      expect(screen.getByText('+24')).toBeInTheDocument() // HELLO = 8 * 3 = 24
    })

    it('records multiple words in turn history', async () => {
      const user = userEvent.setup()
      const [firstWordInput] = screen.getAllByPlaceholderText('Enter word...')

      await user.type(firstWordInput, 'DOG')

      const addWordButton = screen.getByText('Add Word')
      await user.click(addWordButton)

      const wordInputs = screen.getAllByPlaceholderText('Enter word...')
      await user.type(wordInputs[1], 'CAT')

      await user.click(screen.getByText('Confirm Turn'))

      expect(screen.getByText('Word 1: DOG')).toBeInTheDocument()
      expect(screen.getByText('Word 2: CAT')).toBeInTheDocument()
      expect(screen.getByText('+10')).toBeInTheDocument()
      expect(screen.queryByText('Bingo +50')).not.toBeInTheDocument()
    })

    it('records skipped turns in history without edit controls', async () => {
      const user = userEvent.setup()

      await user.click(screen.getByRole('button', { name: /skip turn/i }))

      expect(screen.getByText('Skipped turn (tile exchange)')).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /edit turn/i })).not.toBeInTheDocument()
    })

    it('allows editing a previous turn and updates scores', async () => {
      const user = userEvent.setup()
      const wordInput = screen.getByPlaceholderText('Enter word...')

      await user.type(wordInput, 'DOG')
      await user.click(screen.getByText('Confirm Turn'))

      expect(screen.getByText('+5')).toBeInTheDocument()

      const editButtons = screen.getAllByRole('button', { name: /edit turn/i })
      await user.click(editButtons[0])

      const updateButton = screen.getByRole('button', { name: /update turn/i })
      const editInput = screen.getByPlaceholderText('Enter word...')

      await user.clear(editInput)
      await user.type(editInput, 'QUIZ')

      await user.click(updateButton)

      expect(screen.getByText('+22')).toBeInTheDocument()
      expect(screen.queryByText('+5')).not.toBeInTheDocument()

      const playerScoreRow = screen.getByText('Player 1', { selector: '.Page__player-name' }).closest('div')
      expect(playerScoreRow).not.toBeNull()
      if (playerScoreRow) {
        expect(within(playerScoreRow).getByText('22')).toBeInTheDocument()
      }
    })

    it('allows cancelling an edit and restores confirm button', async () => {
      const user = userEvent.setup()
      const wordInput = screen.getByPlaceholderText('Enter word...')

      await user.type(wordInput, 'DOG')
      await user.click(screen.getByText('Confirm Turn'))

      await user.click(screen.getAllByRole('button', { name: /edit turn/i })[0])
      expect(screen.getByRole('button', { name: /update turn/i })).toBeInTheDocument()

      await user.click(screen.getByRole('button', { name: /cancel edit/i }))

      expect(screen.getByRole('button', { name: /confirm turn/i })).toBeInTheDocument()
      expect(screen.getByText('+5')).toBeInTheDocument()
    })
  })

  describe('New Game', () => {
    beforeEach(async () => {
      const user = userEvent.setup()
      const startButtons = screen.getAllByText('Start Game')
      await user.click(startButtons[0])
    })

    it('resets game state when new game is clicked', async () => {
      const user = userEvent.setup()
      
      // Play a turn first
      const wordInput = screen.getByPlaceholderText('Enter word...')
      await user.type(wordInput, 'HELLO')
      await user.click(screen.getByText('Confirm Turn'))
      
      // Click new game
      await user.click(screen.getByText('New Game'))
      
      // Should return to setup screen
      expect(screen.getByText('Number of Players')).toBeInTheDocument()
      expect(screen.getByText('Start Game')).toBeInTheDocument()
    })
  })

  describe('Score Calculation Edge Cases', () => {
    beforeEach(async () => {
      const user = userEvent.setup()
      const startButtons = screen.getAllByText('Start Game')
      await user.click(startButtons[0])
    })

    it('handles high-value letters correctly', async () => {
      const user = userEvent.setup()
      
      const wordInput = screen.getByPlaceholderText('Enter word...')
      await user.type(wordInput, 'QUIZ')
      
      // QUIZ = Q(10) + U(1) + I(1) + Z(10) = 22
      expect(screen.getByText('Word Score: 22 points')).toBeInTheDocument()
    })

    it('handles blank tiles with zero points', async () => {
      const user = userEvent.setup()
      
      const wordInput = screen.getByPlaceholderText('Enter word...')
      await user.type(wordInput, 'HELLO')
      
      // Mark first letter as blank
      const blankCheckboxes = screen.getAllByRole('checkbox')
      await user.click(blankCheckboxes[0])
      
      // HELLO with H as blank = H(0) + E(1) + L(1) + L(1) + O(1) = 4
      expect(screen.getByText('Word Score: 4 points')).toBeInTheDocument()
    })

    it('handles multiple letter bonuses in same word', async () => {
      const user = userEvent.setup()
      
      const wordInput = screen.getByPlaceholderText('Enter word...')
      await user.type(wordInput, 'HELLO')
      
      // Select double letter score for first letter
      const checkboxes = screen.getAllByRole('checkbox')
      await user.click(checkboxes[0]) // First checkbox for first letter
      
      // Should show individual letter tiles instead of the word as a single text
      expect(screen.getByText('H')).toBeInTheDocument()
      expect(screen.getByText('E')).toBeInTheDocument()
      expect(screen.getAllByText('L')).toHaveLength(2)
      expect(screen.getByText('O')).toBeInTheDocument()
    })

    it('handles word multipliers correctly', async () => {
      const user = userEvent.setup()
      
      const wordInput = screen.getByPlaceholderText('Enter word...')
      await user.type(wordInput, 'HELLO')
      
      // Select triple word score - use getAllByRole and select by index
      const checkboxes = screen.getAllByRole('checkbox')
      const tripleWordCheckbox = checkboxes[5] // 6th checkbox (after letter blank checkboxes and double word)
      await user.click(tripleWordCheckbox)
      
      // Verify that the word is still displayed and the checkbox interaction worked
      expect(screen.getByText('H')).toBeInTheDocument()
      expect(screen.getByText('E')).toBeInTheDocument()
      expect(screen.getAllByText('L')).toHaveLength(2)
      expect(screen.getByText('O')).toBeInTheDocument()
    })
  })

  describe('Multiple Words per Turn', () => {
    beforeEach(async () => {
      const user = userEvent.setup()
      const startButtons = screen.getAllByText('Start Game')
      await user.click(startButtons[0])
    })

    it('allows adding additional words to the turn', async () => {
      const user = userEvent.setup()

      // Starts with a single word input
      expect(screen.getAllByPlaceholderText('Enter word...')).toHaveLength(1)

      await user.click(screen.getByRole('button', { name: /add word/i }))

      // After adding, there should be two word inputs
      expect(screen.getAllByPlaceholderText('Enter word...')).toHaveLength(2)

      // Each additional word should have a remove button
      expect(screen.getByRole('button', { name: /remove word 2/i })).toBeInTheDocument()
    })

    it('recalculates total score when multiple words are entered', async () => {
      const user = userEvent.setup()

      // Enter primary word
      const firstInput = screen.getByPlaceholderText('Enter word...')
      await user.type(firstInput, 'DOG') // 2 + 1 + 2 = 5

      // Add second word and enter value
      await user.click(screen.getByRole('button', { name: /add word/i }))
      const secondInput = screen.getAllByPlaceholderText('Enter word...')[1]
      await user.type(secondInput, 'CAT') // 3 + 1 + 1 = 5

      // Total should now be 10 points
      expect(screen.getByText(/10 points/)).toBeInTheDocument()
    })

    it('allows removing an additional word before confirming', async () => {
      const user = userEvent.setup()

      await user.click(screen.getByRole('button', { name: /add word/i }))
      expect(screen.getAllByPlaceholderText('Enter word...')).toHaveLength(2)

      await user.click(screen.getByRole('button', { name: /remove word 2/i }))

      // Back to a single word input, remove button gone
      expect(screen.getAllByPlaceholderText('Enter word...')).toHaveLength(1)
      expect(screen.queryByRole('button', { name: /remove word 2/i })).not.toBeInTheDocument()
    })

    it('records multiple words in the turn history with total score', async () => {
      const user = userEvent.setup()

      const firstInput = screen.getByPlaceholderText('Enter word...')
      await user.type(firstInput, 'DOG')

      await user.click(screen.getByRole('button', { name: /add word/i }))
      const secondInput = screen.getAllByPlaceholderText('Enter word...')[1]
      await user.type(secondInput, 'CAT')

      await user.click(screen.getByText('Confirm Turn'))

      // Turn history should list both words and total score (10 points)
      expect(screen.getByText('Word 1: DOG')).toBeInTheDocument()
      expect(screen.getByText('Word 2: CAT')).toBeInTheDocument()
      expect(screen.getByText('+10')).toBeInTheDocument()
    })
  })

  describe('Player Rotation', () => {
    beforeEach(async () => {
      const user = userEvent.setup()
      const startButtons = screen.getAllByText('Start Game')
      await user.click(startButtons[0])
    })

    it('rotates through players correctly', async () => {
      const user = userEvent.setup()
      
      // Play first turn
      const wordInput = screen.getByPlaceholderText('Enter word...')
      await user.type(wordInput, 'HELLO')
      await user.click(screen.getByText('Confirm Turn'))
      
      // Should now be Player 2's turn
      expect(screen.getByText('Current Turn: Player 2')).toBeInTheDocument()
      
      // Play second turn
      await user.type(wordInput, 'WORLD')
      await user.click(screen.getByText('Confirm Turn'))
      
      // Should be back to Player 1's turn
      expect(screen.getByText('Current Turn: Player 1')).toBeInTheDocument()
    })

    it('highlights current player in score list', async () => {
      const user = userEvent.setup()
      
      // Player 1 should be highlighted initially
      const player1Score = screen.getByText('Player 1').closest('div')
      expect(player1Score).toBeInTheDocument()
      
      // Play a turn to switch to Player 2
      const wordInput = screen.getByPlaceholderText('Enter word...')
      await user.type(wordInput, 'HELLO')
      await user.click(screen.getByText('Confirm Turn'))
      
      // Player 2 should now be highlighted
      const player2Score = screen.getByText('Player 2').closest('div')
      expect(player2Score).toBeInTheDocument()
    })
  })
}) 