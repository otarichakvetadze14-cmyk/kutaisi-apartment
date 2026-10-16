'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { useAdminBookings, type Booking } from '@/hooks/useAdminBookings'
import { useApartmentPrice } from '@/hooks/useApartmentPrice'
import { formatCurrency } from '@/lib/currency'
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  Trash2, 
  Calendar, 
  DollarSign, 
  Users, 
  RefreshCw,
  Phone,
  Moon
} from 'lucide-react'

export default function AdminDashboard() {
  const [isMounted, setIsMounted] = useState(false)
  const {
    bookings,
    loading,
    error,
    refetch: fetchBookings,
    updateStatus,
    deleteBooking,
  } = useAdminBookings()
  const {
    pricePerNight,
    currency,
    loading: priceLoading,
    error: priceError,
    updatePrice,
  } = useApartmentPrice()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [priceInput, setPriceInput] = useState<string | null>(null)
  const [priceSaving, setPriceSaving] = useState(false)
  const [priceFormError, setPriceFormError] = useState<string | null>(null)
  const [priceSaved, setPriceSaved] = useState(false)

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setIsMounted(true))
    return () => window.cancelAnimationFrame(frame)
  }, [])

  const handleSavePrice = async () => {
    const inputValue = priceInput ?? (pricePerNight === null ? '' : String(pricePerNight))
    const nextPrice = Number(inputValue)
    setPriceSaved(false)
    setPriceFormError(null)

    if (!inputValue.trim() || !Number.isFinite(nextPrice) || nextPrice <= 0) {
      setPriceFormError('გთხოვთ შეიყვანოთ ნულზე მეტი სწორი ფასი.')
      return
    }

    setPriceSaving(true)
    try {
      const saved = await updatePrice(nextPrice)
      if (saved) {
        setPriceSaved(true)
        setPriceInput(null)
      }
    } finally {
      setPriceSaving(false)
    }
  }

  const parseDateRange = (rangeStr: string) => {
    if (!rangeStr) return { start: 'N/A', end: 'N/A', nights: 0 }
    const cleaned = rangeStr.replace(/[\[\]\(\)]/g, '')
    const [startStr, endStr] = cleaned.split(',')

    if (!startStr || !endStr) return { start: 'N/A', end: 'N/A', nights: 0 }

    const startDate = new Date(startStr.trim())
    const endDate = new Date(endStr.trim())

    const diffTime = endDate.getTime() - startDate.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return {
      start: startStr.trim(),
      end: endStr.trim(),
      nights: diffDays > 0 ? diffDays : 0,
    }
  }

  // სტატუსის შეცვლა უსაფრთხო და აუცილებელი რეაქციით ბაზიდან
  const handleStatusChange = async (id: string, newStatus: Booking['status']) => {
    setActionLoading(id)
    try {
      await updateStatus(id, newStatus)
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async (id: string) => {
    setActionLoading(id)
    try {
      await deleteBooking(id)
    } finally {
      setActionLoading(null)
    }
  }

  const stats = useMemo(() => {
    const total = bookings.length
    const confirmed = bookings.filter((b) => b.status === 'confirmed')
    const pending = bookings.filter((b) => b.status === 'pending').length
    const revenue = confirmed.reduce((acc, b) => acc + Number(b.total_price || 0), 0)

    return { total, pending, revenue }
  }, [bookings])

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchesSearch =
        b.guest_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.guest_phone.includes(searchQuery)
      const matchesStatus = statusFilter === 'all' || b.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [bookings, searchQuery, statusFilter])

  return (
    <div className="min-h-screen bg-[#f5f5f5] p-6 font-sans text-[#262626]">
      <div className="mx-auto max-w-7xl space-y-6">
        
        <div className="-mx-6 -mt-6 flex flex-col items-start justify-between gap-4 border-b border-[#e7e7e7] border-t-4 border-t-[#003b95] bg-white px-6 py-5 shadow-sm sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#262626]">
              Kutaisi Residence • Admin
            </h1>
            <p className="mt-1 text-sm text-[#6b6b6b]">
              ჯავშნების მართვა და რეალურ დროში მონიტორინგი
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="min-h-[44px] rounded-md border border-[#006ce4] bg-white px-4 py-2 text-sm font-medium text-[#006ce4] transition-colors duration-150 hover:bg-[#f0f6ff]"
            >
              ← საიტზე დაბრუნება
            </Link>
            <button
              onClick={fetchBookings}
              className="flex min-h-[44px] items-center gap-2 rounded-md border border-[#006ce4] bg-white px-4 py-2 text-sm font-medium text-[#006ce4] transition-colors duration-150 hover:bg-[#f0f6ff]"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#006ce4] ${loading ? 'animate-spin' : ''}`} />
              <span>განახლება</span>
            </button>
          </div>
        </div>

        <section
          aria-labelledby="price-settings-title"
          className="rounded-lg border border-[#e7e7e7] border-l-4 border-l-[#006ce4] bg-white p-6 shadow-sm"
        >
          <div className="mb-4 flex items-center gap-3">
            <DollarSign className="h-5 w-5 text-[#006ce4]" aria-hidden="true" />
            <div>
              <h2 id="price-settings-title" className="text-base font-semibold text-[#262626]">
                1 ღამის ფასის მართვა
              </h2>
              <p className="mt-1 text-sm text-[#6b6b6b]">
                ფასი განახლდება საიტზე Realtime რეჟიმში.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <label className="block w-full max-w-xs">
              <span className="mb-1.5 block text-sm font-medium text-[#262626]">
                მიმდინარე ფასი (GEL / ღამე)
              </span>
              <input
                type="number"
                min="0.01"
                step="0.01"
                inputMode="decimal"
                value={priceInput ?? (pricePerNight === null ? '' : String(pricePerNight))}
                onChange={(event) => {
                  setPriceInput(event.target.value)
                  setPriceSaved(false)
                }}
                placeholder={priceLoading ? 'იტვირთება...' : 'ფასი'}
                disabled={priceLoading || priceSaving}
                className="min-h-[44px] w-full rounded-md border border-[#868686] bg-white px-3 py-2 text-sm text-[#262626] outline-none transition-colors placeholder:text-[#6b6b6b] focus:border-[#006ce4] focus:ring-2 focus:ring-[#006ce4]/30 disabled:bg-[#f5f5f5]"
              />
            </label>
            <button
              type="button"
              onClick={handleSavePrice}
              disabled={priceLoading || priceSaving || pricePerNight === null}
              className="min-h-[44px] rounded-md bg-[#006ce4] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#003b95] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {priceSaving ? 'ინახება...' : 'შენახვა'}
            </button>
          </div>
          {priceError && (
            <p className="mt-3 text-sm text-[#b42318]" role="alert">
              ფასის ჩატვირთვა/განახლება ვერ მოხერხდა: {priceError}
            </p>
          )}
          {priceFormError && (
            <p className="mt-3 text-sm text-[#b42318]" role="alert">{priceFormError}</p>
          )}
          {priceSaved && (
            <p className="mt-3 text-sm text-[#008234]" role="status">
              ფასი წარმატებით შეინახა.
            </p>
          )}
        </section>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-2 rounded-lg border border-[#e7e7e7] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between text-[#6b6b6b]">
              <span className="text-sm text-[#6b6b6b]">სულ ჯავშნები</span>
              <Users className="w-4 h-4 text-[#006ce4]" />
            </div>
            <p className="text-2xl font-bold text-[#262626]">{stats.total}</p>
          </div>

          <div className="space-y-2 rounded-lg border border-[#e7e7e7] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between text-[#6b6b6b]">
              <span className="text-sm text-[#6b6b6b]">მომლოდინე</span>
              <Clock className="w-4 h-4 text-[#006ce4]" />
            </div>
            <p className="text-2xl font-bold text-[#262626]">{stats.pending}</p>
          </div>

          <div className="space-y-2 rounded-lg border border-[#e7e7e7] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between text-[#6b6b6b]">
              <span className="text-sm text-[#6b6b6b]">დადასტურებული შემოსავალი</span>
              <DollarSign className="w-4 h-4 text-[#008234]" />
            </div>
            <p className="text-2xl font-bold text-[#262626]">
              {isMounted ? formatCurrency(stats.revenue, 'ka-GE', currency) : '0.00 ₾'}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#006ce4]" />
            <input
              type="text"
              placeholder="ძებნა სახელით ან ტელეფონით..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="min-h-[44px] w-full rounded-md border border-[#868686] bg-white px-3 py-2 pl-10 text-sm text-[#262626] outline-none transition-colors duration-150 placeholder:text-[#6b6b6b] focus:border-[#006ce4] focus:ring-2 focus:ring-[#006ce4]/30"
            />
          </div>

          <div className="flex w-full items-center gap-2 overflow-x-auto pb-2 md:w-auto md:pb-0">
            {['all', 'pending', 'confirmed', 'cancelled'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`min-h-[44px] rounded-md px-4 py-2 text-sm font-medium transition-colors duration-150 ${
                  statusFilter === st
                    ? 'bg-[#006ce4] text-white hover:bg-[#003b95]'
                    : 'border border-[#006ce4] bg-white text-[#006ce4] hover:bg-[#f0f6ff]'
                }`}
              >
                {st === 'all' ? 'ყველა' : st === 'pending' ? 'მომლოდინე' : st === 'confirmed' ? 'დადასტურებული' : 'გაუქმებული'}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-[#e7e7e7] bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#262626]">
              <thead className="border-b border-[#e7e7e7] bg-[#f5f5f5] text-xs font-bold text-[#6b6b6b]">
                <tr>
                  <th className="px-6 py-3 font-bold">სტუმარი</th>
                  <th className="px-6 py-3 font-bold">ტელეფონი</th>
                  <th className="px-6 py-3 font-bold">თარიღები (ჩასვლა — გასვლა)</th>
                  <th className="px-6 py-3 font-bold">ღამეები</th>
                  <th className="px-6 py-3 font-bold">თანხა</th>
                  <th className="px-6 py-3 font-bold">სტატუსი</th>
                  <th className="px-6 py-3 text-right font-bold">მოქმედება</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e7e7e7]">
                {loading && bookings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-sm text-[#6b6b6b]">
                      მონაცემები იტვირთება...
                    </td>
                  </tr>
                ) : filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-sm text-[#6b6b6b]">
                      {error || 'ჯავშნები ვერ მოიძებნა'}
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((b) => {
                    const { start, end, nights } = parseDateRange(b.date_range)
                    const isProcessing = actionLoading === b.id

                    return (
                      <tr key={b.id} className={`bg-white transition-colors duration-150 hover:bg-[#f0f6ff] ${isProcessing ? 'pointer-events-none opacity-50' : ''}`}>
                        <td className="px-6 py-4 font-semibold text-[#262626]">{b.guest_name}</td>
                        <td className="px-6 py-4 text-sm text-[#262626]">
                          <a href={`tel:${b.guest_phone}`} className="flex min-h-[44px] items-center gap-1.5 text-[#006ce4] transition-colors duration-150 hover:underline">
                            <Phone className="w-3 h-3 text-[#006ce4]" />
                            {b.guest_phone}
                          </a>
                        </td>
                        <td className="px-6 py-4 text-sm text-[#262626]">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-[#006ce4]" />
                            <span>{start}</span>
                            <span className="text-neutral-600">—</span>
                            <span>{end}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="flex w-fit items-center gap-1 rounded-md bg-[#f5f5f5] px-2 py-1 text-xs text-[#262626]">
                          <Moon className="w-3 h-3 text-[#006ce4]" />
                            {nights} ღამე
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-[#262626]">{formatCurrency(Number(b.total_price), 'ka-GE', currency)}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-bold ${
                              b.status === 'confirmed'
                                ? 'bg-[#008234] text-white'
                                : b.status === 'cancelled'
                                ? 'bg-[#d4111e] text-white'
                                : 'bg-[#febb02] text-[#262626]'
                            }`}
                          >
                            {b.status === 'confirmed' && <CheckCircle2 className="w-3 h-3" />}
                            {b.status === 'cancelled' && <XCircle className="w-3 h-3" />}
                            {b.status === 'pending' && <Clock className="w-3 h-3" />}
                            {b.status === 'confirmed' ? 'დადასტურებული' : b.status === 'cancelled' ? 'გაუქმებული' : 'მომლოდინე'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {b.status !== 'confirmed' && (
                              <button
                                onClick={() => handleStatusChange(b.id, 'confirmed')}
                                title="დადასტურება"
                                className="min-h-[44px] min-w-[44px] rounded-md border border-[#e7e7e7] bg-white p-1.5 text-[#6b6b6b] transition-colors duration-150 hover:bg-[#f0f6ff] hover:text-[#006ce4]"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                            )}

                            {b.status !== 'cancelled' && (
                              <button
                                onClick={() => handleStatusChange(b.id, 'cancelled')}
                                title="გაუქმება"
                                className="min-h-[44px] min-w-[44px] rounded-md border border-[#e7e7e7] bg-white p-1.5 text-[#6b6b6b] transition-colors duration-150 hover:bg-[#f0f6ff] hover:text-[#006ce4]"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            )}

                            <button
                              onClick={() => handleDelete(b.id)}
                              title="წაშლა"
                              className="min-h-[44px] min-w-[44px] rounded-md border border-[#e7e7e7] bg-white p-1.5 text-[#6b6b6b] transition-colors duration-150 hover:bg-[#fff0f0] hover:text-[#d4111e]"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}