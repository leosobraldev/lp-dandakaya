// Componente de upload de imagem do painel.
// Fluxo: escolher/arrastar arquivo → validar → otimizar no navegador (redimensiona + WebP)
// → enviar ao Supabase Storage → salvar a URL pública em site_content → remover a imagem anterior.

import { supabase } from '../lib/supabase'
import { CONTENT_TABLE, type ContentKey } from '../lib/content'
import {
  ACCEPTED_TYPES,
  describeError,
  formatBytes,
  removeImage,
  uploadImage,
  validateImage,
} from './storage'

export interface ImageUploadOptions {
  key: ContentKey
  label: string
  hint: string
  shape: 'arch' | 'bowl' | 'plate'
  currentUrl?: string
  onUploaded?: (url: string) => void
}

type Status = 'idle' | 'ready' | 'working' | 'success' | 'error'

export function createImageUpload(opts: ImageUploadOptions): HTMLElement {
  const id = `upload-${opts.key}`
  const root = document.createElement('section')
  root.className = 'upload'
  root.setAttribute('aria-labelledby', `${id}-title`)
  root.innerHTML = `
    <div class="upload__preview upload__preview--${opts.shape}">
      <img alt="" hidden />
      <span class="upload__empty">Sem imagem</span>
    </div>
    <div class="upload__body">
      <h3 class="upload__title" id="${id}-title"></h3>
      <p class="upload__hint"></p>
      <label class="upload__drop" for="${id}-input">
        <input class="upload__input" id="${id}-input" type="file" accept="${ACCEPTED_TYPES.join(',')}" />
        <span class="upload__drop-text"><strong>Escolher imagem</strong> ou arraste aqui</span>
        <span class="upload__file" hidden></span>
      </label>
      <div class="upload__actions">
        <button class="btn btn--primary" type="button" disabled>Enviar imagem</button>
        <button class="btn btn--ghost" type="button" hidden>Cancelar</button>
      </div>
      <p class="upload__status" role="status" aria-live="polite"></p>
    </div>
  `

  const $ = <T extends Element>(sel: string) => root.querySelector(sel) as T
  const previewImg = $<HTMLImageElement>('.upload__preview img')
  const emptyLabel = $<HTMLElement>('.upload__empty')
  const input = $<HTMLInputElement>('.upload__input')
  const drop = $<HTMLLabelElement>('.upload__drop')
  const fileLabel = $<HTMLElement>('.upload__file')
  const dropText = $<HTMLElement>('.upload__drop-text')
  const [sendBtn, cancelBtn] = Array.from(root.querySelectorAll<HTMLButtonElement>('.upload__actions button'))
  const status = $<HTMLElement>('.upload__status')

  $<HTMLElement>('.upload__title').textContent = opts.label
  $<HTMLElement>('.upload__hint').textContent = opts.hint

  let currentUrl = opts.currentUrl ?? ''
  let selected: File | null = null
  let localPreview: string | null = null

  const showPreview = (src: string) => {
    previewImg.src = src
    previewImg.hidden = !src
    emptyLabel.hidden = Boolean(src)
  }

  const setStatus = (state: Status, message = '') => {
    root.dataset.state = state
    status.textContent = message
    const busy = state === 'working'
    sendBtn.disabled = busy || !selected
    sendBtn.textContent = busy ? 'Enviando…' : 'Enviar imagem'
    input.disabled = busy
    cancelBtn.hidden = !selected || busy
  }

  const reset = () => {
    selected = null
    input.value = ''
    fileLabel.hidden = true
    dropText.hidden = false
    if (localPreview) URL.revokeObjectURL(localPreview)
    localPreview = null
    showPreview(currentUrl)
  }

  const select = (file: File | undefined) => {
    if (!file) return
    const problem = validateImage(file)
    if (problem) {
      reset()
      setStatus('error', problem)
      return
    }
    selected = file
    if (localPreview) URL.revokeObjectURL(localPreview)
    localPreview = URL.createObjectURL(file)
    showPreview(localPreview)
    fileLabel.textContent = `${file.name} · ${formatBytes(file.size)}`
    fileLabel.hidden = false
    dropText.hidden = true
    setStatus('ready', 'Pré-visualização. Clique em "Enviar imagem" para publicar no site.')
  }

  input.addEventListener('change', () => select(input.files?.[0]))

  drop.addEventListener('dragover', (e) => {
    e.preventDefault()
    drop.classList.add('is-over')
  })
  drop.addEventListener('dragleave', () => drop.classList.remove('is-over'))
  drop.addEventListener('drop', (e) => {
    e.preventDefault()
    drop.classList.remove('is-over')
    select(e.dataTransfer?.files?.[0])
  })

  cancelBtn.addEventListener('click', () => {
    reset()
    setStatus('idle')
  })

  sendBtn.addEventListener('click', async () => {
    if (!selected) return
    setStatus('working', 'Otimizando e enviando…')
    try {
      const { path, url, bytes } = await uploadImage(opts.key, selected)

      const { error: dbError } = await supabase.from(CONTENT_TABLE).upsert({ key: opts.key, value: url })
      if (dbError) {
        // Não deixa arquivo órfão se a URL não pôde ser salva.
        await removeImage(path)
        throw dbError
      }

      const previous = currentUrl
      currentUrl = url
      reset()
      setStatus('success', `Publicada. A imagem já aparece no site (${formatBytes(bytes)}).`)
      opts.onUploaded?.(url)
      if (previous) removeImage(previous)
    } catch (err) {
      console.error(err)
      setStatus('error', describeError(err))
    }
  })

  showPreview(currentUrl)
  setStatus('idle')
  return root
}
