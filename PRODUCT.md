# Product


## Platform

web

## Stack

Vite (multi-page) + TypeScript puro, sem framework. Supabase (Auth, Postgres, Storage) como backend. Escolha confirmada pelo usuário. Node local é v14 (Vite 4); recomendado migrar para Node 20+.

## Users

- **Visitante (cliente):** mulheres e homens negros de Salvador, majoritariamente no celular, chegando pelo Instagram ou indicação, querendo saber o que o espaço oferece e agendar/comprar pelo WhatsApp.
- **Equipe (admin):** as fundadoras e a equipe do Dandakayá, atualizando textos, fotos e o carrossel sem depender de desenvolvedor.

## Product Purpose

Landing page que converte visitas em conversas no WhatsApp, apresentando o salão e a loja. Sucesso = cliques no WhatsApp.

## Positioning

Um único endereço no Centro de Salvador, das irmãs Jessika e Jamile: salão especializado em estética negra e uma loja com as linhas da própria casa, ligadas à ancestralidade negra. Beleza e cultura negra no mesmo lugar, num negócio de mulheres negras.

## Operating Context

- Contato e agendamento: WhatsApp +55 71 99192-1326 (`https://wa.me/5571991921326`).
- Vitrine contínua: Instagram @dandakaya (https://www.instagram.com/dandakaya/). O carrossel do site é próprio: a equipe sobe as fotos e cola o link do post no /admin (escolha do usuário em 2026-11-03, no lugar de widget de terceiros). Não sincroniza sozinho com o Instagram.
- Endereço: Av. Sete de Setembro, 624 - Sala 103, Barris (em frente à Praça da Piedade), Centro, Salvador - BA, 40060-001.
- Google Maps: "DandaKayá - Espaço Afro", coordenadas -12.9829419, -38.5156852.

## Capabilities and Constraints

- Conteúdo editável em /admin (Supabase): headline, subtítulo, títulos e textos da loja e do salão, texto "Nossa história", fotos do Hero, da loja, do salão e das fundadoras, e a galeria do carrossel (até 24 fotos, com link do post e descrição).
- /admin: login por e-mail/senha (Supabase Auth); só usuários na tabela `admins` escrevem.
- Headline fixa por briefing: "A sua beleza e cultura em um só lugar".
- **Loja** (confirmado por Jamile no WhatsApp, 2026-11-03; não é mais colaborativa): vende as linhas da casa.
  - **Dya Muene**: linha de acessórios voltados à ancestralidade negra (búzios, arames, peças voltadas aos orixás, Nkisi etc.).
  - **Linha sensorial**: sabonetes e perfume.
  - Não é loja de moda/roupa.
- **Salão** (mesma fonte): terapia capilar, dreads, tranças, maquiagem para pele preta, entre outros. Novidade: "na nova Dandakayá" estão abrindo um studio de Lash Designer.
- **Em aberto:** preços e lista completa de serviços; história completa das irmãs; horário de funcionamento; CNPJ (`.env`); fotos do salão e da loja (a cliente vai enviar). Marcados com `TODO(conteúdo)` em `index.html`.

## Brand Commitments

- Nome: Dandakayá Espaço Afro.
- Fundadoras: as irmãs Jessika e Jamile (grafia informada pela cliente).
- Paleta pedida pelo cliente: fundo off-white/areia, terracota, laranja queimado, texto marrom profundo.
- Logo oficial (imagens enviadas em 2026-11-03; redesenhado em vetor em `public/logo/` com correções da cliente: o "n" de Danda é verde-petróleo e se liga ao "á" de Kayá; a cauda nasce da perna do "á"; o acento do "á" é verde-petróleo): "Danda / Kayá" em letras finas cor de ouro (#9A7B3F), cauda de sereia em verde-petróleo (#00425C), "— ESPAÇO AFRO —" em verde-petróleo, sobre um círculo branco. Ouro e verde-petróleo são cores da marca; devem aparecer na identidade, não ser substituídas.

## Evidence on Hand

- `public/fotos/fundadoras.jpg`: foto real de Jessika e Jamile enviada pela cliente (2026-11-03).
- Nenhum depoimento, número ou dado de clientes. Não fabricar depoimentos, números, produtos ou horários.

## Product Principles

1. Todo caminho termina no WhatsApp.
2. A equipe precisa conseguir atualizar a página sozinha.
3. Mobile e conexão lenta primeiro: a página tem que ser leve.
4. Cultura negra soteropolitana é o centro, não decoração.

## Accessibility & Inclusion

WCAG 2.1 AA: contraste, foco visível, acordeão e carrossel acessíveis por teclado, respeito a prefers-reduced-motion.
