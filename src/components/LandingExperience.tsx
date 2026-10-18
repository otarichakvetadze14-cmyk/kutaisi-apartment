'use client';

import Image from 'next/image';
import { useState, type Dispatch, type FormEventHandler, type SetStateAction } from 'react';
import { formatCurrency } from '@/lib/currency';
import type { BookingDateRange } from '@/lib/bookingAvailability';
import DatePicker from '@/components/DatePicker';
import {
  ArrowRight,
  BedDouble,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Coffee,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Navigation,
  Phone,
  Search,
  Sparkles,
  Tag,
  User,
  Users,
  Wifi,
  X,
} from 'lucide-react';

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
  const [menuOpen, setMenuOpen] = useState(false);
  const isGe = language === 'ge';

  return (
    <div className="landing site-shell">
      {/* 1. HEADER */}
      <header className="site-header flex items-center justify-between py-4 px-6 sm:px-8 border-b border-white/20">
        <a className="brand flex items-center gap-3" href="#top" aria-label={text.brand}>
          <span className="brand-mark w-8 h-8 border border-current grid place-items-center font-serif text-base shrink-0">K</span>
          <span className="flex flex-col">
            <strong className="text-xs font-semibold tracking-wide leading-tight">{text.brand}</strong>
            <small className="text-[8px] tracking-widest uppercase opacity-80 mt-0.5">{text.tagline}</small>
          </span>
        </a>

        <nav
          aria-label={text.mainNavigation}
          className={`main-nav flex items-center gap-8 ${menuOpen ? 'is-open' : ''}`}
        >
          <a href="#apartments" className="text-xs font-medium" onClick={() => setMenuOpen(false)}>{text.navGallery}</a>
          <a href="#location" className="text-xs font-medium" onClick={() => setMenuOpen(false)}>{text.navLocation}</a>
          <a href="#recommendations" className="text-xs font-medium" onClick={() => setMenuOpen(false)}>{text.navRecommendations}</a>
          <a href="#restaurants" className="text-xs font-medium" onClick={() => setMenuOpen(false)}>{text.navRestaurants}</a>
          <a href="#contact" className="text-xs font-medium" onClick={() => setMenuOpen(false)}>{isGe ? 'კონტაქტი' : 'Contact'}</a>
          <button
            className="nav-close md:hidden"
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label={text.closeMenu}
          >
            <X size={18} aria-hidden="true" />
          </button>
        </nav>

        <div className="header-actions flex items-center gap-6">
          <div role="group" aria-label={text.languageLabel} className="language-switcher flex items-center gap-1">
            {(['ge', 'en'] as const).map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={language === option}
                className={`language-option min-w-[36px] min-h-[36px] flex items-center justify-center text-xs transition ${language === option ? 'font-bold underline' : 'opacity-70'}`}
                onClick={() => setLanguage(option)}
              >
                {option === 'ge' ? 'ქარ' : 'ENG'}
              </button>
            ))}
            <ChevronDown size={13} aria-hidden="true" />
          </div>
          <a className="header-book min-h-[44px] px-6 inline-flex items-center justify-center border border-white/70 text-xs uppercase tracking-wider transition hover:bg-white hover:text-black" href="#booking">{text.bookNow}</a>
          <button
            className="menu-toggle md:hidden"
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label={text.openMenu}
            aria-expanded={menuOpen}
          >
            <Menu size={20} aria-hidden="true" />
          </button>
        </div>
      </header>

      <main id="top">
        {/* HERO SECTION */}
        <section className="hero">
          <div className="hero-image">
            <Image
              src="/hero-main.jpg"
              alt={text.heroDescription}
              fill
              priority
              loading="eager"
              fetchPriority="high"
              sizes="100vw"
              className="object-cover object-[center_43%]"
            />
          </div>
          <div className="hero-overlay" />
          <div className="hero-content">
            <p className="eyebrow light"><span /> {text.heroEyebrow}</p>
            <h1>{text.heroLineOne}<br /><em>{text.heroAccent}</em> {text.heroLineTwo}</h1>
            <p className="hero-copy">{text.heroDescription}</p>
            <a href="#apartments" className="text-link light-link">
              {text.browseApartments} <ArrowRight size={17} aria-hidden="true" />
            </a>
          </div>
          <div className="hero-note"><span>01</span><i /><span>{text.cityLabel}</span></div>
          <div className="scroll-cue"><span>{text.scrollDown}</span><i /></div>
        </section>

        {/* 2. BOOKING BAR */}
        <section className="booking-bar max-w-6xl mx-auto -mt-10 relative z-10 p-6 bg-white/98 shadow-xl" id="booking" aria-label={text.bookNow}>
          <form onSubmit={onBooking} className="booking-form grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
            <div className="booking-price md:col-span-6 flex items-center justify-between pb-2 border-b border-neutral-100">
              <span className="flex items-center gap-2 text-sm">
                <Tag size={15} aria-hidden="true" /> {text.pricePrefix}{' '}
                <strong>
                  {pricePerNight === null
                    ? text.priceLoading
                    : `${formatCurrency(pricePerNight, isGe ? 'ka-GE' : 'en-US', currency)} / ${isGe ? 'ღამე' : 'night'}`}
                </strong>
              </span>
              {nights > 0 && (
                <strong className="booking-total text-sm font-serif">
                  {nights} {isGe ? 'ღამე' : 'nights'} ({guests} {isGe ? 'სტუმარი' : 'guests'}) · {formatCurrency(totalPrice, isGe ? 'ka-GE' : 'en-US', currency)}
                </strong>
              )}
            </div>

            {/* სახელი */}
            <div className="booking-field flex flex-col gap-1.5 p-3 border border-neutral-200 rounded-xl bg-white min-h-[64px] justify-center">
              <label htmlFor="guest-name" className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                <User size={15} aria-hidden="true" />{text.guestName}
              </label>
              <input
                id="guest-name"
                type="text"
                required
                autoComplete="name"
                placeholder={text.guestNamePlaceholder}
                value={guestName}
                onChange={(event) => setGuestName(event.target.value)}
                className="w-full text-sm outline-none bg-transparent"
              />
            </div>

            {/* ელფოსტა */}
            <div className="booking-field flex flex-col gap-1.5 p-3 border border-neutral-200 rounded-xl bg-white min-h-[64px] justify-center">
              <label htmlFor="guest-email" className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                <Mail size={15} aria-hidden="true" />{isGe ? 'ელფოსტა' : 'Email'}
              </label>
              <input
                id="guest-email"
                type="email"
                required
                autoComplete="email"
                placeholder="your@email.com"
                value={guestEmail}
                onChange={(event) => setGuestEmail(event.target.value)}
                className="w-full text-sm outline-none bg-transparent px-1"
              />
            </div>

            {/* სტუმრები (1-4) */}
            <div className="booking-field flex flex-col gap-1.5 p-3 border border-neutral-200 rounded-xl bg-white min-h-[64px] justify-center">
              <label htmlFor="guest-count" className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                <Users size={15} aria-hidden="true" />{isGe ? 'სტუმრები' : 'Guests'}
              </label>
              <select
                id="guest-count"
                value={guests}
                onChange={(event) => setGuests(Number(event.target.value))}
                className="w-full text-sm outline-none bg-transparent cursor-pointer"
              >
                <option value={1}>1 {isGe ? 'სტუმარი' : 'Guest'}</option>
                <option value={2}>2 {isGe ? 'სტუმარი' : 'Guests'}</option>
                <option value={3}>3 {isGe ? 'სტუმარი' : 'Guests'}</option>
                <option value={4}>4 {isGe ? 'სტუმარი' : 'Guests'}</option>
              </select>
            </div>

            {/* ჩასვლა */}
            <div className="booking-field flex flex-col gap-1.5 p-3 border border-neutral-200 rounded-xl bg-white min-h-[64px] justify-center">
              <DatePicker
                id="check-in"
                label={text.checkIn}
                value={startDate}
                otherDate={endDate}
                role="checkin"
                bookings={availabilityBookings}
                disabled={availabilityLoading || availabilityError !== null}
                onChange={(date) => {
                  setStartDate(date)
                  if (endDate && date >= endDate) setEndDate('')
                }}
                triggerClassName="landing-date-trigger w-full text-sm text-left bg-transparent"
              />
            </div>

            {/* გასვლა */}
            <div className="booking-field flex flex-col gap-1.5 p-3 border border-neutral-200 rounded-xl bg-white min-h-[64px] justify-center">
              <DatePicker
                id="check-out"
                label={text.checkOut}
                value={endDate}
                otherDate={startDate}
                role="checkout"
                bookings={availabilityBookings}
                disabled={!startDate || availabilityLoading || availabilityError !== null}
                onChange={setEndDate}
                triggerClassName="landing-date-trigger w-full text-sm text-left bg-transparent"
              />
            </div>

            {/* დაჯავშნის ღილაკი */}
            <button
              className="booking-submit min-h-[64px] h-full w-full bg-neutral-900 text-white rounded-xl flex items-center justify-center gap-2 text-xs uppercase tracking-wider hover:bg-neutral-800 transition px-6"
              type="submit"
              disabled={loading || priceLoading || pricePerNight === null || priceError !== null || availabilityLoading || availabilityError !== null}
            >
              <span>{loading ? text.loading : text.bookNow}</span>
              <Search size={16} aria-hidden="true" />
            </button>
          </form>
          {successMessage && <p className="booking-feedback success mt-3 text-sm text-emerald-700">{successMessage}</p>}
          {errorMessage && <p className="booking-feedback error mt-3 text-sm text-rose-700">{errorMessage}</p>}
          {priceError && <p className="booking-feedback error mt-3 text-sm text-rose-700">{text.priceUnavailable}</p>}
          {availabilityError && <p className="booking-feedback error mt-3 text-sm text-rose-700">{text.availabilityCheckFailed}</p>}
        </section>

        {/* APARTMENT SECTION */}
        <section className="section apartment-section" id="apartments">
          <div className="section-heading split-heading">
            <div>
              <p className="eyebrow"><span />{text.apartmentEyebrow}</p>
              <h2>{text.apartmentHeading}<br /><em>{text.apartmentAccent}</em></h2>
            </div>
            <p className="section-intro">{text.apartmentIntro}</p>
          </div>
          <div className="gallery-wrap">
            <div className="gallery-main">
              <Image
                src={galleryData[galleryIndex].imagePath}
                alt={galleryData[galleryIndex].title[language]}
                width={1200}
                height={1200}
                sizes="(min-width: 800px) 60vw, 90vw"
                loading="lazy"
                decoding="async"
              />
              <button
                className="gallery-arrow left"
                type="button"
                aria-label={text.galleryPrevious}
                onClick={() => setGalleryIndex((index) => (index - 1 + galleryData.length) % galleryData.length)}
              >
                <ChevronLeft size={20} aria-hidden="true" />
              </button>
              <button
                className="gallery-arrow right"
                type="button"
                aria-label={text.galleryNext}
                onClick={() => setGalleryIndex((index) => (index + 1) % galleryData.length)}
              >
                <ChevronRight size={20} aria-hidden="true" />
              </button>
              <div className="gallery-count">0{galleryIndex + 1} <span>/ 0{galleryData.length}</span></div>
            </div>
            <div className="gallery-info">
              <p className="eyebrow">{`01 — ${text.apartmentSuite}`}</p>
              <h3>{text.apartmentDetails}<br /><em>{text.address}</em></h3>
              <p>{text.apartmentDescription}</p>
              <div className="amenities">
                <span><BedDouble size={16} aria-hidden="true" />{text.bedrooms}</span>
                <span><Wifi size={16} aria-hidden="true" />{text.wifi}</span>
              </div>
              <a href="#booking" className="outline-button">
                {text.bookNow} <ArrowRight size={16} aria-hidden="true" />
              </a>
            </div>
          </div>
          <div className="gallery-thumbs" aria-label={text.galleryTitle}>
            {galleryData.map((photo, index) => (
              <button
                key={photo.imagePath}
                type="button"
                className={galleryIndex === index ? 'active' : ''}
                onClick={() => setGalleryIndex(index)}
                aria-label={photo.title[language]}
                aria-pressed={galleryIndex === index}
              >
                <Image
                  src={photo.imagePath}
                  alt={photo.title[language]}
                  width={192}
                  height={128}
                  sizes="96px"
                  loading="lazy"
                  decoding="async"
                />
              </button>
            ))}
          </div>
        </section>

        {/* STORY SECTION */}
        <section className="story-section">
          <div className="story-image">
            <Image
              src={attractionsData[5]?.imagePath || attractionsData[0].imagePath}
              alt={text.cityLabel}
              width={1920}
              height={1080}
              sizes="(min-width: 800px) 50vw, 100vw"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="story-copy">
            <p className="eyebrow"><span />{text.storyEyebrow}</p>
            <h2>{text.storyLineOne}<br /><em>{text.storyAccent}</em></h2>
            <p>{text.storyDescription}</p>
            <a className="text-link" href="#location">
              {text.navLocation} <ArrowRight size={17} aria-hidden="true" />
            </a>
          </div>
        </section>

        {/* LOCATION SECTION */}
        <section className="section location-section" id="location">
          <div className="section-heading">
            <p className="eyebrow"><span />{text.locationEyebrow}</p>
            <h2>{text.locationTitle}</h2>
          </div>
          <div className="location-grid">
            <div className="location-copy">
              <p className="location-address"><MapPin size={18} aria-hidden="true" />{text.address}</p>
              <p>{text.locationDescription}</p>
              <div className="location-details">
                <span><Navigation size={16} aria-hidden="true" />{text.airport}</span>
                <span><Sparkles size={16} aria-hidden="true" />{text.fountainView}</span>
                <a href="https://maps.app.goo.gl/6vCSoXyBVkPM3Vem7" target="_blank" rel="noreferrer">
                  <Navigation size={16} aria-hidden="true" />{text.directions}
                </a>
              </div>
            </div>
            <div className="location-map">
              <iframe
                title={text.mapTitle}
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2976.812456!2d42.7001!3d42.2721!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zS3V0YWlzaSBDRU5UUkFMIFNRVUFERQ!5e0!3m2!1ska!2sge!4v1650000000000!5m2!1ska!2sge"
                loading="lazy"
                allowFullScreen={false}
              />
            </div>
          </div>
        </section>

        {/* 3. „აღმოაჩინე ქუთაისი“ - თანაბარი ბარათები */}
        <section className="section discover-section max-w-7xl mx-auto px-4 py-16" id="recommendations">
          <div className="section-heading mb-10">
            <p className="eyebrow"><span />{text.discoverEyebrow}</p>
            <h2>{text.discoverTitle} <em>{text.discoverAccent}</em></h2>
            <p className="section-intro max-w-2xl mt-2 text-neutral-600">{text.discoverDescription}</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {attractionsData.map((attraction, index) => (
              <a
                className="group relative flex flex-col h-[320px] rounded-2xl overflow-hidden shadow-sm border border-neutral-200/80 transition hover:shadow-md"
                href={attraction.locationUrl}
                key={attraction.title.en}
                target="_blank"
                rel="noreferrer"
              >
                <Image
                  src={attraction.imagePath}
                  alt={attraction.title[language]}
                  fill
                  sizes="(min-width: 1280px) 400px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, calc(100vw - 2rem)"
                  loading="lazy"
                  decoding="async"
                  className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <span className="relative z-10 mt-auto p-6 flex flex-col text-white">
                  <span className="text-xs font-semibold text-amber-400 tracking-wider mb-1">0{index + 1} · {attraction.distance[language]}</span>
                  <h3 className="text-xl font-serif font-medium">{attraction.title[language]}</h3>
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* RESTAURANTS GUIDE */}
        <section className="section guide-section" id="restaurants">
          <div className="section-heading">
            <p className="eyebrow"><span />{text.hostFavorites}</p>
            <h2>{text.restaurantsTitle}</h2>
          </div>
          <div className="guide-grid">
            {restaurantsData.map((restaurant) => (
              <a
                className="guide-card"
                href={restaurant.addressUrl}
                key={restaurant.title.en}
                target="_blank"
                rel="noreferrer"
              >
                <div className="guide-image">
                  <Image
                    src={restaurant.imagePath}
                    alt={restaurant.title[language]}
                    fill
                    sizes="(min-width: 800px) 25vw, 45vw"
                    loading="lazy"
                    decoding="async"
                  />
                  <span><ArrowRight size={16} aria-hidden="true" /></span>
                </div>
                <p>{restaurant.cuisine[language]}</p>
                <h3>{restaurant.title[language]}</h3>
                <small>{text.learnMore}</small>
              </a>
            ))}
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section className="section contact-section max-w-7xl mx-auto px-4 py-16" id="contact">
          <div className="section-heading mb-12">
            <p className="eyebrow"><span />{isGe ? 'კონტაქტი' : 'Contact Us'}</p>
            <h2 className="text-3xl font-serif font-medium">
              {isGe ? 'დაგვიკავშირდით' : 'Get in Touch'}
            </h2>
            <p className="section-intro max-w-2xl mt-2 text-neutral-600">
              {isGe
                ? 'მზად ვართ გიპასუხოთ ნებისმიერ შეკითხვაზე და დაგეხმაროთ იდეალური დასვენების დაგეგმვაში.'
                : 'We are here to answer your questions and help you plan your stay.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* მისამართი */}
            <div className="p-6 bg-white border border-neutral-200/80 rounded-2xl shadow-sm flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-900">
                <MapPin size={20} />
              </div>
              <div>
                <h3 className="text-xs uppercase font-semibold tracking-wider text-neutral-500 mb-1">
                  {isGe ? 'მისამართი' : 'Address'}
                </h3>
                <p className="text-sm font-medium text-neutral-900">
                  {isGe ? 'ქუთაისის ცენტრალური მოედანი' : 'Kutaisi Central Square'}
                </p>
                <p className="text-xs text-neutral-500">{isGe ? 'ქუთაისი, საქართველო' : 'Kutaisi, Georgia'}</p>
              </div>
            </div>

            {/* ტელეფონი / WhatsApp */}
            <div className="p-6 bg-white border border-neutral-200/80 rounded-2xl shadow-sm flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <Phone size={20} />
              </div>
              <div>
                <h3 className="text-xs uppercase font-semibold tracking-wider text-neutral-500 mb-1">
                  {isGe ? 'ტელეფონი / WhatsApp' : 'Phone / WhatsApp'}
                </h3>
                <a href="https://wa.me/995598542424" target="_blank" rel="noreferrer" className="text-sm font-medium text-neutral-900 hover:underline block">
                  +995 598 54 24 24
                </a>
                <span className="text-xs text-emerald-600 font-medium">
                  {isGe ? 'ხელმისაწვდომია WhatsApp-ზე' : 'Available on WhatsApp'}
                </span>
              </div>
            </div>

            {/* ელფოსტა */}
            <div className="p-6 bg-white border border-neutral-200/80 rounded-2xl shadow-sm flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-900">
                <Mail size={20} />
              </div>
              <div>
                <h3 className="text-xs uppercase font-semibold tracking-wider text-neutral-500 mb-1">
                  {isGe ? 'ელფოსტა' : 'Email'}
                </h3>
                <a href="mailto:hello@kutaisi-square.ge" className="text-sm font-medium text-neutral-900 hover:underline block">
                  hello@kutaisi-square.ge
                </a>
                <p className="text-xs text-neutral-500">{isGe ? 'სწრაფი უკუკავშირი' : 'Quick response'}</p>
              </div>
            </div>

            {/* ჩასვლა / გასვლა */}
            <div className="p-6 bg-white border border-neutral-200/80 rounded-2xl shadow-sm flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-900">
                <Clock size={20} />
              </div>
              <div>
                <h3 className="text-xs uppercase font-semibold tracking-wider text-neutral-500 mb-1">
                  {isGe ? 'ჩასვლა / გასვლა' : 'Check-in / Check-out'}
                </h3>
                <p className="text-sm font-medium text-neutral-900">Check-in: 14:00+</p>
                <p className="text-xs text-neutral-500">Check-out: 12:00-მდე</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-brand">
          <span className="brand-mark">K</span>
          <div><strong>{text.brand}</strong><p>{text.footerHome}</p></div>
        </div>
        <div className="footer-contact">
          <span><MapPin size={15} aria-hidden="true" />{text.cityLabel}</span>
          <a href="mailto:hello@kutaisi-square.ge"><Coffee size={15} aria-hidden="true" />{text.footerEmail}</a>
        </div>
        <div className="footer-end">
          <span>© 2026 Kutaisi Central Square. {text.copyright}</span>
          <a href="#top">{text.backToTop} <ArrowRight size={14} aria-hidden="true" /></a>
        </div>
      </footer>

      <a
        className="whatsapp-button"
        href="https://wa.me/995598542424"
        target="_blank"
        rel="noreferrer"
        aria-label={text.whatsappLabel}
      >
        <MessageCircle size={25} aria-hidden="true" />
      </a>
    </div>
  );
}