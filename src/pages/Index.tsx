import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { generateStory } from '@/lib/storyGenerator';
import StoryBook from '@/components/StoryBook';

const HERO_IMG = 'https://cdn.poehali.dev/projects/7ea2770c-a283-46b6-90ce-5942b1848166/files/b6cb1f17-8faf-4381-a8db-b05dd74409e1.jpg';
const GALLERY = [
  {
    img: 'https://cdn.poehali.dev/projects/7ea2770c-a283-46b6-90ce-5942b1848166/files/da68fb3a-0bdf-4b8e-bd78-caf7496d9366.jpg',
    title: 'Тимур и добрый дракон',
    tag: 'Приключения',
  },
  {
    img: 'https://cdn.poehali.dev/projects/7ea2770c-a283-46b6-90ce-5942b1848166/files/8d78f4f2-bc01-4feb-9c91-3144f81b3831.jpg',
    title: 'Полёт Алисы на сове',
    tag: 'Волшебство',
  },
  {
    img: HERO_IMG,
    title: 'Морское путешествие Лисёнка',
    tag: 'Космос и звёзды',
  },
];

const THEMES = ['Приключения', 'Волшебство', 'Космос и звёзды', 'Дружба', 'Подводный мир', 'Динозавры'];
const HEROES = ['Отважный рыцарь', 'Добрый дракон', 'Космонавт', 'Волшебная фея', 'Лисёнок', 'Супергерой'];

const NAV = [
  { id: 'hero', label: 'Главная' },
  { id: 'creator', label: 'Создать сказку' },
  { id: 'pricing', label: 'Цены' },
  { id: 'gallery', label: 'Галерея' },
  { id: 'about', label: 'О нас' },
  { id: 'contacts', label: 'Контакты' },
];

const Index = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { toast } = useToast();
  const [form, setForm] = useState({ name: '', age: '', hero: '', theme: '', wish: '' });
  const [pages, setPages] = useState(5);
  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [story, setStory] = useState<{ title: string; paragraphs: string[] } | null>(null);

  const setField = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handlePhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, 3);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const url = ev.target?.result as string;
        setPhotos((prev) => {
          const next = [...prev, url].slice(0, 3);
          return next;
        });
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const removePhoto = (idx: number) =>
    setPhotos((prev) => prev.filter((_, i) => i !== idx));

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleGenerate = () => {
    if (!form.name.trim()) {
      toast({ title: 'Как зовут малыша?', description: 'Введите имя ребёнка, чтобы создать сказку.' });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setStory(generateStory({ ...form, pages }));
      setLoading(false);
    }, 1200);
  };

  const storyText = () =>
    story ? `${story.title}\n\n${story.paragraphs.join('\n\n')}` : '';

  const handlePrint = () => window.print();

  const handleCopy = () => {
    navigator.clipboard.writeText(storyText());
    toast({ title: 'Сказка скопирована!', description: 'Теперь можно вставить её куда угодно.' });
  };

  const handleEmail = () => {
    if (!story) return;
    window.location.href = `mailto:?subject=${encodeURIComponent(story.title)}&body=${encodeURIComponent(storyText())}`;
  };

  const handleShare = async () => {
    if (!story) return;
    if (navigator.share) {
      try {
        await navigator.share({ title: story.title, text: storyText() });
      } catch {
        /* отменено пользователем */
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-50 glass border-b border-white/40">
        <div className="container flex items-center justify-between h-16">
          <button onClick={() => scrollTo('hero')} className="flex items-center gap-2">
            <span className="text-2xl">📖</span>
            <span className="font-display text-xl text-gradient">Сказкоробот</span>
          </button>
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => scrollTo(n.id)}
                className="font-heading text-sm font-medium px-4 py-2 rounded-full text-foreground/70 hover:text-primary hover:bg-primary/10 transition-colors"
              >
                {n.label}
              </button>
            ))}
          </nav>
          <Button onClick={() => scrollTo('creator')} className="hidden md:flex rounded-full font-heading font-semibold">
            <Icon name="Sparkles" size={16} className="mr-1" /> Создать
          </Button>
          <button className="md:hidden" onClick={() => setMenuOpen((v) => !v)}>
            <Icon name={menuOpen ? 'X' : 'Menu'} size={26} />
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden glass border-t border-white/40 px-4 py-3 flex flex-col gap-1 animate-fade-in">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => scrollTo(n.id)}
                className="font-heading text-left px-4 py-3 rounded-xl hover:bg-primary/10"
              >
                {n.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Hero */}
      <section id="hero" className="relative night-gradient pt-32 pb-24 overflow-hidden">
        {[...Array(18)].map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-star animate-twinkle"
            style={{
              top: `${Math.random() * 90}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
        <div className="container relative grid md:grid-cols-2 gap-10 items-center">
          <div className="text-white animate-fade-in">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur text-sm font-heading mb-6">
              <Icon name="Wand2" size={16} /> Сказки, которых ещё не было
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6">
              Сказка, где герой —<br />
              <span className="text-star">ваш малыш</span>
            </h1>
            <p className="text-lg text-white/80 max-w-md mb-8 font-sans">
              Искусственный интеллект напишет волшебную историю по имени, возрасту и любимым героям вашего ребёнка. За одну минуту.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                size="lg"
                onClick={() => scrollTo('creator')}
                className="rounded-full font-heading font-bold text-base h-14 px-8 shadow-xl shadow-primary/30 hover-scale"
              >
                <Icon name="Sparkles" size={20} className="mr-2" /> Создать сказку
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => scrollTo('gallery')}
                className="rounded-full font-heading font-semibold text-base h-14 px-8 bg-white/10 border-white/40 text-white hover:bg-white/20 hover:text-white"
              >
                Посмотреть примеры
              </Button>
            </div>
          </div>
          <div className="relative animate-scale-in">
            <div className="absolute -inset-4 bg-gradient-to-tr from-sunset/40 to-coral/40 blur-3xl rounded-full" />
            <img
              src={HERO_IMG}
              alt="Волшебная сказка"
              className="relative rounded-[2rem] shadow-2xl animate-float w-full object-cover aspect-square"
            />
          </div>
        </div>
        <div className="absolute -bottom-1 inset-x-0 h-16 bg-background rounded-t-[3rem]" />
      </section>

      {/* Steps */}
      <section className="container py-16">
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { icon: 'PenLine', title: 'Расскажите о малыше', text: 'Имя, возраст и любимый герой' },
            { icon: 'Bot', title: 'ИИ пишет сказку', text: 'Уникальная история за минуту' },
            { icon: 'Share2', title: 'Делитесь и храните', text: 'PDF, печать, email и соцсети' },
          ].map((s, i) => (
            <div
              key={i}
              className="bg-card rounded-3xl p-7 border border-border shadow-sm hover-scale text-center"
            >
              <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <Icon name={s.icon} size={26} className="text-primary" />
              </div>
              <h3 className="font-heading font-bold text-lg mb-1">{s.title}</h3>
              <p className="text-muted-foreground text-sm">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Creator */}
      <section id="creator" className="py-20 bg-gradient-to-b from-secondary/40 to-accent/30">
        <div className="container max-w-3xl">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl sm:text-4xl text-gradient mb-3">Создатель сказок</h2>
            <p className="text-muted-foreground">Заполните данные — и волшебство начнётся ✨</p>
          </div>
          <div className="bg-card rounded-[2rem] p-6 sm:p-10 shadow-xl border border-border">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="font-heading font-semibold">Имя ребёнка</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setField('name', e.target.value)}
                  placeholder="Например, Тимур"
                  className="rounded-xl h-12"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-heading font-semibold">Возраст</Label>
                <Input
                  type="number"
                  value={form.age}
                  onChange={(e) => setField('age', e.target.value)}
                  placeholder="5"
                  className="rounded-xl h-12"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-heading font-semibold">Любимый герой</Label>
                <Select value={form.hero} onValueChange={(v) => setField('hero', v)}>
                  <SelectTrigger className="rounded-xl h-12">
                    <SelectValue placeholder="Выберите героя" />
                  </SelectTrigger>
                  <SelectContent>
                    {HEROES.map((h) => (
                      <SelectItem key={h} value={h}>{h}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="font-heading font-semibold">Тема сказки</Label>
                <Select value={form.theme} onValueChange={(v) => setField('theme', v)}>
                  <SelectTrigger className="rounded-xl h-12">
                    <SelectValue placeholder="Выберите тему" />
                  </SelectTrigger>
                  <SelectContent>
                    {THEMES.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2 mt-6">
              <Label className="font-heading font-semibold">Особое пожелание (необязательно)</Label>
              <Input
                value={form.wish}
                onChange={(e) => setField('wish', e.target.value)}
                placeholder="Например, малыш обожает динозавров и поезда"
                className="rounded-xl h-12"
              />
            </div>

            {/* Pages selector */}
            <div className="mt-6 space-y-3">
              <Label className="font-heading font-semibold">Количество страниц</Label>
              <div className="flex gap-2">
                {[3, 5, 7, 10].map((n) => (
                  <button
                    key={n}
                    onClick={() => setPages(n)}
                    className={`flex-1 h-11 rounded-xl font-heading font-semibold text-sm border-2 transition-all ${
                      pages === n
                        ? 'border-primary bg-primary text-primary-foreground shadow-md'
                        : 'border-border bg-muted text-foreground hover:border-primary/50'
                    }`}
                  >
                    {n}
                    <span className="block text-[10px] font-normal opacity-70">стр.</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Photo upload */}
            <div className="mt-6 space-y-3">
              <Label className="font-heading font-semibold">
                Фото ребёнка для иллюстраций
                <span className="ml-2 text-xs font-normal text-muted-foreground">до 3 фото</span>
              </Label>
              <div className="flex flex-wrap gap-3">
                {photos.map((src, i) => (
                  <div key={i} className="relative group w-24 h-24">
                    <img
                      src={src}
                      alt={`Фото ${i + 1}`}
                      className="w-24 h-24 rounded-2xl object-cover border-2 border-primary/30 shadow"
                    />
                    <button
                      onClick={() => removePhoto(i)}
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-white flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Icon name="X" size={12} />
                    </button>
                  </div>
                ))}
                {photos.length < 3 && (
                  <label className="w-24 h-24 rounded-2xl border-2 border-dashed border-primary/40 flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-primary/5 transition-colors">
                    <Icon name="ImagePlus" size={24} className="text-primary/60" />
                    <span className="text-[10px] text-muted-foreground font-heading">Добавить</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handlePhotos}
                    />
                  </label>
                )}
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full mt-8 h-14 rounded-full font-heading font-bold text-base shadow-lg shadow-primary/30 hover-scale"
            >
              {loading ? (
                <>
                  <Icon name="Loader2" size={20} className="mr-2 animate-spin" /> Придумываю сказку…
                </>
              ) : (
                <>
                  <Icon name="Sparkles" size={20} className="mr-2" /> Создать волшебную сказку
                </>
              )}
            </Button>

            <div className="mt-8 pt-8 border-t border-border">
              <p className="text-center text-sm text-muted-foreground mb-4 font-heading">Готовую сказку можно:</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { icon: 'FileDown', label: 'PDF', action: handlePrint },
                  { icon: 'Printer', label: 'Печать', action: handlePrint },
                  { icon: 'Mail', label: 'Email', action: handleEmail },
                  { icon: 'Share2', label: 'Поделиться', action: handleShare },
                ].map((a) => (
                  <button
                    key={a.label}
                    onClick={() => {
                      if (!story) {
                        toast({ title: 'Сначала создайте сказку', description: 'Заполните данные малыша выше.' });
                        return;
                      }
                      a.action();
                    }}
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-muted hover:bg-primary/10 transition-colors"
                  >
                    <Icon name={a.icon} size={22} className="text-primary" />
                    <span className="text-xs font-heading font-medium">{a.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-gradient-to-b from-accent/30 to-secondary/40">
        <div className="container max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl text-gradient mb-3">Цены</h2>
            <p className="text-muted-foreground">Платите только за то, что нужно — без подписок и скрытых списаний</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {/* Одна сказка */}
            <div className="bg-card rounded-[2rem] p-8 border border-border shadow-sm flex flex-col hover-scale">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                <span className="text-2xl">📖</span>
              </div>
              <h3 className="font-heading font-bold text-xl mb-1">Одна сказка</h3>
              <p className="text-muted-foreground text-sm mb-6">Попробуйте и влюбитесь</p>
              <div className="mb-6">
                <span className="font-display text-4xl text-foreground">299 ₽</span>
                <span className="text-muted-foreground text-sm ml-1">/ сказка</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {['1 персональная сказка', 'Фото ребёнка внутри', 'Скачать PDF', 'Поделиться и напечатать'].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Icon name="Check" size={16} className="text-primary shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                variant="outline"
                className="w-full rounded-full font-heading font-semibold"
                onClick={() => toast({ title: 'Скоро откроем оплату!', description: 'Оплата будет подключена в ближайшее время.' })}
              >
                Купить сказку
              </Button>
            </div>

            {/* Пакет 5 сказок — хит */}
            <div className="relative bg-card rounded-[2rem] p-8 border-2 border-primary shadow-xl flex flex-col hover-scale">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full font-heading font-bold text-xs text-white shadow-lg"
                style={{ background: 'linear-gradient(90deg, hsl(var(--sunset)), hsl(var(--coral)))' }}>
                🔥 Выгоднее всего
              </div>
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="font-heading font-bold text-xl mb-1">Пакет 5 сказок</h3>
              <p className="text-muted-foreground text-sm mb-6">Целая полка историй</p>
              <div className="mb-1">
                <span className="font-display text-4xl text-foreground">990 ₽</span>
                <span className="text-muted-foreground text-sm ml-1">/ пакет</span>
              </div>
              <p className="text-xs text-primary font-heading mb-6">Экономия 505 ₽ vs разовые</p>
              <ul className="space-y-3 mb-8 flex-1">
                {['5 персональных сказок', 'Фото ребёнка внутри', 'Разные темы и герои', 'Скачать PDF и печать', 'Поделиться в соцсетях', 'Срок использования — год'].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Icon name="Check" size={16} className="text-primary shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="w-full rounded-full font-heading font-bold shadow-lg shadow-primary/30"
                onClick={() => toast({ title: 'Скоро откроем оплату!', description: 'Оплата будет подключена в ближайшее время.' })}
              >
                Купить пакет
              </Button>
            </div>

            {/* Безлимит */}
            <div className="relative bg-card rounded-[2rem] p-8 border border-border shadow-sm flex flex-col hover-scale overflow-hidden">
              <div className="absolute inset-0 night-gradient opacity-5 pointer-events-none" />
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 relative">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="font-heading font-bold text-xl mb-1 relative">Безлимит</h3>
              <p className="text-muted-foreground text-sm mb-6 relative">Для настоящих сказочников</p>
              <div className="mb-6 relative">
                <span className="font-display text-4xl text-foreground">∞</span>
                <span className="font-display text-2xl text-foreground ml-2">сказок</span>
                <div className="text-sm text-muted-foreground mt-1">от <strong className="text-foreground">1 990 ₽</strong> / год</div>
              </div>
              <ul className="space-y-3 mb-8 flex-1 relative">
                {['Неограниченно сказок', 'Фото внутри каждой', 'Все темы и герои', 'PDF, печать, email', 'Поделиться в соцсетях', 'Приоритетная поддержка'].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Icon name="Check" size={16} className="text-primary shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                variant="outline"
                className="w-full rounded-full font-heading font-semibold relative"
                onClick={() => toast({ title: 'Скоро откроем оплату!', description: 'Оплата будет подключена в ближайшее время.' })}
              >
                Купить безлимит
              </Button>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-8">
            Сказки не сгорают. Оплата разовая — без автосписаний и подписок.
          </p>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="container py-20">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl sm:text-4xl text-gradient mb-3">Галерея иллюстраций</h2>
          <p className="text-muted-foreground">Примеры сказочных миров, созданных нашим ИИ</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {GALLERY.map((g, i) => (
            <div key={i} className="group rounded-3xl overflow-hidden bg-card border border-border shadow-sm hover-scale">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={g.img} alt={g.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full glass text-xs font-heading font-semibold">
                  {g.tag}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-heading font-bold text-lg">{g.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20 bg-gradient-to-b from-accent/30 to-secondary/40">
        <div className="container grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl text-gradient mb-6">О нас</h2>
            <p className="text-foreground/80 leading-relaxed mb-4 font-sans">
              Сказкоробот — это команда родителей и инженеров, которые верят, что каждый ребёнок заслуживает быть героем собственной истории.
            </p>
            <p className="text-foreground/80 leading-relaxed font-sans">
              Мы соединили тёплую магию сказок и современный искусственный интеллект, чтобы создавать персональные истории, которые останутся в семье навсегда.
            </p>
            <div className="grid grid-cols-3 gap-4 mt-8">
              {[
                { num: '12k+', label: 'сказок создано' },
                { num: '4.9★', label: 'оценка родителей' },
                { num: '60 сек', label: 'на одну сказку' },
              ].map((s) => (
                <div key={s.label} className="bg-card rounded-2xl p-4 text-center border border-border">
                  <div className="font-display text-2xl text-gradient">{s.num}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-4">
            {[
              { icon: 'Heart', title: 'С любовью к детям', text: 'Добрые и безопасные сюжеты' },
              { icon: 'Shield', title: 'Безопасность', text: 'Бережно к данным семьи' },
              { icon: 'Star', title: 'Уникальность', text: 'Каждая сказка неповторима' },
            ].map((c) => (
              <div key={c.title} className="flex items-start gap-4 bg-card rounded-2xl p-5 border border-border shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon name={c.icon} size={22} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-heading font-bold">{c.title}</h3>
                  <p className="text-sm text-muted-foreground">{c.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contacts */}
      <section id="contacts" className="container py-20">
        <div className="bg-card rounded-[2.5rem] p-8 sm:p-12 border border-border shadow-xl grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl text-gradient mb-4">Контакты</h2>
            <p className="text-muted-foreground mb-8">Напишите нам — мы всегда рады волшебникам и родителям!</p>
            <div className="space-y-4">
              {[
                { icon: 'Mail', label: 'hello@skazkorobot.ru' },
                { icon: 'Phone', label: '+7 (900) 123-45-67' },
                { icon: 'MapPin', label: 'Москва, Звёздный бульвар, 7' },
              ].map((c) => (
                <div key={c.label} className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon name={c.icon} size={20} className="text-primary" />
                  </div>
                  <span className="font-sans">{c.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <Input placeholder="Ваше имя" className="rounded-xl h-12" />
            <Input placeholder="Email" className="rounded-xl h-12" />
            <Input placeholder="Сообщение" className="rounded-xl h-12" />
            <Button className="w-full h-12 rounded-full font-heading font-bold hover-scale">
              <Icon name="Send" size={18} className="mr-2" /> Отправить
            </Button>
          </div>
        </div>
      </section>

      {/* Story Modal */}
      <Dialog open={!!story} onOpenChange={(o) => !o && setStory(null)}>
        <DialogContent className="max-w-xl rounded-[2rem] p-0 overflow-hidden border-0">
          {/* Header */}
          <div className="night-gradient px-6 pt-6 pb-4 text-white relative">
            {[...Array(6)].map((_, i) => (
              <span
                key={i}
                className="absolute rounded-full bg-star animate-twinkle"
                style={{
                  top: `${20 + i * 12}%`,
                  left: `${10 + i * 15}%`,
                  width: '4px', height: '4px',
                  animationDelay: `${i * 0.5}s`,
                }}
              />
            ))}
            <div className="relative flex items-center justify-between">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-heading">
                <Icon name="Sparkles" size={14} /> Ваша сказка готова · {story?.paragraphs.length} стр.
              </span>
            </div>
          </div>
          {/* Book */}
          <div className="px-4 py-6 bg-gradient-to-b from-background to-muted/40">
            {story && (
              <StoryBook
                title={story.title}
                paragraphs={story.paragraphs}
                photos={photos}
                onPrint={handlePrint}
                onCopy={handleCopy}
                onEmail={handleEmail}
                onShare={handleShare}
                onRegenerate={handleGenerate}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="night-gradient text-white/80 py-10">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📖</span>
            <span className="font-display text-lg text-white">Сказкоробот</span>
          </div>
          <p className="text-sm">© 2026 Сказкоробот. Сделано с любовью к детям ❤️</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;