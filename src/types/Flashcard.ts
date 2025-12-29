export interface Tag {
  label: string;
  description?: string;
}

export interface Flashcard {
  id: number;
  front: string;
  frontAudioUrl?: string;
  back: string;
  backAudioUrl?: string;
  frontLabel?: string;
  backLabel?: string;
  repetitionCount?: number;
  tags?: Tag[];
}
