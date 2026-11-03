// Galeria do carrossel "No nosso Instagram": a equipe sobe a foto, cola o link do post e ordena.
import { supabase } from '../lib/supabase'
import { GALLERY_LIMIT, GALLERY_TABLE, type GalleryItem } from '../lib/content'
import { ACCEPTED_TYPES, describeError, removeImage, uploadImage, validateImage } from './storage'

export const INSTAGRAM_URL = /^https:\/\/(www\.)?instagram\.com\/(p|reel|tv)\/[\w-]+\/?/i

export function createGalleryManager(): HTMLElement {
  const root = document.createElement('div')
  root.className = 'gallery'
  root.innerHTML = `
    <form class="gallery__form" novalidate>
      <div class="gallery__pick">
        <div class="upload__preview upload__preview--square"><img alt="" hidden /><span class="upload__empty">Sem foto</span></div>
        <label class="upload__drop" for="gallery-file">
          <input class="upload__input" id="gallery-file" name="file" type="file" accept="${ACCEPTED_TYPES.join(',')}" />
          <span class="upload__drop-text"><strong>Escolher foto</strong> ou arraste aqui</span>
        </label>
      </div>
      <div class="gallery__fields">
        <div class="field">
          <label for="gallery-alt">Descrição da foto</label>
          <input id="gallery-alt" name="alt" type="text" maxlength="140" required />
          <div class="field__meta"><span>Para quem usa leitor de tela. Ex.: "Tranças nagô com fios dourados".</span></div>
        </div>
        <div class="field">
          <label for="gallery-link">Link do post (opcional)</label>
          <input id="gallery-link" name="link" type="url" inputmode="url" placeholder="https://www.instagram.com/p/..." />
          <div class="field__meta"><span>No Instagram: ••• no post → Copiar link.</span></div>
        </div>
        <div class="upload__actions">
          <button class="btn btn--primary" type="submit">Adicionar ao carrossel</button>
        </div>
        <p class="upload__status" role="status" aria-live="polite"></p>
      </div>
    </form>
    <div class="gallery__list-head">
      <h3>No carrossel</h3>
      <span class="gallery__count"></span>
    </div>
    <ol class="gallery__list"></ol>
  `

  const form = root.querySelector('form') as HTMLFormElement
  const fileInput = form.elements.namedItem('file') as HTMLInputElement
  const altInput = form.elements.namedItem('alt') as HTMLInputElement
  const linkInput = form.elements.namedItem('link') as HTMLInputElement
  const submit = form.querySelector('button[type="submit"]') as HTMLButtonElement
  const status = form.querySelector('.upload__status') as HTMLElement
  const preview = form.querySelector('.upload__preview img') as HTMLImageElement
  const previewEmpty = form.querySelector('.upload__empty') as HTMLElement
  const drop = form.querySelector('.upload__drop') as HTMLElement
  const list = root.querySelector('.gallery__list') as HTMLOListElement
  const count = root.querySelector('.gallery__count') as HTMLElement

  let items: GalleryItem[] = []
  let file: File | null = null
  let previewUrl: string | null = null

  const setStatus = (message: string, state: 'idle' | 'error' | 'success' | 'working' = 'idle') => {
    status.textContent = message
    form.dataset.state = state
  }

  const choose = (f: File | undefined) => {
    if (!f) return
    const problem = validateImage(f)
    if (problem) return setStatus(problem, 'error')
    file = f
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    previewUrl = URL.createObjectURL(f)
    preview.src = previewUrl
    preview.hidden = false
    previewEmpty.hidden = true
    setStatus('')
    altInput.focus()
  }

  fileInput.addEventListener('change', () => choose(fileInput.files?.[0]))
  drop.addEventListener('dragover', (e) => {
    e.preventDefault()
    drop.classList.add('is-over')
  })
  drop.addEventListener('dragleave', () => drop.classList.remove('is-over'))
  drop.addEventListener('drop', (e) => {
    e.preventDefault()
    drop.classList.remove('is-over')
    choose(e.dataTransfer?.files?.[0])
  })

  const resetForm = () => {
    form.reset()
    file = null
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    previewUrl = null
    preview.hidden = true
    previewEmpty.hidden = false
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const alt = altInput.value.trim()
    const link = linkInput.value.trim()
    if (!file) return setStatus('Escolha uma foto primeiro.', 'error')
    if (!alt) {
      altInput.focus()
      return setStatus('Escreva uma descrição curta da foto.', 'error')
    }
    if (link && !INSTAGRAM_URL.test(link)) {
      linkInput.focus()
      return setStatus('Cole o link de um post do Instagram (instagram.com/p/...).', 'error')
    }
    if (items.length >= GALLERY_LIMIT) {
      return setStatus(`O carrossel mostra até ${GALLERY_LIMIT} fotos. Remova uma antes de adicionar.`, 'error')
    }

    submit.disabled = true
    submit.textContent = 'Enviando…'
    setStatus('Otimizando e enviando…', 'working')
    try {
      const { path, url } = await uploadImage('gallery', file, 1200)
      const position = items.length ? Math.min(...items.map((i) => i.position)) - 1 : 0
      const { data, error } = await supabase
        .from(GALLERY_TABLE)
        .insert({ image_url: url, post_url: link || null, alt, position })
        .select()
        .single()
      if (error) {
        await removeImage(path)
        throw error
      }
      items = [data as GalleryItem, ...items]
      render()
      resetForm()
      setStatus('Foto adicionada. Ela já aparece no começo do carrossel.', 'success')
    } catch (err) {
      console.error(err)
      setStatus(describeError(err), 'error')
    } finally {
      submit.disabled = false
      submit.textContent = 'Adicionar ao carrossel'
    }
  })

  async function move(index: number, delta: -1 | 1) {
    const other = index + delta
    if (other < 0 || other >= items.length) return
    const next = items.slice()
    ;[next[index], next[other]] = [next[other], next[index]]
    // Grava a ordem da lista como posição 0..n-1 (só as linhas que mudaram).
    const changed = next.map((item, i) => ({ item, i })).filter(({ item, i }) => item.position !== i)
    const results = await Promise.all(
      changed.map(({ item, i }) => supabase.from(GALLERY_TABLE).update({ position: i }).eq('id', item.id)),
    )
    const failed = results.find((r) => r.error)
    if (failed) return setStatus(describeError(failed.error, 'Não foi possível reordenar.'), 'error')
    next.forEach((item, i) => (item.position = i))
    items = next
    render()
    ;(list.querySelectorAll('li')[other]?.querySelector(`[data-move="${delta}"]`) as HTMLElement | null)?.focus()
  }

  async function remove(index: number) {
    const item = items[index]
    if (!confirm('Remover esta foto do carrossel?')) return
    const { error } = await supabase.from(GALLERY_TABLE).delete().eq('id', item.id)
    if (error) return setStatus(describeError(error, 'Não foi possível remover.'), 'error')
    removeImage(item.image_url)
    items.splice(index, 1)
    render()
    setStatus('Foto removida do carrossel.', 'success')
  }

  function render() {
    count.textContent = `${items.length} de ${GALLERY_LIMIT}`
    if (!items.length) {
      list.innerHTML = '<li class="gallery__empty">Nenhuma foto ainda. Enquanto estiver vazio, o site mostra um link para o perfil do Instagram.</li>'
      return
    }
    list.replaceChildren(
      ...items.map((item, i) => {
        const li = document.createElement('li')
        li.className = 'gallery__item'
        const img = document.createElement('img')
        img.src = item.image_url
        img.alt = ''
        img.loading = 'lazy'
        const text = document.createElement('div')
        text.className = 'gallery__item-text'
        const alt = document.createElement('p')
        alt.textContent = item.alt
        text.appendChild(alt)
        if (item.post_url) {
          const a = document.createElement('a')
          a.href = item.post_url
          a.target = '_blank'
          a.rel = 'noopener'
          a.textContent = 'Ver post'
          text.appendChild(a)
        }
        const actions = document.createElement('div')
        actions.className = 'gallery__item-actions'
        actions.innerHTML = `
          <button class="btn btn--ghost btn--sm" type="button" data-move="-1" ${i === 0 ? 'disabled' : ''}>Subir</button>
          <button class="btn btn--ghost btn--sm" type="button" data-move="1" ${i === items.length - 1 ? 'disabled' : ''}>Descer</button>
          <button class="btn btn--ghost btn--sm btn--danger" type="button" data-remove>Remover</button>`
        actions.querySelectorAll<HTMLButtonElement>('[data-move]').forEach((btn) =>
          btn.addEventListener('click', () => move(i, Number(btn.dataset.move) as -1 | 1)),
        )
        actions.querySelector('[data-remove]')!.addEventListener('click', () => remove(i))
        li.append(img, text, actions)
        return li
      }),
    )
  }

  async function load() {
    list.innerHTML = '<li class="gallery__empty">Carregando…</li>'
    const { data, error } = await supabase
      .from(GALLERY_TABLE)
      .select('id,image_url,post_url,alt,position')
      .order('position', { ascending: true })
      .order('created_at', { ascending: false })
    if (error) {
      list.innerHTML = '<li class="gallery__empty">Não foi possível carregar a galeria. Recarregue a página.</li>'
      return
    }
    items = (data ?? []) as GalleryItem[]
    render()
  }

  load()
  return root
}
