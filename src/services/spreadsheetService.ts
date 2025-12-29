import { Flashcard } from '../types/Flashcard';
import { getQueryParam } from '../utils/urlUtils';

// Default Google Spreadsheet values
const DEFAULT_SPREADSHEET_ID = '1nFxVuAugEsxKsaQWrVxkHQ5dSYgZL0jbQB57Sovsndk';
const DEFAULT_SHEET_ID = 0;

/**
 * Data structure of the spreadsheet should be:
 * First row: Header with labels (e.g., "Term", "Definition", "Question", "Answer", etc.)
 * Column 1: Front side content (topic, term, question)
 * Column 2: URL to front side audio (optional)
 * Column 3: Back side content (description, definition, answer)
 * Column 4: URL to back side audio (optional)
 * Column 5: Repetition count (optional, default: 1)
 */

// Get spreadsheet parameters from URL or use defaults
const getSpreadsheetId = (): string => {
  return getQueryParam('spreadsheetId', DEFAULT_SPREADSHEET_ID);
};

const getSheetId = (): number => {
  const sheetIdParam = getQueryParam('sheetId', `${DEFAULT_SHEET_ID}`);
  return parseInt(sheetIdParam, 10) || DEFAULT_SHEET_ID;
};

// Construct the URL for fetching the spreadsheet data as CSV
const getSpreadsheetUrl = (): string => {
  const spreadsheetId = getSpreadsheetId();
  const sheetId = getSheetId();
  return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${sheetId}`;
};

// CORS Proxy URL - use this if direct access fails
const CORS_PROXY_URL = `https://cors-anywhere.herokuapp.com/`;

/**
 * Parse CSV string into array of string arrays
 * Handles quoted values containing commas
 */
const parseCSV = (text: string): string[][] => {
  const result: string[][] = [];
  let row: string[] = [];
  let inQuotes = false;
  let currentValue = '';

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      // Handle escaped quotes
      if (nextChar === '"') {
        currentValue += '"';
        i++; // Skip the next quote
      } else {
        // Toggle quote mode
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of value
      row.push(currentValue.trim());
      currentValue = '';
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      // End of line
      if (char === '\r' && nextChar === '\n') {
        i++; // Skip the \n in \r\n
      }

      // Don't push empty values at the end
      if (currentValue !== '') {
        row.push(currentValue.trim());
        currentValue = '';
      }

      // Don't push empty rows
      if (row.length > 0) {
        result.push(row);
        row = [];
      }
    } else {
      currentValue += char;
    }
  }

  // Handle the last value and row
  if (currentValue !== '') {
    row.push(currentValue.trim());
  }
  if (row.length > 0) {
    result.push(row);
  }

  return result;
};

/**
 * Extract label information from the header row
 * @param headerRow The first row of the spreadsheet that contains labels
 * @returns Object containing frontLabel and backLabel names
 */
const extractLabelsFromHeader = (headerRow: string[]): {frontLabel: string, backLabel: string} => {
  let frontLabel = 'Front';
  let backLabel = 'Back';

  if (headerRow && headerRow.length > 0) {
    // First column should contain front label
    if (headerRow[0] && typeof headerRow[0] === 'string') {
      frontLabel = headerRow[0].trim();
    }

    // Back label is in column 3 (index 2), or column 2 (index 1) if structure is simplified
    if (headerRow.length >= 3 && headerRow[2] && typeof headerRow[2] === 'string') {
      backLabel = headerRow[2].trim();
    } else if (headerRow.length >= 2 && headerRow[1] && typeof headerRow[1] === 'string') {
      backLabel = headerRow[1].trim();
    }
  }

  console.log(`Detected labels: ${frontLabel} → ${backLabel}`);
  return { frontLabel, backLabel };
};

export const fetchFlashcardData = async (): Promise<Flashcard[]> => {
  try {
    // Try direct fetch first
    let csvText: string;
    try {
      console.log('Attempting direct fetch from Google Sheets...');
      const spreadsheetUrl = getSpreadsheetUrl();
      const response = await fetch(spreadsheetUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      csvText = await response.text();
      console.log('Direct fetch successful!');
    } catch (corsError) {
      console.warn('Direct fetch failed:', corsError);

      // If direct fetch fails due to CORS, try with proxy
      try {
        console.log('Attempting fetch via CORS proxy...');
        const spreadsheetUrl = getSpreadsheetUrl();
        const response = await fetch(`${CORS_PROXY_URL}${spreadsheetUrl}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        csvText = await response.text();
        console.log('CORS proxy fetch successful!');
      } catch (proxyError) {
        console.warn('CORS proxy fetch failed:', proxyError);

        // Both direct fetch and CORS proxy failed
        throw new Error('Failed to fetch data: Both direct request and CORS proxy failed. Please check your internet connection and the spreadsheet ID.');
      }
    }

    // Parse the CSV data
    console.log('Parsing CSV data...');
    const rows = parseCSV(csvText);

    // First row must be the header with labels
    // If no header is found, use generic names
    let frontLabel = 'Front';
    let backLabel = 'Back';

    // Always use the first row as header
    const startIndex = 1;

    if (rows.length > 0) {
      // First row contains label information
      const labels = extractLabelsFromHeader(rows[0]);
      frontLabel = labels.frontLabel;
      backLabel = labels.backLabel;
    } else {
      console.warn('No header row found in spreadsheet, using generic labels');
    }

    const parsedCards: Flashcard[] = [];

    rows.slice(startIndex).forEach((columns, index) => {
      // We need the front and back content to be present
      if (!columns[0] || !columns[0].trim()) {
        console.warn(`Row ${index + startIndex} has no ${frontLabel} content:`, columns);
        return;
      }

      // Get the back content from the appropriate column (index 2, or 1 if only 2 columns)
      const back = columns.length >= 3 ? columns[2].trim() :
                   columns.length >= 2 ? columns[1].trim() : '';

      if (!back) {
        console.warn(`Row ${index + startIndex} has no ${backLabel} content:`, columns);
        return;
      }

      // Parse repetition count from 5th column if available
      let repetitionCount: number | undefined = 1; // Default to 1 if not specified
      if (columns.length >= 5 && columns[4].trim() !== '') {
        const repCount = parseInt(columns[4].trim(), 10);
        // Only use the value if it's a valid number
        if (!isNaN(repCount)) {
          repetitionCount = repCount;
        }
      }

      parsedCards.push({
        id: index,
        front: columns[0].trim(),
        // Audio URLs are optional
        frontAudioUrl: columns.length >= 2 ? columns[1].trim() : undefined,
        back: back,
        backAudioUrl: columns.length >= 4 ? columns[3].trim() : undefined,
        frontLabel: frontLabel,
        backLabel: backLabel,
        repetitionCount: repetitionCount
      });
    });

    console.log(`Parsed ${parsedCards.length} flashcards from CSV`);
    return parsedCards;
  } catch (error) {
    console.error('Fatal error in fetchFlashcardData:', error);
    throw error;
  }
};
