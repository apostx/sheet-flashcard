# Sheet Flashcard Project Documentation

## Overview
A static SPA for universal flashcards (any topic/description pairs), deployed to GitHub Pages at https://apostx.github.io/sheet-flashcard/

## Technology Stack
- TypeScript with React 19
- Vite for bundling
- Tailwind CSS v4 for styling
- Native fetch API for data fetching
- gh-pages for deployment

## Architecture
No backend, database, or authentication layer exists. The application reads exclusively from public Google Sheets using CSV export endpoints. Client-side only (static SPA).

## Project Structure
```
src/
├── components/    # React components (Flashcard, FlashcardDeck, ThemeToggle)
├── hooks/         # Custom hooks (useAudio, useTheme)
├── services/      # API services (spreadsheetService)
├── styles/        # CSS files
├── types/         # TypeScript type definitions
└── utils/         # Utility functions (urlUtils, urlParams)
```

## Key Features
- Interactive flashcards with flip animation
- Audio playback for both sides
- Autoplay mode with customizable timing
- Dark/light theme toggle
- Shuffle mode and direction toggle
- Card repetition count support
- URL parameters for customization (spreadsheetId, sheetId, flipTime, nextTime, debug)

## Data Source
Google Spreadsheet structure:
- Column 1: Front side content (required)
- Column 2: Front audio URL (optional)
- Column 3: Back side content (required)
- Column 4: Back audio URL (optional)
- Column 5: Repetition count (optional, default: 1)

## Claude Hooks
Pre-tool-call hook (`.claude/hooks/pre-tool-call.sh`) enforces:
- Package validation: blocks unapproved npm packages (ask user first)
- Conventional commit format enforcement
- Build verification before commits/pushes

## Important Guidelines
- Use conventional commits (feat:/fix:/docs:/refactor:)
- Bump semantic version before committing code changes
- Always verify builds pass before proceeding (`npm run build`)
- Update the CLAUDE.md context file after completing significant changes
- Do NOT add Co-Authored-By or AI attribution to commits
