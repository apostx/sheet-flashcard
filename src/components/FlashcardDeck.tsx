import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Flashcard from './Flashcard';
import { Flashcard as FlashcardType } from '../types/Flashcard';
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
  
  // Extract language information from the first card if available
  const sourceLanguage = flashcards.length > 0 && flashcards[0].sourceLanguage 
    ? flashcards[0].sourceLanguage 
    : 'Source';
  const targetLanguage = flashcards.length > 0 && flashcards[0].targetLanguage 
    ? flashcards[0].targetLanguage 
    : 'Target';

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

  const handleNext = useCallback(() => {
    setCurrentCardIndex((prevIndex) => {
      const maxIndex = shuffleMode ? shuffledIndices.length - 1 : actualDeck.length - 1;
      return prevIndex >= maxIndex ? 0 : prevIndex + 1;
    });
    setIsFlipped(false); // Reset flip state when changing cards
  }, [shuffleMode, shuffledIndices.length, actualDeck.length]);

  const handlePrevious = useCallback(() => {
    setCurrentCardIndex((prevIndex) => {
      const maxIndex = shuffleMode ? shuffledIndices.length - 1 : actualDeck.length - 1;
      return prevIndex <= 0 ? maxIndex : prevIndex - 1;
    });
    setIsFlipped(false); // Reset flip state when changing cards
  }, [shuffleMode, shuffledIndices.length, actualDeck.length]);

  const handleFlip = useCallback(() => {
    setIsFlipped(prev => !prev);
  }, []);
  
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

  const toggleLanguageDirection = () => {
    setReversed(!reversed);
  };

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
            onClick={toggleLanguageDirection} 
            className={`control-button ${reversed ? 'active' : ''}`}
            title={reversed ? `Show ${targetLanguage} → ${sourceLanguage}` : `Show ${sourceLanguage} → ${targetLanguage}`}
            aria-label={reversed ? `Switch to ${sourceLanguage} first` : `Switch to ${targetLanguage} first`}
          >
            {reversed ? `🔄 ${targetLanguage} → ${sourceLanguage}` : `🔄 ${sourceLanguage} → ${targetLanguage}`}
          </button>
        </div>
        
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
