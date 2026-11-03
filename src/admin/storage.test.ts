import { beforeEach, describe, expect, it, vi } from 'vitest'

const remove = vi.fn()
vi.mock('../lib/supabase', () => ({
  supabase: { storage: { from: () => ({ remove }) } },
}))

const { UserFacingError, describeError, formatBytes, removeImage, storagePathFromUrl, validateImage } =
  await import('./storage')

const MB = 1024 * 1024
const fileOf = (type: string, size: number) => {
  const file = new File(['x'], 'foto', { type })
  Object.defineProperty(file, 'size', { value: size })
  return file
}

beforeEach(() => {
  remove.mockReset().mockResolvedValue({ error: null })
})

describe('validateImage', () => {
  it('aceita JPG, PNG e WebP dentro do limite', () => {
    for (const type of ['image/jpeg', 'image/png', 'image/webp']) {
      expect(validateImage(fileOf(type, 2 * MB))).toBeNull()
    }
  })

  it('recusa HEIC e outros formatos com instrução de como resolver', () => {
    expect(validateImage(fileOf('image/heic', MB))).toMatch(/exporte como JPG/)
    expect(validateImage(fileOf('application/pdf', MB))).toMatch(/Formato não suportado/)
  })

  it('recusa arquivos acima de 15 MB mostrando o tamanho', () => {
    expect(validateImage(fileOf('image/jpeg', 16 * MB))).toBe('Arquivo grande demais (16,0 MB). O limite é 15,0 MB.')
  })
})

describe('formatBytes', () => {
  it('usa KB abaixo de 1 MB e MB com vírgula acima', () => {
    expect(formatBytes(512 * 1024)).toBe('512 KB')
    expect(formatBytes(2.5 * MB)).toBe('2,5 MB')
  })
})

describe('describeError', () => {
  it('repassa mensagens pensadas para a equipe', () => {
    expect(describeError(new UserFacingError('Foto grande demais'))).toBe('Foto grande demais')
  })

  it('traduz erros comuns do Supabase', () => {
    expect(describeError({ message: 'new row violates row-level security policy' })).toMatch(/não tem permissão/)
    expect(describeError({ message: 'JWT expired' })).toMatch(/sessão expirou/)
    expect(describeError(new TypeError('Failed to fetch'))).toMatch(/Sem conexão/)
  })

  it('usa a mensagem padrão para o resto', () => {
    expect(describeError(new Error('???'), 'Padrão')).toBe('Padrão')
    expect(describeError(undefined)).toMatch(/Não foi possível enviar/)
  })
})

describe('storagePathFromUrl', () => {
  it('extrai o caminho de uma URL pública do bucket', () => {
    const url = 'https://abc.supabase.co/storage/v1/object/public/site-images/gallery/foto%201.webp'
    expect(storagePathFromUrl(url)).toBe('gallery/foto 1.webp')
  })

  it('devolve null para URLs fora do bucket', () => {
    expect(storagePathFromUrl('https://example.com/foto.jpg')).toBeNull()
  })
})

describe('removeImage', () => {
  it('remove pela URL pública ou pelo caminho relativo', async () => {
    await removeImage('https://abc.supabase.co/storage/v1/object/public/site-images/hero/a.webp')
    await removeImage('gallery/b.webp')
    expect(remove).toHaveBeenNthCalledWith(1, ['hero/a.webp'])
    expect(remove).toHaveBeenNthCalledWith(2, ['gallery/b.webp'])
  })

  it('nunca tenta apagar arquivos do site nem URLs externas', async () => {
    await removeImage('/fotos/fundadoras.jpg')
    await removeImage('https://example.com/foto.jpg')
    await removeImage('')
    expect(remove).not.toHaveBeenCalled()
  })
})
