'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useAdminBookings, type Booking } from '@/hooks/useAdminBookings'
import { useApartmentPrice } from '@/hooks/useApartmentPrice'
import { formatCurrency } from '@/lib/currency'
import {
  Bell,
  Building2,
  Calendar,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign,
  ExternalLink,
  LayoutDashboard,
  Mail,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  RefreshCw,
  Search,
  Settings2,
  TrendingUp,
  Trash2,
  Users,
  X,
  XCircle,
} from 'lucide-react'

const PAGE_SIZE = 8

export default function AdminDashboard() {
  const [isMounted, setIsMounted] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
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
    const confirmed = bookings.filter((booking) => booking.status === 'confirmed')
    const pending = bookings.filter((booking) => booking.status === 'pending').length
    const revenue = confirmed.reduce((acc, booking) => acc + Number(booking.total_price || 0), 0)
    return { total, pending, revenue }
  }, [bookings])

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesSearch =
        booking.guest_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (booking.guest_email && booking.guest_email.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesStatus = statusFilter === 'all' || booking.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [bookings, searchQuery, statusFilter])

  const pageCount = Math.max(1, Math.ceil(filteredBookings.length / PAGE_SIZE))
  const visiblePage = Math.min(currentPage, pageCount)
  const currentBookings = filteredBookings.slice((visiblePage - 1) * PAGE_SIZE, visiblePage * PAGE_SIZE)

  return (
    <div className="admin-dashboard min-h-screen bg-[#090d16] font-sans text-slate-100 selection:bg-indigo-500/30">
      <div className="flex min-h-screen">
        <aside
          className={`sticky top-0 flex h-screen shrink-0 flex-col border-r border-white/[0.07] bg-[#0b1019] transition-[width] duration-300 ${
            sidebarCollapsed ? 'w-[60px] md:w-[76px]' : 'w-[240px] max-md:w-[60px]'
          }`}
        >
          <div className="flex h-[76px] items-center gap-3 border-b border-white/[0.07] px-5 max-md:justify-center max-md:px-0">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-white shadow-lg shadow-indigo-500/25">
              <Building2 className="h-[18px] w-[18px]" />
            </div>
            <div className={sidebarCollapsed ? 'hidden' : 'max-md:hidden'}>
              <p className="truncate text-sm font-semibold tracking-tight text-white">Kutaisi Residence</p>
              <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.16em] text-slate-500">Property console</p>
            </div>
          </div>
          <div className={`px-5 pb-2 pt-8 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600 ${sidebarCollapsed ? 'hidden' : 'max-md:hidden'}`}>
            Workspace
          </div>
          <nav aria-label="მთავარი ნავიგაცია" className="space-y-1 px-3">
            <a
              href="#dashboard"
              title={sidebarCollapsed ? 'მიმოხილვა' : undefined}
              className="relative flex min-h-11 items-center gap-3 rounded-lg border border-indigo-400/[0.16] bg-gradient-to-r from-indigo-500/[0.16] to-transparent px-3 text-sm font-medium text-white transition-colors hover:from-indigo-500/[0.22] max-md:justify-center max-md:px-0"
            >
              <span className="absolute bottom-3 left-0 top-3 w-[2px] rounded-r-full bg-gradient-to-b from-indigo-400 to-cyan-400 max-md:hidden" />
              <LayoutDashboard className="h-[18px] w-[18px] shrink-0" />
              <span className={sidebarCollapsed ? 'hidden' : 'max-md:hidden'}>მიმოხილვა</span>
            </a>
            <a
              href="#bookings"
              title={sidebarCollapsed ? 'ჯავშნები' : undefined}
              className="flex min-h-11 items-center gap-3 rounded-lg border border-transparent px-3 text-sm text-slate-400 transition-colors hover:border-white/[0.06] hover:bg-white/[0.04] hover:text-slate-100 max-md:justify-center max-md:px-0"
            >
              <CalendarDays className="h-[18px] w-[18px] shrink-0" />
              <span className={sidebarCollapsed ? 'hidden' : 'max-md:hidden'}>ჯავშნები</span>
              {!sidebarCollapsed && (
                <span className="ml-auto rounded-md bg-white/[0.06] px-1.5 py-0.5 text-[10px] tabular-nums text-slate-400 max-md:hidden">
                  {stats.total}
                </span>
              )}
            </a>
            <a
              href="#price-settings"
              title={sidebarCollapsed ? 'ფასის მართვა' : undefined}
              className="flex min-h-11 items-center gap-3 rounded-lg border border-transparent px-3 text-sm text-slate-400 transition-colors hover:border-white/[0.06] hover:bg-white/[0.04] hover:text-slate-100 max-md:justify-center max-md:px-0"
            >
              <Settings2 className="h-[18px] w-[18px] shrink-0" />
              <span className={sidebarCollapsed ? 'hidden' : 'max-md:hidden'}>ფასის მართვა</span>
            </a>
          </nav>
          <div className="mt-auto space-y-3 p-3">
            <Link
              href="/"
              title={sidebarCollapsed ? 'საიტზე დაბრუნება' : undefined}
              className="flex min-h-11 items-center gap-3 rounded-lg border border-white/[0.07] px-3 text-sm text-slate-400 transition-colors hover:border-white/[0.14] hover:bg-white/[0.04] hover:text-white max-md:justify-center max-md:px-0"
            >
              <ExternalLink className="h-[17px] w-[17px] shrink-0" />
              <span className={sidebarCollapsed ? 'hidden' : 'max-md:hidden'}>საიტზე დაბრუნება</span>
            </Link>
            <button
              type="button"
              onClick={() => setSidebarCollapsed((collapsed) => !collapsed)}
              aria-label={sidebarCollapsed ? 'გვერდითი მენიუს გაშლა' : 'გვერდითი მენიუს შეკუმშვა'}
              className="flex min-h-10 w-full items-center gap-3 rounded-lg px-3 text-sm text-slate-500 transition-colors hover:bg-white/[0.04] hover:text-slate-200 max-md:justify-center max-md:px-0"
            >
              {sidebarCollapsed ? <PanelLeftOpen className="h-[18px] w-[18px]" /> : <PanelLeftClose className="h-[18px] w-[18px]" />}
              <span className={sidebarCollapsed ? 'hidden' : 'max-md:hidden'}>მენიუს შეკუმშვა</span>
            </button>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between gap-3 border-b border-white/[0.07] bg-[#090d16]/90 px-3 backdrop-blur-xl sm:gap-4 sm:px-8">
            <div className="relative w-full max-w-md">
              <Search aria-hidden="true" className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="search"
                aria-label="ჯავშნების ძებნა"
                placeholder="ძებნა სახელით ან ელფოსტით..."
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value)
                  setCurrentPage(1)
                }}
                className="h-10 w-full rounded-xl border border-white/[0.08] bg-white/[0.035] pl-10 pr-4 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 hover:border-white/[0.13] focus:border-indigo-400/40 focus:bg-white/[0.05] focus:ring-2 focus:ring-indigo-500/15"
              />
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setNotificationsOpen((open) => !open)}
                  aria-label="შეტყობინებები"
                  aria-expanded={notificationsOpen}
                  className="relative grid h-10 w-10 place-items-center rounded-xl border border-white/[0.07] text-slate-400 transition hover:border-white/[0.14] hover:bg-white/[0.04] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50"
                >
                  <Bell className="h-[18px] w-[18px]" />
                  {stats.pending > 0 && <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-[#090d16] bg-amber-300" />}
                </button>
                {notificationsOpen && (
                  <div className="absolute right-0 top-12 z-30 w-[min(320px,calc(100vw-6rem))] rounded-2xl border border-white/[0.1] bg-[#151922] p-4 shadow-2xl shadow-black/40">
                    <div className="flex items-center justify-between">
                      <h2 className="text-sm font-semibold text-white">შეტყობინებები</h2>
                      <button
                        type="button"
                        onClick={() => setNotificationsOpen(false)}
                        aria-label="შეტყობინებების დახურვა"
                        className="grid h-7 w-7 place-items-center rounded-lg text-slate-500 transition hover:bg-white/[0.06] hover:text-white"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-3 flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] p-3">
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-amber-300" />
                      <p className="text-xs leading-5 text-slate-300">
                        {stats.pending > 0
                          ? `${stats.pending} ჯავშანი ელოდება დადასტურებას.`
                          : 'ახალი შეტყობინებები არ არის.'}
                      </p>
                    </div>
                    <a
                      href="#bookings"
                      onClick={() => setNotificationsOpen(false)}
                      className="mt-3 block text-xs font-medium text-cyan-200 transition hover:text-cyan-100"
                    >
                      ჯავშნების ნახვა <span aria-hidden="true">→</span>
                    </a>
                  </div>
                )}
              </div>
              <div className="hidden h-8 w-px bg-white/[0.08] sm:block" />
              <div className="flex items-center gap-2.5">
                <div className="grid h-9 w-9 place-items-center rounded-full border border-cyan-200/20 bg-gradient-to-br from-cyan-200/20 to-indigo-300/10 text-xs font-semibold text-cyan-100">
                  KR
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs font-medium text-slate-200">Administrator</p>
                  <p className="mt-0.5 text-[10px] text-slate-500">Property manager</p>
                </div>
              </div>
            </div>
          </header>

          <main id="dashboard" className="mx-auto w-full max-w-[1500px] space-y-7 px-3 py-6 sm:px-8 sm:py-10">
            <section className="relative overflow-hidden rounded-2xl border border-indigo-400/[0.12] bg-gradient-to-r from-indigo-500/[0.12] via-fuchsia-500/[0.06] to-transparent p-5 sm:p-6">
              <div className="pointer-events-none absolute -left-10 -top-12 h-40 w-40 rounded-full bg-indigo-500/15 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-16 right-1/3 h-40 w-40 rounded-full bg-fuchsia-500/[0.08] blur-3xl" />
              <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                <div>
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-300/[0.06] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-emerald-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.8)]" />
                    <span>სისტემა აქტიურია</span>
                  </div>
                  <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-[30px]">მიმოხილვა</h1>
                  <p className="mt-1.5 text-sm text-slate-400">მართეთ ჯავშნები და აკონტროლეთ თქვენი ობიექტის შედეგები.</p>
                </div>
                <button
                  type="button"
                  onClick={fetchBookings}
                  className="inline-flex min-h-10 items-center justify-center gap-2 self-start rounded-xl border border-white/[0.09] bg-white/[0.035] px-4 text-xs font-medium text-slate-300 transition hover:border-white/[0.16] hover:bg-white/[0.07] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50 sm:self-auto"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
                  განახლება
                </button>
              </div>
            </section>

            <section aria-label="ძირითადი მაჩვენებლები" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <article className="admin-glow-border admin-fade-in group relative overflow-hidden rounded-2xl border border-white/[0.075] bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-5 transition duration-200 hover:-translate-y-0.5 hover:border-indigo-300/20 hover:shadow-xl hover:shadow-indigo-950/30">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-400/60 to-transparent" />
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-400">სულ ჯავშნები</p>
                  <span className="grid h-9 w-9 place-items-center rounded-xl border border-cyan-300/10 bg-cyan-300/[0.07] text-cyan-200">
                    <Users className="h-[17px] w-[17px]" />
                  </span>
                </div>
                <div className="mt-5 flex items-end justify-between">
                  <p className="text-[32px] font-semibold leading-none tracking-tight text-white tabular-nums">{stats.total}</p>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-cyan-200">
                    <TrendingUp className="h-3.5 w-3.5" /> ყველა დრო
                  </span>
                </div>
              </article>
              <article className="admin-glow-border admin-fade-in group relative overflow-hidden rounded-2xl border border-white/[0.075] bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-5 transition duration-200 hover:-translate-y-0.5 hover:border-amber-300/20 hover:shadow-xl hover:shadow-amber-950/20">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-300/50 to-transparent" />
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-400">მომლოდინე ჯავშნები</p>
                  <span className="grid h-9 w-9 place-items-center rounded-xl border border-amber-300/10 bg-amber-300/[0.07] text-amber-200">
                    <Clock className="h-[17px] w-[17px]" />
                  </span>
                </div>
                <div className="mt-5 flex items-end justify-between">
                  <p className="text-[32px] font-semibold leading-none tracking-tight text-white tabular-nums">{stats.pending}</p>
                  <span className="text-xs text-slate-500">საჭიროებს განხილვას</span>
                </div>
              </article>
              <article className="admin-glow-border admin-fade-in group relative overflow-hidden rounded-2xl border border-white/[0.075] bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-5 transition duration-200 hover:-translate-y-0.5 hover:border-emerald-300/20 hover:shadow-xl hover:shadow-emerald-950/20 sm:col-span-2 xl:col-span-1">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/50 to-transparent" />
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-400">დადასტურებული შემოსავალი</p>
                  <span className="grid h-9 w-9 place-items-center rounded-xl border border-emerald-300/10 bg-emerald-300/[0.07] text-emerald-200">
                    <DollarSign className="h-[17px] w-[17px]" />
                  </span>
                </div>
                <div className="mt-5 flex items-end justify-between gap-2">
                  <p className="text-[32px] font-semibold leading-none tracking-tight text-white tabular-nums">
                    {isMounted ? formatCurrency(stats.revenue, 'ka-GE', currency) : '0.00 ₾'}
                  </p>
                  <span className="text-xs text-slate-500">დადასტურებული</span>
                </div>
              </article>
            </section>

            <section
              id="price-settings"
              aria-labelledby="price-settings-title"
              className="admin-glow-border relative overflow-hidden rounded-2xl border border-white/[0.075] bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-5 sm:p-6"
            >
              <div className="pointer-events-none absolute -right-20 -top-28 h-64 w-64 rounded-full bg-cyan-300/[0.035] blur-3xl" />
              <div className="relative flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
                <div className="flex items-start gap-3.5">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-cyan-300/10 bg-cyan-300/[0.07] text-cyan-200">
                    <DollarSign className="h-[18px] w-[18px]" aria-hidden="true" />
                  </span>
                  <div>
                    <h2 id="price-settings-title" className="text-sm font-semibold text-white">1 ღამის ფასის მართვა</h2>
                    <p className="mt-1 text-xs leading-5 text-slate-500">განახლებული ფასი საიტზე რეალურ დროში აისახება.</p>
                  </div>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                  <label className="block w-full sm:w-64">
                    <span className="mb-1.5 block text-[11px] font-medium text-slate-400">მიმდინარე ფასი (GEL / ღამე)</span>
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
                      className="h-11 w-full rounded-xl border border-white/[0.09] bg-[#090d16] px-3.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-400/40 focus:ring-2 focus:ring-indigo-400/10 disabled:opacity-50"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={handleSavePrice}
                    disabled={priceLoading || priceSaving || pricePerNight === null}
                    className="h-11 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 px-5 text-xs font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:brightness-110 hover:shadow-indigo-500/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b1019] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {priceSaving ? 'ინახება...' : 'ფასის შენახვა'}
                  </button>
                </div>
              </div>
              {priceError && (
                <p className="relative mt-3 text-xs leading-5 text-rose-300" role="alert">
                  ფასის ჩატვირთვა/განახლება ვერ მოხერხდა: {priceError}
                </p>
              )}
              {priceFormError && (
                <p className="relative mt-3 text-xs leading-5 text-rose-300" role="alert">{priceFormError}</p>
              )}
              {priceSaved && (
                <p className="relative mt-3 text-xs leading-5 text-emerald-300" role="status">ფასი წარმატებით შეინახა.</p>
              )}
            </section>

            <section id="bookings" aria-labelledby="bookings-title" className="space-y-4 scroll-mt-24">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <h2 id="bookings-title" className="text-lg font-semibold tracking-tight text-white">ჯავშნები</h2>
                  <p className="mt-1 text-xs text-slate-500">მოძებნეთ, გაფილტრეთ და მართეთ სტუმრების ჯავშნები.</p>
                </div>
                <div className="flex w-full items-center gap-1 overflow-x-auto rounded-xl border border-white/[0.07] bg-[#11151d] p-1 sm:w-auto">
                  {['all', 'pending', 'confirmed', 'cancelled'].map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => {
                        setStatusFilter(status)
                        setCurrentPage(1)
                      }}
                      aria-pressed={statusFilter === status}
                      className={`min-h-9 shrink-0 rounded-lg px-3 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/50 ${
                        statusFilter === status
                          ? 'bg-white/[0.09] text-white shadow-sm'
                          : 'text-slate-500 hover:bg-white/[0.04] hover:text-slate-200'
                      }`}
                    >
                      {status === 'all' ? 'ყველა' : status === 'pending' ? 'მომლოდინე' : status === 'confirmed' ? 'დადასტურებული' : 'გაუქმებული'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="admin-glow-border relative overflow-hidden rounded-2xl border border-white/[0.075] bg-gradient-to-b from-white/[0.04] to-white/[0.01]">
                <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3.5 sm:px-5">
                  <p className="text-xs text-slate-400">
                    <span className="font-semibold text-slate-200">{filteredBookings.length}</span> ჯავშანი
                    {searchQuery && <span className="text-slate-500"> · ძიება: “{searchQuery}”</span>}
                  </p>
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('')
                        setCurrentPage(1)
                      }}
                      className="inline-flex min-h-8 items-center gap-1.5 rounded-lg px-2 text-[11px] text-slate-500 transition hover:bg-white/[0.05] hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/50"
                    >
                      <X className="h-3 w-3" /> გასუფთავება
                    </button>
                  )}
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[900px] text-left text-sm">
                    <thead className="border-b border-white/[0.06] bg-white/[0.02] text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-500">
                      <tr>
                        <th scope="col" className="px-5 py-3.5">სტუმარი</th>
                        <th scope="col" className="px-5 py-3.5">ელფოსტა</th>
                        <th scope="col" className="px-5 py-3.5">თარიღები</th>
                        <th scope="col" className="px-5 py-3.5">ღამეები</th>
                        <th scope="col" className="px-5 py-3.5">თანხა</th>
                        <th scope="col" className="px-5 py-3.5">სტატუსი</th>
                        <th scope="col" className="px-5 py-3.5 text-right">მოქმედება</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.055]">
                      {loading && bookings.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-14 text-center text-sm text-slate-500">
                            <span className="mx-auto mb-3 block h-5 w-5 animate-spin rounded-full border-2 border-slate-700 border-t-cyan-200" />
                            მონაცემები იტვირთება...
                          </td>
                        </tr>
                      ) : filteredBookings.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-14 text-center text-sm text-slate-500">{error || 'ჯავშნები ვერ მოიძებნა'}</td>
                        </tr>
                      ) : (
                        currentBookings.map((booking) => {
                          const { start, end, nights } = parseDateRange(booking.date_range)
                          const isProcessing = actionLoading === booking.id

                          return (
                            <tr key={booking.id} className={`group transition-colors hover:bg-white/[0.025] ${isProcessing ? 'pointer-events-none opacity-50' : ''}`}>
                              <td className="px-5 py-4">
                                <div className="flex items-center gap-3">
                                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/[0.08] bg-white/[0.04] text-[11px] font-medium text-slate-300">
                                    {booking.guest_name.trim().charAt(0).toUpperCase()}
                                  </span>
                                  <span className="font-medium text-slate-200">{booking.guest_name}</span>
                                </div>
                              </td>
                              <td className="px-5 py-4 text-xs text-slate-400">
                                {booking.guest_email ? (
                                  <a href={`mailto:${booking.guest_email}`} className="inline-flex min-h-8 items-center gap-2 transition hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/50">
                                    <Mail className="h-3.5 w-3.5 text-slate-500" />
                                    {booking.guest_email}
                                  </a>
                                ) : 'მითითებული არ არის'}
                              </td>
                              <td className="px-5 py-4 text-xs text-slate-300">
                                <div className="inline-flex items-center gap-2 whitespace-nowrap">
                                  <Calendar className="h-3.5 w-3.5 text-slate-500" />
                                  <span>{start}</span><span className="text-slate-600">—</span><span>{end}</span>
                                </div>
                              </td>
                              <td className="px-5 py-4">
                                <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-white/[0.07] bg-white/[0.025] px-2 py-1 text-[11px] text-slate-400">
                                  <Moon className="h-3 w-3 text-slate-500" />{nights} ღამე
                                </span>
                              </td>
                              <td className="whitespace-nowrap px-5 py-4 text-xs font-semibold tabular-nums text-slate-200">
                                {formatCurrency(Number(booking.total_price), 'ka-GE', currency)}
                              </td>
                              <td className="px-5 py-4">
                                <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-medium ${
                                  booking.status === 'confirmed'
                                    ? 'border-emerald-300/15 bg-emerald-300/[0.07] text-emerald-200'
                                    : booking.status === 'cancelled'
                                    ? 'border-rose-300/15 bg-rose-300/[0.07] text-rose-200'
                                    : 'border-amber-300/15 bg-amber-300/[0.07] text-amber-100'
                                }`}>
                                  {booking.status === 'confirmed' && <CheckCircle2 className="h-3 w-3" />}
                                  {booking.status === 'cancelled' && <XCircle className="h-3 w-3" />}
                                  {booking.status === 'pending' && <Clock className="h-3 w-3" />}
                                  {booking.status === 'confirmed' ? 'დადასტურებული' : booking.status === 'cancelled' ? 'გაუქმებული' : 'მომლოდინე'}
                                </span>
                              </td>
                              <td className="px-5 py-4">
                                <div className="flex items-center justify-end gap-1.5">
                                  {booking.status !== 'confirmed' && (
                                    <button
                                      type="button"
                                      onClick={() => handleStatusChange(booking.id, 'confirmed')}
                                      title="დადასტურება"
                                      aria-label={`ჯავშნის დადასტურება: ${booking.guest_name}`}
                                      className="grid h-8 w-8 place-items-center rounded-lg border border-white/[0.07] text-slate-500 transition hover:border-emerald-300/20 hover:bg-emerald-300/[0.08] hover:text-emerald-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/40"
                                    >
                                      <CheckCircle2 className="h-4 w-4" />
                                    </button>
                                  )}
                                  {booking.status !== 'cancelled' && (
                                    <button
                                      type="button"
                                      onClick={() => handleStatusChange(booking.id, 'cancelled')}
                                      title="გაუქმება"
                                      aria-label={`ჯავშნის გაუქმება: ${booking.guest_name}`}
                                      className="grid h-8 w-8 place-items-center rounded-lg border border-white/[0.07] text-slate-500 transition hover:border-amber-300/20 hover:bg-amber-300/[0.08] hover:text-amber-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/40"
                                    >
                                      <XCircle className="h-4 w-4" />
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => handleDelete(booking.id)}
                                    title="წაშლა"
                                    aria-label={`ჯავშნის წაშლა: ${booking.guest_name}`}
                                    className="grid h-8 w-8 place-items-center rounded-lg border border-white/[0.07] text-slate-500 transition hover:border-rose-300/20 hover:bg-rose-300/[0.08] hover:text-rose-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/40"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
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
                <div className="flex flex-col gap-3 border-t border-white/[0.06] px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                  <p className="text-[11px] text-slate-500">
                    {filteredBookings.length === 0
                      ? '0 ჯავშანი'
                      : `${(currentPage - 1) * PAGE_SIZE + 1}–${Math.min(currentPage * PAGE_SIZE, filteredBookings.length)} / ${filteredBookings.length} ჯავშანი`}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCurrentPage((page) => Math.max(1, Math.min(page, pageCount) - 1))}
                      disabled={visiblePage === 1}
                      aria-label="წინა გვერდი"
                      className="inline-flex h-8 items-center gap-1 rounded-lg border border-white/[0.08] px-2.5 text-[11px] text-slate-400 transition hover:bg-white/[0.05] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" /> წინა
                    </button>
                    <span aria-live="polite" className="min-w-16 text-center text-[11px] tabular-nums text-slate-500">
                      {visiblePage} / {pageCount}
                    </span>
                    <button
                      type="button"
                      onClick={() => setCurrentPage((page) => Math.min(pageCount, Math.min(page, pageCount) + 1))}
                      disabled={visiblePage >= pageCount}
                      aria-label="შემდეგი გვერდი"
                      className="inline-flex h-8 items-center gap-1 rounded-lg border border-white/[0.08] px-2.5 text-[11px] text-slate-400 transition hover:bg-white/[0.05] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      შემდეგი <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <footer className="flex items-center justify-between border-t border-white/[0.06] pt-5 text-[10px] text-slate-600">
              <span>Kutaisi Residence · Admin console</span>
              <span>Live property management</span>
            </footer>
          </main>
        </div>
      </div>
    </div>
  )
}
