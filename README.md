# Dandakayá Espaço Afro

Landing page (`/`) + painel administrativo (`/admin/`), em Vite multi-página com TypeScript puro e Supabase.

## Estrutura

```
lp-dandakaya/
├── index.html                  # Landing (rota /). Conteúdo padrão já no HTML → zero JS para a 1ª pintura
├── admin/
│   └── index.html              # Painel (rota /admin/). Entry separado, noindex
├── public/
│   ├── favicon.svg             # Ícone da aba (cauda do logo sobre areia) + apple-touch-icon.png
│   ├── logo/                   # Logo redesenhado em vetor: completo, sem tagline, pequeno (header), círculo, cauda
│   └── fotos/fundadoras.jpg    # Foto padrão de Jessika e Jamile (troca pelo /admin)
├── src/
│   ├── lib/
│   │   ├── content.ts          # Contrato do conteúdo (chaves) + leitura pública via REST (sem supabase-js)
│   │   └── supabase.ts         # Cliente Supabase completo (Auth/Storage/DB), usado só pelo admin
│   ├── landing/
│   │   ├── main.ts             # Aplica conteúdo do backend, menu, revelação ao rolar
│   │   ├── carousel.ts         # Carrossel "No nosso Instagram" (fotos da galeria do /admin)
│   │   └── landing.css
│   ├── admin/
│   │   ├── main.ts             # Login, recuperação de senha, checagem de admin, montagem do dashboard
│   │   ├── storage.ts          # Otimização no navegador (WebP) + upload/remoção no Storage
│   │   ├── image-upload.ts     # Componente de upload → Storage → URL salva em site_content
│   │   ├── gallery-manager.ts  # Galeria do carrossel: adicionar, ordenar, remover
│   │   ├── text-form.ts        # Edição de headline e descrições
│   │   └── admin.css
│   └── styles/tokens.css       # Paleta, fontes, raios, espaçamento
├── supabase/schema.sql         # Tabelas, RLS, bucket e policies
├── vite.config.ts              # Declara os dois entries (main + admin)
└── .env                        # Chaves e dados do negócio (não versionar)
```


## Configurar o Supabase

1. Crie um projeto em https://supabase.com.
2. **SQL Editor** → cole e rode `supabase/schema.sql`.
3. **Authentication → Providers → Email**: deixe ativo e **desative "Allow new users to sign up"**.
4. **Authentication → Users → Add user**: crie o usuário da equipe (e-mail + senha).
5. Libere o acesso dele no SQL Editor:
   ```sql
   insert into public.admins (user_id)
     select id from auth.users where email = 'equipe@exemplo.com';
   ```
6. **Authentication → URL Configuration**: adicione `https://SEU-DOMINIO/admin/` (e `http://localhost:5173/admin/`) em Redirect URLs, para o "Esqueci a senha".
7. **Project Settings → API**: copie a URL e a `anon` key para o `.env`.

## `.env`

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_WHATSAPP_NUMBER=5571991921326
VITE_CNPJ=[a informar]
```

A `anon` key é pública por design; quem protege os dados são as policies RLS do `schema.sql`.

## Rodar

```bash
npm install
npm run dev        # http://localhost:5173  e  http://localhost:5173/admin/
npm run build      # gera dist/ com index.html e admin/index.html
```

Node 14 roda (Vite 4). Recomendado atualizar para Node 20+ e migrar para Vite 5/6.

## Carrossel do Instagram

No /admin → "Carrossel do Instagram": escolha a foto, escreva uma descrição curta e cole o link do post (no Instagram: ••• → Copiar link). A ordem da lista é a ordem do carrossel. Ele não sincroniza sozinho com o Instagram; enquanto a galeria estiver vazia, o site mostra um link para o perfil.

## Deploy

Qualquer host estático (Vercel, Netlify, Cloudflare Pages). Build: `npm run build`, pasta: `dist`. Configure as variáveis `VITE_*` no painel do host.

## Pendências de conteúdo

Procure por `TODO(conteúdo)` em `index.html`:
- História completa de Jessika e Jamile (também editável em /admin → "Nossa história").
- Horário de funcionamento (FAQ).
- Fotos do salão e da loja (enviar pelo /admin).
- CNPJ no `.env`.
- `VITE_SITE_URL` no `.env` (endereço do site), para a prévia de link do WhatsApp/Instagram mostrar o logo.
