import React, { useState } from 'react';
import { Flashcard as FlashcardType } from '../types/Flashcard';
import { useAudio } from '../hooks/useAudio';

interface FlashcardProps {
  card: FlashcardType;
  onNext: () => void;
  onPrevious: () => void;
  reversed?: boolean;
  isFlipped?: boolean;
  onFlip?: () => void;
  isAnimatingBack?: boolean;
  onAnimationEnd?: () => void;
}

const Flashcard: React.FC<FlashcardProps> = ({
  card,
  onNext,
  onPrevious,
  reversed = false,
  isFlipped: externalIsFlipped,
  onFlip: externalOnFlip,
  isAnimatingBack = false,
  onAnimationEnd
}) => {
  const [internalIsFlipped, setInternalIsFlipped] = useState(false);
  const { playAudio, isPlaying, error } = useAudio();

  const isControlledExternally = externalIsFlipped !== undefined && externalOnFlip !== undefined;
  const isFlipped = isControlledExternally ? externalIsFlipped : internalIsFlipped;

  if (!card || !card.front || !card.back) {
    return (
      <div className="w-full max-w-2xl h-[400px] sm:h-[280px] perspective-1000 my-8 mx-auto cursor-pointer">
        <div className="relative w-full h-full text-center preserve-3d rounded-xl" style={{ boxShadow: 'var(--card-shadow)' }}>
          <div className="absolute w-full h-full backface-hidden flex flex-col justify-center items-center rounded-xl p-8 border" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border-color)' }}>
            <h2 className="text-2xl" style={{ color: 'var(--card-text)' }}>Invalid Card Data</h2>
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

  const AudioButton = ({ onClick, disabled, label }: { onClick: (e: React.MouseEvent) => void; disabled: boolean; label: string }) => (
    <button
      className="p-2 rounded mt-2 flex items-center justify-center min-w-10 min-h-10 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      style={{ backgroundColor: 'var(--audio-btn-bg)', color: 'var(--card-text)' }}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
    >
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
      </svg>
    </button>
  );

  const TagsDisplay = () => {
    if (!card.tags || card.tags.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-2 mt-4 justify-center" onClick={(e) => e.stopPropagation()}>
        {card.tags.map((tag, index) => (
          <span
            key={index}
            className="px-4 py-1.5 text-sm rounded-full transition-colors cursor-pointer border"
            style={{ backgroundColor: 'var(--tag-bg)', color: 'var(--tag-text)', borderColor: 'var(--tag-border)' }}
            data-tooltip={tag.description}
          >
            #{tag.label}
          </span>
        ))}
      </div>
    );
  };

  const frontContent = reversed ? (
    <div className="flex flex-col items-center justify-center w-full h-full text-center overflow-hidden">
      <h2 className="text-3xl lg:text-4xl sm:text-2xl mb-2 w-full break-words overflow-y-auto max-h-44 leading-snug">{card.back}</h2>
      {card.backAudioUrl && <AudioButton onClick={playBackAudio} disabled={isPlaying} label={`Play ${card.backLabel || 'back'} audio`} />}
      <TagsDisplay />
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center w-full h-full text-center overflow-hidden">
      <h2 className="text-3xl lg:text-4xl sm:text-2xl mb-2 w-full break-words overflow-y-auto max-h-44 leading-snug">{card.front}</h2>
      {card.frontAudioUrl && <AudioButton onClick={playFrontAudio} disabled={isPlaying} label={`Play ${card.frontLabel || 'front'} audio`} />}
    </div>
  );

  const backContent = reversed ? (
    <div className="flex flex-col items-center justify-center w-full h-full text-center overflow-hidden">
      <h2 className="text-3xl lg:text-4xl sm:text-2xl mb-2 w-full break-words overflow-y-auto max-h-44 leading-snug">{card.front}</h2>
      {card.frontAudioUrl && <AudioButton onClick={playFrontAudio} disabled={isPlaying} label={`Play ${card.frontLabel || 'front'} audio`} />}
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center w-full h-full text-center overflow-hidden">
      <h2 className="text-3xl lg:text-4xl sm:text-2xl mb-2 w-full break-words overflow-y-auto max-h-44 leading-snug">{card.back}</h2>
      {card.backAudioUrl && <AudioButton onClick={playBackAudio} disabled={isPlaying} label={`Play ${card.backLabel || 'back'} audio`} />}
      <TagsDisplay />
    </div>
  );

  return (
    <div
      className="w-full max-w-2xl h-[400px] lg:h-[420px] sm:h-[280px] perspective-1000 my-8 sm:my-6 mx-auto cursor-pointer outline-none"
      onClick={handleFlip}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleFlip();
        }
      }}
      aria-label="Flashcard, click to flip"
    >
      <div
        className={`relative w-full h-full text-center preserve-3d rounded-xl ${
          isAnimatingBack ? 'animate-flip-back' : 'transition-transform duration-500'
        }`}
        style={{
          boxShadow: 'var(--card-shadow)',
          transform: isAnimatingBack ? undefined : (isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)')
        }}
        onAnimationEnd={(e) => {
          if (e.target === e.currentTarget) {
            onAnimationEnd?.();
          }
        }}
      >
        {/* Front face */}
        <div className="absolute w-full h-full backface-hidden flex flex-col justify-center items-center rounded-xl p-8 sm:p-6 overflow-hidden border" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border-color)', color: 'var(--card-text)' }}>
          {frontContent}
        </div>
        {/* Back face */}
        <div className="absolute w-full h-full backface-hidden flex flex-col justify-center items-center rounded-xl p-8 sm:p-6 overflow-hidden rotate-y-180 border" style={{ backgroundColor: 'var(--card-bg-back)', borderColor: 'var(--card-border-color)', color: 'var(--card-text)' }}>
          {backContent}
        </div>
      </div>

      {error && (
        <div className="mt-2 px-3 py-2 rounded text-sm bg-red-50 text-red-700 border border-red-200">
          {error}
        </div>
      )}

      <div className="mt-4 sm:mt-3 flex justify-between w-full">
        <button
          onClick={(e) => { e.stopPropagation(); onPrevious(); }}
          className="px-5 py-2.5 sm:px-4 sm:py-2 sm:text-sm rounded-lg text-white transition-colors cursor-pointer"
          style={{ backgroundColor: 'var(--btn-bg)' }}
          aria-label="Previous flashcard"
        >
          ← Previous
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="px-5 py-2.5 sm:px-4 sm:py-2 sm:text-sm rounded-lg text-white transition-colors cursor-pointer"
          style={{ backgroundColor: 'var(--btn-bg)' }}
          aria-label="Next flashcard"
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default Flashcard;
