# Sheet Flashcard Project Documentation

## Overview
A static SPA for universal flashcards (any topic/description pairs), deployed to GitHub Pages at http://sheetflashcard.sallai.cc/

## Technology Stack
- TypeScript with React 19
- Vite for bundling
- Tailwind CSS v4 for styling
- Native fetch API for data fetching
- Storybook for component development
- GitHub Actions for automated deployment to GitHub Pages

## Architecture
No backend, database, or authentication layer exists. The application reads public Google Sheets through CSV export endpoints, or decks that other apps handed over and that are saved in localStorage. Client-side only (static SPA).

## Project Structure
```
src/
├── components/    # React components (Flashcard, FlashcardDeck, ThemeToggle, SavedDecks)
├── hooks/         # Custom hooks (useAudio, useTheme)
├── services/      # spreadsheetService (fetch + parseFlashcards), receive (DomainMap export protocol), localDecks
├── styles/        # CSS files
├── types/         # TypeScript type definitions
└── utils/         # Utility functions (urlUtils, urlParams, sanitizeHtml)
```

## Key Features
- Interactive flashcards with flip animation
- Audio playback for both sides
- Autoplay mode with customizable timing
- Dark/light theme toggle
- Shuffle mode and direction toggle
- Card repetition count support
- Hashtag-style tags with tooltip descriptions
- Keyboard navigation (←/→ for prev/next, ↑/↓/Space to flip)
- URL parameters for customization (spreadsheetId, sheetId, flipTime, nextTime, debug, deck, receive)
- Decks from other apps: `?receive` waits for a `postMessage` export from `window.opener` (DomainMap export protocol v1: ready → export → received/failed), saves it in localStorage (`sheet-flashcard:decks`, upsert by slugged dataset id + title) and reloads with `?deck=<id>`
- Saved decks button (SavedDecks): rendered only when decks exist, next to ThemeToggle (desktop) and in the mobile control row; opens or deletes decks
- Received HTML is sanitized with a dependency-free allowlist (DOMParser); Google Sheets content is rendered as before

## Data Source
Google Spreadsheet structure (row 1 is header: column 1 = front label, column 2 = back label):
- Column 1: Front side content (required)
- Column 2: Front audio URL (optional)
- Column 3: Back side content (required)
- Column 4: Back audio URL (optional)
- Column 5: Repetition count (optional, default: 1)
- Column 6+: Tag pairs (tag label, tag description, tag label, tag description, ...)

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
