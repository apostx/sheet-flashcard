import axios from 'axios';
import { Flashcard } from '../types/Flashcard';
import { getQueryParam } from '../utils/urlUtils';

// Default Google Spreadsheet values
const DEFAULT_SPREADSHEET_ID = '1nFxVuAugEsxKsaQWrVxkHQ5dSYgZL0jbQB57Sovsndk';
const DEFAULT_SHEET_ID = 0;

/**
 * Data structure of the spreadsheet should be:
 * First row: Header with language names (e.g., "English", "Spanish", etc.)
 * Column 1: Source language word
 * Column 2: URL to source language pronunciation audio (optional)
 * Column 3: Target language translation
 * Column 4: URL to target language pronunciation audio (optional)
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
 * Extract language information from the header row
 * @param headerRow The first row of the spreadsheet that contains language names
 * @returns Object containing sourceLanguage and targetLanguage names
 */
const extractLanguagesFromHeader = (headerRow: string[]): {sourceLanguage: string, targetLanguage: string} => {
  let sourceLanguage = 'Source';
  let targetLanguage = 'Target';
  
  if (headerRow && headerRow.length > 0) {
    // First column should contain source language name
    if (headerRow[0] && typeof headerRow[0] === 'string') {
      sourceLanguage = headerRow[0].trim();
    }
    
    // Target language is in column 3 (index 2), or column 2 (index 1) if structure is simplified
    if (headerRow.length >= 3 && headerRow[2] && typeof headerRow[2] === 'string') {
      targetLanguage = headerRow[2].trim();
    } else if (headerRow.length >= 2 && headerRow[1] && typeof headerRow[1] === 'string') {
      targetLanguage = headerRow[1].trim();
    }
  }
  
  console.log(`Detected languages: ${sourceLanguage} → ${targetLanguage}`);
  return { sourceLanguage, targetLanguage };
};

export const fetchFlashcardData = async (): Promise<Flashcard[]> => {
  try {
    // Try direct fetch first
    let response;
    try {
      console.log('Attempting direct fetch from Google Sheets...');
      const spreadsheetUrl = getSpreadsheetUrl();
      response = await axios.get(spreadsheetUrl);
      console.log('Direct fetch successful!');
    } catch (corsError) {
      console.warn('Direct fetch failed:', corsError);
      
      // If direct fetch fails due to CORS, try with proxy
      try {
        console.log('Attempting fetch via CORS proxy...');
        const spreadsheetUrl = getSpreadsheetUrl();
        response = await axios.get(`${CORS_PROXY_URL}${spreadsheetUrl}`);
        console.log('CORS proxy fetch successful!');
      } catch (proxyError) {
        console.warn('CORS proxy fetch failed:', proxyError);
        
        // Both direct fetch and CORS proxy failed
        throw new Error('Failed to fetch data: Both direct request and CORS proxy failed. Please check your internet connection and the spreadsheet ID.');
      }
    }
    
    // Handle the response based on its type
    if (response && response.data) {
      console.log('Response data type:', typeof response.data);
      
      // If it's a string (CSV data), parse it
      if (typeof response.data === 'string') {
        console.log('Parsing CSV data...');
        const rows = parseCSV(response.data);
        
        // First row must be the header with language names
        // If no header is found, use generic names
        let sourceLanguage = 'Source';
        let targetLanguage = 'Target';
        
        // Always use the first row as header
        const startIndex = 1;
        
        if (rows.length > 0) {
          // First row contains language information
          const languages = extractLanguagesFromHeader(rows[0]);
          sourceLanguage = languages.sourceLanguage;
          targetLanguage = languages.targetLanguage;
        } else {
          console.warn('No header row found in spreadsheet, using generic language names');
        }
        
        const parsedCards: Flashcard[] = [];
        
        rows.slice(startIndex).forEach((columns, index) => {
            // We need the source word and target translation to be present
            if (!columns[0] || !columns[0].trim()) {
                console.warn(`Row ${index + startIndex} has no ${sourceLanguage} word:`, columns);
                return;
            }
            
            // Get the target translation from the appropriate column (index 2, or 1 if only 2 columns)
            const targetTranslation = columns.length >= 3 ? columns[2].trim() : 
                                      columns.length >= 2 ? columns[1].trim() : '';
            
            if (!targetTranslation) {
                console.warn(`Row ${index + startIndex} has no ${targetLanguage} translation:`, columns);
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
                sourceWord: columns[0].trim(),
                // Sound URLs are optional
                sourceSoundUrl: columns.length >= 2 ? columns[1].trim() : undefined,
                targetTranslation: targetTranslation,
                targetSoundUrl: columns.length >= 4 ? columns[3].trim() : undefined,
                sourceLanguage: sourceLanguage,
                targetLanguage: targetLanguage,
                repetitionCount: repetitionCount
            });
        });
        
        console.log(`Parsed ${parsedCards.length} flashcards from CSV`);
        return parsedCards;
      } 
      // If it's already an array (JSON data), return it directly
      else if (Array.isArray(response.data)) {
        console.log(`Received ${response.data.length} flashcards from JSON`);
        return response.data;
      } 
      // Unexpected data format
      else {
        console.error('Unexpected data format:', response.data);
        throw new Error('Unexpected data format received');
      }
    } else {
      console.error('No data in response');
      throw new Error('No data received');
    }
  } catch (error) {
    console.error('Fatal error in fetchFlashcardData:', error);
    throw error;
  }
};
