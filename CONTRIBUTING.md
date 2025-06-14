# Contributing to the Language Flashcard Project

Thank you for considering contributing to this project! This application helps users learn vocabulary between any language pairs. Here's how you can help.

## AI-Assisted Project

This project was originally developed with the assistance of Claude 3.7 (developed by Anthropic). When contributing, feel free to:

- Use AI assistance for your contributions if desired
- Document where AI was used in your pull request descriptions
- Focus on human review for logic, edge cases, and user experience

The project aims to maintain a balance between leveraging AI capabilities and ensuring human oversight for quality and security.

## Code of Conduct

Please be respectful and considerate of others when contributing to this project.

## How to Contribute

1. Fork the repository
2. Create a new branch for your feature or bug fix
3. Make your changes
4. Run tests and ensure everything works correctly
5. Submit a pull request

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/language-flashcard.git
cd language-flashcard

# Install dependencies
npm install

# Start development server
npm start
```

## Project Structure

- `src/components/`: React components
- `src/hooks/`: Custom React hooks
  - `useAudio.ts`: Hook for audio playback
  - `useTheme.ts`: Hook for theme management (dark/light mode)
- `src/services/`: API and data services
- `src/styles/`: CSS files
- `src/types/`: TypeScript type definitions

## Guidelines

### Coding Style

- Follow the existing code style
- Use TypeScript features for type safety
- Add comments for complex logic

### Commit Messages

Use clear and descriptive commit messages:

- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding or updating tests

### Pull Requests

- Create one pull request per feature or bug fix
- Include a clear description of changes
- Reference any related issues

### Theme Implementation

When working with themes:

- Use CSS variables defined in `global.css` for all color-related styling
- Ensure components work properly in both light and dark modes
- Test any UI changes in both themes
- Maintain sufficient contrast ratios for accessibility

## Feature Requests and Bug Reports

Please use the GitHub Issues section to report bugs or request features.

## License

By contributing to this project, you agree that your contributions will be licensed under the project's MIT license.
