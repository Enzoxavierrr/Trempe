# SPEC-001 — Site público

> Status: rascunho
> Autor: Enzo
> Data: 2026-10-21
> Dependências: [SPEC-000 — Princípios](./SPEC-000-principios.md)
> Referência visual: `design/Landing — Trempe-html/Main.dc.html`, `design/Reserva — checkout-html/Reserva.dc.html`

Esta spec descreve a **experiência pública** do site Trempe: a landing narrativa e o fluxo de reserva. Não cobre o painel admin (SPEC futura) nem o back (SPEC-002 em diante).

---

## 1. Objetivo

Entregar um site público que:

1. **Conta a história** do restaurante em formato editorial de 5 capítulos, honrando a identidade visual já desenhada.
2. **Mostra o cardápio da semana** como um dos capítulos (lido do back, com fallback estático).
3. **Permite reservar mesa** em 4 passos, com feedback de confirmação.

O site deve transmitir o tom do restaurante: fogo lento, pausado, artesanal — não um app de delivery.

---

## 2. Personas e cenários

### 2.1 Comensal curioso
Encontra o Trempe pelo Instagram, abre no celular. Quer saber **o que é a casa** antes de decidir reservar. Lê os capítulos como quem lê uma matéria de revista.
**Sucesso**: lê até o fim e decide reservar.

### 2.2 Comensal decidido
Já conhece o Trempe. Abre o site **só pra reservar**. Precisa de um caminho rápido: topo da landing → "Reservar" → fluxo em 4 passos → confirmação.
**Sucesso**: reserva em menos de 1 min.

### 2.3 Comensal explorando o cardápio
Quer ver **o que tem essa semana** antes de reservar.
**Sucesso**: chega ao Capítulo 04 e vê a lista de pratos atualizada.

---

## 3. Mapa de telas e rotas

| Rota | Tela | Conteúdo |
|---|---|---|
| `/` | Landing | 5 capítulos narrativos + CTA de reserva |
| `/reservar` | Checkout de reserva | 4 passos + resumo lateral |
| `/reservar/confirmada` | Confirmação | Mensagem de sucesso + dados da reserva |

Fora de escopo: `/admin`, `/cardapio` dedicado, páginas legais (política, LGPD).

---

## 4. Linguagem ubíqua aplicada ao front

Reaproveitada da [SPEC-000 §5](./SPEC-000-principios.md). Nomes de componentes e rotas devem refletir estes termos:

- Pessoa que reserva → **comensal** (nunca "cliente", "usuário")
- Seções da landing → **capítulos** (`<Chapter />`, não `<Section />`)
- Horário disponível → **slot** / **service window**
- Prato → **dish**
- Cardápio da semana → **weekly menu**

---

## 5. Design tokens (extraídos dos mockups)

Materializar em `front/src/shared/design-system/tokens/`.

### 5.1 Cores
| Nome | Hex | Uso |
|---|---|---|
| `paper` | `#f3efe7` | Fundo principal |
| `ink` | `#352504` | Texto, bordas, fundo escuro (Cap 05, resumo) |
| `ember` | `#a7321c` | Accent principal (brasa, foco, ponto) |
| `yolk` | `#ffdc68` | Texto sobre `ink` (Cap 05 title), CTA primária |
| `sun` | `#cc982a` | Forma do sol/mesa |
| `earth` | `#928941` | Horta/terra |
| `ink-50` | `#6b5422` | Divisores dentro do painel escuro |
| `paper-dim` | `#e6dccb` | Texto secundário sobre `ink` |

### 5.2 Tipografia
| Nome | Família | Uso |
|---|---|---|
| `serif` | Instrument Serif (regular + itálico) | Títulos grandes, nome em input, label de resumo |
| `sans` | Bricolage Grotesque | Corpo, botões, textarea |
| `mono` | JetBrains Mono | Numeração de capítulos, labels, metadados |

Carregar via Google Fonts com `display=swap`.

### 5.3 Escalas
- **Títulos**: `clamp(84px, 13.5vw, 220px)` (abertura), `clamp(56px, 9vw, 144px)` (capítulo pesado), `clamp(48px, 6vw, 88px)` (capítulo padrão).
- **Corpo**: `20px` (texto de capítulo), `16px` (menu, descrição), `14px` (hint), `13px` (metadado em mono).
- **Line-height**: `0.86` em títulos grandes, `0.92` em capítulos, `1.5` em corpo, `1.6` em mono.
- **Letter-spacing**: `-0.035em` em título mega, `-0.025em` em capítulo, `-0.02em` em itálico, `0.08em` em mono uppercase.

### 5.4 Espaçamento e layout
- Container: `max-width: 1440px`, padding lateral `clamp(16px, 4vw, 64px)`.
- Entre capítulos: `padding-top: 48px`, `padding-bottom: clamp(120px, 14vw, 200px)`.
- Border divisor entre capítulos: `1px solid ink`.
- Gap em flex de capítulo: `48px` ou `64px`.

### 5.5 Formas visuais
- **Brasa**: círculo de `28px`, `background: ember` — ponto final em títulos e símbolo recorrente.
- **Sol+terra** (Cap 02): círculo `sun` de `120px` + semicírculo `earth`.
- **Brasa grande** (Cap 03): círculo `ember` de `200px`.
- **Mesa com brasa** (Cap 05): círculo `sun` de `200px` com círculo `ember` de `28px` no centro.

### 5.6 Radii
- Botões pílula: `999px`.
- Botão de dia (checkout): `4px`.
- Painel resumo (checkout): `4px`.
- Botão redondo de pessoas (checkout): `50%` (56×56).

### 5.7 Foco
- `outline: 2px solid ember`, `outline-offset: 2px` em inputs/textarea.
- `outline: 2px solid ember`, `outline-offset: 3px` em `:focus-visible` de botões/links.

---

## 6. Comportamento por tela

### 6.1 Landing (`/`)

#### Header fixo no topo (não sticky)
- À esquerda: wordmark **TREMPE** em mono.
- Centro: índice vertical dos capítulos (01..05, cada um linka pro `#cap{N}`).
- À direita: link **RESERVAR** com underline, aponta pra `/reservar`.

#### Abertura
- Título gigante: *"Tudo começou com uma brasa."* ("brasa" em itálico, ponto = brasinha `ember`).
- Parágrafo mono à direita: definição `trem·pe` + convite.

#### Capítulo 01 — A primeira brasa
- Metadado mono: `Capítulo 01` / `[ANO]`.
- Título + parágrafo + forma pequena (brasa).

#### Capítulo 02 — A feira decide
- Metadado: `Capítulo 02` / `Toda semana`.
- Forma: sol + terra.

#### Capítulo 03 — O tempo do fogo
- Título mega: *"O fogo tem o seu tempo."*
- Forma: brasa `200px`.

#### Capítulo 04 — O que o fogo entregou (CARDÁPIO)
- Metadado: `Capítulo 04` / `Desta semana`.
- Lista de pratos:
  - Nome em serif grande.
  - Descrição em sans menor.
  - Preço em mono à direita (formato `R$ XX`).
- **Dados**: vem de `GET /api/menu/current-week`. Se a chamada falhar ou retornar vazio, mostra os 5 pratos de fallback do mockup com uma pílula "cardápio em preparo".

#### Capítulo 05 — Falta só você na mesa (CTA)
- Fundo `ink`, texto `yolk`.
- Título mega: *"Falta só você na mesa."*
- Grid 3 colunas com `Endereço` / `Horário` / `Telefone` (valores vêm de config estática em `shared/config/restaurant.ts` por enquanto).
- Botão pílula `yolk` → `/reservar`.

#### Rodapé
- Mono: `TREMPE` / link `Instagram` / `[CIDADE]`.

#### Navegação
- Clique no índice do header rola suavemente até o capítulo (`scroll-behavior: smooth`).
- Links de capítulo e CTA de reserva sempre acessíveis via teclado.

---

### 6.2 Reserva — formulário (`/reservar`)

Fluxo em **4 passos verticais numerados**, com **resumo lateral persistente**.

#### Topo
- Wordmark **TREMPE** linka pra `/`.
- Link **← Voltar à história** com underline, volta pra `/`.

#### Título
- Mega serif: *"Reserve sua mesa."* ("mesa" em itálico, ponto brasa).
- Parágrafo mono: *"Quatro passos. A confirmação chega no seu telefone."*

#### Passo 01 — Quantas pessoas
- 8 botões redondos (56×56, pílula). Valores: 1 a 8.
- Selecionado: `background: ink`, `color: paper`.
- Dica abaixo: *"Mais de 8 pessoas? Fale com a gente: [TELEFONE]."*
- Default: `2`.

#### Passo 02 — Qual dia
- 7 cartões (76×92) representando hoje + próximos 6 dias.
- Cada cartão: label do dia da semana (`hoje`, `seg`, `ter`...) em mono + número em serif grande.
- Selecionado: `background: ink`, `color: paper`.
- Default: hoje.
- Mudar o dia **limpa o horário** selecionado.

#### Passo 03 — Que horas
- Pílulas (min-width 92, altura 48) com horários em mono.
- Dados: `GET /api/reservations/slots?date=YYYY-MM-DD&partySize=N`. Retorna `[{ time, available }]`.
- Slots indisponíveis: `opacity: 0.3`, `line-through`, `cursor: not-allowed`, `disabled`.
- Slot selecionado: `background: ink`, `color: paper`.
- Enquanto carrega: skeleton de 8 pílulas placeholder.
- Erro de rede: mensagem *"Não conseguimos carregar os horários. Tente de novo em um instante."* + botão `Tentar de novo`.

#### Passo 04 — Seus dados
- Campos (todos com label mono em CAPS):
  - **Nome** (obrigatório, `autocomplete="name"`, span 2 colunas, input serif `28px`).
  - **Telefone / WhatsApp** (obrigatório, `type="tel"`, `autocomplete="tel"`, placeholder `(00) 00000-0000`).
  - **E-mail** (opcional, `type="email"`, `autocomplete="email"`).
  - **Observações** (opcional, textarea 2 rows, placeholder *"Aniversário, restrição alimentar, cadeira de bebê…"*).
- Visual: sem border, só underline `1px solid ink`.
- Validação no blur: nome não-vazio, telefone com ≥ 10 dígitos.

#### Resumo lateral
- Painel `ink`, texto `paper`.
- Topo: mono `SUA RESERVA` + brasa.
- Frase grande em serif: *"{N} pessoa(s), {dia}, às {horário}."* — atualiza em tempo real conforme o form.
- Lista com `Mesa` (`Salão, perto do fogo` fixo por ora), `Tolerância` (`15 min`), `Cancelamento` (texto fixo).
- Botão **Confirmar reserva**, pílula `paper` sobre `ink`.
  - **Desabilitado** até: horário selecionado + nome preenchido + telefone preenchido.
  - **Habilitado**: `background: paper`, `color: ink`.
  - **Desabilitado**: `background: ink-50`, `color: paper-dim`.
- Dica dinâmica abaixo do botão:
  - *"Escolha um horário para continuar."*
  - *"Falta seu nome e telefone."*
  - *"Tudo certo. É só confirmar."*

#### Submissão
- `POST /api/reservations` com `{ partySize, date, time, name, phone, email?, notes? }`.
- Durante: botão vira `Confirmando…`, `disabled`.
- Sucesso: navega pra `/reservar/confirmada` passando o nome e os dados via state do router (não via URL).
- Erro conhecido (ex: slot ocupou enquanto preenchia): snackbar vermelha *"Esse horário acabou de ser preenchido. Escolha outro."* + recarrega slots.
- Erro de rede: snackbar *"Não conseguimos enviar sua reserva. Tente de novo."* + botão mantém-se habilitado.

---

### 6.3 Reserva — confirmação (`/reservar/confirmada`)

- Metadado mono: `RESERVA CONFIRMADA`.
- Título mega: *"Até logo, {primeiroNome}."* ("logo" em itálico, ponto brasa).
- Border-top + frase serif: *"{N} pessoa(s), {dia}, às {horário}. A trempe vai estar no fogo."*
- Dois botões:
  - **Alterar reserva** (outline) → volta pra `/reservar` com o form pré-preenchido (fora de escopo nesta primeira versão: pode voltar com o form zerado).
  - **Voltar ao início** (sólido `ink`) → `/`.

Se o usuário cair aqui sem passar pelo fluxo (ex: refresh), redireciona pra `/reservar`.

---

## 7. Comportamento transversal

### 7.1 Responsividade
- **Mobile first.** Tudo precisa funcionar bem em `375×812`.
- Breakpoints: `640` (sm), `1024` (md), `1440` (lg).
- Header da landing colapsa para `wordmark + botão Reservar`; o índice de capítulos vira acordeão ou é escondido.
- Resumo lateral do `/reservar` vira **sticky no rodapé** em mobile (altura mínima com botão sempre visível).

### 7.2 Acessibilidade
- Contraste mínimo WCAG AA em todas as combinações declaradas na seção 5.1.
- Toda interação por teclado (`Tab`, `Enter`, `Space`); foco visível com `outline` `ember`.
- Botões de seleção usam `aria-pressed`.
- Dias usam `aria-label` com forma extensa (`"segunda-feira, 22 de outubro"`).
- `<main>`, `<header>`, `<footer>`, `<nav aria-label>`, `<fieldset>` + `<legend>` já estão no mockup — manter.
- Movimento reduzido: respeitar `prefers-reduced-motion` (desabilitar scroll suave e qualquer animação).

### 7.3 Performance
- LCP < 2.5s em 3G simulada.
- Fontes com `display: swap`.
- Nenhuma imagem pesada no primeiro load (só formas CSS).
- Code-splitting por rota (`/reservar` carrega sob demanda).

### 7.4 Estados globais
- Loading, erro e vazio **sempre** desenhados. Nunca um spinner solto sem contexto.
- Toast/snackbar: componente em `shared/components/` reutilizado em erros do form.

---

## 8. Contratos de API (consumidos, não definidos aqui)

Resumo. Os detalhes são responsabilidade das specs do back.

### `GET /api/menu/current-week`
```json
{
  "weekStart": "2026-10-20",
  "items": [
    { "id": "uuid", "name": "Milho na brasa", "description": "queijo curado, pimenta-de-cheiro", "priceCents": 3800 }
  ]
}
```

### `GET /api/reservations/slots?date=2026-10-23&partySize=4`
```json
{
  "date": "2026-10-23",
  "slots": [
    { "time": "19:00", "available": true },
    { "time": "19:30", "available": true },
    { "time": "20:00", "available": false }
  ]
}
```

### `POST /api/reservations`
```json
// req
{ "partySize": 4, "date": "2026-10-23", "time": "20:00",
  "name": "Enzo", "phone": "11999990000", "email": null, "notes": null }

// 201
{ "id": "uuid", "status": "confirmed",
  "partySize": 4, "date": "2026-10-23", "time": "20:00" }

// 409 — slot ocupado
{ "error": "slot_unavailable", "message": "Horário acabou de ser preenchido." }
```

Formatos exatos serão fechados nas specs do back.

---

## 9. Fora de escopo (nesta versão)

- Painel admin.
- Login de comensal / histórico de reservas.
- Pagamento ou sinal de reserva.
- Editar/cancelar reserva pelo site.
- Notificação por WhatsApp/e-mail (o back pode disparar; o front só mostra a tela de confirmação).
- i18n.
- Modo escuro (a identidade já tem um bloco escuro, mas o site inteiro é claro).
- Políticas (LGPD, termos).

---

## 10. Critérios de aceite

1. Landing renderiza os 5 capítulos conforme §6.1, respeitando os tokens de §5.
2. Clicar em qualquer link do índice do header rola até o capítulo.
3. Clicar em **RESERVAR** no header ou no capítulo 05 leva pra `/reservar`.
4. O capítulo 04 mostra o cardápio da semana vindo da API, ou fallback estático se a API falhar.
5. O fluxo `/reservar` permite completar 4 passos com teclado apenas.
6. O botão **Confirmar reserva** só habilita quando horário + nome + telefone estão preenchidos.
7. Mudar o dia selecionado zera o horário.
8. Submissão com sucesso redireciona pra `/reservar/confirmada` mostrando o primeiro nome.
9. Submissão com conflito (`409`) recarrega os slots e mostra snackbar.
10. Em `375×812` nenhum conteúdo gera scroll horizontal.
11. Testes `axe-core` passam sem erro crítico nas três rotas.
12. Build de produção < 200kb JS no caminho `/`.

---

## 11. Arquitetura mapeada à estrutura de pastas

Mapeamento das peças desta spec para o layout do front definido em [SPEC-000 §4](./SPEC-000-principios.md).

```
front/src/
├── app/
│   ├── providers/            → QueryClient, Router (BrowserRouter)
│   └── router/               → routes.tsx (/, /reservar, /reservar/confirmada)
│
├── features/
│   ├── landing/
│   │   ├── pages/LandingPage.tsx
│   │   ├── sections/         → Opening.tsx, Chapter01..Chapter05.tsx
│   │   └── components/       → Chapter.tsx (wrapper), ChapterIndex.tsx, EmberDot.tsx
│   │
│   ├── menu/
│   │   ├── api/useCurrentWeekMenu.ts   → TanStack Query
│   │   └── components/MenuList.tsx     → usado dentro de Chapter04
│   │
│   └── reservations/
│       ├── pages/
│       │   ├── ReservationPage.tsx
│       │   └── ReservationConfirmedPage.tsx
│       ├── components/
│       │   ├── PartySizePicker.tsx
│       │   ├── DayPicker.tsx
│       │   ├── TimeSlotPicker.tsx
│       │   ├── ContactForm.tsx
│       │   └── ReservationSummary.tsx
│       ├── hooks/
│       │   ├── useReservationDraft.ts  → estado local (reducer)
│       │   └── useAvailableSlots.ts
│       ├── api/
│       │   ├── useAvailableSlots.ts    → GET /reservations/slots
│       │   └── useCreateReservation.ts → POST /reservations
│       └── types/reservation.ts
│
├── shared/
│   ├── api/
│   │   └── httpClient.ts     → fetch wrapper (baseURL, erro padronizado)
│   ├── components/
│   │   ├── Toast.tsx
│   │   ├── Button.tsx
│   │   └── Pill.tsx
│   ├── design-system/
│   │   └── tokens/           → colors.ts, fonts.ts, spacing.ts, radii.ts
│   ├── config/
│   │   └── restaurant.ts     → endereço, horário, telefone fixos
│   └── lib/
│       ├── formatPrice.ts
│       └── formatDate.ts
│
└── styles/
    └── globals.css           → reset, variáveis CSS dos tokens, prefers-reduced-motion
```

---

## 12. Próximos passos (fora desta spec)

- **PLAN-001**: traduzir esta spec para plano técnico (quais libs exatas, config do Tailwind, roteamento).
- **SPEC-002**: solicitar reserva (back) — define as regras de negócio das reservas que esta UI consome.
- **SPEC-003**: cardápio da semana (back).
- **SPEC-004**: painel admin.
