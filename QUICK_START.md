# Quick Start Guide

This guide provides a quick overview of how to use the Language Flashcard application for learning vocabulary between any language pairs.

## Accessing the Application

The application is hosted at: https://apostx.github.io/language-flashcard/

You can also run it locally after cloning the repository:

```bash
npm install
npm start
```

## Basic Usage

### Flashcards Navigation

![Flashcard Navigation](https://via.placeholder.com/600x300/e0e0e0/666666?text=Flashcard+Navigation)

1. **Flip a card**: Click or tap anywhere on the flashcard to flip it and see the translation
   - You can also use the up/down arrow keys or spacebar to flip
2. **Navigate**: Use the "Previous" and "Next" buttons to move between cards
   - You can also use the left/right arrow keys to navigate
3. **Listen**: Click the sound button (🔊) to hear pronunciation (when available)

### Features

![Application Features](https://via.placeholder.com/600x300/e0e0e0/666666?text=Application+Features)

1. **Shuffle Mode**: Enabled by default. Click the button to switch between shuffle and ordered modes
2. **Repetition Control**: Cards appear multiple times based on the value in the repetition column
3. **Language Direction**: Click "🔄 Source → Target" to switch between source language first and target language first
4. **Autoplay Mode**: Click "▶️ Autoplay" for hands-free learning with automatic card progression
5. **Timing Controls**: Click "⏱️ Timing" to customize autoplay speeds (flip time and next card time)
6. **Theme Toggle**: Click the sun/moon icon in the top right corner to switch between light and dark modes
7. **Keyboard Controls**: Use arrow keys and spacebar to navigate and flip cards

### Autoplay Mode for Hands-Free Learning

![Autoplay Mode](https://via.placeholder.com/600x300/e0e0e0/666666?text=Autoplay+Mode)

1. **Start Autoplay**: Click the "▶️ Autoplay" button to begin automatic progression
2. **Customize Timing**: Click "⏱️ Timing" to adjust:
   - **Flip Time**: How long to show the front before automatically flipping
   - **Next Time**: How long to show the back before moving to the next card
3. **Manual Override**: Any manual interaction (keyboard, mouse) temporarily resets the timer
4. **Smart Pausing**: Autoplay automatically pauses when you switch browser tabs

## Tips for Effective Learning

- **Review regularly**: Short, frequent sessions are more effective than long, infrequent ones
- **Say words aloud**: Pronounce each word as you see it
- **Use both modes**: Practice with both Source→Target and Target→Source directions
- **Try autoplay**: Use autoplay mode for passive learning or to maintain steady pace
- **Customize timing**: Adjust autoplay timing based on your reading speed and learning style
- **Write it down**: For better retention, try writing down the translations

## Troubleshooting

- **Cards not loading?** Check your internet connection
- **Audio not playing?** Some words may not have associated audio files
- **Page not displaying correctly?** Try refreshing or using a different browser

## Creating Your Own Flashcards

To use your own vocabulary list:

1. Create a Google Spreadsheet with:
   - Header row containing language names (e.g., "English", "French")
   - Data rows with columns for:
     - Source language word
     - Source language audio URL (optional)
     - Target language translation
     - Target language audio URL (optional)
     - Repetition count (optional, default: 1)
2. Make the spreadsheet publicly accessible
3. Update the application code with your spreadsheet ID

Alternatively, you can use URL parameters:
```
https://apostx.github.io/language-flashcard/?spreadsheetId=YOUR_SPREADSHEET_ID&sheetId=0
```

## Advanced Features

- **Debug Mode**: Add `?debug=true` (or simply `?debug`) to the URL to show debug information
- **Custom Spreadsheet**: Use `?spreadsheetId=YOUR_ID&sheetId=0` to specify a different data source

## Need Help?

For more detailed information, see the [README.md](./README.md) file or open an issue on GitHub.
