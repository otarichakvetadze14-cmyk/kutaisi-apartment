'use client'

import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { DEFAULT_CURRENCY } from '@/lib/currency'

function readPrice(value: unknown): number | null {
  if (typeof value !== 'object' || value === null || !('price_per_night' in value)) {
    return null
  }

  const rawPrice = value.price_per_night
  const price = typeof rawPrice === 'number'
    ? rawPrice
    : typeof rawPrice === 'string'
      ? Number(rawPrice)
      : NaN

  return Number.isFinite(price) && price >= 0 ? price : null
}

export function useApartmentPrice() {
  const [pricePerNight, setPricePerNight] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const updatePrice = useCallback(async (price: number) => {
    setError(null)

    try {
      const { data, error: updateError } = await supabase
        .from('apartment_settings')
        .update({ price_per_night: price })
        .eq('id', 1)
        .select('id, price_per_night')
        .single()

      if (updateError) throw updateError

      const savedPrice = readPrice(data)
      if (savedPrice === null) {
        throw new Error('Saved apartment price is missing or invalid.')
      }

      setPricePerNight(savedPrice)
      return true
    } catch (updateFailure) {
      const message = updateFailure instanceof Error
        ? updateFailure.message
        : 'Unable to update the apartment price.'
      console.error('Error updating apartment price:', message)
      setError(message)
      return false
    }
  }, [])

  useEffect(() => {
    let active = true

    const fetchPrice = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('apartment_settings')
          .select('id, price_per_night')
          .eq('id', 1)
          .single()

        if (fetchError) throw fetchError

        const currentPrice = readPrice(data)
        if (currentPrice === null) {
          throw new Error('Apartment price is missing or invalid.')
        }

        if (active) {
          setPricePerNight(currentPrice)
          setError(null)
        }
      } catch (fetchFailure) {
        const message = fetchFailure instanceof Error
          ? fetchFailure.message
          : 'Unable to load the apartment price.'
        console.error('Error fetching apartment price:', message)
        if (active) setError(message)
      } finally {
        if (active) setLoading(false)
      }
    }

    void fetchPrice()

    const channel = supabase
      .channel('apartment-price-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'apartment_settings',
          filter: 'id=eq.1',
        },
        (payload) => {
          if (payload.eventType === 'DELETE') {
            setError('Apartment settings row (id = 1) was deleted.')
            setPricePerNight(null)
            return
          }

          const updatedPrice = readPrice(payload.new)
          if (updatedPrice === null) {
            setError('Realtime apartment price is missing or invalid.')
            return
          }

          setPricePerNight(updatedPrice)
          setError(null)
        },
      )
      .subscribe((status, subscriptionError) => {
        if (!active) return

        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
          const message = subscriptionError?.message ?? `Apartment price realtime subscription ${status.toLowerCase()}.`
          console.error('Apartment price realtime subscription error:', message)
          setError(message)
        }
      })

    return () => {
      active = false
      void supabase.removeChannel(channel)
    }
  }, [])

  return { pricePerNight, currency: DEFAULT_CURRENCY, loading, error, updatePrice }
}
