import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function formDataToRecord(formData: FormData): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  formData.forEach((value, key) => {
    result[key] = typeof value === 'string' ? value : value.name
  })
  return result
}

function parseJsonString(value: unknown): unknown {
  if (typeof value !== 'string') {
    return value
  }

  const trimmed = value.trim()
  if (!trimmed || (!trimmed.startsWith('{') && !trimmed.startsWith('[') && !trimmed.startsWith('"'))) {
    return value
  }

  try {
    return JSON.parse(trimmed)
  } catch {
    return value
  }
}

function parsePayload(rawBody: string, contentType: string, rawBytes: ArrayBuffer): Promise<unknown> | unknown {
  const normalizedContentType = contentType.toLowerCase()
  if (normalizedContentType.includes('multipart/form-data')) {
    const formRequest = new Request('http://localhost', {
      method: 'POST',
      headers: { 'content-type': contentType },
      body: rawBytes,
    })
    return formRequest.formData().then(formDataToRecord)
  }

  if (normalizedContentType.includes('application/x-www-form-urlencoded')) {
    return Object.fromEntries(new URLSearchParams(rawBody))
  }

  if (!rawBody.trim()) {
    return {}
  }

  const json = parseJsonString(rawBody)
  if (json !== rawBody) {
    return json
  }

  if (rawBody.includes('=') && !rawBody.trimStart().startsWith('<')) {
    const fields = Object.fromEntries(new URLSearchParams(rawBody))
    if (Object.keys(fields).length > 0) {
      return fields
    }
  }

  return rawBody
}

function parseDateRange(value: unknown): [string, string] | null {
  if (Array.isArray(value) && value.length >= 2) {
    return [String(value[0]).trim(), String(value[1]).trim()]
  }

  if (typeof value !== 'string') {
    return null
  }

  let normalized = value.trim()
  if (normalized.startsWith('[') || normalized.startsWith('(')) {
    normalized = normalized.slice(1)
  }
  if (normalized.endsWith(']') || normalized.endsWith(')')) {
    normalized = normalized.slice(0, -1)
  }
  const separator = normalized.indexOf(',')
  if (separator < 0) {
    return null
  }

  const cleanBound = (bound: string) => bound.trim().replace(/^["']|["']$/g, '')
  const checkIn = cleanBound(normalized.slice(0, separator))
  const checkOut = cleanBound(normalized.slice(separator + 1))
  return checkIn && checkOut ? [checkIn, checkOut] : null
}

function maskValue(value: string | undefined): string {
  if (!value) {
    return '[not set]'
  }
  if (value.length <= 4) {
    return '*'.repeat(value.length)
  }
  return `${value.slice(0, 2)}${'*'.repeat(Math.min(value.length - 4, 12))}${value.slice(-2)}`
}

export async function POST(request: Request) {
  try {
    const headers = Object.fromEntries(
      Array.from(request.headers.entries(), ([name, value]) => [
        name,
        /^(authorization|cookie|set-cookie|proxy-authorization|apikey|x-api-key)$/i.test(name)
          ? '[REDACTED]'
          : value,
      ]),
    )
    const contentType = request.headers.get('content-type') || ''
    console.log('Webhook received:', {
      method: request.method,
      path: new URL(request.url).pathname,
      headers,
    })
    console.log('Webhook processing step: reading raw request body')

    const rawBytes = await request.arrayBuffer()
    const rawBody = new TextDecoder().decode(rawBytes)
    console.log('Webhook raw payload:', rawBody)
    console.log('Webhook processing step: parsing payload', { contentType })

    let payload = await parsePayload(rawBody, contentType, rawBytes)
    payload = parseJsonString(payload)

    const body: Record<string, unknown> = isRecord(payload) ? payload : {}
    const recordValue = parseJsonString(body.record)
    const record: Record<string, unknown> = isRecord(recordValue) ? recordValue : {}
    const nestedPayload = parseJsonString(body.payload)
    const nestedBody: Record<string, unknown> = isRecord(nestedPayload) ? nestedPayload : {}
    const nestedRecordValue = parseJsonString(nestedBody.record)
    const nestedRecord: Record<string, unknown> = isRecord(nestedRecordValue) ? nestedRecordValue : {}
    const sources = [record, body, nestedRecord, nestedBody]
    const getFirst = (candidates: unknown[]) =>
      candidates.find((value) => value !== undefined && value !== null && value !== '')

    const emailCandidates = [
      body.guest_email,
      record.guest_email,
      body.email,
      record.email,
      body.user_email,
      record.user_email,
      nestedBody.guest_email,
      nestedRecord.guest_email,
      nestedBody.email,
      nestedRecord.email,
      nestedBody.user_email,
      nestedRecord.user_email,
    ]
    const guestEmail = emailCandidates.find(
      (value): value is string =>
        typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),
    )
    const guestName =
      getFirst([
        body.guest_name,
        record.guest_name,
        body.name,
        record.name,
        body.full_name,
        record.full_name,
        nestedBody.guest_name,
        nestedRecord.guest_name,
        nestedBody.name,
        nestedRecord.name,
        nestedBody.full_name,
        nestedRecord.full_name,
      ]) || 'Guest'
    const rawDateRangeValue = getFirst([
      ...sources.map((source) => source.date_range),
    ])
    const rawDateRange = typeof rawDateRangeValue === 'string' ? rawDateRangeValue : ''
    const parsedDateRange = parseDateRange(rawDateRangeValue)
    const checkIn = getFirst(sources.flatMap((source) => [source.check_in, source.checkIn])) || parsedDateRange?.[0] || ''
    const checkOut = getFirst(sources.flatMap((source) => [source.check_out, source.checkOut])) || parsedDateRange?.[1] || ''
    const totalPrice = String(getFirst(sources.map((source) => source.total_price)) ?? '')

    if (!guestEmail) {
      console.warn('Webhook ignored: no valid guest email found. Parsed payload:', JSON.stringify(body, null, 2))
      return NextResponse.json({ success: true, skipped: true, reason: 'No valid guest email' })
    }

    const serviceId = process.env.EMAILJS_SERVICE_ID?.trim()
    const templateId = process.env.EMAILJS_TEMPLATE_ID?.trim()
    const publicKey = process.env.EMAILJS_PUBLIC_KEY?.trim()
    console.log('EmailJS runtime configuration:', {
      EMAILJS_SERVICE_ID: { loaded: Boolean(serviceId), value: maskValue(serviceId) },
      EMAILJS_TEMPLATE_ID: { loaded: Boolean(templateId), value: maskValue(templateId) },
      EMAILJS_PUBLIC_KEY: { loaded: Boolean(publicKey), value: maskValue(publicKey) },
    })

    if (!serviceId || !templateId || !publicKey) {
      console.error('EmailJS sending failed: required EmailJS environment variables are missing')
      return NextResponse.json({ error: 'Email service is not configured' }, { status: 500 })
    }

    const dateRange = checkIn || checkOut
      ? [checkIn, checkOut].filter(Boolean).map(String).join(' – ')
      : rawDateRange

    const templateParams = {
      email: guestEmail.trim(),
      name: String(guestName),
      check_in: String(checkIn),
      check_out: String(checkOut),
      date_range: dateRange,
      total_price: totalPrice,
    }

    console.log('Webhook processing step: sending EmailJS confirmation', {
      guestEmail: guestEmail.trim(),
      checkIn: String(checkIn),
      checkOut: String(checkOut),
      templateParamNames: Object.keys(templateParams),
      templateParamsPresent: {
        email: Boolean(templateParams.email),
        name: Boolean(templateParams.name),
        check_in: Boolean(templateParams.check_in),
        check_out: Boolean(templateParams.check_out),
        date_range: Boolean(templateParams.date_range),
        total_price: Boolean(templateParams.total_price),
      },
    })

    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        template_params: templateParams,
      }),
    })

    const responseDetails = await response.text()
    if (!response.ok) {
      console.error('EmailJS request failed:', {
        status: response.status,
        statusText: response.statusText,
        response: responseDetails,
      })
      return NextResponse.json({ error: 'Email could not be sent' }, { status: 500 })
    }

    if (response.status === 200) {
      console.log('EmailJS returned 200 OK: confirmation email accepted', {
        response: responseDetails,
      })
    } else {
      console.log('EmailJS accepted confirmation email:', {
        status: response.status,
        statusText: response.statusText,
        response: responseDetails,
      })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unhandled webhook processing error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}