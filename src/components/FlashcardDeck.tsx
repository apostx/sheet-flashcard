import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Flashcard from './Flashcard';
import { Flashcard as FlashcardType } from '../types/Flashcard';
import { parseAutoplayTimings, updateUrlTimings, AutoplayTimings } from '../utils/urlParams';

interface FlashcardDeckProps {
  flashcards: FlashcardType[];
}

// Helper to generate shuffled indices synchronously
const createShuffledIndices = (length: number): number[] => {
  const indices = Array.from({ length }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices;
};

// Midpoint of the 400ms flip-back animation (when card is edge-on)
const ANIMATION_MIDPOINT = 200;

// Helper to build the actual deck with repetitions
const buildActualDeck = (flashcards: FlashcardType[]): FlashcardType[] => {
  const deck: FlashcardType[] = [];
  flashcards.forEach(card => {
    const count = card.repetitionCount !== undefined ? card.repetitionCount : 1;
    if (count > 0) {
      for (let i = 0; i < count; i++) {
        deck.push(card);
      }
    }
  });
  return deck;
};

const FlashcardDeck: React.FC<FlashcardDeckProps> = ({ flashcards }) => {
  // Compute actual deck synchronously for proper initialization
  const actualDeck = useMemo(() => buildActualDeck(flashcards), [flashcards]);

  // Initialize shuffled indices synchronously with correct deck length
  const [shuffledIndices, setShuffledIndices] = useState<number[]>(() =>
    createShuffledIndices(buildActualDeck(flashcards).length || 1)
  );

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [shuffleMode, setShuffleMode] = useState(true);
  const [reversed, setReversed] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimatingBack, setIsAnimatingBack] = useState(false);
  const pendingNavigation = useRef<'next' | 'prev' | null>(null);
  const midpointTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [autoplay, setAutoplay] = useState(false);
  const [autoplayTimings, setAutoplayTimings] = useState<AutoplayTimings>(() => parseAutoplayTimings());
  const [showTimingControls, setShowTimingControls] = useState(false);
  const autoplayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initialDeckLengthRef = useRef(actualDeck.length);

  // Extract label information from the first card if available
  const frontLabel = flashcards.length > 0 && flashcards[0].frontLabel
    ? flashcards[0].frontLabel
    : 'Front';
  const backLabel = flashcards.length > 0 && flashcards[0].backLabel
    ? flashcards[0].backLabel
    : 'Back';

  // Function to generate shuffled indices
  const generateShuffledIndices = () => {
    setShuffledIndices(createShuffledIndices(actualDeck.length));
  };

  // Clear midpoint timer
  const clearMidpointTimer = useCallback(() => {
    if (midpointTimerRef.current) {
      clearTimeout(midpointTimerRef.current);
      midpointTimerRef.current = null;
    }
  }, []);

  // Handle animation end - cleanup after flip-back animation completes
  const handleAnimationEnd = useCallback(() => {
    setIsAnimatingBack(false);
    setIsFlipped(false);
    pendingNavigation.current = null;
  }, []);

  // Reset card index when flashcards change (skip initial mount if deck length matches)
  useEffect(() => {
    // Skip if this is the initial render with same deck length (already initialized)
    if (actualDeck.length === initialDeckLengthRef.current && shuffledIndices.length === actualDeck.length) {
      return;
    }

    setCurrentCardIndex(0);
    setAutoplay(false); // Stop autoplay when flashcards change
    if (shuffleMode) {
      generateShuffledIndices();
    }
    initialDeckLengthRef.current = actualDeck.length;
  }, [actualDeck.length, shuffleMode]);

  // Get the actual index based on whether we're in shuffle mode
  const getActualIndex = () => {
    if (shuffleMode && shuffledIndices.length > 0) {
      return shuffledIndices[currentCardIndex];
    }
    return currentCardIndex;
  };

  // Clear autoplay timer
  const clearAutoplayTimer = useCallback(() => {
    if (autoplayTimerRef.current) {
      clearTimeout(autoplayTimerRef.current);
      autoplayTimerRef.current = null;
    }
  }, []);

  // Start autoplay timer
  const startAutoplayTimer = useCallback(() => {
    if (!autoplay) return;

    clearAutoplayTimer();

    autoplayTimerRef.current = setTimeout(() => {
      if (isFlipped) {
        // Card is flipped, wait nextTime then flip back and go to next card
        setIsFlipped(false);
        setTimeout(() => {
          setCurrentCardIndex((prevIndex) => {
            const maxIndex = shuffleMode ? shuffledIndices.length - 1 : actualDeck.length - 1;
            return prevIndex >= maxIndex ? 0 : prevIndex + 1;
          });
        }, 100); // Small delay to show the flip animation
      } else {
        // Card is not flipped, wait flipTime then flip it
        setIsFlipped(true);
      }
    }, isFlipped ? autoplayTimings.nextTime : autoplayTimings.flipTime);
  }, [autoplay, isFlipped, shuffleMode, shuffledIndices.length, actualDeck.length, clearAutoplayTimer, autoplayTimings]);

  // Effect to manage autoplay
  useEffect(() => {
    if (autoplay) {
      startAutoplayTimer();
    } else {
      clearAutoplayTimer();
    }

    return () => {
      clearAutoplayTimer();
    };
  }, [autoplay, isFlipped, currentCardIndex, startAutoplayTimer, clearAutoplayTimer]);

  // Pause autoplay when page is not visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && autoplay) {
        clearAutoplayTimer();
      } else if (!document.hidden && autoplay) {
        startAutoplayTimer();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [autoplay, startAutoplayTimer, clearAutoplayTimer]);

  const handleNext = useCallback(() => {
    if (isAnimatingBack) return; // Prevent navigation during animation
    clearAutoplayTimer();
    clearMidpointTimer();

    if (isFlipped) {
      // Start CSS animation and swap content at midpoint
      pendingNavigation.current = 'next';
      setIsAnimatingBack(true);
      midpointTimerRef.current = setTimeout(() => {
        setCurrentCardIndex((prevIndex) => {
          const maxIndex = shuffleMode ? shuffledIndices.length - 1 : actualDeck.length - 1;
          return prevIndex >= maxIndex ? 0 : prevIndex + 1;
        });
      }, ANIMATION_MIDPOINT);
    } else {
      // Not flipped, just change card immediately
      setCurrentCardIndex((prevIndex) => {
        const maxIndex = shuffleMode ? shuffledIndices.length - 1 : actualDeck.length - 1;
        return prevIndex >= maxIndex ? 0 : prevIndex + 1;
      });
    }
  }, [shuffleMode, shuffledIndices.length, actualDeck.length, clearAutoplayTimer, clearMidpointTimer, isFlipped, isAnimatingBack]);

  const handlePrevious = useCallback(() => {
    if (isAnimatingBack) return; // Prevent navigation during animation
    clearAutoplayTimer();
    clearMidpointTimer();

    if (isFlipped) {
      // Start CSS animation and swap content at midpoint
      pendingNavigation.current = 'prev';
      setIsAnimatingBack(true);
      midpointTimerRef.current = setTimeout(() => {
        setCurrentCardIndex((prevIndex) => {
          const maxIndex = shuffleMode ? shuffledIndices.length - 1 : actualDeck.length - 1;
          return prevIndex <= 0 ? maxIndex : prevIndex - 1;
        });
      }, ANIMATION_MIDPOINT);
    } else {
      // Not flipped, just change card immediately
      setCurrentCardIndex((prevIndex) => {
        const maxIndex = shuffleMode ? shuffledIndices.length - 1 : actualDeck.length - 1;
        return prevIndex <= 0 ? maxIndex : prevIndex - 1;
      });
    }
  }, [shuffleMode, shuffledIndices.length, actualDeck.length, clearAutoplayTimer, clearMidpointTimer, isFlipped, isAnimatingBack]);

  const handleFlip = useCallback(() => {
    clearAutoplayTimer(); // Reset timer when manually flipping
    setIsFlipped(prev => !prev);
  }, [clearAutoplayTimer]);

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          handlePrevious();
          break;
        case 'ArrowRight':
          handleNext();
          break;
        case 'ArrowUp':
        case 'ArrowDown':
        case ' ': // Space
          handleFlip();
          e.preventDefault(); // Prevent page scrolling on space key
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleNext, handlePrevious, handleFlip]);

  // Cleanup timers on component unmount
  useEffect(() => {
    return () => {
      clearAutoplayTimer();
      clearMidpointTimer();
    };
  }, [clearAutoplayTimer, clearMidpointTimer]);

  const toggleShuffleMode = () => {
    if (!shuffleMode) {
      generateShuffledIndices();
      setCurrentCardIndex(0);
    } else {
      // Reset to normal mode
      setCurrentCardIndex(0);
    }
    setShuffleMode(!shuffleMode);
  };

  const toggleDirection = () => {
    setReversed(!reversed);
  };

  const toggleAutoplay = () => {
    setAutoplay(!autoplay);
  };

  const updateTimings = (newTimings: AutoplayTimings) => {
    setAutoplayTimings(newTimings);
    updateUrlTimings(newTimings);
  };

  const handleFlipTimeChange = (value: number) => {
    const newTimings = { ...autoplayTimings, flipTime: value };
    updateTimings(newTimings);
  };

  const handleNextTimeChange = (value: number) => {
    const newTimings = { ...autoplayTimings, nextTime: value };
    updateTimings(newTimings);
  };

  // Monitor URL changes to update timings
  useEffect(() => {
    const handlePopState = () => {
      const newTimings = parseAutoplayTimings();
      setAutoplayTimings(newTimings);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  if (!actualDeck || actualDeck.length === 0) {
    return (
      <div className="p-8 text-center rounded-lg max-w-md mx-auto my-8 border" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border-color)', color: 'var(--text-color)' }}>
        No flashcards available.
      </div>
    );
  }

  const actualIndex = getActualIndex();
  const currentCard = actualDeck[actualIndex];

  if (!currentCard) {
    return (
      <div className="p-8 text-center rounded-lg max-w-md mx-auto my-8" style={{ backgroundColor: 'var(--error-bg)', color: 'var(--error-color)' }}>
        Error: Card data is invalid.
      </div>
    );
  }

  const controlButtonBase = "py-2.5 px-4 sm:py-2 sm:px-3 sm:text-sm rounded cursor-pointer text-sm transition-all duration-300 flex items-center gap-2 font-medium outline-none border";
  const controlButtonInactive = "hover:opacity-80";
  const controlButtonActive = "!bg-[var(--button-bg)] !text-[var(--button-text)] !border-[var(--button-bg)]";

  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto px-4">
      <div className="flex flex-col justify-between items-center w-full mb-6 gap-4">
        <div className="flex gap-4 sm:gap-2 flex-wrap justify-center">
          <button
            onClick={toggleShuffleMode}
            className={`${controlButtonBase} ${shuffleMode ? controlButtonActive : controlButtonInactive}`}
            style={!shuffleMode ? { backgroundColor: 'var(--card-bg)', color: 'var(--text-color)', borderColor: 'var(--card-border-color)' } : undefined}
            data-tooltip={shuffleMode ? "Switch to ordered mode" : "Switch to shuffle mode"}
            aria-label={shuffleMode ? "Switch to ordered mode" : "Switch to shuffle mode"}
          >
            {shuffleMode ? 'Shuffle' : 'Ordered'}
          </button>

          <button
            onClick={toggleDirection}
            className={`${controlButtonBase} ${reversed ? controlButtonActive : controlButtonInactive}`}
            style={!reversed ? { backgroundColor: 'var(--card-bg)', color: 'var(--text-color)', borderColor: 'var(--card-border-color)' } : undefined}
            data-tooltip={reversed ? `Show ${backLabel} → ${frontLabel}` : `Show ${frontLabel} → ${backLabel}`}
            aria-label={reversed ? `Switch to ${frontLabel} first` : `Switch to ${backLabel} first`}
          >
            {reversed ? `${backLabel} → ${frontLabel}` : `${frontLabel} → ${backLabel}`}
          </button>

          <button
            onClick={toggleAutoplay}
            className={`${controlButtonBase} ${autoplay ? controlButtonActive : controlButtonInactive}`}
            style={!autoplay ? { backgroundColor: 'var(--card-bg)', color: 'var(--text-color)', borderColor: 'var(--card-border-color)' } : undefined}
            data-tooltip={autoplay ? "Stop autoplay" : "Start autoplay"}
            aria-label={autoplay ? "Stop autoplay" : "Start autoplay"}
          >
            {autoplay ? 'Pause' : 'Play'}
          </button>

          <button
            onClick={() => setShowTimingControls(!showTimingControls)}
            className={`${controlButtonBase} ${showTimingControls ? controlButtonActive : controlButtonInactive}`}
            style={!showTimingControls ? { backgroundColor: 'var(--card-bg)', color: 'var(--text-color)', borderColor: 'var(--card-border-color)' } : undefined}
            data-tooltip="Autoplay timing settings"
            aria-label="Autoplay timing settings"
          >
            Timing
          </button>
        </div>

        {showTimingControls && (
          <div className="rounded-lg p-4 sm:p-3 mt-4 w-full max-w-md border" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border-color)' }}>
            <div className="flex items-center gap-4 mb-4 flex-wrap sm:flex-col sm:items-stretch sm:gap-2">
              <label htmlFor="flip-time" className="text-sm font-medium min-w-[180px] sm:min-w-0 sm:text-center" style={{ color: 'var(--text-color)' }}>
                Time before flip (seconds):
              </label>
              <input
                id="flip-time"
                type="range"
                min="0.5"
                max="10"
                step="0.5"
                value={autoplayTimings.flipTime / 1000}
                onChange={(e) => handleFlipTimeChange(parseFloat(e.target.value) * 1000)}
                className="flex-1 min-w-[100px] h-1.5 bg-gray-300 rounded appearance-none cursor-pointer accent-[var(--button-bg)]"
              />
              <span className="text-sm font-semibold min-w-[40px] text-right sm:text-center" style={{ color: 'var(--text-color)' }}>
                {(autoplayTimings.flipTime / 1000).toFixed(1)}s
              </span>
            </div>

            <div className="flex items-center gap-4 flex-wrap sm:flex-col sm:items-stretch sm:gap-2">
              <label htmlFor="next-time" className="text-sm font-medium min-w-[180px] sm:min-w-0 sm:text-center" style={{ color: 'var(--text-color)' }}>
                Time before next card (seconds):
              </label>
              <input
                id="next-time"
                type="range"
                min="0.5"
                max="10"
                step="0.5"
                value={autoplayTimings.nextTime / 1000}
                onChange={(e) => handleNextTimeChange(parseFloat(e.target.value) * 1000)}
                className="flex-1 min-w-[100px] h-1.5 bg-gray-300 rounded appearance-none cursor-pointer accent-[var(--button-bg)]"
              />
              <span className="text-sm font-semibold min-w-[40px] text-right sm:text-center" style={{ color: 'var(--text-color)' }}>
                {(autoplayTimings.nextTime / 1000).toFixed(1)}s
              </span>
            </div>
          </div>
        )}

        <div className="text-sm md:text-base mt-2" style={{ color: '#7f8c8d' }}>
          Card {currentCardIndex + 1} of {shuffleMode ? shuffledIndices.length : actualDeck.length}
        </div>
      </div>

      <Flashcard
        card={currentCard}
        onNext={handleNext}
        onPrevious={handlePrevious}
        reversed={reversed}
        isFlipped={isFlipped}
        onFlip={handleFlip}
        isAnimatingBack={isAnimatingBack}
        onAnimationEnd={handleAnimationEnd}
      />
    </div>
  );
};

export default FlashcardDeck;
