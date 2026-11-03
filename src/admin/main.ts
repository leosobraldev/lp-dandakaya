import './admin.css'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { CONTENT_TABLE, isSupabaseConfigured, type ContentKey, type SiteContent } from '../lib/content'
import { createGalleryManager } from './gallery-manager'
import { createImageUpload } from './image-upload'
import { createTextForm } from './text-form'

type View = 'loading' | 'config' | 'login' | 'recovery' | 'denied' | 'dashboard'

function show(view: View) {
  document.querySelectorAll<HTMLElement>('[data-view]').forEach((el) => {
    el.hidden = el.dataset.view !== view
  })
}

function setUserEmail(email: string) {
  document.querySelectorAll('[data-user-email]').forEach((el) => (el.textContent = email))
}

// ---------- Login ----------

const loginForm = document.getElementById('login-form') as HTMLFormElement
const loginError = loginForm.querySelector('.auth__error') as HTMLElement

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault()
  const data = new FormData(loginForm)
  const email = String(data.get('email') ?? '').trim()
  const password = String(data.get('password') ?? '')
  if (!email || !password) {
    loginError.textContent = 'Preencha e-mail e senha.'
    return
  }

  const button = loginForm.querySelector('button[type="submit"]') as HTMLButtonElement
  button.disabled = true
  button.textContent = 'Entrando…'
  loginError.textContent = ''

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  button.disabled = false
  button.textContent = 'Entrar'
  if (error) {
    loginError.textContent = /invalid login/i.test(error.message)
      ? 'E-mail ou senha incorretos.'
      : 'Não foi possível entrar agora. Tente de novo em instantes.'
  }
  // Sucesso: onAuthStateChange abre o painel.
})

document.getElementById('forgot-password')?.addEventListener('click', async () => {
  const email = (loginForm.elements.namedItem('email') as HTMLInputElement).value.trim()
  if (!email) {
    loginError.textContent = 'Digite seu e-mail acima e clique de novo em "Esqueci a senha".'
    return
  }
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${location.origin}/admin/`,
  })
  loginError.textContent = error
    ? 'Não foi possível enviar o e-mail. Tente de novo em instantes.'
    : 'Se esse e-mail tiver acesso, você vai receber um link para criar uma nova senha.'
})

const recoveryForm = document.getElementById('recovery-form') as HTMLFormElement
recoveryForm.addEventListener('submit', async (e) => {
  e.preventDefault()
  const password = (recoveryForm.elements.namedItem('password') as HTMLInputElement).value
  const err = recoveryForm.querySelector('.auth__error') as HTMLElement
  if (password.length < 8) {
    err.textContent = 'A senha precisa ter pelo menos 8 caracteres.'
    return
  }
  const { error } = await supabase.auth.updateUser({ password })
  if (error) {
    err.textContent = 'Não foi possível salvar a senha. Peça um novo link e tente de novo.'
    return
  }
  const { data } = await supabase.auth.getSession()
  route(data.session)
})

document.querySelectorAll('[data-sign-out]').forEach((btn) =>
  btn.addEventListener('click', () => supabase.auth.signOut()),
)

// ---------- Dashboard ----------

let dashboardFor: string | null = null

async function openDashboard(session: Session) {
  setUserEmail(session.user.email ?? '')

  const { data: isAdmin, error: adminError } = await supabase.rpc('is_admin')
  if (adminError || !isAdmin) {
    show('denied')
    return
  }

  // Evita remontar o painel a cada refresh de token.
  if (dashboardFor === session.user.id) {
    show('dashboard')
    return
  }

  const { data, error } = await supabase.from(CONTENT_TABLE).select('key,value')
  const content: SiteContent = {}
  if (!error) for (const row of data ?? []) content[row.key as ContentKey] = row.value

  const uploads = document.getElementById('uploads')!
  uploads.replaceChildren(
    createImageUpload({
      key: 'hero_image_url',
      label: 'Foto do topo (Hero)',
      hint: 'Aparece no arco ao lado da headline. Vertical, 4:5.',
      shape: 'arch',
      currentUrl: content.hero_image_url,
    }),
    createImageUpload({
      key: 'loja_image_url',
      label: 'Nossa Loja',
      hint: 'Acessórios Dya Muene, linha sensorial ou o ambiente da loja. Vertical, 4:5.',
      shape: 'arch',
      currentUrl: content.loja_image_url,
    }),
    createImageUpload({
      key: 'salao_image_url',
      label: 'Salão Especializado',
      hint: 'Um atendimento ou resultado do salão. Vertical, 4:5.',
      shape: 'bowl',
      currentUrl: content.salao_image_url,
    }),
    createImageUpload({
      key: 'sobre_image_url',
      label: 'Jessika e Jamile',
      hint: 'Foto da seção "Nossa história". Horizontal, 4:3.',
      shape: 'plate',
      // Sem upload, o site usa a foto que já vem com ele.
      currentUrl: content.sobre_image_url || '/fotos/fundadoras.jpg',
    }),
  )

  document.getElementById('gallery')!.replaceChildren(createGalleryManager())

  const texts = document.getElementById('texts')!
  if (error) {
    texts.innerHTML = '<p class="dash__error">Não foi possível carregar os textos. Recarregue a página.</p>'
  } else {
    texts.replaceChildren(createTextForm(content))
  }

  dashboardFor = session.user.id
  show('dashboard')
}

function route(session: Session | null) {
  if (!session) {
    dashboardFor = null
    show('login')
    return
  }
  openDashboard(session)
}

if (!isSupabaseConfigured) {
  show('config')
} else {
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'PASSWORD_RECOVERY') {
      show('recovery')
      return
    }
    // Adia para fora do callback (recomendação do supabase-js para não travar o lock de auth).
    setTimeout(() => route(session), 0)
  })
}
