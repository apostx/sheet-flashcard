import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { Flashcard as FlashcardType } from '../types/Flashcard';

// Mock card data
const mockCard: FlashcardType = {
  id: 1,
  front: 'What is React?',
  back: 'A JavaScript library for building user interfaces',
  frontLabel: 'Question',
  backLabel: 'Answer',
  tags: [
    { label: 'JavaScript', description: 'Programming language' },
    { label: 'Frontend', description: 'Client-side development' },
    { label: 'Library', description: 'Reusable code collection' },
  ],
};

// Full-page wrapper
const Page = ({ children, bg }: { children: React.ReactNode; bg: string }) => (
  <div className="w-screen h-screen flex items-center justify-center p-8" style={{ background: bg, minHeight: '100vh' }}>
    <div className="w-full max-w-2xl">{children}</div>
  </div>
);

// Tags component
const Tags = ({ tags, className }: { tags?: FlashcardType['tags']; className: string }) => {
  if (!tags?.length) return null;
  return (
    <div className="flex flex-wrap gap-2 mt-4 justify-center">
      {tags.map((tag, i) => (
        <span key={i} className={className} title={tag.description}>#{tag.label}</span>
      ))}
    </div>
  );
};

// Card base
const Card = ({ isFlipped, shadow, children, radius = 'rounded-xl' }: { isFlipped: boolean; shadow: string; children: React.ReactNode; radius?: string }) => (
  <div className="h-[400px] perspective-1000 cursor-pointer">
    <div
      className={`relative w-full h-full text-center preserve-3d transition-transform duration-500 ${radius}`}
      style={{ boxShadow: shadow, transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
    >
      {children}
    </div>
  </div>
);

// ============================================
// ELEGANT VARIATIONS (10)
// ============================================

// 1. Elegant Gold - Classic gold border
const Elegant1_Gold = ({ card, isFlipped, isDark }: { card: FlashcardType; isFlipped: boolean; isDark: boolean }) => (
  <Page bg={isDark ? '#0c0c10' : '#f8f6f2'}>
    <Card isFlipped={isFlipped} shadow={isDark ? '0 8px 40px rgba(212,175,55,0.12)' : '0 8px 40px rgba(0,0,0,0.08)'}>
      <div
        className="absolute w-full h-full backface-hidden flex flex-col justify-center items-center rounded-xl p-8"
        style={{ backgroundColor: isDark ? '#18181f' : '#ffffff', border: '1px solid #d4af37' }}
      >
        <h2 className={`text-3xl ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>{card.front}</h2>
      </div>
      <div
        className="absolute w-full h-full backface-hidden flex flex-col justify-center items-center rounded-xl p-8 rotate-y-180"
        style={{ backgroundColor: isDark ? '#1a1a24' : '#fdfcf8', border: '1px solid #d4af37' }}
      >
        <h2 className={`text-3xl mb-4 ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>{card.back}</h2>
        <Tags tags={card.tags} className="px-4 py-1.5 text-sm rounded-full bg-amber-500/20 text-amber-600 border border-amber-500/30" />
      </div>
    </Card>
  </Page>
);

// 2. Elegant Silver - Platinum accents
const Elegant2_Silver = ({ card, isFlipped, isDark }: { card: FlashcardType; isFlipped: boolean; isDark: boolean }) => (
  <Page bg={isDark ? '#0a0a0c' : '#f5f5f7'}>
    <Card isFlipped={isFlipped} shadow={isDark ? '0 8px 40px rgba(192,192,192,0.08)' : '0 8px 40px rgba(0,0,0,0.06)'}>
      <div
        className="absolute w-full h-full backface-hidden flex flex-col justify-center items-center rounded-xl p-8"
        style={{ backgroundColor: isDark ? '#151518' : '#ffffff', border: '1px solid #a0a0a8' }}
      >
        <h2 className={`text-3xl ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>{card.front}</h2>
      </div>
      <div
        className="absolute w-full h-full backface-hidden flex flex-col justify-center items-center rounded-xl p-8 rotate-y-180"
        style={{ backgroundColor: isDark ? '#18181c' : '#fafafa', border: '1px solid #a0a0a8' }}
      >
        <h2 className={`text-3xl mb-4 ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>{card.back}</h2>
        <Tags tags={card.tags} className="px-4 py-1.5 text-sm rounded-full bg-gray-400/20 text-gray-500 border border-gray-400/30" />
      </div>
    </Card>
  </Page>
);

// 3. Elegant Rose - Rose gold accents
const Elegant3_Rose = ({ card, isFlipped, isDark }: { card: FlashcardType; isFlipped: boolean; isDark: boolean }) => (
  <Page bg={isDark ? '#0f0a0c' : '#faf5f5'}>
    <Card isFlipped={isFlipped} shadow={isDark ? '0 8px 40px rgba(200,150,150,0.1)' : '0 8px 40px rgba(0,0,0,0.06)'}>
      <div
        className="absolute w-full h-full backface-hidden flex flex-col justify-center items-center rounded-xl p-8"
        style={{ backgroundColor: isDark ? '#1a1518' : '#ffffff', border: '1px solid #c9a0a0' }}
      >
        <h2 className={`text-3xl ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>{card.front}</h2>
      </div>
      <div
        className="absolute w-full h-full backface-hidden flex flex-col justify-center items-center rounded-xl p-8 rotate-y-180"
        style={{ backgroundColor: isDark ? '#1c1618' : '#fdfafa', border: '1px solid #c9a0a0' }}
      >
        <h2 className={`text-3xl mb-4 ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>{card.back}</h2>
        <Tags tags={card.tags} className="px-4 py-1.5 text-sm rounded-full bg-rose-400/20 text-rose-500 border border-rose-400/30" />
      </div>
    </Card>
  </Page>
);

// 4. Elegant Emerald - Green luxury
const Elegant4_Emerald = ({ card, isFlipped, isDark }: { card: FlashcardType; isFlipped: boolean; isDark: boolean }) => (
  <Page bg={isDark ? '#080c0a' : '#f5f8f6'}>
    <Card isFlipped={isFlipped} shadow={isDark ? '0 8px 40px rgba(80,200,120,0.1)' : '0 8px 40px rgba(0,0,0,0.06)'}>
      <div
        className="absolute w-full h-full backface-hidden flex flex-col justify-center items-center rounded-xl p-8"
        style={{ backgroundColor: isDark ? '#141a16' : '#ffffff', border: '1px solid #50c878' }}
      >
        <h2 className={`text-3xl ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>{card.front}</h2>
      </div>
      <div
        className="absolute w-full h-full backface-hidden flex flex-col justify-center items-center rounded-xl p-8 rotate-y-180"
        style={{ backgroundColor: isDark ? '#161c18' : '#fafcfa', border: '1px solid #50c878' }}
      >
        <h2 className={`text-3xl mb-4 ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>{card.back}</h2>
        <Tags tags={card.tags} className="px-4 py-1.5 text-sm rounded-full bg-emerald-500/20 text-emerald-500 border border-emerald-500/30" />
      </div>
    </Card>
  </Page>
);

// 5. Elegant Sapphire - Royal blue
const Elegant5_Sapphire = ({ card, isFlipped, isDark }: { card: FlashcardType; isFlipped: boolean; isDark: boolean }) => (
  <Page bg={isDark ? '#08080c' : '#f5f7fa'}>
    <Card isFlipped={isFlipped} shadow={isDark ? '0 8px 40px rgba(65,105,225,0.12)' : '0 8px 40px rgba(0,0,0,0.06)'}>
      <div
        className="absolute w-full h-full backface-hidden flex flex-col justify-center items-center rounded-xl p-8"
        style={{ backgroundColor: isDark ? '#14161c' : '#ffffff', border: '1px solid #4169e1' }}
      >
        <h2 className={`text-3xl ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>{card.front}</h2>
      </div>
      <div
        className="absolute w-full h-full backface-hidden flex flex-col justify-center items-center rounded-xl p-8 rotate-y-180"
        style={{ backgroundColor: isDark ? '#16181e' : '#fafafc', border: '1px solid #4169e1' }}
      >
        <h2 className={`text-3xl mb-4 ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>{card.back}</h2>
        <Tags tags={card.tags} className="px-4 py-1.5 text-sm rounded-full bg-blue-500/20 text-blue-500 border border-blue-500/30" />
      </div>
    </Card>
  </Page>
);

// 6. Elegant Amethyst - Purple luxury
const Elegant6_Amethyst = ({ card, isFlipped, isDark }: { card: FlashcardType; isFlipped: boolean; isDark: boolean }) => (
  <Page bg={isDark ? '#0a080c' : '#f8f5fa'}>
    <Card isFlipped={isFlipped} shadow={isDark ? '0 8px 40px rgba(153,102,204,0.12)' : '0 8px 40px rgba(0,0,0,0.06)'}>
      <div
        className="absolute w-full h-full backface-hidden flex flex-col justify-center items-center rounded-xl p-8"
        style={{ backgroundColor: isDark ? '#18161c' : '#ffffff', border: '1px solid #9966cc' }}
      >
        <h2 className={`text-3xl ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>{card.front}</h2>
      </div>
      <div
        className="absolute w-full h-full backface-hidden flex flex-col justify-center items-center rounded-xl p-8 rotate-y-180"
        style={{ backgroundColor: isDark ? '#1a181e' : '#fcfafc', border: '1px solid #9966cc' }}
      >
        <h2 className={`text-3xl mb-4 ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>{card.back}</h2>
        <Tags tags={card.tags} className="px-4 py-1.5 text-sm rounded-full bg-purple-500/20 text-purple-500 border border-purple-500/30" />
      </div>
    </Card>
  </Page>
);

// 7. Elegant Ruby - Deep red
const Elegant7_Ruby = ({ card, isFlipped, isDark }: { card: FlashcardType; isFlipped: boolean; isDark: boolean }) => (
  <Page bg={isDark ? '#0c0808' : '#faf5f5'}>
    <Card isFlipped={isFlipped} shadow={isDark ? '0 8px 40px rgba(224,17,95,0.1)' : '0 8px 40px rgba(0,0,0,0.06)'}>
      <div
        className="absolute w-full h-full backface-hidden flex flex-col justify-center items-center rounded-xl p-8"
        style={{ backgroundColor: isDark ? '#1c1416' : '#ffffff', border: '1px solid #e0115f' }}
      >
        <h2 className={`text-3xl ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>{card.front}</h2>
      </div>
      <div
        className="absolute w-full h-full backface-hidden flex flex-col justify-center items-center rounded-xl p-8 rotate-y-180"
        style={{ backgroundColor: isDark ? '#1e1618' : '#fcfafa', border: '1px solid #e0115f' }}
      >
        <h2 className={`text-3xl mb-4 ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>{card.back}</h2>
        <Tags tags={card.tags} className="px-4 py-1.5 text-sm rounded-full bg-red-500/20 text-red-500 border border-red-500/30" />
      </div>
    </Card>
  </Page>
);

// 8. Elegant Onyx - Deep black with subtle border
const Elegant8_Onyx = ({ card, isFlipped, isDark }: { card: FlashcardType; isFlipped: boolean; isDark: boolean }) => (
  <Page bg={isDark ? '#050505' : '#f0f0f0'}>
    <Card isFlipped={isFlipped} shadow={isDark ? '0 8px 40px rgba(255,255,255,0.03)' : '0 8px 40px rgba(0,0,0,0.1)'}>
      <div
        className="absolute w-full h-full backface-hidden flex flex-col justify-center items-center rounded-xl p-8"
        style={{ backgroundColor: isDark ? '#0f0f0f' : '#ffffff', border: isDark ? '1px solid #2a2a2a' : '1px solid #1a1a1a' }}
      >
        <h2 className={`text-3xl ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>{card.front}</h2>
      </div>
      <div
        className="absolute w-full h-full backface-hidden flex flex-col justify-center items-center rounded-xl p-8 rotate-y-180"
        style={{ backgroundColor: isDark ? '#121212' : '#f8f8f8', border: isDark ? '1px solid #2a2a2a' : '1px solid #1a1a1a' }}
      >
        <h2 className={`text-3xl mb-4 ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>{card.back}</h2>
        <Tags tags={card.tags} className={`px-4 py-1.5 text-sm rounded-full ${isDark ? 'bg-white/10 text-gray-400 border border-white/20' : 'bg-gray-800/10 text-gray-600 border border-gray-800/20'}`} />
      </div>
    </Card>
  </Page>
);

// 9. Elegant Pearl - Soft white/cream
const Elegant9_Pearl = ({ card, isFlipped, isDark }: { card: FlashcardType; isFlipped: boolean; isDark: boolean }) => (
  <Page bg={isDark ? '#0c0c0a' : '#f8f8f5'}>
    <Card isFlipped={isFlipped} shadow={isDark ? '0 8px 40px rgba(255,250,240,0.05)' : '0 8px 40px rgba(0,0,0,0.05)'}>
      <div
        className="absolute w-full h-full backface-hidden flex flex-col justify-center items-center rounded-xl p-8"
        style={{ backgroundColor: isDark ? '#1a1a18' : '#fffef8', border: '1px solid #e8e4d9' }}
      >
        <h2 className={`text-3xl ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>{card.front}</h2>
      </div>
      <div
        className="absolute w-full h-full backface-hidden flex flex-col justify-center items-center rounded-xl p-8 rotate-y-180"
        style={{ backgroundColor: isDark ? '#1c1c1a' : '#fdfcf5', border: '1px solid #e8e4d9' }}
      >
        <h2 className={`text-3xl mb-4 ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>{card.back}</h2>
        <Tags tags={card.tags} className="px-4 py-1.5 text-sm rounded-full bg-amber-100/50 text-amber-700 border border-amber-200/50" />
      </div>
    </Card>
  </Page>
);

// 10. Elegant Bronze - Warm copper/bronze
const Elegant10_Bronze = ({ card, isFlipped, isDark }: { card: FlashcardType; isFlipped: boolean; isDark: boolean }) => (
  <Page bg={isDark ? '#0c0a08' : '#f8f5f2'}>
    <Card isFlipped={isFlipped} shadow={isDark ? '0 8px 40px rgba(205,127,50,0.1)' : '0 8px 40px rgba(0,0,0,0.06)'}>
      <div
        className="absolute w-full h-full backface-hidden flex flex-col justify-center items-center rounded-xl p-8"
        style={{ backgroundColor: isDark ? '#1a1816' : '#ffffff', border: '1px solid #cd7f32' }}
      >
        <h2 className={`text-3xl ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>{card.front}</h2>
      </div>
      <div
        className="absolute w-full h-full backface-hidden flex flex-col justify-center items-center rounded-xl p-8 rotate-y-180"
        style={{ backgroundColor: isDark ? '#1c1a18' : '#fdfaf5', border: '1px solid #cd7f32' }}
      >
        <h2 className={`text-3xl mb-4 ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>{card.back}</h2>
        <Tags tags={card.tags} className="px-4 py-1.5 text-sm rounded-full bg-orange-600/20 text-orange-600 border border-orange-600/30" />
      </div>
    </Card>
  </Page>
);

// ============================================
// META & STORIES
// ============================================
const meta: Meta = {
  title: 'Design Variations/Elegant',
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj;

// 1. Gold
export const Gold_Light_Front: Story = { render: () => <Elegant1_Gold card={mockCard} isFlipped={false} isDark={false} /> };
export const Gold_Light_Back: Story = { render: () => <Elegant1_Gold card={mockCard} isFlipped={true} isDark={false} /> };
export const Gold_Dark_Front: Story = { render: () => <Elegant1_Gold card={mockCard} isFlipped={false} isDark={true} /> };
export const Gold_Dark_Back: Story = { render: () => <Elegant1_Gold card={mockCard} isFlipped={true} isDark={true} /> };

// 2. Silver
export const Silver_Light_Front: Story = { render: () => <Elegant2_Silver card={mockCard} isFlipped={false} isDark={false} /> };
export const Silver_Light_Back: Story = { render: () => <Elegant2_Silver card={mockCard} isFlipped={true} isDark={false} /> };
export const Silver_Dark_Front: Story = { render: () => <Elegant2_Silver card={mockCard} isFlipped={false} isDark={true} /> };
export const Silver_Dark_Back: Story = { render: () => <Elegant2_Silver card={mockCard} isFlipped={true} isDark={true} /> };

// 3. Rose
export const Rose_Light_Front: Story = { render: () => <Elegant3_Rose card={mockCard} isFlipped={false} isDark={false} /> };
export const Rose_Light_Back: Story = { render: () => <Elegant3_Rose card={mockCard} isFlipped={true} isDark={false} /> };
export const Rose_Dark_Front: Story = { render: () => <Elegant3_Rose card={mockCard} isFlipped={false} isDark={true} /> };
export const Rose_Dark_Back: Story = { render: () => <Elegant3_Rose card={mockCard} isFlipped={true} isDark={true} /> };

// 4. Emerald
export const Emerald_Light_Front: Story = { render: () => <Elegant4_Emerald card={mockCard} isFlipped={false} isDark={false} /> };
export const Emerald_Light_Back: Story = { render: () => <Elegant4_Emerald card={mockCard} isFlipped={true} isDark={false} /> };
export const Emerald_Dark_Front: Story = { render: () => <Elegant4_Emerald card={mockCard} isFlipped={false} isDark={true} /> };
export const Emerald_Dark_Back: Story = { render: () => <Elegant4_Emerald card={mockCard} isFlipped={true} isDark={true} /> };

// 5. Sapphire
export const Sapphire_Light_Front: Story = { render: () => <Elegant5_Sapphire card={mockCard} isFlipped={false} isDark={false} /> };
export const Sapphire_Light_Back: Story = { render: () => <Elegant5_Sapphire card={mockCard} isFlipped={true} isDark={false} /> };
export const Sapphire_Dark_Front: Story = { render: () => <Elegant5_Sapphire card={mockCard} isFlipped={false} isDark={true} /> };
export const Sapphire_Dark_Back: Story = { render: () => <Elegant5_Sapphire card={mockCard} isFlipped={true} isDark={true} /> };

// 6. Amethyst
export const Amethyst_Light_Front: Story = { render: () => <Elegant6_Amethyst card={mockCard} isFlipped={false} isDark={false} /> };
export const Amethyst_Light_Back: Story = { render: () => <Elegant6_Amethyst card={mockCard} isFlipped={true} isDark={false} /> };
export const Amethyst_Dark_Front: Story = { render: () => <Elegant6_Amethyst card={mockCard} isFlipped={false} isDark={true} /> };
export const Amethyst_Dark_Back: Story = { render: () => <Elegant6_Amethyst card={mockCard} isFlipped={true} isDark={true} /> };

// 7. Ruby
export const Ruby_Light_Front: Story = { render: () => <Elegant7_Ruby card={mockCard} isFlipped={false} isDark={false} /> };
export const Ruby_Light_Back: Story = { render: () => <Elegant7_Ruby card={mockCard} isFlipped={true} isDark={false} /> };
export const Ruby_Dark_Front: Story = { render: () => <Elegant7_Ruby card={mockCard} isFlipped={false} isDark={true} /> };
export const Ruby_Dark_Back: Story = { render: () => <Elegant7_Ruby card={mockCard} isFlipped={true} isDark={true} /> };

// 8. Onyx
export const Onyx_Light_Front: Story = { render: () => <Elegant8_Onyx card={mockCard} isFlipped={false} isDark={false} /> };
export const Onyx_Light_Back: Story = { render: () => <Elegant8_Onyx card={mockCard} isFlipped={true} isDark={false} /> };
export const Onyx_Dark_Front: Story = { render: () => <Elegant8_Onyx card={mockCard} isFlipped={false} isDark={true} /> };
export const Onyx_Dark_Back: Story = { render: () => <Elegant8_Onyx card={mockCard} isFlipped={true} isDark={true} /> };

// 9. Pearl
export const Pearl_Light_Front: Story = { render: () => <Elegant9_Pearl card={mockCard} isFlipped={false} isDark={false} /> };
export const Pearl_Light_Back: Story = { render: () => <Elegant9_Pearl card={mockCard} isFlipped={true} isDark={false} /> };
export const Pearl_Dark_Front: Story = { render: () => <Elegant9_Pearl card={mockCard} isFlipped={false} isDark={true} /> };
export const Pearl_Dark_Back: Story = { render: () => <Elegant9_Pearl card={mockCard} isFlipped={true} isDark={true} /> };

// 10. Bronze
export const Bronze_Light_Front: Story = { render: () => <Elegant10_Bronze card={mockCard} isFlipped={false} isDark={false} /> };
export const Bronze_Light_Back: Story = { render: () => <Elegant10_Bronze card={mockCard} isFlipped={true} isDark={false} /> };
export const Bronze_Dark_Front: Story = { render: () => <Elegant10_Bronze card={mockCard} isFlipped={false} isDark={true} /> };
export const Bronze_Dark_Back: Story = { render: () => <Elegant10_Bronze card={mockCard} isFlipped={true} isDark={true} /> };
