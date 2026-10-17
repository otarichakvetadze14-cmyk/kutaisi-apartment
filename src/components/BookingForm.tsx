'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { formatCurrency } from '@/lib/currency'
import { useApartmentPrice } from '@/hooks/useApartmentPrice'
import DatePicker from '@/components/DatePicker'
import { useBookingAvailability } from '@/hooks/useBookingAvailability'

export function BookingForm() {
  const {
    pricePerNight,
    currency,
    loading: priceLoading,
    error: priceError,
  } = useApartmentPrice()
  const [guestName, setGuestName] = useState('')
  const [email, setEmail] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const {
    bookings: availabilityBookings,
    loading: availabilityLoading,
    error: availabilityError,
    checkAvailability,
  } = useBookingAvailability()

  const calculateNights = () => {
    if (!startDate || !endDate) return 0
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = end.getTime() - start.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  const nights = calculateNights()
  const totalPrice = nights * (pricePerNight ?? 0)

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccessMessage(null)
    setErrorMessage(null)

    if (!guestName || !email || !startDate || !endDate) {
      setErrorMessage('გთხოვთ შეავსოთ ყველა ველი!')
      return
    }

    if (nights <= 0) {
      setErrorMessage('გასვლის თარიღი უნდა აღემატებოდეს ჩასვლის თარიღს!')
      return
    }

    if (pricePerNight === null || priceError) {
      setErrorMessage('ფასის ჩატვირთვა ვერ მოხერხდა. სცადეთ მოგვიანებით.')
      return
    }

    try {
      setLoading(true)
      if (availabilityError) {
        setErrorMessage('თავისუფალი თარიღების შემოწმება ვერ მოხერხდა. სცადეთ მოგვიანებით.')
        return
      }

      const isAvailable = await checkAvailability(startDate, endDate)
      if (isAvailable === null) {
        setErrorMessage('თავისუფალი თარიღების შემოწმება ვერ მოხერხდა. სცადეთ მოგვიანებით.')
        return
      }
      if (!isAvailable) {
        setErrorMessage('არჩეული თარიღები უკვე დაკავებულია!')
        return
      }

      const dateRange = `[${startDate},${endDate}]`

      const { error } = await supabase.from('bookings').insert([
        {
          guest_name: guestName,
          guest_email: email, // <-- ტელეფონის ნაცვლად ვწერთ guest_email-ს
          date_range: dateRange,
          total_price: totalPrice,
          status: 'pending',
        },
      ])

      if (error) throw error

      setSuccessMessage('ჯავშანი წარმატებით გაიგზავნა! მენეჯერი მალე დაგიკავშირდებათ.')
      setGuestName('')
      setEmail('')
      setStartDate('')
      setEndDate('')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'სერვერთან კავშირის ხარვეზი'
      setErrorMessage('შეცდომა ჯავშნის გაფორმებისას: ' + message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-xl shadow-neutral-100 sticky top-28 w-full max-w-lg mx-auto box-border">
      <div className="flex justify-between items-baseline mb-6 pb-6 border-b border-neutral-100">
        <div>
          <span className="text-3xl font-serif font-medium text-neutral-900">
            {pricePerNight === null ? '—' : formatCurrency(pricePerNight, 'ka-GE', currency)}
          </span>
          <span className="text-neutral-700 text-sm font-light"> / ღამე</span>
        </div>
        <span className="text-xs uppercase font-semibold tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
          თავისუფალია
        </span>
      </div>

      {priceError && (
        <div role="alert" className="mb-6 rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-800">
          ფასის ჩატვირთვა ვერ მოხერხდა.
        </div>
      )}
      {availabilityError && (
        <div role="alert" className="mb-6 rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-800">
          თავისუფალი თარიღების შემოწმება ვერ მოხერხდა.
        </div>
      )}

      {successMessage && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-2xl text-sm font-light">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-800 rounded-2xl text-sm font-light">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleBooking} className="space-y-4">
        {/* სრული სახელი */}
        <div className="w-full">
          <label className="block text-xs uppercase font-semibold tracking-wider text-neutral-700 mb-2">სახელი</label>
          <input
            type="text"
            required
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder="მაგ: გიორგი ბერიძე"
            className="w-full min-h-[48px] px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-neutral-900 text-sm transition box-border"
          />
        </div>

        {/* ელფოსტა */}
        <div className="w-full">
          <label className="block text-xs uppercase font-semibold tracking-wider text-neutral-700 mb-2">ელფოსტა</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full min-h-[48px] px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-neutral-900 text-sm transition box-border"
          />
        </div>

        {/* ჩასვლა და გასვლა - თანაბარი სიგანის სექციები */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
          <div className="w-full">
            <label className="block text-xs uppercase font-semibold tracking-wider text-neutral-700 mb-2">ჩასვლა</label>
            <DatePicker
              id="booking-check-in"
              label="ჩასვლა"
              value={startDate}
              otherDate={endDate}
              role="checkin"
              bookings={availabilityBookings}
              disabled={availabilityLoading || availabilityError !== null}
              onChange={(date) => {
                setStartDate(date)
                if (endDate && date >= endDate) setEndDate('')
              }}
              triggerClassName="flex min-h-[48px] w-full items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-left text-sm transition hover:border-neutral-400 disabled:opacity-50 box-border"
            />
          </div>
          <div className="w-full">
            <label className="block text-xs uppercase font-semibold tracking-wider text-neutral-700 mb-2">გასვლა</label>
            <DatePicker
              id="booking-check-out"
              label="გასვლა"
              value={endDate}
              otherDate={startDate}
              role="checkout"
              bookings={availabilityBookings}
              disabled={!startDate || availabilityLoading || availabilityError !== null}
              onChange={setEndDate}
              triggerClassName="flex min-h-[48px] w-full items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-left text-sm transition hover:border-neutral-400 disabled:opacity-50 box-border"
            />
          </div>
        </div>

        {nights > 0 && (
          <div className="py-4 px-5 bg-neutral-50 rounded-2xl space-y-2 border border-neutral-100">
            <div className="flex justify-between text-sm text-neutral-700 font-light">
              <span>ხანგრძლივობა:</span>
              <span>{nights} ღამე</span>
            </div>
            <div className="flex justify-between text-base font-serif font-medium text-neutral-900 pt-2 border-t border-neutral-200/60">
              <span>ჯამური თანხა:</span>
              <span>{formatCurrency(totalPrice, 'ka-GE', currency)}</span>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || priceLoading || pricePerNight === null || priceError !== null || availabilityLoading || availabilityError !== null}
          className="min-h-[48px] w-full py-4 bg-neutral-900 text-white font-medium text-sm rounded-xl hover:bg-neutral-800 transition shadow-sm disabled:opacity-50 tracking-wide mt-2"
        >
          {loading ? 'იგზავნება...' : 'ჯავშნის მოთხოვნა'}
        </button>
      </form>
    </div>
  )
}