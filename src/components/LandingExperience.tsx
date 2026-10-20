'use client'

import type { Dispatch, FormEventHandler, SetStateAction } from 'react'
import type { BookingDateRange } from '@/lib/bookingAvailability'
import { formatCurrency } from '@/lib/currency'
import { Contact } from '@/components/site/contact'
import { Cursor } from '@/components/site/cursor'
import { Discover } from '@/components/site/discover'
import { Experiences } from '@/components/site/experiences'
import { Footer } from '@/components/site/footer'
import { Gallery } from '@/components/site/gallery'
import { Header } from '@/components/site/header'
import { Hero } from '@/components/site/hero'
import { Intro } from '@/components/site/intro'
import { MotionProvider } from '@/components/site/motion-provider'
import { Preloader } from '@/components/site/preloader'
import { Residences } from '@/components/site/residences'
import { Testimonials } from '@/components/site/testimonials'

type Language = 'ge' | 'en'
type LocalizedText = Readonly<Record<Language, string>>

interface GalleryPhoto {
  imagePath: string
  title: LocalizedText
}

interface Attraction {
  imagePath: string
  title: LocalizedText
  description: LocalizedText
  distance: LocalizedText
  locationUrl: string
}

interface Restaurant {
  imagePath: string
  title: LocalizedText
  cuisine: LocalizedText
  description: LocalizedText
  addressUrl: string
}

interface LandingExperienceProps {
  text: Record<string, string>
  language: Language
  setLanguage: (language: Language) => void
  guestName: string
  setGuestName: (value: string) => void
  guestEmail: string
  setGuestEmail: (value: string) => void
  guests: number
  setGuests: (value: number) => void
  startDate: string
  setStartDate: (value: string) => void
  endDate: string
  setEndDate: (value: string) => void
  loading: boolean
  successMessage: string | null
  errorMessage: string | null
  galleryIndex: number
  setGalleryIndex: Dispatch<SetStateAction<number>>
  pricePerNight: number | null
  currency: string
  priceLoading: boolean
  priceError: string | null
  availabilityBookings: readonly BookingDateRange[]
  availabilityLoading: boolean
  availabilityError: string | null
  nights: number
  totalPrice: number
  onBooking: FormEventHandler<HTMLFormElement>
  galleryData: readonly GalleryPhoto[]
  attractionsData: readonly Attraction[]
  restaurantsData: readonly Restaurant[]
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
  const priceLabel = priceLoading
    ? text.priceLoading
    : priceError || pricePerNight === null
      ? text.priceUnavailable
      : formatCurrency(pricePerNight, language === 'ge' ? 'ka-GE' : 'en-US', currency)

  const booking = {
    text,
    language,
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
  }

  return (
    <MotionProvider>
      <div className="landing site-shell min-h-screen overflow-x-clip bg-ink text-ivory">
        <Preloader />
        <Cursor />
        <Header language={language} setLanguage={setLanguage} text={text} />
        <main>
          <Hero booking={booking} />
          <Intro text={text} />
          <Residences priceLabel={priceLabel} text={text} />
          <Gallery
            photos={galleryData}
            language={language}
            text={text}
            galleryIndex={galleryIndex}
            setGalleryIndex={setGalleryIndex}
          />
          <Experiences restaurants={restaurantsData} language={language} text={text} />
          <Discover destinations={attractionsData} language={language} text={text} />
          <Testimonials language={language} text={text} />
          <Contact language={language} text={text} />
        </main>
        <Footer language={language} text={text} />
      </div>
    </MotionProvider>
  )
}
