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
  Coffee,
  MapPin,
  Menu,
  MessageCircle,
  Navigation,
  Phone,
  Search,
  Sparkles,
  Tag,
  User,
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
  guestPhone: string;
  setGuestPhone: (value: string) => void;
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
  guestPhone,
  setGuestPhone,
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

  return (
    <div className="landing site-shell">
      <header className="site-header flex items-center">
        <a className="brand" href="#top" aria-label={text.brand}>
          <span className="brand-mark">K</span>
          <span>
            <strong>{text.brand}</strong>
            <small>{text.tagline}</small>
          </span>
        </a>

        <nav
          aria-label={text.mainNavigation}
          className={`main-nav ${menuOpen ? 'is-open' : ''}`}
        >
          <a href="#apartments" onClick={() => setMenuOpen(false)}>{text.navGallery}</a>
          <a href="#location" onClick={() => setMenuOpen(false)}>{text.navLocation}</a>
          <a href="#recommendations" onClick={() => setMenuOpen(false)}>{text.navRecommendations}</a>
          <a href="#restaurants" onClick={() => setMenuOpen(false)}>{text.navRestaurants}</a>
          <button
            className="nav-close"
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label={text.closeMenu}
          >
            <X size={18} aria-hidden="true" />
          </button>
        </nav>

        <div className="header-actions">
          <div role="group" aria-label={text.languageLabel} className="language-switcher">
            {(['ge', 'en'] as const).map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={language === option}
                className={`language-option ${language === option ? 'active' : ''}`}
                onClick={() => setLanguage(option)}
              >
                {option === 'ge' ? 'ქარ' : 'ENG'}
              </button>
            ))}
            <ChevronDown size={13} aria-hidden="true" />
          </div>
          <a className="header-book" href="#booking">{text.bookNow}</a>
          <button
            className="menu-toggle"
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

        <section className="booking-bar" id="booking" aria-label={text.bookNow}>
          <form onSubmit={onBooking} className="booking-form">
            <div className="booking-price">
              <span>
                <Tag size={15} aria-hidden="true" /> {text.pricePrefix}{' '}
                <strong>
                  {pricePerNight === null
                    ? text.priceLoading
                    : `${formatCurrency(pricePerNight, language === 'ge' ? 'ka-GE' : 'en-US', currency)} / ${language === 'ge' ? 'ღამე' : 'night'}`}
                </strong>
              </span>
              {nights > 0 && (
                <strong className="booking-total">
                  {nights} {language === 'ge' ? 'ღამე' : 'nights'} · {formatCurrency(totalPrice, language === 'ge' ? 'ka-GE' : 'en-US', currency)}
                </strong>
              )}
            </div>
            <div className="booking-field">
              <label htmlFor="guest-name"><User size={17} aria-hidden="true" />{text.guestName}</label>
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
              <label htmlFor="guest-phone"><Phone size={17} aria-hidden="true" />{text.phone}</label>
              <input
                id="guest-phone"
                type="tel"
                required
                autoComplete="tel"
                placeholder="+995 555 12 34 56"
                value={guestPhone}
                onChange={(event) => setGuestPhone(event.target.value)}
              />
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
                  setStartDate(date)
                  if (endDate && date >= endDate) setEndDate('')
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
            <button
              className="booking-submit"
              type="submit"
              disabled={loading || priceLoading || pricePerNight === null || priceError !== null || availabilityLoading || availabilityError !== null}
            >
              {loading ? text.loading : text.bookNow}
              <Search size={16} aria-hidden="true" />
            </button>
          </form>
          {successMessage && <p className="booking-feedback success" role="status">{successMessage}</p>}
          {errorMessage && <p className="booking-feedback error" role="alert">{errorMessage}</p>}
          {priceError && (
            <p className="booking-feedback error" role="alert">
              {text.priceUnavailable}
            </p>
          )}
          {availabilityError && (
            <p className="booking-feedback error" role="alert">
              {text.availabilityCheckFailed}
            </p>
          )}
        </section>

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
                height={800}
                unoptimized
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
                  unoptimized
                  loading="lazy"
                  decoding="async"
                />
              </button>
            ))}
          </div>
        </section>

        <section className="story-section">
          <div className="story-image">
            <Image
              src={attractionsData[5].imagePath}
              alt={text.cityLabel}
              width={1000}
              height={800}
              unoptimized
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

        <section className="section discover-section" id="recommendations">
          <div className="section-heading">
            <p className="eyebrow"><span />{text.discoverEyebrow}</p>
            <h2>{text.discoverTitle} <em>{text.discoverAccent}</em></h2>
            <p className="section-intro">{text.discoverDescription}</p>
          </div>
          <div className="destination-grid">
            {attractionsData.map((attraction, index) => (
              <a
                className={`destination-card card-${index + 1}`}
                href={attraction.locationUrl}
                key={attraction.title.en}
                target="_blank"
                rel="noreferrer"
              >
                <Image
                  src={attraction.imagePath}
                  alt={attraction.title[language]}
                  fill
                  unoptimized
                  sizes="(min-width: 800px) 35vw, 90vw"
                  loading="lazy"
                  decoding="async"
                />
                <span className="card-shade" />
                <span className="destination-copy">
                  <span>0{index + 1}</span>
                  <h3>{attraction.title[language]}</h3>
                  <span>{attraction.distance[language]}</span>
                </span>
              </a>
            ))}
          </div>
        </section>

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
                    unoptimized
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
          <a href="/admin" title={text.adminLogin}>{text.adminPanel}</a>
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
