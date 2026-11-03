-- Dandakayá Espaço Afro: schema do conteúdo editável + Storage de imagens.
-- Rode uma vez em Supabase → SQL Editor.

-- 1. Quem pode editar o site (allowlist). Só usuários listados aqui escrevem.
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

create policy "admin lê a própria linha"
  on public.admins for select
  to authenticated
  using (user_id = auth.uid());

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- 2. Conteúdo do site em pares chave/valor (textos e URLs de imagem).
create table if not exists public.site_content (
  key text primary key,
  value text not null default '',
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

create policy "leitura pública do conteúdo"
  on public.site_content for select
  to anon, authenticated
  using (true);

create policy "admins inserem conteúdo"
  on public.site_content for insert
  to authenticated
  with check (public.is_admin());

create policy "admins atualizam conteúdo"
  on public.site_content for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists site_content_touch on public.site_content;
create trigger site_content_touch
  before update on public.site_content
  for each row execute function public.touch_updated_at();

insert into public.site_content (key, value) values
  ('hero_headline',    'A sua beleza e cultura em um só lugar'),
  ('hero_subheadline', 'Salão de estética negra e uma loja de acessórios ligados à ancestralidade, no Centro de Salvador, em frente à Praça da Piedade.'),
  ('hero_image_url',   ''),
  ('loja_title',       'Loja de acessórios de ancestralidade'),
  ('loja_text',        'Acessórios ligados à ancestralidade negra da linha Dya Muene: búzios, arames e peças voltadas aos orixás e aos Nkisi. E a linha sensorial, com sabonetes e perfumes.'),
  ('loja_image_url',   ''),
  ('salao_title',      'Salão de estética negra em Salvador'),
  ('salao_text',       'Terapia capilar, dreads, tranças e maquiagem para pele preta, feitos por quem entende de cabelo crespo e cacheado. Novidade: estamos abrindo um studio de Lash Designer.'),
  ('salao_image_url',  ''),
  ('sobre_text',       ''),
  ('sobre_image_url',  '')
on conflict (key) do nothing;

-- 3. Galeria do carrossel "No nosso Instagram" (fotos sobem pelo /admin).
create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  post_url text,
  alt text not null default '',
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists gallery_items_order on public.gallery_items (position, created_at desc);

alter table public.gallery_items enable row level security;

create policy "leitura pública da galeria"
  on public.gallery_items for select
  to anon, authenticated
  using (true);

create policy "admins inserem na galeria"
  on public.gallery_items for insert
  to authenticated
  with check (public.is_admin());

create policy "admins atualizam a galeria"
  on public.gallery_items for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "admins removem da galeria"
  on public.gallery_items for delete
  to authenticated
  using (public.is_admin());

-- 4. Storage: bucket público para leitura, escrita só para admins.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('site-images', 'site-images', true, 5242880, array['image/webp', 'image/jpeg', 'image/png'])
on conflict (id) do nothing;

create policy "leitura pública das imagens"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'site-images');

create policy "admins enviam imagens"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'site-images' and public.is_admin());

create policy "admins atualizam imagens"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'site-images' and public.is_admin());

create policy "admins removem imagens"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'site-images' and public.is_admin());

-- 5. Depois de criar o usuário da equipe em Authentication → Users, libere o acesso:
-- insert into public.admins (user_id)
--   select id from auth.users where email = 'equipe@dandakaya.com.br';
