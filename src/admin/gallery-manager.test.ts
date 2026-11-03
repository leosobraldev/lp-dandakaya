import { describe, expect, it, vi } from 'vitest'

vi.mock('../lib/supabase', () => ({ supabase: {} }))
const { INSTAGRAM_URL } = await import('./gallery-manager')

describe('INSTAGRAM_URL', () => {
  it.each([
    'https://www.instagram.com/p/C1a2B3c4D5e/',
    'https://instagram.com/p/C1a2B3c4D5e',
    'https://www.instagram.com/reel/C9x_y-Z/?igsh=abc',
    'https://www.instagram.com/tv/ABC123/',
  ])('aceita link de post: %s', (url) => {
    expect(INSTAGRAM_URL.test(url)).toBe(true)
  })

  it.each([
    'https://www.instagram.com/dandakaya/',
    'http://www.instagram.com/p/abc/',
    'https://instagram.com.golpe.com/p/abc/',
    'https://www.facebook.com/p/abc/',
    'instagram.com/p/abc',
  ])('recusa: %s', (url) => {
    expect(INSTAGRAM_URL.test(url)).toBe(false)
  })
})
