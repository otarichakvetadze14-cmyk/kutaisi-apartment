'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState, type Dispatch, type FormEventHandler, type SetStateAction } from 'react';
import { AnimatePresence, MotionConfig, motion, useMotionValue, useMotionValueEvent, useScroll, useSpring, useTransform } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Search,
  Sparkles,
  Tag,
  Users,
  Wifi,
  X,
} from 'lucide-react';
import { formatCurrency } from '@/lib/currency';
import type { BookingDateRange } from '@/lib/bookingAvailability';
import DatePicker from '@/components/DatePicker';

type Language = 'ge' | 'en';
type LocalizedText = Readonly<Record<Language, string>>;

interface GalleryPhoto {
  imagePath: string;
  title: LocalizedText;
}

interface Attraction {
  imagePath: string;
  title: LocalizedText;
  description: LocalizedText;
  distance: LocalizedText;
  locationUrl: string;
}

interface Restaurant {
  imagePath: string;
  title: LocalizedText;
  cuisine: LocalizedText;
  description: LocalizedText;
  addressUrl: string;
}

interface LandingExperienceProps {
  text: Record<string, string>;
  language: Language;
  setLanguage: (language: Language) => void;
  guestName: string;
  setGuestName: (value: string) => void;
  guestEmail: string;
  setGuestEmail: (value: string) => void;
  guests: number;
  setGuests: (value: number) => void;
  startDate: string;
  setStartDate: (value: string) => void;
  endDate: string;
  setEndDate: (value: string) => void;
  loading: boolean;
  successMessage: string | null;
  errorMessage: string | null;
  galleryIndex: number;
  setGalleryIndex: Dispatch<SetStateAction<number>>;
  pricePerNight: number | null;
  currency: string;
  priceLoading: boolean;
  priceError: string | null;
  availabilityBookings: readonly BookingDateRange[];
  availabilityLoading: boolean;
  availabilityError: string | null;
  nights: number;
  totalPrice: number;
  onBooking: FormEventHandler<HTMLFormElement>;
  galleryData: readonly GalleryPhoto[];
  attractionsData: readonly Attraction[];
  restaurantsData: readonly Restaurant[];
}

const curve = [0.22, 1, 0.36, 1] as const;
const phoneHref = 'tel:+995598542424';
const whatsappHref = 'https://wa.me/995598542424';
const emailAddress = 'kutaisicentralsquare@gmail.com';

function Eyebrow({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.3em] ${className}`}>
      <span className="h-px w-8 shrink-0 bg-current opacity-60" aria-hidden="true" />
      {children}
    </p>
  );
}

function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8% 0px' }}
      transition={{ duration: 0.9, delay, ease: curve }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Brand({ text }: { text: string }) {
  return (
    <span className="flex items-center gap-3">
      <span className="grid size-8 shrink-0 place-items-center border border-current font-serif text-base" aria-hidden="true">K</span>
      <span className="text-left">
        <strong className="block text-[10px] font-medium tracking-[0.08em] sm:text-xs">{text}</strong>
        <small className="mt-1 block text-[8px] uppercase tracking-[0.28em] text-stone">Residence · Georgia</small>
      </span>
    </span>
  );
}

function PointerCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 380, damping: 32, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 380, damping: 32, mass: 0.6 });
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    const query = window.matchMedia('(pointer: fine)');
    const update = () => setEnabled(query.matches);
    update();
    query.addEventListener('change', update);
    const move = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-cursor], a, button') : null;
      setHovering(Boolean(target));
      setLabel(target?.dataset.cursor ?? null);
    };
    window.addEventListener('pointermove', move);
    return () => {
      query.removeEventListener('change', update);
      window.removeEventListener('pointermove', move);
    };
  }, [x, y]);

  if (!enabled) return null;
  const size = label ? 84 : hovering ? 42 : 9;

  return (
    <motion.div aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[100]" style={{ x: springX, y: springY }}>
      <motion.div
        animate={{ width: size, height: size }}
        transition={{ type: 'spring', stiffness: 300, damping: 26 }}
        className={`-translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full ${
          label ? 'bg-ivory text-ink' : hovering ? 'border border-bronze' : 'bg-bronze'
        }`}
      >
        {label && <span className="text-[9px] uppercase tracking-[0.18em]">{label}</span>}
      </motion.div>
    </motion.div>
  );
}

function Preloader() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const timeout = window.setTimeout(() => setVisible(false), 1450);
    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          aria-hidden="true"
          initial={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.8, ease: curve }}
          className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-ink"
        >
          <motion.p
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ duration: 0.85, ease: curve }}
            className="font-serif text-3xl font-light tracking-wide text-ivory sm:text-5xl"
          >
            Kutaisi <span className="italic text-bronze">Central</span> Square
          </motion.p>
          <div className="mt-8 h-px w-36 overflow-hidden bg-ivory/10">
            <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.2, ease: curve }} className="h-full origin-left bg-bronze" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function LandingExperience({
  text,
  language,
  setLanguage,
  guestName,
  setGuestName,
  guestEmail,
  setGuestEmail,
  guests,
  setGuests,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  loading,
  successMessage,
  errorMessage,
  galleryIndex,
  setGalleryIndex,
  pricePerNight,
  currency,
  priceLoading,
  priceError,
  availabilityBookings,
  availabilityLoading,
  availabilityError,
  nights,
  totalPrice,
  onBooking,
  galleryData,
  attractionsData,
  restaurantsData,
}: LandingExperienceProps) {
  const isGe = language === 'ge';
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [headerHidden, setHeaderHidden] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [activeDestination, setActiveDestination] = useState<number | null>(null);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [quotePaused, setQuotePaused] = useState(false);
  const pageScroll = useScroll();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.04, 1.18]);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const previewX = useSpring(pointerX, { stiffness: 150, damping: 20 });
  const previewY = useSpring(pointerY, { stiffness: 150, damping: 20 });
  const shownPhoto = galleryData[galleryIndex];
  const activeAttraction = activeDestination === null ? null : attractionsData[activeDestination];

  const navigation = [
    { label: isGe ? 'აპარტამენტი' : 'Residence', href: '#apartments' },
    { label: isGe ? 'გალერეა' : 'Gallery', href: '#gallery' },
    { label: isGe ? 'გამოცდილება' : 'Experiences', href: '#experiences' },
    { label: isGe ? 'აღმოაჩინე' : 'Discover', href: '#discover' },
    { label: isGe ? 'კონტაქტი' : 'Contact', href: '#contact' },
  ];
  const stayNotes = isGe
    ? [
        { title: 'ცენტრალური მოედანი', detail: 'ქალაქის ისტორიულ გულში' },
        { title: 'მზიანი ინტერიერი', detail: 'თბილი ხე, თეთრეული და ქვა' },
        { title: 'მარტივი დაჯავშნა', detail: 'ხელმისაწვდომობის რეალური შემოწმება' },
      ]
    : [
        { title: 'Central Square', detail: 'In the historic heart of the city' },
        { title: 'Sunlit interiors', detail: 'Warm timber, linen and stone' },
        { title: 'A considered stay', detail: 'Live availability, direct booking' },
      ];
  const quote = isGe
    ? [
        'ქუთაისის შუაგულში — მზიანი ოთახები, თბილი ხის დეტალები და მშვიდი დასვენება.',
        'ცენტრალური მოედნიდან ქალაქის კულტურული ღირსშესანიშნაობები მარტივად მისადგომია.',
        'დაჯავშნის მოთხოვნამდე ფასი და თავისუფალი თარიღები გამჭვირვალედ მოწმდება.',
      ][quoteIndex]
    : [
        'In the heart of Kutaisi — sunlit rooms, warm timber and a quieter way to stay.',
        'From Central Square, the city’s cultural landmarks are all within easy reach.',
        'Rates and live availability are checked before your booking request is sent.',
      ][quoteIndex];

  useMotionValueEvent(pageScroll.scrollY, 'change', (value) => {
    const previous = pageScroll.scrollY.getPrevious() ?? 0;
    setScrolled(value > 40);
    setHeaderHidden(value > 400 && value > previous);
  });

  useEffect(() => {
    document.body.style.overflow = menuOpen || galleryOpen ? 'hidden' : '';
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        setGalleryOpen(false);
      }
      if (galleryOpen && event.key === 'ArrowRight') {
        setGalleryIndex((index) => (index + 1) % galleryData.length);
      }
      if (galleryOpen && event.key === 'ArrowLeft') {
        setGalleryIndex((index) => (index - 1 + galleryData.length) % galleryData.length);
      }
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [galleryData.length, galleryOpen, menuOpen, setGalleryIndex]);

  useEffect(() => {
    if (quotePaused) return;
    const timeout = window.setTimeout(() => setQuoteIndex((index) => (index + 1) % stayNotes.length), 8000);
    return () => window.clearTimeout(timeout);
  }, [quoteIndex, quotePaused, stayNotes.length]);

  const stepGallery = useCallback((direction: 1 | -1) => {
    setGalleryIndex((index) => (index + direction + galleryData.length) % galleryData.length);
  }, [galleryData.length, setGalleryIndex]);

  const priceLabel = priceLoading
    ? text.priceLoading
    : priceError || pricePerNight === null
      ? text.priceUnavailable
      : `${formatCurrency(pricePerNight, isGe ? 'ka-GE' : 'en-US', currency)} / ${isGe ? 'ღამე' : 'night'}`;
  const bookingDisabled = loading || priceLoading || pricePerNight === null || priceError !== null || availabilityLoading || availabilityError !== null;

  return (
    <MotionConfig reducedMotion="user">
      <div className="landing site-shell min-h-screen overflow-x-clip bg-ink text-ivory">
        <Preloader />
        <PointerCursor />

        <motion.header
          animate={{ y: headerHidden && !menuOpen ? '-100%' : '0%' }}
          transition={{ duration: 0.5, ease: curve }}
          className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
            scrolled && !menuOpen ? 'bg-ink/80 backdrop-blur-xl' : 'bg-transparent'
          }`}
        >
          <div className="mx-auto flex h-[76px] max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-10">
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="site-menu"
              aria-label={menuOpen ? text.closeMenu : text.openMenu}
              className="group flex min-h-11 items-center gap-3 text-[10px] uppercase tracking-[0.26em] text-ivory"
            >
              <span className="relative flex h-3 w-7 flex-col justify-between" aria-hidden="true">
                <span className={`h-px w-full bg-current transition-transform duration-500 ${menuOpen ? 'translate-y-[5.5px] rotate-45' : ''}`} />
                <span className={`h-px w-2/3 bg-current transition-all duration-500 group-hover:w-full ${menuOpen ? 'w-full -translate-y-[5.5px] -rotate-45' : ''}`} />
              </span>
              <span className="hidden sm:inline">{menuOpen ? (isGe ? 'დახურვა' : 'Close') : (isGe ? 'მენიუ' : 'Menu')}</span>
            </button>

            <a href="#top" aria-label={text.brand} className="mx-2 min-w-0 flex-1 text-left text-ivory md:absolute md:left-1/2 md:mx-0 md:-translate-x-1/2 md:text-center">
              <span className="block whitespace-nowrap font-serif text-[11px] font-light leading-none tracking-wide max-[360px]:text-[10px] sm:text-xl">
                Kutaisi <span className="italic">Central</span> Square
              </span>
              <span className="mt-1 hidden text-[8px] uppercase tracking-[0.4em] text-stone md:block">Residence · Georgia</span>
            </a>

            <div className="flex items-center gap-2 sm:gap-4">
              <div role="group" aria-label={text.languageLabel} className="flex items-center gap-1">
                {(['ge', 'en'] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={language === option}
                    onClick={() => setLanguage(option)}
                    className={`flex min-h-10 min-w-9 items-center justify-center text-[9px] uppercase tracking-[0.15em] ${
                      language === option ? 'text-bronze' : 'text-ivory/60 hover:text-ivory'
                    }`}
                  >
                    {option === 'ge' ? 'ქარ' : 'ENG'}
                  </button>
                ))}
              </div>
              <a
                href="#booking"
                className="flex min-h-10 items-center border border-ivory/35 px-3 text-[9px] uppercase tracking-[0.18em] transition-colors hover:border-bronze hover:bg-bronze hover:text-ink sm:px-5 sm:text-[10px] sm:tracking-[0.24em]"
              >
                {text.bookNow}
              </a>
            </div>
          </div>
        </motion.header>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              id="site-menu"
              role="dialog"
              aria-modal="true"
              aria-label={text.mainNavigation}
              initial={{ clipPath: 'inset(0 0 100% 0)' }}
              animate={{ clipPath: 'inset(0 0 0% 0)' }}
              exit={{ clipPath: 'inset(0 0 100% 0)' }}
              transition={{ duration: 0.8, ease: curve }}
              className="fixed inset-0 z-40 grid overflow-y-auto bg-ink-soft lg:grid-cols-[1.2fr_1fr]"
            >
              <nav className="flex flex-col justify-center gap-1 px-6 pb-12 pt-24 sm:px-12 lg:px-16" aria-label={text.mainNavigation}>
                {navigation.map((link, index) => (
                  <div key={link.href} className="overflow-hidden">
                    <motion.a
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      initial={{ y: '100%' }}
                      animate={{ y: 0 }}
                      transition={{ duration: 0.8, delay: 0.2 + index * 0.06, ease: curve }}
                      className="group flex items-baseline gap-4 font-serif text-4xl font-light text-ivory transition-colors hover:text-bronze sm:text-6xl"
                    >
                      <span className="font-sans text-[10px] tracking-[0.25em] text-stone">0{index + 1}</span>
                      <span className="transition-transform duration-500 group-hover:translate-x-3 group-hover:italic">{link.label}</span>
                    </motion.a>
                  </div>
                ))}
                <div className="mt-8 flex flex-col gap-2 text-sm text-stone">
                  <a href={phoneHref} className="hover:text-ivory">+995 598 54 24 24</a>
                  <a href={`mailto:${emailAddress}`} className="break-all hover:text-ivory">{emailAddress}</a>
                </div>
              </nav>
              <div className="relative hidden min-h-[50vh] lg:block">
                <Image src="/images/redesign/suite-square.webp" alt="" fill sizes="45vw" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-ink-soft to-transparent" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <main>
          <section ref={heroRef} id="top" className="grain relative flex min-h-[940px] flex-col overflow-visible md:min-h-svh">
            <motion.div style={{ y: imageY, scale: imageScale }} className="absolute inset-0 z-0 overflow-hidden">
              <motion.div
                initial={{ scale: 1.18 }}
                animate={{ scale: 1 }}
                transition={{ duration: 2.2, delay: 0.8, ease: curve }}
                className="absolute inset-0"
              >
                <Image src="/images/redesign/hero.webp" alt={text.heroDescription} fill priority sizes="100vw" className="object-cover" />
              </motion.div>
            </motion.div>
            <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-ink/70 via-ink/20 to-ink" />
            <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-r from-ink/55 via-ink/15 to-transparent" />

            <div className="relative z-10 mx-auto flex w-full max-w-[1600px] flex-1 flex-col justify-center px-5 pb-8 pt-32 sm:px-8 md:px-10 md:pb-12">
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1, ease: curve }}
                className="mb-6 text-[9px] uppercase tracking-[0.3em] text-sand sm:mb-8 sm:text-[10px] sm:tracking-[0.4em]"
              >
                {text.heroEyebrow} · {text.cityLabel}
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.1, ease: curve }}
                className="max-w-5xl text-balance font-serif text-[clamp(3.25rem,11vw,8.5rem)] font-light leading-[0.93] tracking-tight text-ivory"
              >
                {text.heroLineOne}<br />
                <em className="font-normal text-bronze">{text.heroAccent}</em>{' '}{text.heroLineTwo}
              </motion.h1>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.6 }}
                className="mt-7 flex max-w-md items-start gap-4 text-sm leading-relaxed text-sand sm:mt-9"
              >
                <span className="mt-2.5 h-px w-8 shrink-0 bg-bronze sm:w-10" aria-hidden="true" />
                {text.heroDescription}
              </motion.div>
              <a href="#apartments" className="mt-7 inline-flex min-h-11 self-start items-center gap-3 border-b border-bronze pb-2 text-[10px] uppercase tracking-[0.22em] text-ivory transition-all hover:gap-5 sm:mt-9">
                {text.browseApartments}<ArrowRight size={15} aria-hidden="true" />
              </a>
            </div>

            <div id="booking" className="relative z-20 mx-auto mb-6 w-[calc(100%-2rem)] max-w-[1440px] scroll-mt-24 sm:mb-9 sm:w-[calc(100%-3rem)] lg:mb-10">
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 1.25, ease: curve }}
                className="border border-ivory/15 bg-ink/75 p-4 shadow-2xl backdrop-blur-xl sm:p-6 lg:p-7"
              >
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-ivory/10 pb-4">
                  <p className="flex items-center gap-2 text-xs text-sand">
                    <Tag size={14} aria-hidden="true" />
                    {text.pricePrefix} <strong className="font-medium text-ivory">{priceLabel}</strong>
                  </p>
                  {nights > 0 && (
                    <p className="text-xs text-sand">
                      {nights} {isGe ? 'ღამე' : nights === 1 ? 'night' : 'nights'} · {guests} {isGe ? 'სტუმარი' : guests === 1 ? 'guest' : 'guests'} ·{' '}
                      <strong className="font-medium text-ivory">{formatCurrency(totalPrice, isGe ? 'ka-GE' : 'en-US', currency)}</strong>
                    </p>
                  )}
                </div>
                <form onSubmit={onBooking} className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1.05fr_1.15fr_.8fr_1.05fr_1.05fr_auto] lg:gap-2">
                  <div className="booking-field">
                    <label htmlFor="guest-name">{text.guestName}</label>
                    <input
                      id="guest-name"
                      type="text"
                      required
                      autoComplete="name"
                      placeholder={text.guestNamePlaceholder}
                      value={guestName}
                      onChange={(event) => setGuestName(event.target.value)}
                    />
                  </div>
                  <div className="booking-field">
                    <label htmlFor="guest-email">{isGe ? 'ელფოსტა' : 'Email'}</label>
                    <input
                      id="guest-email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="your@email.com"
                      value={guestEmail}
                      onChange={(event) => setGuestEmail(event.target.value)}
                    />
                  </div>
                  <div className="booking-field">
                    <label htmlFor="guest-count"><Users size={13} aria-hidden="true" />{isGe ? 'სტუმრები' : 'Guests'}</label>
                    <select id="guest-count" value={guests} onChange={(event) => setGuests(Number(event.target.value))}>
                      {[1, 2, 3, 4].map((count) => (
                        <option key={count} value={count}>{count} {isGe ? 'სტუმარი' : count === 1 ? 'guest' : 'guests'}</option>
                      ))}
                    </select>
                  </div>
                  <div className="booking-field">
                    <DatePicker
                      id="check-in"
                      label={text.checkIn}
                      value={startDate}
                      otherDate={endDate}
                      role="checkin"
                      bookings={availabilityBookings}
                      disabled={availabilityLoading || availabilityError !== null}
                      onChange={(date) => {
                        setStartDate(date);
                        if (endDate && date >= endDate) setEndDate('');
                      }}
                      triggerClassName="landing-date-trigger"
                    />
                  </div>
                  <div className="booking-field">
                    <DatePicker
                      id="check-out"
                      label={text.checkOut}
                      value={endDate}
                      otherDate={startDate}
                      role="checkout"
                      bookings={availabilityBookings}
                      disabled={!startDate || availabilityLoading || availabilityError !== null}
                      onChange={setEndDate}
                      triggerClassName="landing-date-trigger"
                    />
                  </div>
                  <button type="submit" disabled={bookingDisabled} className="booking-submit group">
                    <span>{loading ? text.loading : text.bookNow}</span>
                    <Search size={15} aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
                  </button>
                </form>
                <div aria-live="polite" className="mt-4 min-h-9 space-y-1 text-xs">
                  {successMessage && <p className="text-emerald-300">{successMessage}</p>}
                  {errorMessage && <p className="text-rose-300">{errorMessage}</p>}
                  {priceError && <p className="text-rose-300">{text.priceUnavailable}</p>}
                  {availabilityError && <p className="text-rose-300">{text.availabilityCheckFailed}</p>}
                </div>
              </motion.div>
            </div>
            <p className="pointer-events-none absolute bottom-1/2 right-8 hidden -translate-y-1/2 rotate-90 text-[9px] uppercase tracking-[0.38em] text-sand/70 xl:block" aria-hidden="true">
              42.27° N — 42.70° E
            </p>
          </section>

          <section className="relative bg-ivory text-ink" aria-labelledby="intro-title">
            <div className="mx-auto max-w-[1600px] px-5 py-24 sm:px-8 md:px-10 md:py-36">
              <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
                <Reveal className="lg:col-span-3">
                  <Eyebrow className="text-ink/60">{text.storyEyebrow}</Eyebrow>
                </Reveal>
                <Reveal className="lg:col-span-9">
                  <h2 id="intro-title" className="text-balance font-serif text-4xl font-light leading-[1.08] sm:text-5xl lg:text-7xl">
                    {isGe
                      ? <>ქუთაისის გულში — ადგილი, სადაც <em className="text-bronze">სიმშვიდე</em> დროსთან ერთად იგრძნობა.</>
                      : <>A private address in the heart of Kutaisi — where <em className="text-bronze">quiet</em> luxury is measured in light and time.</>}
                  </h2>
                </Reveal>
              </div>
              <div className="mt-16 grid items-end gap-8 sm:mt-24 md:grid-cols-12 md:gap-10">
                <Reveal className="relative aspect-[4/5] overflow-hidden md:col-span-6">
                  <Image src="/images/redesign/suite-living.webp" alt={text.apartmentDescription} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
                </Reveal>
                <div className="flex flex-col gap-8 md:col-span-5 md:col-start-8">
                  <Reveal className="relative aspect-square w-3/4 self-end overflow-hidden" delay={0.1}>
                    <Image src="/images/redesign/detail.webp" alt={isGe ? 'დილის ყავა ფანჯარასთან' : 'Morning coffee on a windowsill'} fill sizes="(min-width: 768px) 35vw, 100vw" className="object-cover" />
                  </Reveal>
                  <Reveal delay={0.15}>
                    <p className="max-w-md text-sm leading-relaxed text-ink/70">{text.storyDescription}</p>
                  </Reveal>
                </div>
              </div>
              <dl className="mt-16 grid grid-cols-2 border-t border-ink/15 md:mt-24 lg:grid-cols-4">
                {[
                  { number: '01', unit: isGe ? 'წთ' : 'min', label: isGe ? 'ცენტრალურ შადრევნამდე ფეხით' : 'Walk to the Colchis Fountain' },
                  { number: '15', unit: isGe ? 'წთ' : 'min', label: isGe ? 'ქუთაისის აეროპორტიდან' : 'From Kutaisi International Airport' },
                  { number: '15:00', unit: '', label: isGe ? 'ჩასვლა, პირადი დახვედრით' : 'Check-in, with a personal welcome' },
                  { number: '24', unit: '/7', label: isGe ? 'მასპინძელი WhatsApp-ზე' : 'Host on call via WhatsApp' },
                ].map((fact, index) => (
                  <Reveal key={fact.label} delay={index * 0.06} className="border-b border-ink/15 py-6 pr-4 lg:border-b-0 lg:border-r lg:px-6 lg:first:pl-0 lg:last:border-r-0">
                    <dt className="sr-only">{fact.label}</dt>
                    <dd>
                      <p className="font-serif text-5xl font-light tabular-nums sm:text-6xl">
                        {fact.number}<span className="text-xl italic text-bronze">{fact.unit}</span>
                      </p>
                      <p className="mt-3 text-[9px] uppercase tracking-[0.16em] text-ink/60 sm:text-[10px] sm:tracking-[0.2em]">{fact.label}</p>
                    </dd>
                  </Reveal>
                ))}
              </dl>
            </div>
          </section>

          <section id="apartments" aria-labelledby="residences-title" className="relative scroll-mt-20 bg-ink py-24 sm:py-32 md:py-40">
            <div className="mx-auto max-w-[1600px] px-5 sm:px-8 md:px-10">
              <div className="mb-12 flex flex-wrap items-end justify-between gap-6 lg:mb-14">
                <div>
                  <Eyebrow className="mb-5 text-bronze">{text.apartmentEyebrow}</Eyebrow>
                  <h2 id="residences-title" className="max-w-3xl font-serif text-5xl font-light leading-none text-ivory sm:text-6xl md:text-7xl">
                    {text.apartmentHeading}<br /><em className="text-bronze">{text.apartmentAccent}</em>
                  </h2>
                </div>
                <p className="max-w-xs text-sm leading-relaxed text-stone">{text.apartmentIntro}</p>
              </div>
              <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_.8fr] lg:gap-16">
                <button type="button" onClick={() => setGalleryOpen(true)} data-cursor={isGe ? 'ნახვა' : 'View'} className="group relative block aspect-[4/3] w-full overflow-hidden text-left">
                  <Image src={shownPhoto?.imagePath ?? '/images/redesign/suite-square.webp'} alt={shownPhoto?.title[language] ?? text.apartmentDescription} fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover transition-transform duration-[1.5s] group-hover:scale-105" />
                  <span className="absolute inset-0 bg-gradient-to-t from-ink/65 via-transparent to-transparent" />
                  <span className="absolute bottom-5 left-5 text-[10px] uppercase tracking-[0.25em] text-ivory sm:bottom-7 sm:left-7">
                    {isGe ? 'ქუთაისის ცენტრალური მოედანი' : 'Kutaisi Central Square'}
                  </span>
                </button>
                <div>
                  <Reveal>
                    <p className="text-[10px] uppercase tracking-[0.28em] text-bronze">{isGe ? 'ერთი მისამართი · გამორჩეული დასვენება' : 'One address · a considered stay'}</p>
                    <h3 className="mt-5 font-serif text-4xl font-light leading-[1.06] text-ivory sm:text-5xl">
                      {text.apartmentDetails}<br /><em className="text-bronze">{text.address}</em>
                    </h3>
                    <p className="mt-6 max-w-lg text-sm leading-relaxed text-sand">{text.apartmentDescription}</p>
                    <ul className="mt-8 flex flex-col border-y border-ivory/10">
                      {[
                        { icon: Wifi, label: text.wifi },
                        { icon: Sparkles, label: text.bedrooms },
                        { icon: MapPin, label: text.fountainView },
                      ].map(({ icon: Icon, label }) => (
                        <li key={label} className="flex items-center gap-4 border-b border-ivory/10 py-4 text-sm text-ivory last:border-0">
                          <Icon size={15} className="text-bronze" aria-hidden="true" />{label}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-8 flex flex-wrap items-center justify-between gap-5">
                      <p className="text-xs text-stone">
                        {isGe ? 'ფასი ღამეში' : 'Rate per night'}
                        <span className="ml-3 font-serif text-3xl text-ivory">{priceLoading ? '—' : priceError || pricePerNight === null ? '—' : formatCurrency(pricePerNight, isGe ? 'ka-GE' : 'en-US', currency)}</span>
                      </p>
                      <a href="#booking" className="group inline-flex min-h-12 items-center gap-3 bg-bronze px-6 py-4 text-[9px] font-semibold uppercase tracking-[0.22em] text-ink transition-colors hover:bg-ivory">
                        {text.bookNow}<ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                      </a>
                    </div>
                  </Reveal>
                </div>
              </div>
              <div className="mt-6 flex gap-2 overflow-x-auto pb-2" aria-label={text.galleryTitle}>
                {galleryData.map((photo, index) => (
                  <button
                    key={photo.imagePath}
                    type="button"
                    onClick={() => setGalleryIndex(index)}
                    aria-label={photo.title[language]}
                    aria-pressed={galleryIndex === index}
                    className={`relative h-16 w-24 shrink-0 overflow-hidden border transition-opacity sm:h-20 sm:w-32 ${
                      galleryIndex === index ? 'border-bronze opacity-100' : 'border-transparent opacity-50 hover:opacity-100'
                    }`}
                  >
                    <Image src={photo.imagePath} alt="" fill sizes="128px" className="object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section id="gallery" aria-labelledby="gallery-title" className="relative overflow-hidden bg-ink py-24 sm:py-32 md:py-40">
            <div className="mx-auto max-w-[1600px] px-5 sm:px-8 md:px-10">
              <div className="mb-14 grid gap-6 md:mb-20 md:grid-cols-2 md:items-end">
                <div>
                  <Eyebrow className="mb-5 text-bronze">{text.galleryEyebrow}</Eyebrow>
                  <h2 id="gallery-title" className="font-serif text-5xl font-light leading-none text-ivory sm:text-6xl md:text-7xl">
                    {isGe ? <>მომენტები <em className="text-bronze">სინათლესა</em> და ქვაში.</> : <>Moments in <em className="text-bronze">light</em> & stone.</>}
                  </h2>
                </div>
                <p className="max-w-sm text-sm leading-relaxed text-stone md:justify-self-end">{text.galleryTitle}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-7">
                {galleryData.map((photo, index) => (
                  <motion.button
                    key={photo.imagePath}
                    type="button"
                    onClick={() => {
                      setGalleryIndex(index);
                      setGalleryOpen(true);
                    }}
                    data-cursor={isGe ? 'გახსნა' : 'Open'}
                    aria-label={`${isGe ? 'ფოტოს გახსნა' : 'Open image'}: ${photo.title[language]}`}
                    className={`group relative overflow-hidden text-left ${
                      index % 3 === 0 ? 'aspect-[3/4]' : index % 3 === 1 ? 'aspect-[4/5] md:mt-20' : 'aspect-square hidden md:block'
                    }`}
                  >
                    <Image src={photo.imagePath} alt={photo.title[language]} fill sizes="(min-width: 768px) 33vw, 50vw" className="object-cover transition-transform duration-[1.4s] group-hover:scale-110" />
                    <span className="absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/25" />
                  </motion.button>
                ))}
              </div>
            </div>
          </section>

          <section id="experiences" aria-labelledby="experiences-title" className="relative bg-ink-soft py-24 sm:py-32 md:py-40">
            <div className="mx-auto max-w-[1600px] px-5 sm:px-8 md:px-10">
              <div className="mb-20 text-center sm:mb-28">
                <Reveal><Eyebrow className="justify-center text-bronze">{isGe ? 'ქუთაისის გამოცდილება' : 'The Kutaisi Experience'}</Eyebrow></Reveal>
                <h2 id="experiences-title" className="mt-5 font-serif text-5xl font-light text-ivory sm:text-6xl md:text-8xl">
                  {isGe ? <>დასვენებაზე <em className="text-bronze">მეტი.</em></> : <>Beyond the <em className="text-bronze">stay.</em></>}
                </h2>
              </div>
              <div className="flex flex-col gap-28 md:gap-44">
                <article className="grid items-center gap-12 md:grid-cols-12 md:gap-8">
                  <div className="relative md:col-span-7">
                    <div className="relative aspect-[5/4] overflow-hidden">
                      <Image src="/images/redesign/ritual.webp" alt={isGe ? 'ქვის აბაზანა სანთლის შუქზე' : 'Stone bath in soft candlelight'} fill sizes="(min-width: 768px) 58vw, 100vw" className="object-cover" />
                    </div>
                    <div className="absolute -bottom-10 -right-2 aspect-[3/4] w-[38%] border-8 border-ink-soft md:-bottom-16 md:-right-10">
                      <Image src="/images/redesign/detail.webp" alt={isGe ? 'დილის ყავა ფანჯარასთან' : 'Morning coffee by the window'} fill sizes="40vw" className="object-cover" />
                    </div>
                  </div>
                  <Reveal className="md:col-span-4 md:col-start-9">
                    <p className="font-serif text-7xl font-light italic text-bronze/40 md:text-8xl" aria-hidden="true">I</p>
                    <p className="mt-2 text-[10px] uppercase tracking-[0.3em] text-bronze">{isGe ? 'დასვენება' : 'The Residence'}</p>
                    <h3 className="mt-5 font-serif text-4xl font-light leading-[1.05] text-ivory md:text-5xl">
                      {isGe ? <>ნელი დილები, <em className="text-bronze">მყუდრო</em> საღამოები.</> : <>Slow mornings, <em className="text-bronze">restorative</em> evenings.</>}
                    </h3>
                    <p className="mt-6 text-sm leading-relaxed text-sand">{text.apartmentDescription}</p>
                    <ul className="mt-8 flex flex-col border-t border-ivory/10">
                      {[text.wifi, text.bedrooms, text.fountainView].map((item) => (
                        <li key={item} className="flex items-center justify-between border-b border-ivory/10 py-4 text-sm text-ivory">
                          {item}<span className="size-1.5 rounded-full bg-bronze" aria-hidden="true" />
                        </li>
                      ))}
                    </ul>
                  </Reveal>
                </article>
                <article className="grid items-center gap-12 md:grid-cols-12 md:gap-8">
                  <div className="relative md:order-2 md:col-span-7 md:col-start-6">
                    <div className="relative aspect-[5/4] overflow-hidden">
                      <Image src="/images/redesign/dining.webp" alt={isGe ? 'იმერული სუფრა ადგილობრივი კერძებით' : 'Imeretian table with local dishes'} fill sizes="(min-width: 768px) 58vw, 100vw" className="object-cover" />
                    </div>
                    <div className="absolute -bottom-10 -left-2 aspect-[3/4] w-[38%] border-8 border-ink-soft md:-bottom-16 md:-left-10">
                      <Image src="/images/redesign/suite-living.webp" alt={text.apartmentDescription} fill sizes="40vw" className="object-cover" />
                    </div>
                  </div>
                  <Reveal className="md:order-1 md:col-span-4 md:col-start-1">
                    <p className="font-serif text-7xl font-light italic text-bronze/40 md:text-8xl" aria-hidden="true">II</p>
                    <p className="mt-2 text-[10px] uppercase tracking-[0.3em] text-bronze">{isGe ? 'ადგილობრივი გემოები' : 'The Table'}</p>
                    <h3 className="mt-5 font-serif text-4xl font-light leading-[1.05] text-ivory md:text-5xl">
                      {isGe ? <>იმერეთის <em className="text-bronze">გემოები.</em></> : <>The flavours of <em className="text-bronze">Imereti.</em></>}
                    </h3>
                    <p className="mt-6 text-sm leading-relaxed text-sand">
                      {isGe
                        ? 'აღმოაჩინე იმერული კერძები და ადგილობრივი ღვინო. მასპინძელი გაგიზიარებს ქალაქში მის საყვარელ ადგილებს.'
                        : 'Discover Imeretian cooking and local wine. Our host shares a hand-picked guide to the tables Kutaisi locals love.'}
                    </p>
                    <ul className="mt-8 flex flex-col border-t border-ivory/10">
                      {restaurantsData.slice(0, 3).map((restaurant) => (
                        <li key={restaurant.title.en} className="flex items-baseline justify-between gap-4 border-b border-ivory/10 py-4">
                          <span className="font-serif text-xl text-ivory">{restaurant.title[language]}</span>
                          <span className="text-right text-[11px] text-stone">{restaurant.cuisine[language]}</span>
                        </li>
                      ))}
                    </ul>
                  </Reveal>
                </article>
              </div>
            </div>
          </section>

          <section id="discover" aria-labelledby="discover-title" className="relative scroll-mt-20 bg-ivory py-24 text-ink sm:py-32 md:py-40">
            <div className="mx-auto max-w-[1600px] px-5 sm:px-8 md:px-10">
              <div className="mb-14 grid gap-7 md:mb-20 md:grid-cols-2 md:items-end">
                <div>
                  <Eyebrow className="mb-5 text-ink/60">{text.discoverEyebrow}</Eyebrow>
                  <h2 id="discover-title" className="font-serif text-5xl font-light leading-none sm:text-6xl md:text-7xl">
                    {text.discoverTitle}<br /><em className="text-bronze">{text.discoverAccent}</em>
                  </h2>
                </div>
                <p className="max-w-sm text-sm leading-relaxed text-ink/65 md:justify-self-end">{text.discoverDescription}</p>
              </div>
              <ul
                id="recommendations"
                className="relative border-t border-ink/15"
                onPointerMove={(event) => {
                  const rect = event.currentTarget.getBoundingClientRect();
                  pointerX.set(event.clientX - rect.left);
                  pointerY.set(event.clientY - rect.top);
                }}
                onPointerLeave={() => setActiveDestination(null)}
              >
                {attractionsData.map((attraction, index) => (
                  <li key={attraction.title.en}>
                    <Reveal delay={index * 0.04}>
                      <a
                        href={attraction.locationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onPointerEnter={() => setActiveDestination(index)}
                        onFocus={() => setActiveDestination(index)}
                        onBlur={() => setActiveDestination(null)}
                        className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-ink/15 py-5 sm:gap-6 md:grid-cols-[70px_1fr_1fr_130px_auto] md:gap-7 md:py-8"
                      >
                        <span className="font-serif text-sm italic text-ink/50">0{index + 1}</span>
                        <span className="font-serif text-2xl font-light transition-all duration-500 group-hover:translate-x-2 group-hover:italic sm:text-3xl md:text-5xl">
                          {attraction.title[language]}
                        </span>
                        <span className="hidden text-sm text-ink/60 md:block">{attraction.description[language]}</span>
                        <span className="hidden text-right text-[10px] uppercase tracking-[0.18em] text-ink/60 md:block">{attraction.distance[language]}</span>
                        <span className="flex size-10 items-center justify-center rounded-full border border-ink/20 transition-all duration-500 group-hover:rotate-45 group-hover:border-ink group-hover:bg-ink group-hover:text-ivory">
                          <ArrowUpRight size={15} aria-hidden="true" />
                          <span className="sr-only">{isGe ? 'რუკაზე გახსნა' : 'Open in maps'}: {attraction.title[language]}</span>
                        </span>
                      </a>
                    </Reveal>
                  </li>
                ))}
                <motion.div style={{ x: previewX, y: previewY }} className="pointer-events-none absolute left-0 top-0 z-10 hidden md:block" aria-hidden="true">
                  <AnimatePresence>
                    {activeAttraction && (
                      <motion.div
                        key={activeDestination}
                        initial={{ opacity: 0, scale: 0.7, rotate: -5 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.7 }}
                        transition={{ duration: 0.4, ease: curve }}
                        className="relative -ml-40 -mt-48 h-[250px] w-[190px] overflow-hidden lg:-ml-48 lg:h-[300px] lg:w-[230px]"
                      >
                        <Image src={activeAttraction.imagePath} alt="" fill sizes="230px" className="object-cover" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </ul>
              <div className="mt-12 grid grid-cols-3 gap-3 md:hidden">
                {attractionsData.slice(0, 3).map((attraction) => (
                  <div key={attraction.title.en} className="relative aspect-[3/4] overflow-hidden">
                    <Image src={attraction.imagePath} alt={attraction.title[language]} fill sizes="33vw" className="object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section
            aria-labelledby="stay-notes-title"
            aria-roledescription="carousel"
            className="grain relative overflow-hidden bg-ink py-24 sm:py-32 md:py-40"
            onMouseEnter={() => setQuotePaused(true)}
            onMouseLeave={() => setQuotePaused(false)}
          >
            <Image src="/images/redesign/hero.webp" alt="" fill sizes="100vw" className="object-cover opacity-[0.14]" />
            <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/80 to-ink" aria-hidden="true" />
            <div className="relative mx-auto max-w-5xl px-5 text-center sm:px-8 md:px-10">
              <Eyebrow className="justify-center text-bronze">{isGe ? 'ქუთაისში ყოფნა' : 'A stay in Kutaisi'}</Eyebrow>
              <h2 id="stay-notes-title" className="sr-only">{isGe ? 'ქუთაისში ყოფნის შესახებ' : 'About a stay in Kutaisi'}</h2>
              <div className="mt-9 flex justify-center gap-2" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, index) => <span key={index} className="size-1.5 rounded-full bg-bronze" />)}
              </div>
              <div className="relative mt-9 min-h-64 sm:min-h-72" aria-live="polite">
                <AnimatePresence mode="wait">
                  <motion.figure
                    key={quoteIndex}
                    initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -18, filter: 'blur(8px)' }}
                    transition={{ duration: 0.7, ease: curve }}
                  >
                    <blockquote className="text-balance font-serif text-3xl font-light italic leading-snug text-ivory sm:text-4xl md:text-5xl">
                      “{quote}”
                    </blockquote>
                    <figcaption className="mt-8 text-[10px] uppercase tracking-[0.25em] text-bronze">
                      Kutaisi Central Square
                    </figcaption>
                  </motion.figure>
                </AnimatePresence>
              </div>
              <div className="mt-8 flex items-center justify-center gap-5">
                <button type="button" onClick={() => setQuoteIndex((index) => (index - 1 + stayNotes.length) % stayNotes.length)} aria-label={isGe ? 'წინა' : 'Previous'} className="flex size-10 items-center justify-center rounded-full border border-ivory/20 text-ivory transition-colors hover:border-bronze hover:text-bronze">
                  <ArrowLeft size={14} />
                </button>
                <div className="flex gap-3">
                  {stayNotes.map((item, index) => (
                    <button
                      key={item.title}
                      type="button"
                      onClick={() => setQuoteIndex(index)}
                      aria-label={`${isGe ? 'ჩვენება' : 'Show'} ${index + 1}`}
                      aria-current={index === quoteIndex}
                      className={`h-px w-10 transition-colors ${index === quoteIndex ? 'bg-bronze' : 'bg-ivory/25'}`}
                    />
                  ))}
                </div>
                <button type="button" onClick={() => setQuoteIndex((index) => (index + 1) % stayNotes.length)} aria-label={isGe ? 'შემდეგი' : 'Next'} className="flex size-10 items-center justify-center rounded-full border border-ivory/20 text-ivory transition-colors hover:border-bronze hover:text-bronze">
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </section>

          <section id="contact" aria-labelledby="contact-title" className="relative scroll-mt-20 bg-ink py-24 sm:py-32 md:py-40">
            <div className="mx-auto grid max-w-[1600px] gap-12 px-5 sm:px-8 md:px-10 lg:grid-cols-2 lg:gap-20">
              <div>
                <Eyebrow className="mb-5 text-bronze">{text.locationEyebrow}</Eyebrow>
                <h2 id="contact-title" className="font-serif text-5xl font-light leading-none text-ivory sm:text-6xl md:text-7xl">
                  {isGe ? <>გვიპოვე <em className="text-bronze">ცენტრალურ</em> მოედანზე.</> : <>Find us on <em className="text-bronze">Central</em> Square.</>}
                </h2>
                <p className="mt-7 max-w-md text-sm leading-relaxed text-sand">{text.locationDescription}</p>
                <dl className="mt-10 border-t border-ivory/10">
                  {[
                    { icon: MapPin, label: isGe ? 'მისამართი' : 'Address', value: isGe ? 'ქუთაისის ცენტრალური მოედანი, საქართველო' : 'Central Square, Kutaisi 4600, Georgia', href: 'https://www.google.com/maps/search/?api=1&query=Kutaisi+Central+Square' },
                    { icon: Phone, label: isGe ? 'ტელეფონი / WhatsApp' : 'Phone & WhatsApp', value: '+995 598 54 24 24', href: whatsappHref },
                    { icon: Mail, label: isGe ? 'ელფოსტა' : 'Email', value: emailAddress, href: `mailto:${emailAddress}` },
                    { icon: Clock3, label: isGe ? 'ჩასვლა / გასვლა' : 'Check-in / out', value: '15:00 / 12:00', href: null },
                    { icon: Navigation, label: isGe ? 'აეროპორტი' : 'Airport (KUT)', value: isGe ? '15 წუთი · ტრანსფერი მოთხოვნით' : '15 minutes · transfer on request', href: null },
                  ].map(({ icon: Icon, label, value, href }) => (
                    <Reveal key={label}>
                      <div className="flex items-center gap-3 border-b border-ivory/10 py-4 sm:gap-5 sm:py-5">
                        <Icon size={15} className="shrink-0 text-bronze" aria-hidden="true" />
                        <dt className="w-24 shrink-0 text-[8px] uppercase tracking-[0.15em] text-stone sm:w-32 sm:text-[9px] sm:tracking-[0.22em]">{label}</dt>
                        <dd className="min-w-0 flex-1 break-words text-xs text-ivory sm:text-sm">
                          {href ? <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined} className="transition-colors hover:text-bronze">{value}</a> : value}
                        </dd>
                      </div>
                    </Reveal>
                  ))}
                </dl>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-3 bg-bronze px-5 py-4 text-[9px] font-semibold uppercase tracking-[0.18em] text-ink transition-colors hover:bg-ivory sm:px-6 sm:tracking-[0.24em]">
                    {text.whatsappLabel}<ArrowUpRight size={15} />
                  </a>
                  <a href="https://www.google.com/maps/search/?api=1&query=Kutaisi+Central+Square" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center border border-ivory/25 px-5 py-4 text-[9px] font-semibold uppercase tracking-[0.18em] text-ivory transition-colors hover:border-bronze hover:text-bronze sm:px-6 sm:tracking-[0.24em]">
                    {text.directions}
                  </a>
                </div>
              </div>
              <Reveal className="relative min-h-[360px] overflow-hidden border border-ivory/10 sm:min-h-[440px] lg:min-h-full">
                <iframe
                  title={text.mapTitle}
                  src="https://www.google.com/maps?q=Kutaisi+Central+Square&z=16&output=embed"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 h-full w-full grayscale invert-[0.92] hue-rotate-180 contrast-[0.9]"
                />
                <div className="pointer-events-none absolute inset-0 bg-bronze/10 mix-blend-color" aria-hidden="true" />
              </Reveal>
            </div>
          </section>
        </main>

        <footer className="relative overflow-hidden bg-ink-soft pt-16 text-ivory sm:pt-24 md:pt-28">
          <div className="flex overflow-hidden border-y border-ivory/10 py-5" aria-hidden="true">
            <div className="flex shrink-0 animate-marquee gap-8 whitespace-nowrap pr-8 font-serif text-4xl font-light italic text-ivory/80 sm:gap-12 sm:pr-12 sm:text-6xl">
              {Array.from({ length: 2 }).map((_, repeat) => (
                <span key={repeat} className="flex gap-8 sm:gap-12">
                  {['Kutaisi', 'Central Square', 'Imereti', isGe ? 'დარჩი ცოტა ხნით' : 'Stay a while'].map((word) => (
                    <span key={word} className="flex items-center gap-8 sm:gap-12">
                      {word}<span className="size-2 rounded-full bg-bronze not-italic" />
                    </span>
                  ))}
                </span>
              ))}
            </div>
          </div>
          <div className="mx-auto grid max-w-[1600px] gap-10 px-5 py-14 sm:px-8 md:grid-cols-12 md:px-10 md:py-20">
            <div className="md:col-span-5">
              <a href="#top" aria-label={text.brand}><Brand text={text.brand} /></a>
              <p className="mt-5 max-w-sm font-serif text-2xl font-light leading-snug sm:text-3xl">{text.footerHome}</p>
            </div>
            <nav aria-label={isGe ? 'ქვედა ნავიგაცია' : 'Footer'} className="md:col-span-2 md:col-start-8">
              <p className="text-[9px] uppercase tracking-[0.28em] text-stone">{isGe ? 'აღმოაჩინე' : 'Explore'}</p>
              <ul className="mt-4 flex flex-col gap-3 text-sm">
                {navigation.map((link) => <li key={link.href}><a href={link.href} className="transition-colors hover:text-bronze">{link.label}</a></li>)}
              </ul>
            </nav>
            <div className="md:col-span-3">
              <p className="text-[9px] uppercase tracking-[0.28em] text-stone">{isGe ? 'კონტაქტი' : 'Contact'}</p>
              <ul className="mt-4 flex flex-col gap-3 text-sm">
                <li>{isGe ? 'ქუთაისის ცენტრალური მოედანი' : 'Central Square, Kutaisi'}</li>
                <li><a href={phoneHref} className="transition-colors hover:text-bronze">+995 598 54 24 24</a></li>
                <li><a href={`mailto:${emailAddress}`} className="break-all transition-colors hover:text-bronze">{emailAddress}</a></li>
              </ul>
            </div>
          </div>
          <div className="mx-auto max-w-[1600px] px-5 sm:px-8 md:px-10">
            <p className="select-none text-center font-serif text-[18vw] font-light leading-[0.8] tracking-tight text-ivory/[0.06]" aria-hidden="true">Kutaisi</p>
            <div className="flex flex-col items-center justify-between gap-4 border-t border-ivory/10 py-7 text-[10px] text-stone md:flex-row">
              <p>© 2026 Kutaisi Central Square. {text.copyright}</p>
              <a href="#top" className="uppercase tracking-[0.26em] transition-colors hover:text-ivory">{text.backToTop}</a>
            </div>
          </div>
        </footer>

        <a href={whatsappHref} target="_blank" rel="noopener noreferrer" aria-label={text.whatsappLabel} className="fixed bottom-5 right-5 z-30 grid size-12 place-items-center rounded-full border border-bronze bg-ink text-bronze shadow-lg transition-all hover:scale-105 hover:bg-bronze hover:text-ink sm:bottom-7 sm:right-7">
          <MessageCircle size={20} aria-hidden="true" />
        </a>

        <AnimatePresence>
          {galleryOpen && shownPhoto && (
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={text.galleryTitle}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="fixed inset-0 z-[70] flex flex-col bg-ink/95 backdrop-blur-xl"
            >
              <div className="flex items-center justify-between px-5 py-4 sm:px-8">
                <p className="font-serif text-lg tabular-nums text-ivory">
                  {String(galleryIndex + 1).padStart(2, '0')} <span className="text-stone">/ {String(galleryData.length).padStart(2, '0')}</span>
                </p>
                <button type="button" onClick={() => setGalleryOpen(false)} aria-label={isGe ? 'დახურვა' : 'Close viewer'} className="flex size-11 items-center justify-center rounded-full border border-ivory/20 text-ivory transition-colors hover:bg-ivory hover:text-ink">
                  <X size={18} />
                </button>
              </div>
              <div className="relative flex-1">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div key={galleryIndex} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }} transition={{ duration: 0.5, ease: curve }} className="absolute inset-x-4 inset-y-0 sm:inset-x-16 md:inset-x-24">
                    <Image src={shownPhoto.imagePath} alt={shownPhoto.title[language]} fill sizes="90vw" className="object-contain" />
                  </motion.div>
                </AnimatePresence>
                {([-1, 1] as const).map((direction) => (
                  <button key={direction} type="button" onClick={() => stepGallery(direction)} aria-label={direction === -1 ? text.galleryPrevious : text.galleryNext} className={`absolute top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-ivory/20 bg-ink/50 text-ivory backdrop-blur-md transition-colors hover:bg-ivory hover:text-ink sm:size-12 ${direction === -1 ? 'left-3 sm:left-7' : 'right-3 sm:right-7'}`}>
                    {direction === -1 ? <ChevronLeft size={19} /> : <ChevronRight size={19} />}
                  </button>
                ))}
              </div>
              <p className="px-5 py-5 text-center text-sm italic text-sand">{shownPhoto.title[language]}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
