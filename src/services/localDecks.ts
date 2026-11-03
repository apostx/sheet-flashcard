/**
 * Decks received from other apps, kept in this browser and opened with `?deck=<id>` instead of a
 * spreadsheet. Sending the same dataset and title again replaces the deck.
 */

export interface StoredDeck {
  id: string;
  datasetName: string;
  title: string;
  csv: string;
  receivedAt: string;
}

const STORAGE_KEY = 'sheet-flashcard:decks';

const slug = (text: string) =>
  text
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/** The ID of a deck: its dataset and title, as they can stand in an address. */
export const deckId = (datasetId: string, title: string): string =>
  `${slug(datasetId) || 'deck'}--${slug(title) || 'cards'}`;

export function readDecks(): StoredDeck[] {
  try {
    const decks = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    return Array.isArray(decks) ? decks : [];
  } catch {
    return [];
  }
}

function writeDecks(decks: StoredDeck[]): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(decks));
    return true;
  } catch (error) {
    console.error('Could not save the decks:', error);
    return false;
  }
}

export const findDeck = (id: string): StoredDeck | undefined => readDecks().find((deck) => deck.id === id);

/** Saves a deck, replacing one with the same ID; false when the browser's storage is full. */
export const saveDeck = (deck: StoredDeck): boolean =>
  writeDecks([...readDecks().filter((stored) => stored.id !== deck.id), deck]);

export const removeDeck = (id: string): void => {
  writeDecks(readDecks().filter((deck) => deck.id !== id));
};
