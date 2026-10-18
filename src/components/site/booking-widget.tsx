'use client'

import { Search, Users } from 'lucide-react'
import type { FormEventHandler } from 'react'
import DatePicker from '@/components/DatePicker'
import { formatCurrency } from '@/lib/currency'
import type { BookingDateRange } from '@/lib/bookingAvailability'

export interface BookingWidgetProps {
  text: Record<string, string>
  language: 'ge' | 'en'
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
}

export function BookingWidget({
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
}: BookingWidgetProps) {
  const isGe = language === 'ge'
  const bookingDisabled =
    loading ||
    priceLoading ||
    pricePerNight === null ||
    priceError !== null ||
    availabilityLoading ||
    availabilityError !== null

  return (
    <div id="reserve" className="relative scroll-mb-6">
      <form
        onSubmit={onBooking}
        className="grid grid-cols-2 border border-ivory/15 bg-ink/55 backdrop-blur-xl md:grid-cols-[1.4fr_1fr_1fr_0.7fr_auto]"
      >
        <div className="booking-field border-b border-r border-ivory/10 md:border-b-0">
          <label htmlFor="booking-guest-name">{text.guestName}</label>
          <input
            id="booking-guest-name"
            type="text"
            autoComplete="name"
            placeholder={text.guestNamePlaceholder}
            value={guestName}
            onChange={(event) => setGuestName(event.target.value)}
            required
          />
          <label htmlFor="booking-guest-email" className="sr-only">
            {isGe ? 'ელფოსტა' : 'Email address'}
          </label>
          <input
            id="booking-guest-email"
            type="email"
            autoComplete="email"
            placeholder={isGe ? 'ელფოსტა' : 'Email address'}
            value={guestEmail}
            onChange={(event) => setGuestEmail(event.target.value)}
            required
          />
        </div>

        <div className="booking-field border-b border-ivory/10 md:border-b-0">
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

        <div className="booking-field border-r border-ivory/10 md:border-r">
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

        <div className="booking-field">
          <label htmlFor="guest-count">
            <Users size={13} aria-hidden="true" />
            {isGe ? 'სტუმრები' : 'Guests'}
          </label>
          <select id="guest-count" value={guests} onChange={(event) => setGuests(Number(event.target.value))}>
            {[1, 2, 3, 4].map((count) => (
              <option key={count} value={count}>
                {count} {isGe ? 'სტუმარი' : count === 1 ? 'guest' : 'guests'}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" disabled={bookingDisabled} className="booking-submit group col-span-2 md:col-span-1">
          <span>{loading ? text.loading : isGe ? 'დაჯავშნა' : 'Book now'}</span>
          <Search size={15} aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
        </button>
      </form>

      <div aria-live="polite" className="mt-4 min-h-9 space-y-1 text-xs">
        {priceLoading ? (
          <p className="text-sand">{text.priceLoading}</p>
        ) : priceError || pricePerNight === null ? (
          <p className="text-rose-300">{text.priceUnavailable}</p>
        ) : (
          <p className="text-sand">
            {isGe ? 'ფასი:' : 'Rate:'} {formatCurrency(pricePerNight, isGe ? 'ka-GE' : 'en-US', currency)} /{' '}
            {isGe ? 'ღამე' : 'night'}
            {nights > 0 &&
              ` · ${formatCurrency(totalPrice, isGe ? 'ka-GE' : 'en-US', currency)} ${
                isGe ? `${nights} ღამეზე` : `for ${nights} ${nights === 1 ? 'night' : 'nights'}`
              }`}
          </p>
        )}
        {availabilityError && <p className="text-rose-300">{text.availabilityCheckFailed}</p>}
        {successMessage && <p className="text-emerald-300">{successMessage}</p>}
        {errorMessage && <p className="text-rose-300">{errorMessage}</p>}
      </div>
    </div>
  )
}
