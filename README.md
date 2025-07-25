# Scrabber: score keeper for Scrabble

A modern web application for tracking Scrabble scores with automatic calculation and visual tile representation. Built with Next.js, React, and TypeScript.

## Features

- **Game Setup**: Support for 1-4 players with custom names
- **Visual Tile Representation**: Each letter displayed as a tile with its point value
- **Automatic Score Calculation**: Handles letter bonuses (DLS/TLS), word multipliers (DWS/TWS), and bingo bonuses
- **Turn History**: Visual representation of played words with scores
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Real-time Updates**: Instant score calculation and turn confirmation

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Testing

Run the test suite:

```bash
npm test
# or
npm run test:watch
# or
npm run test:coverage
```

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **UI Library**: React 19 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Testing**: Jest with React Testing Library
- **Icons**: Lucide React

## Project Structure

- `app/` - Next.js app router pages and layout
- `components/ui/` - Reusable UI components
- `__tests__/` - Test files organized by feature
- `docs/` - Project documentation including PRD
- `lib/` - Utility functions and score calculation logic

## License

This project is private and proprietary.

v1
