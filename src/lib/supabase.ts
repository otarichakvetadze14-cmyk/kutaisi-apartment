import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL.')
}

if (!supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY.')
}

try {
  const parsedUrl = new URL(supabaseUrl)
  if (parsedUrl.protocol !== 'https:' && parsedUrl.protocol !== 'http:') {
    throw new Error()
  }
} catch {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL must be a valid HTTP(S) URL.')
}

if (
  supabaseAnonKey.startsWith('sb_secret_') ||
  (
    !/^sb_publishable_[\w-]+$/.test(supabaseAnonKey) &&
    !/^[\w-]+\.[\w-]+\.[\w-]+$/.test(supabaseAnonKey)
  )
) {
  throw new Error(
    'NEXT_PUBLIC_SUPABASE_ANON_KEY must be a Supabase publishable key (sb_publishable_...) or legacy anon JWT.',
  )
}

export function getSupabaseErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) return error.message

  if (typeof error === 'object' && error !== null && 'message' in error) {
    const { message } = error
    if (typeof message === 'string') return message
  }

  return fallback
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)