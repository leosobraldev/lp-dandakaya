// Formulário de textos editáveis (headline e descrições).
import { supabase } from '../lib/supabase'
import { CONTENT_TABLE, type ContentKey, type SiteContent } from '../lib/content'

interface Field {
  key: ContentKey
  label: string
  hint?: string
  maxLength: number
  multiline?: boolean
  rows?: number
}

interface FieldGroup {
  title: string
  fields: Field[]
}

const GROUPS: FieldGroup[] = [
  {
    title: 'Topo da página',
    fields: [
      { key: 'hero_headline', label: 'Headline', maxLength: 80, hint: 'Frase principal, em letras grandes.' },
      { key: 'hero_subheadline', label: 'Subtítulo', maxLength: 220, multiline: true, rows: 3 },
    ],
  },
  {
    title: 'Nossa Loja',
    fields: [
      { key: 'loja_title', label: 'Título', maxLength: 40 },
      { key: 'loja_text', label: 'Descrição', maxLength: 400, multiline: true, rows: 4 },
    ],
  },
  {
    title: 'Salão Especializado',
    fields: [
      { key: 'salao_title', label: 'Título', maxLength: 40 },
      { key: 'salao_text', label: 'Descrição', maxLength: 400, multiline: true, rows: 4 },
    ],
  },
  {
    title: 'Nossa história',
    fields: [
      {
        key: 'sobre_text',
        label: 'Texto sobre Jessika e Jamile',
        maxLength: 1500,
        multiline: true,
        rows: 8,
        hint: 'Deixe uma linha em branco entre os parágrafos. Se ficar vazio, o site mostra o texto padrão.',
      },
    ],
  },
]

export function createTextForm(initial: SiteContent): HTMLFormElement {
  const form = document.createElement('form')
  form.className = 'text-form'
  form.noValidate = true

  for (const group of GROUPS) {
    const fieldset = document.createElement('fieldset')
    fieldset.className = 'text-form__group'
    const legend = document.createElement('legend')
    legend.textContent = group.title
    fieldset.appendChild(legend)

    for (const field of group.fields) fieldset.appendChild(renderField(field, initial[field.key] ?? ''))
    form.appendChild(fieldset)
  }

  const footer = document.createElement('div')
  footer.className = 'text-form__footer'
  footer.innerHTML = `
    <p class="text-form__status" role="status" aria-live="polite"></p>
    <button class="btn btn--primary" type="submit" disabled>Salvar textos</button>
  `
  form.appendChild(footer)

  const submit = footer.querySelector('button') as HTMLButtonElement
  const status = footer.querySelector('.text-form__status') as HTMLElement
  const controls = () =>
    Array.from(form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[name]'))

  let saved: SiteContent = { ...initial }
  const dirtyKeys = () => controls().filter((c) => c.value.trim() !== (saved[c.name as ContentKey] ?? '').trim())

  const refresh = () => {
    const dirty = dirtyKeys().length > 0
    form.toggleAttribute('data-dirty', dirty)
    submit.disabled = !dirty
    if (dirty) status.textContent = 'Alterações não salvas.'
  }

  form.addEventListener('input', (e) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement
    const counter = form.querySelector<HTMLElement>(`[data-counter="${target.name}"]`)
    if (counter) counter.textContent = `${target.value.length}/${target.maxLength}`
    refresh()
  })

  window.addEventListener('beforeunload', (e) => {
    if (form.hasAttribute('data-dirty')) e.preventDefault()
  })

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const changed = dirtyKeys()
    if (!changed.length) return

    const required = changed.find((c) => c.name !== 'sobre_text' && !c.value.trim())
    if (required) {
      status.textContent = 'Esse campo não pode ficar vazio.'
      required.focus()
      return
    }

    submit.disabled = true
    submit.textContent = 'Salvando…'
    const rows = changed.map((c) => ({ key: c.name, value: c.value.trim() }))
    const { error } = await supabase.from(CONTENT_TABLE).upsert(rows)
    submit.textContent = 'Salvar textos'

    if (error) {
      console.error(error)
      status.textContent = /row-level security/i.test(error.message)
        ? 'Sua conta não tem permissão para alterar o site.'
        : 'Não foi possível salvar. Verifique a conexão e tente de novo.'
      submit.disabled = false
      return
    }

    for (const row of rows) saved[row.key as ContentKey] = row.value
    saved = { ...saved }
    refresh()
    status.textContent = `Salvo. ${rows.length === 1 ? '1 campo atualizado' : `${rows.length} campos atualizados`} no site.`
  })

  return form
}

function renderField(field: Field, value: string): HTMLElement {
  const id = `field-${field.key}`
  const wrap = document.createElement('div')
  wrap.className = 'field'

  const label = document.createElement('label')
  label.htmlFor = id
  label.textContent = field.label

  const control = field.multiline ? document.createElement('textarea') : document.createElement('input')
  control.id = id
  control.name = field.key
  control.maxLength = field.maxLength
  control.value = value
  if (control instanceof HTMLTextAreaElement) control.rows = field.rows ?? 3
  else control.type = 'text'

  const meta = document.createElement('div')
  meta.className = 'field__meta'
  if (field.hint) {
    const hint = document.createElement('span')
    hint.id = `${id}-hint`
    hint.textContent = field.hint
    control.setAttribute('aria-describedby', hint.id)
    meta.appendChild(hint)
  }
  const counter = document.createElement('span')
  counter.className = 'field__counter'
  counter.dataset.counter = field.key
  counter.textContent = `${value.length}/${field.maxLength}`
  meta.appendChild(counter)

  wrap.append(label, control, meta)
  return wrap
}
