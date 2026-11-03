# Sheet Flashcard

A universal flashcard application powered by Google Sheets. Create flashcards for any topic - vocabulary, definitions, Q&A, or any front/back card format.

## Features

- Interactive flashcards with flip animation
- Audio playback for both sides (when URLs are provided)
- Autoplay mode with customizable timing
- Dark/light theme toggle
- Shuffle mode for randomized learning
- Direction toggle (front→back or back→front)
- Card repetition support
- Fully responsive (desktop, tablet, mobile)
- Data sourced from public Google Spreadsheets
- Decks received from other apps, such as DomainMap, saved in the browser

## Quick Start

1. Visit http://sheetflashcard.sallai.cc/
2. Or use your own spreadsheet: `?spreadsheetId=YOUR_ID`

## Data Structure

Create a Google Spreadsheet with this structure:

| Front Label | (Audio URL) | Back Label | (Audio URL) | Repetition |
|-------------|-------------|------------|-------------|------------|
| Term 1      | (optional)  | Definition | (optional)  | (optional) |
| Question    | (optional)  | Answer     | (optional)  | 2          |

- **Column 1**: Front side content (required)
- **Column 2**: Front audio URL (optional)
- **Column 3**: Back side content (required)
- **Column 4**: Back audio URL (optional)
- **Column 5**: Repetition count (optional, default: 1)

## URL Parameters

- `spreadsheetId` - Google Spreadsheet ID
- `sheetId` - Sheet index (default: 0)
- `flipTime` - Auto-flip delay in ms (default: 3000)
- `nextTime` - Next card delay in ms (default: 3000)
- `debug` - Show debug info
- `deck` - A deck received from another app and saved in this browser
- `receive` - The page another app opens to hand over a deck (see below)

## Decks From Other Apps

Another app can hand a deck to Sheet Flashcard without a file or a Google Sheet; DomainMap does
so from its glossary. The deck is kept in the browser (localStorage) and opens at once with
`?deck=<id>`. Once a deck is saved, a **Saved decks** button appears next to the theme toggle
(**Decks** on small screens) to open a saved deck again or delete it; without saved decks the
page looks as before. Received content is cleaned of scripts and other active markup before it
is shown.

The sender opens `/?receive` in a new tab and talks to it with `postMessage` (version 1):

1. Sheet Flashcard says it is ready: `{ type: 'domain-map:ready', version: 1 }`.
2. The sender answers with the deck, a sheet in the format above as comma-separated values:
   `{ type: 'domain-map:export', version: 1, format: 'flashcards', dataset: { id, name }, title, csv }`.
3. Sheet Flashcard answers `{ type: 'domain-map:received', version: 1 }`, or
   `{ type: 'domain-map:failed', version: 1, reason }` with a sentence the sender can show.

Sending the same dataset and title again replaces the saved deck.

## Keyboard Controls

- **←/→**: Navigate cards
- **↑/↓/Space**: Flip card

## Development

```bash
npm install
npm start    # Dev server at localhost:3000
npm run build
npm run deploy  # Deploy to GitHub Pages
```

## License

MIT
