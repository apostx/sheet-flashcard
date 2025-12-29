import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Flashcard from './Flashcard';
import { Flashcard as FlashcardType } from '../types/Flashcard';
import { parseAutoplayTimings, updateUrlTimings, AutoplayTimings } from '../utils/urlParams';
import '../styles/FlashcardDeck.css';

interface FlashcardDeckProps {
  flashcards: FlashcardType[];
}

const FlashcardDeck: React.FC<FlashcardDeckProps> = ({ flashcards }) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [shuffleMode, setShuffleMode] = useState(true);
  const [shuffledIndices, setShuffledIndices] = useState<number[]>([]);
  const [reversed, setReversed] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [autoplay, setAutoplay] = useState(false);
  const [autoplayTimings, setAutoplayTimings] = useState<AutoplayTimings>(() => parseAutoplayTimings());
  const [showTimingControls, setShowTimingControls] = useState(false);
  const autoplayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Generate the actual deck, respecting repetition counts
  const actualDeck = useMemo(() => {
    const deck: FlashcardType[] = [];

    flashcards.forEach(card => {
      const count = card.repetitionCount !== undefined ? card.repetitionCount : 1;

      // Only add cards with repetition count > 0
      if (count > 0) {
        // Add the card the specified number of times
        for (let i = 0; i < count; i++) {
          deck.push(card);
        }
      }
    });

    return deck;
  }, [flashcards]);

  // Extract label information from the first card if available
  const frontLabel = flashcards.length > 0 && flashcards[0].frontLabel
    ? flashcards[0].frontLabel
    : 'Front';
  const backLabel = flashcards.length > 0 && flashcards[0].backLabel
    ? flashcards[0].backLabel
    : 'Back';

  // Function to generate shuffled indices
  const generateShuffledIndices = () => {
    // Generate shuffled indices
    const indices = Array.from({ length: actualDeck.length }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    setShuffledIndices(indices);
  };

  // Reset card index when flashcards change
  useEffect(() => {
    setCurrentCardIndex(0);
    setAutoplay(false); // Stop autoplay when flashcards change
    if (shuffleMode) {
      generateShuffledIndices();
    }
  }, [actualDeck, shuffleMode]);

  // Initialize shuffle on component mount
  useEffect(() => {
    if (shuffleMode && actualDeck.length > 0) {
      generateShuffledIndices();
    }
  }, [shuffleMode, actualDeck.length]);

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
    clearAutoplayTimer(); // Reset timer when manually changing cards
    setCurrentCardIndex((prevIndex) => {
      const maxIndex = shuffleMode ? shuffledIndices.length - 1 : actualDeck.length - 1;
      return prevIndex >= maxIndex ? 0 : prevIndex + 1;
    });
    setIsFlipped(false); // Reset flip state when changing cards
  }, [shuffleMode, shuffledIndices.length, actualDeck.length, clearAutoplayTimer]);

  const handlePrevious = useCallback(() => {
    clearAutoplayTimer(); // Reset timer when manually changing cards
    setCurrentCardIndex((prevIndex) => {
      const maxIndex = shuffleMode ? shuffledIndices.length - 1 : actualDeck.length - 1;
      return prevIndex <= 0 ? maxIndex : prevIndex - 1;
    });
    setIsFlipped(false); // Reset flip state when changing cards
  }, [shuffleMode, shuffledIndices.length, actualDeck.length, clearAutoplayTimer]);

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

  // Cleanup autoplay timer on component unmount
  useEffect(() => {
    return () => {
      clearAutoplayTimer();
    };
  }, [clearAutoplayTimer]);

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
    return <div className="no-cards">No flashcards available.</div>;
  }

  const actualIndex = getActualIndex();
  const currentCard = actualDeck[actualIndex];

  if (!currentCard) {
    return <div className="error-card">Error: Card data is invalid.</div>;
  }

  return (
    <div className="flashcard-deck">
      <div className="deck-controls">
        <div className="control-buttons">
          <button
            onClick={toggleShuffleMode}
            className={`control-button ${shuffleMode ? 'active' : ''}`}
            title={shuffleMode ? "Switch to ordered mode" : "Switch to shuffle mode"}
            aria-label={shuffleMode ? "Switch to ordered mode" : "Switch to shuffle mode"}
          >
            {shuffleMode ? '🔀 Shuffle' : '🔢 Ordered'}
          </button>

          <button
            onClick={toggleDirection}
            className={`control-button ${reversed ? 'active' : ''}`}
            title={reversed ? `Show ${backLabel} → ${frontLabel}` : `Show ${frontLabel} → ${backLabel}`}
            aria-label={reversed ? `Switch to ${frontLabel} first` : `Switch to ${backLabel} first`}
          >
            {reversed ? `🔄 ${backLabel} → ${frontLabel}` : `🔄 ${frontLabel} → ${backLabel}`}
          </button>

          <button
            onClick={toggleAutoplay}
            className={`control-button ${autoplay ? 'active' : ''}`}
            title={autoplay ? "Stop autoplay" : "Start autoplay"}
            aria-label={autoplay ? "Stop autoplay" : "Start autoplay"}
          >
            {autoplay ? '⏸️ Autoplay' : '▶️ Autoplay'}
          </button>

          <button
            onClick={() => setShowTimingControls(!showTimingControls)}
            className={`control-button ${showTimingControls ? 'active' : ''}`}
            title="Autoplay timing settings"
            aria-label="Autoplay timing settings"
          >
            ⏱️ Timing
          </button>
        </div>

        {showTimingControls && (
          <div className="timing-controls">
            <div className="timing-control">
              <label htmlFor="flip-time">Time before flip (seconds):</label>
              <input
                id="flip-time"
                type="range"
                min="0.5"
                max="10"
                step="0.5"
                value={autoplayTimings.flipTime / 1000}
                onChange={(e) => handleFlipTimeChange(parseFloat(e.target.value) * 1000)}
              />
              <span>{(autoplayTimings.flipTime / 1000).toFixed(1)}s</span>
            </div>

            <div className="timing-control">
              <label htmlFor="next-time">Time before next card (seconds):</label>
              <input
                id="next-time"
                type="range"
                min="0.5"
                max="10"
                step="0.5"
                value={autoplayTimings.nextTime / 1000}
                onChange={(e) => handleNextTimeChange(parseFloat(e.target.value) * 1000)}
              />
              <span>{(autoplayTimings.nextTime / 1000).toFixed(1)}s</span>
            </div>
          </div>
        )}

        <div className="deck-info">
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
      />
    </div>
  );
};

export default FlashcardDeck;
