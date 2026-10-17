import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export interface Booking {
  id: string
  created_at: string
  guest_name: string
  guest_email: string // <-- guest_phone-ის ნაცვლად
  date_range: string
  status: 'pending' | 'confirmed' | 'cancelled'
  total_price: number
}

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback
}

function parseBooking(value: unknown): Booking | null {
  if (typeof value !== 'object' || value === null) return null

  const booking = value as Record<string, unknown>
  if (
    typeof booking.id !== 'string' ||
    typeof booking.created_at !== 'string' ||
    typeof booking.guest_name !== 'string' ||
    typeof booking.guest_email !== 'string' || // <-- guest_phone-ის ნაცვლად
    typeof booking.date_range !== 'string' ||
    (booking.status !== 'pending' && booking.status !== 'confirmed' && booking.status !== 'cancelled')
  ) {
    return null
  }

  const totalPrice = typeof booking.total_price === 'number'
    ? booking.total_price
    : typeof booking.total_price === 'string'
      ? Number(booking.total_price)
      : NaN
  if (!Number.isFinite(totalPrice)) return null

  return {
    id: booking.id,
    created_at: booking.created_at,
    guest_name: booking.guest_name,
    guest_email: booking.guest_email, // <-- guest_phone-ის ნაცვლად
    date_range: booking.date_range,
    status: booking.status,
    total_price: totalPrice,
  }
}

async function loadBookings(): Promise<Booking[]> {
  const { data, error: fetchError } = await supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false })

  if (fetchError) throw fetchError
  const parsedBookings = (data ?? []).map(parseBooking)
  if (parsedBookings.some((booking) => booking === null)) {
    throw new Error('Received invalid booking data from the database.')
  }
  return parsedBookings.filter((booking): booking is Booking => booking !== null)
}

export function useAdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBookings = useCallback(async () => {
    setLoading(true)
    try {
      const nextBookings = await loadBookings()
      setBookings(nextBookings)
      setError(null)
    } catch (failure: unknown) {
      const message = getErrorMessage(failure, 'Failed to fetch bookings')
      console.error('Error fetching bookings:', message)
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let active = true

    const loadInitialBookings = async () => {
      try {
        const initialBookings = await loadBookings()
        if (active) {
          setBookings(initialBookings)
          setError(null)
        }
      } catch (failure: unknown) {
        const message = getErrorMessage(failure, 'Failed to fetch bookings')
        console.error('Error fetching bookings:', message)
        if (active) setError(message)
      } finally {
        if (active) setLoading(false)
      }
    }

    void loadInitialBookings()

    const channel = supabase
      .channel('admin-bookings-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookings' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const booking = parseBooking(payload.new)
            if (!booking) {
              setError('Received invalid booking data from Realtime.')
              return
            }
            setBookings((previous) => [
              booking,
              ...previous.filter((current) => current.id !== booking.id),
            ])
          } else if (payload.eventType === 'UPDATE') {
            const booking = parseBooking(payload.new)
            if (!booking) {
              setError('Received invalid booking data from Realtime.')
              return
            }
            setBookings((previous) =>
              previous.map((current) => current.id === booking.id ? booking : current),
            )
          } else if (payload.eventType === 'DELETE') {
            const deletedId = typeof payload.old.id === 'string' ? payload.old.id : null
            if (deletedId) {
              setBookings((previous) => previous.filter((booking) => booking.id !== deletedId))
            }
          }
        },
      )
      .subscribe()

    return () => {
      active = false
      void supabase.removeChannel(channel)
    }
  }, [])

  const updateStatus = async (id: string, newStatus: Booking['status']) => {
    const previousBookings = [...bookings]

    setBookings((previous) =>
      previous.map((booking) => (booking.id === id ? { ...booking, status: newStatus } : booking)),
    )

    try {
      const { error: updateError } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', id)

      if (updateError) throw updateError
    } catch (failure: unknown) {
      const message = getErrorMessage(failure, 'Failed to update booking status.')
      console.error('Error updating status:', message)
      setBookings(previousBookings)
      alert('სტატუსის განახლება ვერ მოხერხდა')
    }
  }

  const deleteBooking = async (id: string) => {
    if (!confirm('ნამდვილად გსურთ ჯავშნის წაშლა?')) return

    const previousBookings = [...bookings]
    setBookings((previous) => previous.filter((booking) => booking.id !== id))

    try {
      const { error: deleteError } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError
    } catch (failure: unknown) {
      const message = getErrorMessage(failure, 'Failed to delete booking.')
      console.error('Error deleting booking:', message)
      setBookings(previousBookings)
      alert('ჯავშნის წაშლა ვერ მოხერხდა')
    }
  }

  return {
    bookings,
    loading,
    error,
    refetch: fetchBookings,
    updateStatus,
    deleteBooking,
  }
}