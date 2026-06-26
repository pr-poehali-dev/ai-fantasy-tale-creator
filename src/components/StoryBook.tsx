import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface StoryBookProps {
  title: string;
  paragraphs: string[];
  photos: string[];
  onPrint: () => void;
  onCopy: () => void;
  onEmail: () => void;
  onShare: () => void;
  onRegenerate: () => void;
}

const PAGE_EMOJIS = ['🌟', '🍄', '🦋', '🌙', '🌈', '🦊', '🐉', '🚀', '🌊', '🦕'];
const BG_COLORS = [
  'from-violet-100 to-purple-50',
  'from-amber-100 to-orange-50',
  'from-sky-100 to-blue-50',
  'from-rose-100 to-pink-50',
  'from-emerald-100 to-green-50',
  'from-fuchsia-100 to-violet-50',
  'from-cyan-100 to-teal-50',
  'from-lime-100 to-emerald-50',
  'from-orange-100 to-red-50',
  'from-indigo-100 to-blue-50',
];

export default function StoryBook({
  title,
  paragraphs,
  photos,
  onPrint,
  onCopy,
  onEmail,
  onShare,
  onRegenerate,
}: StoryBookProps) {
  const [page, setPage] = useState(0);
  const [flipping, setFlipping] = useState<'left' | 'right' | null>(null);

  const total = paragraphs.length;
  const isFirst = page === 0;
  const isLast = page === total - 1;

  const goTo = (dir: 'prev' | 'next') => {
    if (flipping) return;
    if (dir === 'next' && isLast) return;
    if (dir === 'prev' && isFirst) return;
    setFlipping(dir === 'next' ? 'right' : 'left');
    setTimeout(() => {
      setPage((p) => (dir === 'next' ? p + 1 : p - 1));
      setFlipping(null);
    }, 380);
  };

  const bg = BG_COLORS[page % BG_COLORS.length];
  const emoji = PAGE_EMOJIS[page % PAGE_EMOJIS.length];
  const photo = photos[page % photos.length] ?? null;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Book */}
      <div className="relative w-full max-w-lg select-none" style={{ perspective: '1200px' }}>
        {/* Shadow */}
        <div className="absolute -bottom-3 left-4 right-4 h-6 bg-black/20 blur-lg rounded-full" />

        {/* Book body */}
        <div
          className={`relative rounded-[1.5rem] overflow-hidden bg-gradient-to-br ${bg} border border-white/80 shadow-2xl transition-all duration-300`}
          style={{
            transform: flipping === 'right'
              ? 'rotateY(-8deg) scale(0.97)'
              : flipping === 'left'
              ? 'rotateY(8deg) scale(0.97)'
              : 'rotateY(0deg) scale(1)',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Spine */}
          <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-black/15 to-transparent z-10 rounded-l-[1.5rem]" />

          {/* Page lines texture */}
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #888 31px, #888 32px)', backgroundPositionY: '8px' }} />

          <div className="relative p-6 sm:p-8 min-h-[420px] flex flex-col">
            {/* Page header */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl animate-float inline-block">{emoji}</span>
              <span className="font-heading text-xs text-foreground/40 tracking-widest uppercase">
                стр. {page + 1} / {total}
              </span>
            </div>

            {/* Title on first page */}
            {page === 0 && (
              <h2 className="font-display text-2xl sm:text-3xl text-foreground mb-4 leading-snug capitalize">
                {title}
              </h2>
            )}

            {/* Photo */}
            {photo && (
              <div className="mb-5 flex justify-center">
                <div className="relative">
                  {/* 3D frame */}
                  <div className="absolute -inset-2 rounded-[1.25rem] rotate-2"
                    style={{ background: 'linear-gradient(135deg, hsl(var(--sunset)/0.5), hsl(var(--coral)/0.3))', filter: 'blur(6px)' }} />
                  <div className="absolute -inset-1.5 rounded-[1.25rem] bg-white shadow-lg" />
                  <img
                    src={photo}
                    alt="Фото ребёнка"
                    className="relative rounded-[1rem] object-cover shadow-inner"
                    style={{ width: 160, height: 160 }}
                  />
                  {/* Shine */}
                  <div className="absolute inset-0 rounded-[1rem] bg-gradient-to-tr from-white/40 to-transparent pointer-events-none" />
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-white rounded-full text-[10px] font-heading font-bold shadow text-primary whitespace-nowrap">
                    ✨ Наш герой
                  </span>
                </div>
              </div>
            )}

            {/* Paragraph */}
            <p className="font-sans text-base sm:text-lg leading-relaxed text-foreground/85 flex-1">
              <span className="font-display text-3xl text-primary float-left mr-1 leading-none">
                {paragraphs[page][0]}
              </span>
              {paragraphs[page].slice(1)}
            </p>

            {/* Decorative corner */}
            <div className="absolute bottom-4 right-6 text-4xl opacity-10 select-none font-display">
              {page + 1}
            </div>
          </div>
        </div>

        {/* Page flip hint lines on edge */}
        <div className="absolute right-0 top-6 bottom-6 w-1.5 flex flex-col gap-0.5 opacity-30">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex-1 bg-foreground/30 rounded-full" />
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-3 mt-1">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full w-11 h-11 shadow"
          onClick={() => goTo('prev')}
          disabled={isFirst || !!flipping}
        >
          <Icon name="ChevronLeft" size={20} />
        </Button>

        {/* Page dots */}
        <div className="flex gap-1.5">
          {paragraphs.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                if (flipping || i === page) return;
                setFlipping(i > page ? 'right' : 'left');
                setTimeout(() => { setPage(i); setFlipping(null); }, 380);
              }}
              className={`rounded-full transition-all duration-200 ${i === page ? 'w-5 h-2.5 bg-primary' : 'w-2.5 h-2.5 bg-muted-foreground/30 hover:bg-primary/50'}`}
            />
          ))}
        </div>

        <Button
          variant="outline"
          size="icon"
          className="rounded-full w-11 h-11 shadow"
          onClick={() => goTo('next')}
          disabled={isLast || !!flipping}
        >
          <Icon name="ChevronRight" size={20} />
        </Button>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 justify-center pt-1">
        {[
          { icon: 'Printer', label: 'PDF', action: onPrint },
          { icon: 'Copy', label: 'Копировать', action: onCopy },
          { icon: 'Mail', label: 'Email', action: onEmail },
          { icon: 'Share2', label: 'Поделиться', action: onShare },
        ].map((a) => (
          <Button key={a.label} variant="outline" onClick={a.action} className="rounded-full font-heading text-sm h-9">
            <Icon name={a.icon} size={15} className="mr-1.5" /> {a.label}
          </Button>
        ))}
        <Button onClick={onRegenerate} className="rounded-full font-heading text-sm h-9">
          <Icon name="RefreshCw" size={15} className="mr-1.5" /> Другая сказка
        </Button>
      </div>
    </div>
  );
}
