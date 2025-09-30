# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Scrabber is a modern web-based Scrabble score keeper built with Next.js 15, React 19, and TypeScript. The application provides real-time score calculation, visual tile representation, and supports 1-4 players with automatic turn management.

## Development Commands

### Core Development
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production application
- `npm start` - Start production server
- `npm run lint` - Run ESLint checks

### Testing
- `npm test` - Run Jest test suite
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report

## Architecture & Structure

### Key Directories
- `app/` - Next.js App Router pages (layout.tsx, page.tsx)
- `components/ui/` - Reusable UI components following shadcn/ui patterns
- `lib/` - Utility functions and shared logic
- `__tests__/` - Jest tests organized by feature area
- `styles/` - SCSS files using SUIT CSS naming convention
- `docs/` - Project documentation including PRD

### Technology Stack
- **Framework**: Next.js 15 with App Router
- **UI**: React 19 with TypeScript
- **Styling**: SCSS with SUIT CSS naming convention (migrated from Tailwind)
- **Testing**: Jest with React Testing Library
- **UI Components**: shadcn/ui with Radix primitives
- **Icons**: Lucide React

### State Management
The application uses React hooks for client-side state management:
- Game state (players, scores, turns) managed in main component
- No external state management library
- Session persistence through browser memory only

### Component Architecture
- `components/ui/` contains reusable components (Button, Card, Input, Checkbox, Tile)
- Main game logic in `app/page.tsx` as a single-page application
- Custom Tile component for Scrabble letter representation with bonus states
- SUIT CSS naming: `.ComponentName[--modifier][__descendant]`

### Styling System
Uses SCSS with SUIT CSS naming convention:
- CSS custom properties for design tokens
- Component-specific SCSS files in `styles/components/`
- Utility classes follow `.u-{property}-{value}` pattern
- Dark mode support through CSS custom properties
- Main entry point: `styles/main.scss`

### Score Calculation Logic
Located in main component with support for:
- Standard Scrabble letter values (A=1, B=3, etc.)
- Double/Triple Letter Score (DLS/TLS) bonuses
- Double/Triple Word Score (DWS/TWS) multipliers
- Blank tile handling (0 points)
- 7-letter bingo bonus (+50 points)

### Testing Strategy
- Jest with jsdom environment
- React Testing Library for component testing
- Tests organized by feature in `__tests__/` directory
- Module path mapping: `@/*` resolves to project root
- SWC for fast TypeScript compilation in tests

## Key Implementation Details

### Game Flow
1. Game setup: Select 1-4 players and enter names
2. Turn entry: Input word with visual tile representation
3. Bonus selection: Click tiles to cycle through normal/DLS/TLS states
4. Word multipliers: Separate checkboxes for DWS/TWS
5. Score calculation: Automatic with turn confirmation
6. History tracking: Visual turn history with scores

### Core Components
- **Tile**: Custom component with letter, point value, and bonus state visualization
- **Game State**: Single source of truth in main page component
- **Turn Management**: Automatic player rotation with visual indicators
- **Score Display**: Real-time totals and detailed turn history

## Development Notes

- All components use TypeScript with strict type checking
- SCSS compilation handled automatically by Next.js
- No backend required - purely client-side application
- Responsive design works on desktop, tablet, and mobile
- Uses modern React patterns (hooks, functional components)
- Path aliases configured for clean imports (`@/` prefix)