'use client'

import { useState } from 'react'
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'
import {
  hasBookingOverlap,
  isOccupiedNight,
  type BookingDateRange,
} from '@/lib/bookingAvailability'

type DateRole = 'checkin' | 'checkout'

interface DatePickerProps {
  id: string
  label: string
  value: string
  otherDate: string
  role: DateRole
  bookings: readonly BookingDateRange[]
  disabled?: boolean
  onChange: (value: string) => void
  triggerClassName?: string
}

function dateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function parseDate(value: string): Date {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export default function DatePicker({
  id,
  label,
  value,
  otherDate,
  role,
  bookings,
  disabled = false,
  onChange,
  triggerClassName = '',
}: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const [today, setToday] = useState('')
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const date = value ? parseDate(value) : new Date(2000, 0, 1)
    return new Date(date.getFullYear(), date.getMonth(), 1)
  })

  const year = visibleMonth.getFullYear()
  const month = visibleMonth.getMonth()
  const monthStart = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstWeekday = (monthStart.getDay() + 6) % 7
  const monthLabel = new Intl.DateTimeFormat('ka-GE', {
    month: 'long',
    year: 'numeric',
  }).format(visibleMonth)
  const weekdayLabels = ['ორშ', 'სამ', 'ოთხ', 'ხუთ', 'პარ', 'შაბ', 'კვ']

  const isDateDisabled = (date: string) => {
    if (date < today) return true
    if (role === 'checkout' && (!otherDate || date <= otherDate)) return true

    if (otherDate) {
      return role === 'checkin'
        ? hasBookingOverlap(date, otherDate, bookings)
        : hasBookingOverlap(otherDate, date, bookings)
    }

    return isOccupiedNight(date, bookings)
  }

  const displayedValue = value
    ? new Intl.DateTimeFormat('ka-GE', { dateStyle: 'medium' }).format(parseDate(value))
    : 'თარიღის არჩევა'

  return (
    <div className="relative min-w-0">
      <label
        htmlFor={id}
        className="mb-1 block text-xs font-semibold uppercase tracking-wider text-neutral-700"
      >
        {label}
      </label>
      <button
        id={id}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`${label}: ${displayedValue}`}
        disabled={disabled}
        onClick={() => {
          if (!open) {
            const selected = value ? parseDate(value) : new Date()
            setVisibleMonth(new Date(selected.getFullYear(), selected.getMonth(), 1))
            setToday(dateKey(new Date()))
          }
          setOpen((current) => !current)
        }}
        className={triggerClassName}
      >
        <CalendarDays size={16} aria-hidden="true" />
        <span>{displayedValue}</span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label={`${label} კალენდარი`}
          className="absolute left-0 top-full z-30 mt-2 w-72 rounded-xl border border-neutral-200 bg-white p-3 shadow-xl"
        >
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              aria-label="წინა თვე"
              onClick={() => setVisibleMonth(new Date(year, month - 1, 1))}
              className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-neutral-100"
            >
              <ChevronLeft size={18} aria-hidden="true" />
            </button>
            <span className="text-sm font-semibold capitalize">{monthLabel}</span>
            <button
              type="button"
              aria-label="შემდეგი თვე"
              onClick={() => setVisibleMonth(new Date(year, month + 1, 1))}
              className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-neutral-100"
            >
              <ChevronRight size={18} aria-hidden="true" />
            </button>
          </div>

          <div className="grid grid-cols-7 text-center text-xs text-neutral-600">
            {weekdayLabels.map((weekday) => (
              <span key={weekday} className="py-2 font-medium">{weekday}</span>
            ))}
            {Array.from({ length: firstWeekday }, (_, index) => (
              <span key={`empty-${index}`} aria-hidden="true" />
            ))}
            {Array.from({ length: daysInMonth }, (_, index) => {
              const date = dateKey(new Date(year, month, index + 1))
              const selected = value === date
              const blocked = isDateDisabled(date)
              return (
                <button
                  key={date}
                  type="button"
                  aria-label={new Intl.DateTimeFormat('ka-GE', { dateStyle: 'full' }).format(parseDate(date))}
                  aria-pressed={selected}
                  disabled={disabled || blocked}
                  onClick={() => {
                    onChange(date)
                    setOpen(false)
                  }}
                  className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm ${
                    selected
                      ? 'bg-[#1f3a38] text-white'
                      : blocked
                        ? 'cursor-not-allowed text-neutral-300 line-through'
                        : 'hover:bg-[#e2eee7]'
                  }`}
                >
                  {index + 1}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
