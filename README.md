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

## Quick Start

1. Visit https://apostx.github.io/sheet-flashcard/
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
