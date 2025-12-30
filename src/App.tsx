import React, { useState, useEffect } from 'react';
import FlashcardDeck from './components/FlashcardDeck';
import ThemeToggle from './components/ThemeToggle';
import { fetchFlashcardData } from './services/spreadsheetService';
import { Flashcard } from './types/Flashcard';
import { getBooleanQueryParam } from './utils/urlUtils';
import { useTheme } from './hooks/useTheme';

const App: React.FC = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');

  const { theme, toggleTheme } = useTheme();
  const isDebugMode = getBooleanQueryParam('debug', false);

  useEffect(() => {
    const loadFlashcards = async () => {
      try {
        setLoading(true);
        setDebugInfo('Fetching flashcard data...');
        const data = await fetchFlashcardData();
        setDebugInfo(prev => `${prev}\nData received: ${JSON.stringify(data).substring(0, 100)}...`);

        if (data && Array.isArray(data) && data.length > 0) {
          setFlashcards(data);
          setDebugInfo(prev => `${prev}\nLoaded ${data.length} flashcards successfully.`);
        } else {
          setDebugInfo(prev => `${prev}\nNo flashcards found in the response. Data structure: ${typeof data}`);
          setError('No flashcards found in the response.');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setDebugInfo(prev => `${prev}\nError: ${errorMessage}`);
        setError(`Failed to load flashcard data: ${errorMessage}`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadFlashcards();
  }, []);

  const renderLoadingState = () => (
    <div className="flex flex-col items-center justify-center p-8 text-lg text-center w-full max-w-xl text-[#3498db]">
      <div
        className="w-12 h-12 border-4 border-[rgba(52,152,219,0.2)] rounded-full mb-4"
        style={{
          borderTopColor: 'var(--button-bg)',
          animation: 'spin 1s ease-in-out infinite'
        }}
      />
      <p>Loading flashcards...</p>
    </div>
  );

  const renderErrorState = () => (
    <div
      className="flex flex-col items-center justify-center p-8 text-lg text-center w-full max-w-xl rounded-lg"
      style={{
        color: 'var(--error-color)',
        border: '1px solid var(--error-color)',
        backgroundColor: 'var(--error-bg)'
      }}
    >
      <h2 className="mt-0">Error</h2>
      <p>{error}</p>
      <button
        className="mt-4 px-4 py-2 rounded text-white"
        style={{ backgroundColor: 'var(--button-bg)' }}
        onClick={() => window.location.reload()}
      >
        Retry
      </button>
      {isDebugMode && (
        <div className="mt-5 p-4 rounded border w-full max-w-3xl overflow-x-auto" style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--card-bg)' }}>
          <h3>Debug Information:</h3>
          <pre className="whitespace-pre-wrap break-words font-mono text-sm p-2 rounded" style={{ backgroundColor: 'var(--bg-color)' }}>{debugInfo}</pre>
        </div>
      )}
    </div>
  );

  const renderFlashcards = () => (
    <>
      <FlashcardDeck flashcards={flashcards} theme={theme} toggleTheme={toggleTheme} />
      {isDebugMode && (
        <div className="mt-5 p-4 rounded border w-full max-w-3xl overflow-x-auto" style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--card-bg)' }}>
          <h3>Debug Information:</h3>
          <pre className="whitespace-pre-wrap break-words font-mono text-sm p-2 rounded" style={{ backgroundColor: 'var(--bg-color)' }}>{debugInfo}</pre>
          <p>Flashcards loaded: {flashcards.length}</p>
          {flashcards.length > 0 && (
            <div>
              <h4>First flashcard:</h4>
              <pre className="whitespace-pre-wrap break-words font-mono text-sm p-2 rounded" style={{ backgroundColor: 'var(--bg-color)' }}>{JSON.stringify(flashcards[0], null, 2)}</pre>
            </div>
          )}
        </div>
      )}
    </>
  );

  const frontLabel = flashcards.length > 0 ? flashcards[0].frontLabel || 'Front' : 'Front';
  const backLabel = flashcards.length > 0 ? flashcards[0].backLabel || 'Back' : 'Back';
  const headerTitle = `${frontLabel} - ${backLabel} Flashcards`;

  return (
    <div className="flex flex-col min-h-screen max-w-5xl mx-auto p-5 md:p-4 sm:p-2.5">
      <header className="text-center mb-8 md:mb-6 sm:mb-4 relative">
        <h1 className="text-4xl md:text-3xl sm:text-sm mb-2 sm:mb-1 line-clamp-2" style={{ color: 'var(--header-color)' }}>{headerTitle}</h1>
        <p className="text-base sm:text-xs mt-0 sm:hidden" style={{ color: 'var(--subtitle-color)' }}>Learn with interactive flashcards</p>
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} className="absolute top-5 right-5 md:top-4 md:right-4 hidden sm:flex" />
      </header>

      <main className="flex-1 flex flex-col items-center justify-start">
        {loading ? renderLoadingState() : error ? renderErrorState() : renderFlashcards()}
      </main>

      <footer className="mt-8 md:mt-6 text-center text-sm sm:text-xs" style={{ color: 'var(--subtitle-color)' }}>
        <p>Sheet Flashcard</p>
        <p className="italic text-xs sm:text-[0.7rem] mt-2">Tap or click a card to flip it</p>
      </footer>
    </div>
  );
};

export default App;
