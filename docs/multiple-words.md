# Multiple Words per Turn Feature Specification

## Overview

This specification defines the implementation of multiple word scoring functionality for Scrabber. When a player's move creates multiple words simultaneously (e.g., adding "S" to "TRACK" to create both "TRACKS" and a perpendicular word), all words must be scored as part of the same turn.

## User Stories

### Epic: Multiple Word Scoring
**As a Scrabble player, I want to score multiple words created in a single turn so that my score accurately reflects all words formed by my move.**

#### Story 1: Add Additional Words to Turn
**As a player, I want to add additional words to my current turn entry so that I can score all words created by my move.**

**Acceptance Criteria:**
- GIVEN I am entering a turn
- WHEN I click an "Add Word" button
- THEN a new word entry section appears
- AND I can enter the additional word with its own bonuses
- AND the additional word contributes to my total turn score

#### Story 2: Visual Multiple Word Display
**As a player, I want to see all words in my current turn clearly displayed so that I can verify my entries before confirming.**

**Acceptance Criteria:**
- GIVEN I have multiple words in my turn
- WHEN I view the turn entry area
- THEN each word is displayed as a separate tile section
- AND each word shows its individual calculated score
- AND the total combined score is prominently displayed

#### Story 3: Remove Additional Words
**As a player, I want to remove additional words from my turn so that I can correct mistakes.**

**Acceptance Criteria:**
- GIVEN I have added additional words to my turn
- WHEN I click a remove button next to a word
- THEN that word is removed from the turn
- AND the total score is recalculated
- AND I cannot remove the primary word (first word)

#### Story 4: Multiple Word Turn History
**As a player, I want to see multiple words displayed in the turn history so that I can review past complex turns.**

**Acceptance Criteria:**
- GIVEN I have confirmed a turn with multiple words
- WHEN I view the turn history
- THEN all words from that turn are displayed
- AND the total score for the turn is shown
- AND individual word scores are visible

## Functional Requirements

### FR1: Enhanced Turn Data Structure
- Modify the `Turn` interface to support multiple words
- Each word maintains its own letter states, bonuses, and calculated score
- No migration needed since data only exists during browser session

### FR2: Dynamic Word Entry UI
- Add "+ Add Word" button to turn entry area
- Each word entry includes:
  - Word input field
  - Tile visualization with bonus selection
  - Individual score display
  - Remove button (except for primary word)

### FR3: Score Calculation Enhancement
- Calculate individual scores for each word
- Sum all word scores for total turn score
- Apply bingo bonus to total if applicable (7+ total tiles used)
- Maintain existing letter and word bonus logic per word

### FR4: Turn History Enhancement
- Display multiple words in compact format
- Show total turn score prominently
- Provide expandable view for detailed word breakdown

## Technical Requirements

### TR1: Data Model Changes
```typescript
interface WordEntry {
  word: string
  letterStates: LetterState[]
  score: number
  bonuses: string[]
}

interface Turn {
  player: string
  words: WordEntry[]  // Array of words created in this turn
  totalScore: number
  hasBingo: boolean
}
```

### TR2: Component Architecture
- Create `MultiWordEntry` component
- Create `WordEntryRow` component for individual words
- Enhance `Turn` history display component
- Single-word turns display as first word in array

### TR3: State Management
- Extend current turn state to handle multiple words
- Implement add/remove word functionality
- Preserve existing turn confirmation flow

## Acceptance Criteria (Gherkin Format)

### Feature: Multiple Word Entry

```gherkin
Scenario: Adding a second word to turn
  Given I am on the game page with a game in progress
  And I have entered "TRACK" as my primary word
  When I click the "Add Word" button
  Then I should see a second word entry section
  And the second word entry should have its own input field
  And the second word entry should have tile visualization
  And the total turn score should update when I enter the second word

Scenario: Calculating score for multiple words
  Given I have entered "TRACK" worth 11 points as my primary word
  And I have added "TRACKS" worth 13 points as a second word
  When I view the turn score
  Then the total turn score should display 24 points
  And each word should show its individual score
  And the scores should update when I apply bonuses to either word

Scenario: Removing additional words
  Given I have "TRACK" as my primary word
  And I have added "TRACKS" as a second word
  When I click the remove button next to "TRACKS"
  Then the "TRACKS" word entry should be removed
  And the total score should recalculate to only include "TRACK"
  And I should not see a remove button next to the primary word

Scenario: Confirming turn with multiple words
  Given I have entered multiple words with a total score of 24
  When I click "Confirm Turn"
  Then the turn should be added to history with all words
  And the current player's score should increase by 24
  And the turn entry should reset for the next player
  And the turn history should display the multiple words

Scenario: Viewing multiple word history
  Given a turn was confirmed with words "TRACK" (11 pts) and "TRACKS" (13 pts)
  When I view the turn history
  Then I should see both words listed for that turn
  And the total score of 24 should be displayed
  And the individual word scores should be visible
```

## Implementation Breakdown

Given the complexity and scope of this feature, it should be broken down into the following subtasks for iterative development:

### Subtask 1: Data Model Foundation (Complexity: 1, Files: 1)
**Deliverable:** Updated data structures for multiple words

**Files Modified:**
- `app/page.tsx` (interface definitions and turn creation)

**Tasks:**
- Update `Turn` interface to support multiple words
- Create `WordEntry` interface
- Update turn creation and display logic
- No migration needed (session-only data)

**Acceptance Criteria:**
- Single-word turns work as first word in array
- New data structure supports multiple words
- All existing functionality preserved

### Subtask 2: Core Multiple Word State Management (Complexity: 3, Files: 1)
**Deliverable:** Backend logic for managing multiple words in turn state

**Files Modified:**
- `app/page.tsx` (state management)

**Tasks:**
- Implement multiple word state management
- Add/remove word functionality
- Enhanced score calculation for multiple words
- Update turn confirmation logic

**Acceptance Criteria:**
- Can add up to 5 words per turn
- Score calculation works correctly for multiple words
- Turn confirmation creates proper Turn object
- Bingo bonus applies correctly

### Subtask 3: Multiple Word Entry UI Components (Complexity: 3, Files: 2-3)
**Deliverable:** User interface for entering multiple words

**Files Modified:**
- `app/page.tsx` (UI components)
- `components/ui/` (new components if needed)

**Tasks:**
- Create multi-word entry interface
- Add "Add Word" button functionality
- Implement word removal UI
- Update turn score display

**Acceptance Criteria:**
- Clean, intuitive multiple word entry interface
- Add/remove word buttons work correctly
- Real-time score updates for all words
- Responsive design maintained

### Subtask 4: Enhanced Turn History Display (Complexity: 2, Files: 1)
**Deliverable:** Updated turn history to show multiple words

**Files Modified:**
- `app/page.tsx` (turn history display)

**Tasks:**
- Update turn history component to show multiple words
- Display multiple words in compact format
- Show individual and total scores
- Maintain existing styling consistency

**Acceptance Criteria:**
- Multiple words display clearly in history
- Total and individual scores visible
- Compact format fits existing design
- Single-word turns display as normal (first word in array)

### Subtask 5: Enhanced Testing & Polish (Complexity: 2, Files: 3-4)
**Deliverable:** Comprehensive testing and UI polish

**Files Modified:**
- `__tests__/` (new test files)
- `app/page.tsx` (edge case handling)

**Tasks:**
- Add comprehensive test coverage
- Handle edge cases (empty words, duplicate words)
- UI polish and accessibility improvements
- Performance optimization

**Acceptance Criteria:**
- >90% test coverage for new functionality
- All edge cases handled gracefully
- Accessibility requirements met
- No performance regressions

## Technical Considerations

### Performance
- Limit maximum words per turn (suggest 5) to prevent UI clutter
- Optimize re-renders when adding/removing words
- Lazy load turn history details for large game sessions

### Accessibility
- Proper ARIA labels for multiple word sections
- Keyboard navigation between word entries
- Screen reader friendly word removal buttons

### Data Validation
- Prevent empty words from being added
- Validate minimum word length (2+ characters)
- Handle special characters appropriately

### Mobile Responsiveness
- Stacked word entry layout on mobile
- Touch-friendly add/remove buttons
- Maintain usability on small screens

## Deployment Strategy

### Phase 1: Foundation (Subtask 1) ✅ Complete
Data structure updated to support multiple words. Single-word functionality unchanged.

### Phase 2: Core Logic (Subtask 2)
Enhanced state management for multiple words. Single-word UI with multiple-word backend.

### Phase 3: UI Enhancement (Subtasks 3-4)
Multiple word entry interface and enhanced history display.

### Phase 4: Polish (Subtask 5)
Testing improvements and final polish.

## Risk Mitigation

### Technical Risks
- **Performance degradation**: Performance testing with large turn histories
- **Mobile usability**: Extensive mobile device testing
- **State complexity**: Careful state management for multiple words

### User Experience Risks
- **Complexity**: Progressive disclosure with simple primary interface
- **Learning curve**: Maintain existing single-word workflow as default
- **Visual clutter**: Clean, minimal multiple-word interface

## Success Metrics

### User Adoption
- % of games using multiple word feature
- Average words per turn when feature is used
- User feedback scores

### Technical Performance
- Page load time impact < 5%
- Turn confirmation time < 200ms
- Zero data corruption incidents

### Quality Metrics
- Test coverage > 90%
- Zero critical bugs in first month
- Mobile compatibility score > 95%
- No session data corruption