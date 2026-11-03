import React, { useEffect, useRef, useState } from 'react';
import { readDecks, removeDeck, StoredDeck } from '../services/localDecks';
import { getQueryParam } from '../utils/urlUtils';

interface SavedDecksProps {
  /** `icon`: a round button like the theme toggle; `text`: a control button for small screens. */
  variant: 'icon' | 'text';
  className?: string;
}

/**
 * The decks received from other apps, such as DomainMap, to open again or delete. Without saved
 * decks it renders nothing, so the page looks as it always did.
 */
const SavedDecks: React.FC<SavedDecksProps> = ({ variant, className = '' }) => {
  const [decks, setDecks] = useState<StoredDeck[]>(readDecks);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const currentDeck = getQueryParam('deck');

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  if (decks.length === 0) return null;

  const toggle = () => {
    if (!open) setDecks(readDecks());
    setOpen(!open);
  };

  const remove = (deck: StoredDeck) => {
    removeDeck(deck.id);
    if (deck.id === currentDeck) {
      window.location.href = window.location.pathname;
      return;
    }
    setDecks(readDecks());
  };

  const panelColors = {
    backgroundColor: 'var(--card-bg)',
    color: 'var(--text-color)',
    borderColor: 'var(--card-border-color)',
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {variant === 'icon' ? (
        <button
          className="p-2 rounded-full w-10 h-10 md:w-9 md:h-9 sm:w-8 sm:h-8 flex items-center justify-center transition-colors"
          style={{ backgroundColor: 'var(--theme-toggle-bg)' }}
          onClick={toggle}
          aria-label="Saved decks"
          aria-expanded={open}
          title="Saved decks"
        >
          <svg className="w-6 h-6 md:w-5 md:h-5 sm:w-4 sm:h-4" style={{ color: 'var(--theme-toggle-icon)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="7" width="14" height="14" rx="2" />
            <path d="M7 3h12a2 2 0 0 1 2 2v12" />
          </svg>
        </button>
      ) : (
        <button
          className="py-2.5 px-4 sm:py-2 sm:px-3 sm:text-sm rounded cursor-pointer text-sm transition-all duration-300 flex items-center gap-2 font-medium outline-none border hover:opacity-80"
          style={panelColors}
          onClick={toggle}
          aria-expanded={open}
        >
          Decks
        </button>
      )}
      {open && (
        <div
          className={`z-20 rounded-lg border shadow-lg p-2 text-left ${
            variant === 'icon' ? 'absolute right-0 mt-2 w-72' : 'fixed left-4 right-4 bottom-4'
          }`}
          style={panelColors}
          role="dialog"
          aria-label="Saved decks"
        >
          <p className="px-2 py-1 text-xs font-semibold uppercase opacity-70">Saved decks</p>
          <ul>
            {decks.map((deck) => (
              <li key={deck.id} className="flex items-center gap-1">
                <a
                  href={`${window.location.pathname}?deck=${encodeURIComponent(deck.id)}`}
                  className={`flex-1 min-w-0 rounded px-2 py-1.5 hover:opacity-80 ${deck.id === currentDeck ? 'font-semibold' : ''}`}
                  aria-current={deck.id === currentDeck ? 'page' : undefined}
                >
                  <span className="block truncate text-sm">{deck.title}</span>
                  <span className="block truncate text-xs opacity-70">{deck.datasetName}</span>
                </a>
                <button
                  className="shrink-0 rounded px-2 py-1 text-lg leading-none opacity-60 hover:opacity-100"
                  onClick={() => remove(deck)}
                  aria-label={`Delete ${deck.title} (${deck.datasetName})`}
                  title="Delete"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SavedDecks;
