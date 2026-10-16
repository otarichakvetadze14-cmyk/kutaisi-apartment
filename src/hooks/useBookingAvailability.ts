'use client'

import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import {
  hasBookingOverlap,
  parseBookingDateRange,
  type BookingDateRange,
} from '@/lib/bookingAvailability'

interface ActiveBooking {
  id: string
  date_range: string
  status: string
}

function toDateRanges(bookings: readonly ActiveBooking[]): BookingDateRange[] {
  return bookings.map((booking) => {
    const range = parseBookingDateRange(booking.date_range)
    if (!range) {
      throw new Error(`Booking ${booking.id} has an invalid date range.`)
    }
    return range
  })
}

export function useBookingAvailability() {
  const [bookings, setBookings] = useState<ActiveBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const checkAvailability = useCallback(async (checkIn: string, checkOut: string) => {
    try {
      const { data, error: fetchError } = await supabase
        .from('bookings')
        .select('id, date_range, status')
        .neq('status', 'cancelled')

      if (fetchError) throw fetchError

      const activeBookings = (data ?? []) as ActiveBooking[]
      const dateRanges = toDateRanges(activeBookings)
      setBookings(activeBookings)
      setError(null)
      return !hasBookingOverlap(checkIn, checkOut, dateRanges)
    } catch (failure) {
      const message = failure instanceof Error
        ? failure.message
        : 'Unable to verify booking availability.'
      console.error('Error verifying booking availability:', message)
      setError(message)
      return null
    }
  }, [])

  useEffect(() => {
    let active = true

    const loadInitialBookings = async () => {
      setLoading(true)
      try {
        const { data, error: fetchError } = await supabase
          .from('bookings')
          .select('id, date_range, status')
          .neq('status', 'cancelled')

        if (fetchError) throw fetchError

        const activeBookings = (data ?? []) as ActiveBooking[]
        toDateRanges(activeBookings)
        if (active) {
          setBookings(activeBookings)
          setError(null)
        }
      } catch (failure) {
        const message = failure instanceof Error
          ? failure.message
          : 'Unable to load existing bookings.'
        console.error('Error loading booking availability:', message)
        if (active) setError(message)
      } finally {
        if (active) setLoading(false)
      }
    }

    void loadInitialBookings()

    const channel = supabase
      .channel('booking-availability-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookings' },
        (payload) => {
          if (payload.eventType === 'DELETE') {
            const deletedId = String(payload.old.id)
            setBookings((current) => current.filter((booking) => booking.id !== deletedId))
            return
          }

          const updated = payload.new as ActiveBooking
          if (payload.eventType === 'INSERT') {
            if (updated.status !== 'cancelled') {
              try {
                toDateRanges([updated])
                setBookings((current) => [
                  updated,
                  ...current.filter((booking) => booking.id !== updated.id),
                ])
                setError(null)
              } catch (failure) {
                setError(failure instanceof Error ? failure.message : 'Invalid booking date range.')
              }
            }
            return
          }

          if (updated.status !== 'cancelled') {
            try {
              toDateRanges([updated])
            } catch (failure) {
              setError(failure instanceof Error ? failure.message : 'Invalid booking date range.')
              setBookings((current) => current.filter((booking) => booking.id !== updated.id))
              return
            }
          }
          setError(null)
          setBookings((current) => {
            const remaining = current.filter((booking) => booking.id !== updated.id)
            return updated.status === 'cancelled' ? remaining : [updated, ...remaining]
          })
        },
      )
      .subscribe((status, subscriptionError) => {
        if (!active) return
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
          const message = subscriptionError?.message
            ?? `Booking availability subscription ${status.toLowerCase()}.`
          console.error('Booking availability subscription error:', message)
          setError(message)
        }
      })

    return () => {
      active = false
      void supabase.removeChannel(channel)
    }
  }, [])

  const dateRanges = toDateRanges(bookings)

  return {
    bookings: dateRanges,
    loading,
    error,
    checkAvailability,
  }
}
