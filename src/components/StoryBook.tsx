import { useState, useEffect } from 'react';
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
const PAGE_SCENES = [
  'начало путешествия', 'встреча с другом', 'первое испытание',
  'волшебный момент', 'решающий выбор', 'победа добра',
  'праздник дружбы', 'возвращение домой', 'финальный сюрприз', 'счастливый конец',
];

const BG_COLORS = [
  'from-violet-100 via-purple-50 to-pink-50',
  'from-amber-100 via-orange-50 to-yellow-50',
  'from-sky-100 via-blue-50 to-cyan-50',
  'from-rose-100 via-pink-50 to-fuchsia-50',
  'from-emerald-100 via-green-50 to-teal-50',
  'from-fuchsia-100 via-violet-50 to-purple-50',
  'from-cyan-100 via-teal-50 to-sky-50',
  'from-lime-100 via-emerald-50 to-green-50',
  'from-orange-100 via-red-50 to-rose-50',
  'from-indigo-100 via-blue-50 to-violet-50',
];

// Разные мультяшные стили для каждой страницы
const CARTOON_STYLES: { filter: string; border: string; label: string }[] = [
  { filter: 'saturate(1.8) contrast(1.1) hue-rotate(10deg)', border: 'linear-gradient(135deg,#f97316,#ec4899)', label: '🎨 Акварель' },
  { filter: 'saturate(2) contrast(1.2) brightness(1.05)', border: 'linear-gradient(135deg,#8b5cf6,#06b6d4)', label: '✏️ Карандаш' },
  { filter: 'saturate(1.5) sepia(0.3) contrast(1.1)', border: 'linear-gradient(135deg,#f59e0b,#84cc16)', label: '🖌️ Масло' },
  { filter: 'saturate(2.2) contrast(1.15) hue-rotate(-20deg)', border: 'linear-gradient(135deg,#ec4899,#f97316)', label: '🌈 Неон' },
  { filter: 'saturate(1.6) contrast(1.05) brightness(1.1)', border: 'linear-gradient(135deg,#10b981,#3b82f6)', label: '🦄 Пастель' },
  { filter: 'saturate(1.9) contrast(1.2) hue-rotate(30deg)', border: 'linear-gradient(135deg,#6366f1,#a855f7)', label: '⭐ Звёздный' },
  { filter: 'saturate(2) contrast(1.1) sepia(0.2)', border: 'linear-gradient(135deg,#f59e0b,#ef4444)', label: '🔥 Тёплый' },
  { filter: 'saturate(1.7) contrast(1.15) hue-rotate(-10deg)', border: 'linear-gradient(135deg,#06b6d4,#8b5cf6)', label: '❄️ Ледяной' },
  { filter: 'saturate(2.1) brightness(1.08) contrast(1.1)', border: 'linear-gradient(135deg,#84cc16,#f97316)', label: '🌿 Лесной' },
  { filter: 'saturate(1.8) contrast(1.2) hue-rotate(20deg)', border: 'linear-gradient(135deg,#a855f7,#ec4899)', label: '🌸 Сакура' },
];

// Имитация прогресса генерации для одной страницы
function useIllustrationGen(photo: string | null, pageIdx: number) {
  const [state, setState] = useState<'idle' | 'generating' | 'done'>('idle');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!photo) { setState('idle'); setProgress(0); return; }
    setState('generating');
    setProgress(0);
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 18 + 8;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setTimeout(() => setState('done'), 200);
      }
      setProgress(Math.min(p, 100));
    }, 120);
    return () => clearInterval(interval);
  }, [photo, pageIdx]);

  return { state, progress };
}

interface IllustrationProps {
  photo: string | null;
  pageIdx: number;
  scene: string;
}

function Illustration({ photo, pageIdx, scene }: IllustrationProps) {
  const { state, progress } = useIllustrationGen(photo, pageIdx);
  const style = CARTOON_STYLES[pageIdx % CARTOON_STYLES.length];

  if (!photo) return null;

  return (
    <div className="mb-5 flex flex-col items-center gap-2">
      <div className="relative">
        {/* Animated gradient border */}
        <div
          className="absolute -inset-[3px] rounded-[1.4rem] z-0"
          style={{ background: style.border, opacity: state === 'done' ? 1 : 0.4 }}
        />
        {/* White mat */}
        <div className="absolute -inset-[1px] rounded-[1.3rem] bg-white z-[1]" />

        {/* Image */}
        <div className="relative z-[2] rounded-[1.2rem] overflow-hidden shadow-lg" style={{ width: 156, height: 156 }}>
          <img
            src={photo}
            alt="Иллюстрация"
            className="w-full h-full object-cover transition-all duration-700"
            style={{
              filter: state === 'done' ? style.filter : 'grayscale(1) blur(2px)',
              transform: state === 'done' ? 'scale(1.05)' : 'scale(1)',
            }}
          />

          {/* Cartoon overlay — штриховка поверх фото */}
          {state === 'done' && (
            <>
              <div className="absolute inset-0 mix-blend-overlay opacity-20"
                style={{ backgroundImage: 'repeating-linear-gradient(45deg,#000 0,#000 1px,transparent 0,transparent 50%)', backgroundSize: '6px 6px' }} />
              <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none" />
            </>
          )}

          {/* Generating overlay */}
          {state === 'generating' && (
            <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center gap-2">
              <div className="w-10 h-10 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
              <div className="w-24 h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-150"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-[10px] font-heading text-muted-foreground">рисую героя…</span>
            </div>
          )}
        </div>

        {/* Badge */}
        {state === 'done' && (
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2.5 py-1 bg-white rounded-full shadow-md border border-border whitespace-nowrap z-10">
            <span className="text-[10px] font-heading font-bold text-primary">{style.label}</span>
          </div>
        )}
      </div>

      {state === 'done' && (
        <p className="text-[10px] text-muted-foreground font-heading mt-3 italic">
          «{scene}»
        </p>
      )}
    </div>
  );
}

export default function StoryBook({
  title, paragraphs, photos,
  onPrint, onCopy, onEmail, onShare, onRegenerate,
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
  // Цикличное фото — если загружено хоть одно, показываем на каждой странице
  const photo = photos.length > 0 ? photos[page % photos.length] : null;
  const scene = PAGE_SCENES[page % PAGE_SCENES.length];

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Book */}
      <div className="relative w-full max-w-lg select-none" style={{ perspective: '1200px' }}>
        <div className="absolute -bottom-3 left-4 right-4 h-6 bg-black/20 blur-lg rounded-full" />

        <div
          className={`relative rounded-[1.5rem] overflow-hidden bg-gradient-to-br ${bg} border border-white/80 shadow-2xl transition-all duration-300`}
          style={{
            transform: flipping === 'right' ? 'rotateY(-8deg) scale(0.97)'
              : flipping === 'left' ? 'rotateY(8deg) scale(0.97)'
              : 'rotateY(0deg) scale(1)',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Spine */}
          <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-black/15 to-transparent z-10 rounded-l-[1.5rem]" />
          {/* Lines texture */}
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #888 31px, #888 32px)', backgroundPositionY: '8px' }} />

          <div className="relative p-6 sm:p-8 min-h-[460px] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl animate-float inline-block">{emoji}</span>
              <span className="font-heading text-xs text-foreground/40 tracking-widest uppercase">
                стр. {page + 1} / {total}
              </span>
            </div>

            {page === 0 && (
              <h2 className="font-display text-2xl sm:text-3xl text-foreground mb-4 leading-snug capitalize">
                {title}
              </h2>
            )}

            {/* Illustration with cartoon effect */}
            <Illustration photo={photo} pageIdx={page} scene={scene} />

            {/* Text */}
            <p className="font-sans text-base sm:text-lg leading-relaxed text-foreground/85 flex-1">
              <span className="font-display text-3xl text-primary float-left mr-1 leading-none">
                {paragraphs[page][0]}
              </span>
              {paragraphs[page].slice(1)}
            </p>

            <div className="absolute bottom-4 right-6 text-4xl opacity-10 select-none font-display">
              {page + 1}
            </div>
          </div>
        </div>

        {/* Page edge */}
        <div className="absolute right-0 top-6 bottom-6 w-1.5 flex flex-col gap-0.5 opacity-30">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex-1 bg-foreground/30 rounded-full" />
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-3 mt-1">
        <Button variant="outline" size="icon" className="rounded-full w-11 h-11 shadow"
          onClick={() => goTo('prev')} disabled={isFirst || !!flipping}>
          <Icon name="ChevronLeft" size={20} />
        </Button>

        <div className="flex gap-1.5">
          {paragraphs.map((_, i) => (
            <button key={i}
              onClick={() => {
                if (flipping || i === page) return;
                setFlipping(i > page ? 'right' : 'left');
                setTimeout(() => { setPage(i); setFlipping(null); }, 380);
              }}
              className={`rounded-full transition-all duration-200 ${i === page ? 'w-5 h-2.5 bg-primary' : 'w-2.5 h-2.5 bg-muted-foreground/30 hover:bg-primary/50'}`}
            />
          ))}
        </div>

        <Button variant="outline" size="icon" className="rounded-full w-11 h-11 shadow"
          onClick={() => goTo('next')} disabled={isLast || !!flipping}>
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
