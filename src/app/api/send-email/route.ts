import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

const ADMIN_EMAIL = 'kutaisicentralsquare@gmail.com'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function escapeHtml(value: unknown) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }
    return entities[character]
  })
}

export async function POST(request: Request) {
  let payload: unknown
  try {
    payload = await request.json()
  } catch (error) {
    console.error('Invalid booking notification payload:', error)
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 })
  }

  const body: Record<string, unknown> = isRecord(payload) ? payload : {}
  const record: Record<string, unknown> = isRecord(body.record) ? body.record : {}
  const guestEmail = record.email || body.email
  const guestName = record.full_name || record.guest_name || body.name || body.guest_name
  const checkIn = record.check_in || body.check_in || body.checkIn
  const checkOut = record.check_out || body.check_out || body.checkOut

  if (typeof guestEmail !== 'string' || !guestEmail.trim()) {
    return NextResponse.json({ error: 'No guest email provided' }, { status: 400 })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail.trim())) {
    return NextResponse.json({ error: 'A valid guest email is required' }, { status: 400 })
  }

  const user = process.env.GMAIL_USER
  const appPassword = process.env.GMAIL_APP_PASSWORD
  if (!user || !appPassword) {
    console.error('Booking notifications could not be sent: Gmail SMTP credentials are not configured')
    return NextResponse.json({ error: 'Email service is not configured' }, { status: 500 })
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass: appPassword },
  })
  console.log('Sending confirmation email to:', guestEmail)

  const safeGuestName = escapeHtml(guestName)
  const bookingDates = checkIn || checkOut
    ? [checkIn, checkOut].filter(Boolean).map(escapeHtml).join(' – ')
    : escapeHtml(record.date_range || body.date_range)
  const price = escapeHtml(record.total_price || body.total_price)
  const bookingDetails = `
    <hr />
    <p><strong>სტუმარი / Guest:</strong> ${safeGuestName}</p>
    <p><strong>ელფოსტა / Email:</strong> ${escapeHtml(guestEmail.trim())}</p>
    <p><strong>თარიღები / Dates:</strong> ${bookingDates}</p>
    <p><strong>ჯამური ფასი / Total price:</strong> ${price} GEL</p>
  `

  try {
    const result = await transporter.sendMail({
      from: user,
      to: guestEmail.trim(),
      bcc: ADMIN_EMAIL,
      subject: 'თქვენი ჯავშანი მიღებულია! / Booking Confirmation',
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2>გამარჯობა, ${safeGuestName}!</h2>
          <p>თქვენი ჯავშანი ქუთაისის ცენტრალურ მოედანზე წარმატებით დარეგისტრირდა.</p>
          ${bookingDetails}
          <p>ინსტრუქციის მისაღებად გთხოვთ დამიკავშირდეთ WhatsApp-ზე ნომერზე: <strong>+995 598 54 24 24</strong></p>
          <p>ჩვენი მენეჯერი მალე დაგიკავშირდებათ დეტალების დასაზუსტებლად.</p>
        </div>
      `,
    })

    const rejectedRecipients = result.rejected.map((recipient) => String(recipient).toLowerCase())
    if (
      rejectedRecipients.includes(guestEmail.trim().toLowerCase()) ||
      rejectedRecipients.includes(ADMIN_EMAIL)
    ) {
      throw new Error('SMTP server rejected the guest or admin recipient')
    }
  } catch (error) {
    console.error('Gmail SMTP booking confirmation failed:', error)
    return NextResponse.json(
      { error: 'Booking confirmation email could not be sent' },
      { status: 502 },
    )
  }

  return NextResponse.json({ success: true })
}
