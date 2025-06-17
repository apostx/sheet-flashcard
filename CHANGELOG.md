# Changelog

All notable changes to the Language Flashcard project will be documented in this file.

## Project Information

This project was developed with the assistance of Claude 3.7 (developed by Anthropic) in June 2025.

## [2.6.1] - 2025-06-18

### Fixed
- **Complete Focus Styling Elimination**: Completely removed all focus-related visual effects
  - ❌ Eliminated invisible buttons on focus state
  - ❌ Removed unwanted borders appearing on button focus
  - ❌ Disabled all focus outlines and visual indicators
  - ✅ Maintained hover effects even when buttons are focused
  - ✅ Preserved proper button styling for both normal and active states
  - ✅ Ensured consistent button appearance across all interaction states

### Technical
- Comprehensive CSS focus rule elimination across all stylesheets
- Added explicit focus+hover combination rules to maintain hover effects
- Used CSS variable-based styling to ensure consistent button appearance
- Implemented failsafe rules with `!important` declarations to override browser defaults

## [2.6.0] - 2025-06-16

### Added
- **Autoplay Feature**: Automatic card progression with customizable timing
  - ▶️ Autoplay button to start/stop automatic card progression
  - ⏱️ Timing controls for customizing autoplay behavior
  - Separate timing controls for flip time (front → back) and next card time (back → next)
  - URL parameter support for sharing timing settings (`?flipTime=2000&nextTime=4000`)
  - Smart timer reset on manual user interactions
  - Automatic pause when browser tab is not visible
  - Range: 0.5-10 seconds for both timing controls
  - Real-time URL parameter display and updates

### Enhanced
- User experience with hands-free learning capability
- Accessibility with keyboard navigation still working during autoplay
- Performance with proper timer cleanup and memory leak prevention
- Mobile responsiveness for timing controls

### Technical
- New `urlParams.ts` utility for URL parameter management
- Enhanced timer management with dynamic timing values
- Visibility API integration for tab focus detection
- Responsive CSS for timing control sliders

## [2.5.0] - 2025-06-15

### Added
- Support for card repetition via fifth column in spreadsheet
- Added keyboard navigation for card browsing and flipping
  - Left/right arrow keys to navigate between cards
  - Up/down arrow keys and spacebar to flip cards

### Changed
- Improved desktop layout with better sizing and spacing
- Enhanced button styling for clearer visual hierarchy
- Removed focus state styling for cleaner UI appearance
- Shuffle mode is now enabled by default

### Fixed
- Fixed layout issues with card index display on desktop
- Corrected display inconsistencies in control buttons
- Fixed button icon display issues

## [2.4.0] - 2025-06-15

### Added
- Dark mode / light mode theme toggle
- Theme toggle button in header
- CSS variables for consistent theming
- Theme persistence using localStorage

### Improved
- Button styling and hover states
- Better color contrast in both themes
- Smooth transitions between theme changes

## [2.3.2] - 2025-06-14

### Removed
- HISTORY.md file due to AI limitations in maintaining its own documentation structure
- File became inconsistent and chaotic with each AI update
- Historical development information now consolidated in this CHANGELOG.md

## [2.3.1] - 2025-06-14

### Fixed
- Long text overflow issue in flashcards
- Vertical alignment of text with audio buttons
- Word wrapping for languages with long words
- Improved scrolling for content that exceeds card dimensions

### Changed
- Restructured flashcard content container to better handle different text lengths
- Modified text styling to support different writing systems
- Enhanced responsive design for text elements

## [2.3.0] - 2025-06-14

### Added
- Enhanced mobile compatibility with responsive design improvements
- Added proper audio button alignment on mobile devices
- Improved touch interaction support

### Changed
- Redesigned the flashcard content layout with flexbox for better alignment
- Improved focus handling for better keyboard navigation without visual artifacts
- Optimized UI spacing and sizing for small mobile screens

### Fixed
- Misaligned sound buttons on mobile displays
- Unwanted focus outlines on interactive elements
- Various responsive design issues on small screens

## [2.2.0] - 2025-06-13

### Removed
- Eliminated fallback data mechanism
- Removed references to fallback data from documentation

### Changed
- Application now requires a valid spreadsheet connection
- Error handling simplified to focus on connection issues

## [2.1.0] - 2025-06-13

### Added
- URL query parameter support for configuration:
  - `?debug=true` to toggle debug information display
  - `?spreadsheetId=ID` to specify a custom Google Spreadsheet
  - `?sheetId=N` to specify which sheet to use in the spreadsheet
- Updated documentation to explain URL parameter usage

### Changed
- Made debug information hidden by default in ALL environments (not just production)
- Debug information now only shows when explicitly enabled with `?debug=true`
- Refactored spreadsheet service to use URL parameters with fallback values

## [2.0.0] - 2025-06-12

### Added
- Support for any language pair, not just German-Hungarian
- Dynamic language detection from spreadsheet headers
- New language-agnostic field names in the codebase
- Enhanced documentation reflecting the application's generic nature

### Changed
- Renamed project to "language-flashcard"
- Updated UI to dynamically show the current language pair
- Modified language toggle button to use generic labels
- Improved spreadsheet parsing to extract language information
- Updated all documentation to reflect new generic features

### Fixed
- Various references to specific languages in the codebase
- Fallback data structure to match new field names

## [1.1.0] - 2025-06-11

### Added
- Language direction toggle feature
- Loading spinner animation
- Improved error handling with retry button
- Better mobile responsiveness
- Enhanced CSV parser for quoted values
- Comprehensive debug information for development
- Documentation about AI-assisted development

### Changed
- Made sound URLs optional in the type definition
- Improved control button styling
- Enhanced overall UI with better spacing and transitions
- Updated fallback data with more vocabulary words
- Added AI attribution to documentation

### Fixed
- CSV parsing issues with commas in fields
- Memory leaks in audio playback
- Data loading error handling
- Responsive design issues on small screens

## [1.0.0] - 2025-06-01

### Added
- Initial release
- Basic flashcard functionality with flip animation
- Navigation between cards
- Shuffle mode for randomized learning
- Google Spreadsheet data fetching
- Audio playback for both languages
- Responsive design for desktop and mobile
- GitHub Pages deployment workflow
