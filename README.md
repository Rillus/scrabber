# Scrabber: score keeper for Scrabble

A modern web application for tracking Scrabble scores with automatic calculation and visual tile representation. Built with Next.js 15, React 19, and TypeScript.

## Features

### Core Gameplay
- **Game Setup**: Support for 1-4 players with custom names
- **Visual Tile Representation**: Each letter displayed as a tile with its point value
- **Automatic Score Calculation**: Handles letter bonuses (DLS/TLS), word multipliers (DWS/TWS), and bingo bonuses
- **Multiple Words per Turn**: Score up to 5 additional words created in a single turn
- **Skip Turn**: Option to skip a player's turn without entering a word
- **Turn History**: Visual representation of played words with scores and turn details
- **Turn Editing**: Edit previous turns to correct mistakes
- **Session Persistence**: Game state automatically saved to browser localStorage

### User Experience
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Real-time Updates**: Instant score calculation and turn confirmation
- **Blank Tile Support**: Mark tiles as blanks (worth 0 points) while maintaining letter display
- **Bingo Bonus**: Automatic detection and application of 50-point bonus for 7-letter words

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

Clone the repository and install dependencies:

```bash
npm install
```

### Development

Start the development server with Turbopack:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

### Building for Production

```bash
npm run build
npm start
```

## Testing

Run the test suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Generate test coverage report:

```bash
npm run test:coverage
```

## Technology Stack

### Core Framework
- **Next.js**: 15.2.4 with App Router
- **React**: 19.0.0 with TypeScript
- **TypeScript**: 5.x with strict type checking

### Styling
- **SCSS**: Custom styling architecture with SUIT CSS naming convention
- **Design System**: CSS custom properties for theming and dark mode support
- **Component Styles**: Modular SCSS files for each UI component
- **Utility Classes**: Custom utility classes following `.u-{property}-{value}` pattern

### UI Components
- **shadcn/ui**: Component library with Radix UI primitives
- **Radix UI**: Accessible component primitives (Checkbox, Slot)
- **Lucide React**: Icon library

### Development Tools
- **Turbopack**: Fast bundler for development (enabled by default)
- **ESLint**: 9.x with Next.js configuration
- **SWC**: Fast TypeScript/JavaScript compiler for Jest

### Testing
- **Jest**: 30.0.5 with jsdom environment
- **React Testing Library**: 16.3.0 for component testing
- **@swc/jest**: Fast TypeScript compilation in tests

## Project Structure

```
scrabber/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with global styles
│   └── page.tsx           # Main Scrabble score keeper component
├── components/
│   └── ui/                # Reusable UI components
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── checkbox.tsx
│       ├── input.tsx
│       └── tile.tsx       # Custom Scrabble tile component
├── lib/                    # Utility functions
│   └── utils.ts           # Shared utilities
├── styles/                 # SCSS styling system
│   ├── main.scss          # Main entry point
│   ├── base/              # Base styles (reset, typography, variables)
│   ├── components/        # Component-specific styles
│   ├── layout/            # Layout styles
│   └── utilities/         # Utility classes
├── __tests__/             # Test files organized by feature
│   ├── app/
│   ├── components/
│   └── lib/
├── docs/                  # Project documentation
│   ├── PRD.md            # Product Requirements Document
│   └── multiple-words.md # Multiple words feature spec
└── types/                 # TypeScript type definitions
```

## Styling System

This project uses **SCSS with SUIT CSS naming convention** instead of Tailwind CSS. The styling system provides:

- **Component-based styling**: Each component has its own SCSS file
- **SUIT CSS naming**: `.ComponentName[--modifier][__descendant]` pattern
- **CSS custom properties**: Design tokens for consistent theming
- **Utility classes**: `.u-{property}-{value}` pattern for common utilities
- **Dark mode support**: Through CSS custom properties

See [STYLING.md](./STYLING.md) for detailed styling guidelines.

## Game Features in Detail

### Multiple Words per Turn
When a player's move creates multiple words simultaneously (e.g., adding "S" to "TRACK" to create both "TRACKS" and a perpendicular word), all words can be scored as part of the same turn. Up to 5 additional words can be added to a single turn.

### Score Calculation
- Standard Scrabble letter values (A=1, B=3, C=3, etc.)
- Double/Triple Letter Score (DLS/TLS) bonuses per letter
- Double/Triple Word Score (DWS/TWS) multipliers per word
- Blank tile handling (0 points)
- 7-letter bingo bonus (+50 points)

### Session Persistence
Game state is automatically saved to browser localStorage and restored when the page is refreshed. This includes:
- Player names and scores
- Current turn state
- Turn history
- Current player index

## Development Notes

- All components use TypeScript with strict type checking
- SCSS compilation handled automatically by Next.js
- No backend required - purely client-side application
- Path aliases configured for clean imports (`@/` prefix)
- Modern React patterns (hooks, functional components)

## License

This project is private and proprietary.
