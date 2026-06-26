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
  { id: 'gallery', label: 'Галерея' },
  { id: 'about', label: 'О нас' },
  { id: 'contacts', label: 'Контакты' },
];

const Index = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
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
                <Input placeholder="Например, Тимур" className="rounded-xl h-12" />
              </div>
              <div className="space-y-2">
                <Label className="font-heading font-semibold">Возраст</Label>
                <Input type="number" placeholder="5" className="rounded-xl h-12" />
              </div>
              <div className="space-y-2">
                <Label className="font-heading font-semibold">Любимый герой</Label>
                <Select>
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
                <Select>
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
              <Input placeholder="Например, малыш обожает динозавров и поезда" className="rounded-xl h-12" />
            </div>
            <Button className="w-full mt-8 h-14 rounded-full font-heading font-bold text-base shadow-lg shadow-primary/30 hover-scale">
              <Icon name="Sparkles" size={20} className="mr-2" /> Создать волшебную сказку
            </Button>

            <div className="mt-8 pt-8 border-t border-border">
              <p className="text-center text-sm text-muted-foreground mb-4 font-heading">Готовую сказку можно:</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { icon: 'FileDown', label: 'PDF' },
                  { icon: 'Printer', label: 'Печать' },
                  { icon: 'Mail', label: 'Email' },
                  { icon: 'Share2', label: 'Поделиться' },
                ].map((a) => (
                  <button
                    key={a.label}
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
