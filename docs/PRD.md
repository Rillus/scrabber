# Product Requirements Document: Scrabble Score Keeper

## 1. Introduction
This document outlines the requirements for a web-based application designed to help users efficiently track scores during a game of Scrabble. The application will simplify scorekeeping by allowing players to input words, mark bonus squares, and automatically calculate scores for each turn, maintaining a running total for up to four players.

## 2. Goals
- [x] To provide an intuitive and easy-to-use interface for tracking Scrabble scores.
- [x] To automate score calculations, reducing manual errors and speeding up gameplay.
- [x] To offer a clear overview of current player scores and a history of played words.
- [x] To support 1 to 4 players in a single game session.

## 3. User Roles
- [x] Player: Anyone participating in a Scrabble game who needs to track scores.

## 4. User Stories / Features

### Game Setup
- [x] As a player, I want to start a new game so I can begin tracking scores for my current Scrabble session.
- [x] As a player, I want to specify the number of players (1-4) at the start of a new game so the app can track scores for everyone involved.
- [x] As a player, I want to enter player names at the start of a new game so I can easily identify each player's score.

### Turn Management & Score Entry
- [x] As a player, I want to enter the word played for the current turn.
- [x] As a player, I want to be able to select individual letters of the entered word that land on Double Letter Score (DLS) or Triple Letter Score (TLS) squares so their values are correctly multiplied.
- [x] As a player, I want to be able to select if the word lands on a Double Word Score (DWS) or Triple Word Score (TWS) square so the entire word's score is correctly multiplied.
- [x] As a player, I want the app to automatically calculate the score for the entered word, taking into account letter values and bonus squares.
- [x] As a player, I want to be able to indicate if a blank tile was used for a letter, and specify what letter it represents, so its score contribution is zero but the word is correct.
- [x] As a player, I want to confirm the turn to add the calculated score to the current player's total.

### Score Display & History
- [x] As a player, I want to see the current score for each player clearly displayed.
- [x] As a player, I want to see a running list of all words played and their individual scores for the current game, ordered chronologically.

### Game End
- [x] As a player, I want an option to end the game to finalize scores and potentially start a new one.

## 5. Functional Requirements

### 5.1 Game Initialization
- [x] Player Count: Must allow selection of 1, 2, 3, or 4 players.
- [x] Player Names: Input fields for each player's name.
- [x] Game Reset: A "New Game" button or similar clear action to reset all scores and game history.

### 5.2 Word and Score Input
- [x] Word Input Field: A text input for the word played.
- [x] Letter Value Mapping: The system must contain a mapping of standard Scrabble letter values (A=1, B=3, C=3, D=2, E=1, F=4, G=2, H=4, I=1, J=8, K=5, L=1, M=3, N=1, O=1, P=3, Q=10, R=1, S=1, T=1, U=1, V=4, W=4, X=8, Y=4, Z=10).

#### Bonus Square Selection:
- [x] For each letter in the entered word, the user should be able to toggle/select if it's on a DLS or TLS square. This could be implemented with a visual representation of the word where each letter can be clicked to cycle through states (normal, DLS, TLS).
- [x] Separate checkboxes or buttons for DWS and TWS for the entire word.
- [x] Blank Tile Handling: If a blank tile is used, its score value is 0. The app should allow the user to indicate a specific letter within the word was a blank.

### 5.3 Score Calculation Logic
#### Letter Score Calculation:
- [x] Iterate through each letter in the word.
- [x] Get its base value.
- [x] If DLS, multiply by 2.
- [x] If TLS, multiply by 3.
- [x] Sum up all letter scores to get the base word score.

#### Word Score Multiplier:
- [x] If DWS, multiply the base word score by 2.
- [x] If TWS, multiply the base word score by 3.
- [x] (Note: If both DWS/TWS apply to the same word, they multiply sequentially, e.g., TWS then DWS, but typically only one applies per word. Clarification needed on specific Scrabble rules if multiple word multipliers could ever apply from different tiles on one turn). For simplicity, assume only one word multiplier applies.

#### 7-Letter Bonus:
- [x] If the word uses all 7 tiles from a player's rack (a "bingo"), add 50 points to the final score. The app should have a way to easily toggle/add this bonus if the user achieved it.

#### Running Total:
- [x] Add the calculated turn score to the current player's total score.

### 5.4 Data Display
- [x] Current Scores: Clear display of each player's name and their total score.
- [x] Turn History: A scrollable list showing:
  - [x] Player name for the turn.
  - [x] Word played.
  - [x] Score for that word.

## 6. Non-Functional Requirements

### Usability:
- [x] Intuitive and clean user interface.
- [x] Responsive design to work well on various screen sizes (desktop, tablet, mobile).
- [x] Clear feedback on score calculation and turn confirmation.

### Performance:
- [x] Score calculation should be instantaneous.
- [x] UI should be fluid and responsive to user input.

### Compatibility:
- [x] Accessible via modern web browsers (Chrome, Firefox, Safari, Edge).

### Accuracy:
- [x] Score calculations must adhere to standard Scrabble rules.

### Data Persistence (within session):
- [x] Scores and game history must persist for the duration of the browser session (e.g., if the user navigates away and returns to the tab). No long-term storage required for MVP.

## 7. Technical Considerations (High-Level)

### Frontend:
- [x] HTML: For structuring the content.
- [x] CSS: For styling (e.g., Tailwind CSS for rapid development and responsiveness).
- [x] JavaScript: For all interactive elements, logic, and state management. A framework like React is recommended for managing UI state efficiently and component-based development.
- [x] No Backend Required for MVP: For session-based scorekeeping, all logic and data can reside client-side in the browser's memory.
- [x] State Management: React's useState and useReducer hooks would be suitable for managing game state (players, scores, turn history).

## 8. Future Enhancements (Out of Scope for MVP)
- [ ] Save/Load Games: Allow users to save current games and load them later.
- [ ] Player Statistics: Track average word score, highest word score, etc.
- [ ] Customizable Letter Values: Option to use different Scrabble versions (e.g., UK vs. US values).
- [ ] Undo Last Turn: Ability to correct mistakes.
- [ ] Player Avatars/Colors: Visual customization for players.
- [ ] Timer: Add a turn timer.
- [ ] Dictionary Lookup: Integrate a dictionary API to check word validity (though this is typically a player's responsibility in Scrabble).
- [ ] Multi-Device Sync: If saved games are introduced, allow syncing across multiple devices for a single game (would require a backend).

## Implementation Status Summary

**Core Features Implemented:** ✅ All MVP features have been successfully implemented
- Game setup with 1-4 players and custom names
- Word input with visual tile representation
- Letter bonus selection (DLS/TLS) with clickable tiles
- Word multiplier selection (DWS/TWS)
- Blank tile handling
- 7-letter bingo bonus
- Automatic score calculation
- Turn confirmation and player rotation
- Current score display
- Turn history with visual representation
- New game functionality
- Responsive design with Tailwind CSS
- React-based state management

**Technical Implementation:**
- Built with Next.js and React
- Uses TypeScript for type safety
- Implements shadcn/ui components for consistent UI
- Responsive design that works on desktop, tablet, and mobile
- Client-side state management with React hooks
- No backend required - all data persists in browser session

The application successfully meets all the MVP requirements outlined in this PRD and provides a fully functional Scrabble score keeper with an intuitive, modern interface. 