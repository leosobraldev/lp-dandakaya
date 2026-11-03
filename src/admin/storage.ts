// Utilidades de imagem + Storage compartilhadas pelos componentes do painel.
import { supabase } from '../lib/supabase'
import { IMAGES_BUCKET } from '../lib/content'

export const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_INPUT_BYTES = 15 * 1024 * 1024
const MAX_OUTPUT_BYTES = 5 * 1024 * 1024 // igual ao file_size_limit do bucket
const QUALITY = 0.82

export class UserFacingError extends Error {}

export function validateImage(file: File): string | null {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return 'Formato não suportado. Envie uma foto JPG, PNG ou WebP (fotos HEIC do iPhone: exporte como JPG).'
  }
  if (file.size > MAX_INPUT_BYTES) {
    return `Arquivo grande demais (${formatBytes(file.size)}). O limite é ${formatBytes(MAX_INPUT_BYTES)}.`
  }
  return null
}

/** Otimiza no navegador e envia ao bucket. Retorna o caminho e a URL pública. */
export async function uploadImage(folder: string, file: File, maxDimension = 2000) {
  const blob = await optimizeImage(file, maxDimension)
  if (blob.size > MAX_OUTPUT_BYTES) {
    throw new UserFacingError('A imagem continua grande demais depois de otimizada. Tente uma foto menor.')
  }

  const ext = blob.type === 'image/webp' ? 'webp' : 'jpg'
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  const { error } = await supabase.storage.from(IMAGES_BUCKET).upload(path, blob, {
    contentType: blob.type,
    cacheControl: '31536000', // nome de arquivo único → cache longo é seguro
    upsert: false,
  })
  if (error) throw error

  const { data } = supabase.storage.from(IMAGES_BUCKET).getPublicUrl(path)
  return { path, url: data.publicUrl, bytes: blob.size }
}

export function storagePathFromUrl(url: string): string | null {
  const marker = `/storage/v1/object/public/${IMAGES_BUCKET}/`
  const index = url.indexOf(marker)
  return index === -1 ? null : decodeURIComponent(url.slice(index + marker.length))
}

/** Remove um arquivo do bucket (melhor esforço; falhas não afetam o site). */
export async function removeImage(urlOrPath: string) {
  // Aceita URL pública do bucket ou caminho relativo ("pasta/arquivo.webp").
  // Arquivos do próprio site ("/fotos/...") e URLs externas são ignorados.
  const isBucketPath = !urlOrPath.startsWith('/') && !/^[a-z]+:/i.test(urlOrPath)
  const path = storagePathFromUrl(urlOrPath) ?? (isBucketPath ? urlOrPath : null)
  if (!path) return
  const { error } = await supabase.storage.from(IMAGES_BUCKET).remove([path])
  if (error) console.warn('[admin] não foi possível remover a imagem', error)
}

export function describeError(err: unknown, fallback = 'Não foi possível enviar a imagem. Tente de novo em instantes.'): string {
  if (err instanceof UserFacingError) return err.message
  const message = (err as { message?: string })?.message ?? ''
  if (/row-level security|unauthorized|403/i.test(message)) {
    return 'Sua conta não tem permissão para alterar o site. Peça acesso a quem administra o painel.'
  }
  if (/JWT|expired/i.test(message)) return 'Sua sessão expirou. Entre novamente e tente de novo.'
  if (/fetch|network/i.test(message)) return 'Sem conexão com o servidor. Verifique a internet e tente de novo.'
  return fallback
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1).replace('.', ',')} MB`
}

// ---------- Otimização no navegador ----------

/** Redimensiona para o lado maior ≤ maxDimension e converte para WebP (JPEG se o navegador não suportar). */
async function optimizeImage(file: File, maxDimension: number): Promise<Blob> {
  const { source, width, height, release } = await decode(file)
  try {
    const scale = Math.min(1, maxDimension / Math.max(width, height))
    const w = Math.round(width * scale)
    const h = Math.round(height * scale)

    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new UserFacingError('Seu navegador não conseguiu processar a imagem.')
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(source, 0, 0, w, h)

    const webp = await toBlob(canvas, 'image/webp', QUALITY)
    if (webp && webp.type === 'image/webp') return webp
    const jpeg = await toBlob(canvas, 'image/jpeg', QUALITY)
    if (!jpeg) throw new UserFacingError('Não foi possível converter a imagem.')
    return jpeg
  } finally {
    release()
  }
}

async function decode(file: File): Promise<{
  source: CanvasImageSource
  width: number
  height: number
  release: () => void
}> {
  if ('createImageBitmap' in window) {
    try {
      // imageOrientation corrige fotos de celular que vêm "deitadas" pelo EXIF.
      const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
      return { source: bitmap, width: bitmap.width, height: bitmap.height, release: () => bitmap.close() }
    } catch {
      /* cai para o caminho com <img> */
    }
  }
  const url = URL.createObjectURL(file)
  const img = new Image()
  img.decoding = 'async'
  img.src = url
  try {
    await img.decode()
  } catch {
    URL.revokeObjectURL(url)
    throw new UserFacingError('Não conseguimos abrir esse arquivo. Use uma foto JPG, PNG ou WebP.')
  }
  return { source: img, width: img.naturalWidth, height: img.naturalHeight, release: () => URL.revokeObjectURL(url) }
}

function toBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality))
}
