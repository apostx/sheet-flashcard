export interface Flashcard {
  id: number;
  sourceWord: string;
  sourceSoundUrl?: string;
  targetTranslation: string;
  targetSoundUrl?: string;
  sourceLanguage?: string;
  targetLanguage?: string;
  repetitionCount?: number;
}
