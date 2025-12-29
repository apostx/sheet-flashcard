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

  const isControlledExternally = externalIsFlipped !== undefined && externalOnFlip !== undefined;
  const isFlipped = isControlledExternally ? externalIsFlipped : internalIsFlipped;

  if (!card || !card.front || !card.back) {
    return (
      <div className="w-full max-w-lg h-[300px] sm:h-[200px] perspective-1000 my-8 mx-auto cursor-pointer">
        <div className="relative w-full h-full text-center preserve-3d rounded-xl" style={{ boxShadow: 'var(--card-shadow)' }}>
          <div className="absolute w-full h-full backface-hidden flex flex-col justify-center items-center rounded-xl p-6 overflow-hidden" style={{ backgroundColor: 'var(--button-bg)', color: 'var(--button-text)' }}>
            <h2 className="text-2xl">Invalid Card Data</h2>
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
      className="p-2 bg-white/20 rounded mt-2 text-xl text-white flex items-center justify-center min-w-10 min-h-10 transition-colors hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
    >
      🔊
    </button>
  );

  const frontContent = reversed ? (
    <div className="flex flex-col items-center justify-center w-full h-full text-center overflow-hidden">
      <h2 className="text-2xl lg:text-3xl sm:text-xl mb-2 w-full break-words overflow-y-auto max-h-36 leading-snug">{card.back}</h2>
      {card.backAudioUrl && <AudioButton onClick={playBackAudio} disabled={isPlaying} label={`Play ${card.backLabel || 'back'} audio`} />}
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center w-full h-full text-center overflow-hidden">
      <h2 className="text-2xl lg:text-3xl sm:text-xl mb-2 w-full break-words overflow-y-auto max-h-36 leading-snug">{card.front}</h2>
      {card.frontAudioUrl && <AudioButton onClick={playFrontAudio} disabled={isPlaying} label={`Play ${card.frontLabel || 'front'} audio`} />}
    </div>
  );

  const backContent = reversed ? (
    <div className="flex flex-col items-center justify-center w-full h-full text-center overflow-hidden">
      <h2 className="text-2xl lg:text-3xl sm:text-xl mb-2 w-full break-words overflow-y-auto max-h-36 leading-snug">{card.front}</h2>
      {card.frontAudioUrl && <AudioButton onClick={playFrontAudio} disabled={isPlaying} label={`Play ${card.frontLabel || 'front'} audio`} />}
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center w-full h-full text-center overflow-hidden">
      <h2 className="text-2xl lg:text-3xl sm:text-xl mb-2 w-full break-words overflow-y-auto max-h-36 leading-snug">{card.back}</h2>
      {card.backAudioUrl && <AudioButton onClick={playBackAudio} disabled={isPlaying} label={`Play ${card.backLabel || 'back'} audio`} />}
    </div>
  );

  return (
    <div
      className="w-full max-w-lg lg:max-w-xl h-[300px] lg:h-[320px] sm:h-[200px] perspective-1000 my-8 sm:my-6 mx-auto cursor-pointer outline-none"
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
        className="relative w-full h-full text-center preserve-3d transition-transform duration-500 rounded-xl"
        style={{
          boxShadow: 'var(--card-shadow)',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}
      >
        <div
          className="absolute w-full h-full backface-hidden flex flex-col justify-center items-center rounded-xl p-6 sm:p-4 overflow-hidden"
          style={{ backgroundColor: 'var(--button-bg)', color: 'var(--button-text)' }}
        >
          {frontContent}
        </div>
        <div
          className="absolute w-full h-full backface-hidden flex flex-col justify-center items-center rounded-xl p-6 sm:p-4 overflow-hidden rotate-y-180"
          style={{ backgroundColor: '#2ecc71', color: 'var(--button-text)' }}
        >
          {backContent}
        </div>
      </div>

      {error && (
        <div className="mt-2 px-2 py-1 rounded text-sm" style={{ color: 'var(--error-color)', backgroundColor: 'var(--error-bg)' }}>
          {error}
        </div>
      )}

      <div className="mt-4 sm:mt-2 flex justify-between w-full">
        <button
          onClick={(e) => { e.stopPropagation(); onPrevious(); }}
          className="px-4 py-2 sm:px-3 sm:py-1.5 sm:text-sm rounded bg-[#34495e] text-white transition-colors hover:bg-[#2c3e50]"
          aria-label="Previous flashcard"
        >
          ◀ Previous
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="px-4 py-2 sm:px-3 sm:py-1.5 sm:text-sm rounded bg-[#34495e] text-white transition-colors hover:bg-[#2c3e50]"
          aria-label="Next flashcard"
        >
          Next ▶
        </button>
      </div>
    </div>
  );
};

export default Flashcard;
