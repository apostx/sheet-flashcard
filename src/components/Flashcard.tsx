import React, { useState } from 'react';
import { Flashcard as FlashcardType } from '../types/Flashcard';
import { useAudio } from '../hooks/useAudio';
import '../styles/Flashcard.css';

interface FlashcardProps {
  card: FlashcardType;
  onNext: () => void;
  onPrevious: () => void;
  reversed?: boolean;
  isFlipped?: boolean;
  onFlip?: () => void;
}

const Flashcard: React.FC<FlashcardProps> = ({
  card,
  onNext,
  onPrevious,
  reversed = false,
  isFlipped: externalIsFlipped,
  onFlip: externalOnFlip
}) => {
  const [internalIsFlipped, setInternalIsFlipped] = useState(false);
  const { playAudio, isPlaying, error } = useAudio();

  // Determine if controlled externally or internally
  const isControlledExternally = externalIsFlipped !== undefined && externalOnFlip !== undefined;
  const isFlipped = isControlledExternally ? externalIsFlipped : internalIsFlipped;

  if (!card || !card.front || !card.back) {
    return (
      <div className="flashcard error">
        <div className="flashcard-inner">
          <div className="flashcard-front">
            <h2>Invalid Card Data</h2>
          </div>
        </div>
      </div>
    );
  }

  const handleFlip = () => {
    if (isControlledExternally) {
      externalOnFlip?.();
    } else {
      setInternalIsFlipped(!internalIsFlipped);
    }
  };

  const playFrontAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (card.frontAudioUrl) {
      playAudio(card.frontAudioUrl);
    }
  };

  const playBackAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (card.backAudioUrl) {
      playAudio(card.backAudioUrl);
    }
  };

  const frontContent = reversed ? (
    <div className="flashcard-content">
      <h2>{card.back}</h2>
      {card.backAudioUrl && (
        <button
          className="audio-button"
          onClick={playBackAudio}
          disabled={isPlaying}
          aria-label={`Play ${card.backLabel || 'back'} audio`}
        >
          🔊
        </button>
      )}
    </div>
  ) : (
    <div className="flashcard-content">
      <h2>{card.front}</h2>
      {card.frontAudioUrl && (
        <button
          className="audio-button"
          onClick={playFrontAudio}
          disabled={isPlaying}
          aria-label={`Play ${card.frontLabel || 'front'} audio`}
        >
          🔊
        </button>
      )}
    </div>
  );

  const backContent = reversed ? (
    <div className="flashcard-content">
      <h2>{card.front}</h2>
      {card.frontAudioUrl && (
        <button
          className="audio-button"
          onClick={playFrontAudio}
          disabled={isPlaying}
          aria-label={`Play ${card.frontLabel || 'front'} audio`}
        >
          🔊
        </button>
      )}
    </div>
  ) : (
    <div className="flashcard-content">
      <h2>{card.back}</h2>
      {card.backAudioUrl && (
        <button
          className="audio-button"
          onClick={playBackAudio}
          disabled={isPlaying}
          aria-label={`Play ${card.backLabel || 'back'} audio`}
        >
          🔊
        </button>
      )}
    </div>
  );

  return (
    <div
      className={`flashcard ${isFlipped ? 'flipped' : ''}`}
      onClick={handleFlip}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleFlip();
        }
      }}
      aria-label="Flashcard, click to flip"
      style={{ outline: 'none' }}
    >
      <div className="flashcard-inner">
        <div className="flashcard-front">
          {frontContent}
        </div>
        <div className="flashcard-back">
          {backContent}
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="flashcard-navigation">
        <button
          onClick={(e) => { e.stopPropagation(); onPrevious(); }}
          className="nav-button"
          aria-label="Previous flashcard"
        >
          ◀ Previous
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="nav-button"
          aria-label="Next flashcard"
        >
          Next ▶
        </button>
      </div>
    </div>
  );
};

export default Flashcard;
