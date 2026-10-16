export interface BookingDateRange {
  start: string
  end: string
}

export function parseBookingDateRange(value: string): BookingDateRange | null {
  const dates = value.match(/\d{4}-\d{2}-\d{2}/g)
  if (!dates || dates.length !== 2 || dates[0] >= dates[1]) return null
  return { start: dates[0], end: dates[1] }
}

export function hasBookingOverlap(
  checkIn: string,
  checkOut: string,
  bookings: readonly BookingDateRange[],
): boolean {
  return bookings.some(
    ({ start, end }) => checkIn < end && checkOut > start,
  )
}

export function isOccupiedNight(
  date: string,
  bookings: readonly BookingDateRange[],
): boolean {
  return bookings.some(({ start, end }) => date >= start && date < end)
}
