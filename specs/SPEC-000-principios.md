# SPEC-000 — Princípios do Projeto

> Status: ativo
> Autor: Enzo
> Data: 2026-10-21

Este documento é a **constituição** do projeto Trempe. Define a visão, a filosofia de arquitetura, as decisões técnicas inegociáveis e o vocabulário comum. Toda outra spec, plano e código deve se alinhar a ele. Mudanças aqui exigem revisão explícita.

---

## 1. Visão do produto

**Trempe** é um sistema para um restaurante de fogo lento com cardápio sazonal, que muda com o que chega da feira. O produto suporta duas experiências:

- **Pública** — site institucional em formato narrativo (5 capítulos), cardápio da semana e reserva de mesa.
- **Interna** — painel do restaurante para publicar o cardápio da semana e gerir reservas.

O projeto também é um **laboratório de estudo** de SDD, DDD, Clean Architecture, .NET e React. A qualidade arquitetural importa tanto quanto a funcionalidade entregue.

---

## 2. Princípios fundamentais

### 2.1 Spec-Driven Development (SDD)
Toda mudança de comportamento começa por uma spec. **Nenhuma linha de código de produção é escrita antes de a spec correspondente estar aprovada.** O fluxo é:

```
SPEC → PLAN → TASKS → CÓDIGO
```

- `specs/` descreve **o quê e o porquê** em linguagem do negócio.
- `plans/` descreve **o como** técnico derivado da spec.
- `tasks/` quebra o plano em passos executáveis.
- Código implementa o que foi acordado, não o contrário.

Se durante a implementação surgir uma dúvida de comportamento, **a spec é atualizada antes do código**.

### 2.2 Domain-Driven Design (DDD)
O código é organizado em torno do domínio, não da tecnologia. Isso significa:

- **Linguagem ubíqua**: termos do negócio aparecem literalmente no código.
- **Bounded Contexts** isolados (`Reservations`, `Menu`, `Identity`), cada um com seu próprio modelo.
- **Agregados** controlam suas invariantes; regras de negócio não vivem em `if` solto nem em services anêmicos.
- **Value Objects** encapsulam conceitos (ex: `PartySize`, `ServiceWindow`) com validação no construtor.
- **Domain Events** representam fatos consumados no negócio.

### 2.3 Clean Architecture
Dependências apontam sempre pro domínio:

```
Api → Application → Domain ← Infrastructure
```

- `Domain` não importa nada de fora. C# puro.
- `Application` depende só de `Domain` e das próprias *ports* (interfaces).
- `Infrastructure` implementa as *ports* (Dapper, Postgres, Clock).
- `Api` traduz HTTP e injeta tudo.

### 2.4 Pragmatismo sobre pureza
Começamos **simples e básico**. Ferramentas robustas entram **quando a dor aparece**, não por antecipação:

- Sem FluentValidation agora — validação na borda com código próprio.
- Sem Serilog agora — logging padrão do .NET.
- Sem MediatR agora — handlers como classes injetadas direto.
- Sem AutoMapper/Mapster agora — mapeamento explícito.
- Sem EF Core — Dapper + SQL cru para aprender SQL de verdade.

**Regra**: adicionar uma lib é uma decisão arquitetural que entra numa spec dedicada.

### 2.5 Testabilidade como critério de design
Se não dá pra testar o agregado sem subir banco nem servidor, o desenho está errado. Testes de domínio são rápidos, puros e numerosos; testes de integração validam infra.

---

## 3. Stack e decisões técnicas (ADR condensado)

| Camada | Escolha | Motivo |
|---|---|---|
| Back — linguagem | C# 12 / .NET 8 | Ecossistema maduro pra DDD, tipagem forte, boas abstrações para VO/Aggregate |
| Back — HTTP | ASP.NET Core **Minimal APIs** | Enxuto, didático, menos cerimônia que Controllers |
| Back — persistência | **Dapper** + Npgsql | SQL explícito, aprendizado real de banco; sem leaky abstractions de ORM |
| Back — banco | PostgreSQL | Postgres é o padrão sério; roda em Docker local |
| Back — migrations | Scripts `.sql` numerados | Simples e versionável; runner entra se incomodar |
| Back — testes | xUnit | Padrão .NET; sem FluentAssertions por enquanto |
| Front — framework | React 18 + Vite | Rápido, moderno, DX boa |
| Front — linguagem | TypeScript strict | Contratos explícitos, menos bug em runtime |
| Front — roteamento | React Router | Padrão de facto |
| Front — estado remoto | TanStack Query | Cache de API, invalidation, loading states prontos |
| Front — estilo | Tailwind + tokens | Honra a identidade visual (SPEC-000a) sem CSS global solto |
| Monorepo | Nenhum tooling (pnpm/turbo) agora | Front e back são projetos independentes; integração via HTTP |

**O que fica fora, por decisão deliberada:**
- Microservices
- Event Sourcing
- Message brokers (RabbitMQ, Kafka)
- CQRS com buses separados
- Autenticação OAuth/social — login simples do admin via JWT quando chegar a hora

---

## 4. Estrutura de pastas

```
Trempe/
├── specs/          — SDD: o quê e o porquê
├── plans/          — SDD: o como técnico
├── tasks/          — SDD: checklist executável
├── design/         — mockups de referência (não é código)
│
├── back/           — Clean Architecture (.NET 8)
│   ├── Trempe.Domain/
│   ├── Trempe.Application/
│   ├── Trempe.Infrastructure/
│   ├── Trempe.Api/
│   └── tests/
│
└── front/          — Feature-based (React + Vite + TS)
    └── src/
        ├── app/            — shell: providers, router
        ├── features/       — espelha os bounded contexts do back
        ├── shared/         — reutilizável entre features
        ├── assets/
        └── styles/
```

**Regras:**
- Features do front espelham bounded contexts do back (`reservations` ↔ `Reservations`).
- Nunca criar código em `shared/` prematuramente; só promove quando duas features precisam.
- `design/` é referência visual, não participa do build.

---

## 5. Linguagem ubíqua (glossário)

Estes termos têm **um e apenas um** significado no projeto. Specs, código, commits e conversas devem usá-los consistentemente.

| Termo | Significado |
|---|---|
| **Comensal** | Pessoa que faz uma reserva ou vai jantar. Não "cliente", não "usuário". |
| **Reserva** | Pedido de mesa para uma data/horário com tamanho de grupo. Tem ciclo de vida: `solicitada → confirmada → sentada \| no-show \| cancelada`. |
| **Service window** | Janela de serviço (ex: jantar das 19h às 23h de uma data). Reservas pertencem a uma service window. |
| **Capacidade** | Número máximo de comensais simultâneos numa service window. |
| **Prato** | Item individual do cardápio. Tem nome, descrição e preço. |
| **Cardápio da semana** | Coleção de pratos ativos numa semana específica. Só um cardápio por semana pode estar publicado. |
| **No-show** | Reserva confirmada em que ninguém apareceu. Estado terminal. |
| **Admin** | Pessoa do restaurante que opera o painel interno. |
| **Capítulo** | Seção narrativa da landing (Cap 01..05). Termo visual, não de domínio. |

---

## 6. Convenções

### 6.1 Specs
- Nomenclatura: `SPEC-NNN-slug-curto.md` (ex: `SPEC-002-solicitar-reserva.md`).
- Numeração sequencial, nunca reaproveitada.
- Template fixo em `specs/_template.md` (a criar).

### 6.2 Commits
- Formato Conventional Commits: `feat: ...`, `fix: ...`, `refactor: ...`, `chore: ...`, `docs: ...`.
- Mensagem no imperativo, em inglês, curta.
- Corpo em português quando precisar de contexto.
- Um commit = uma mudança coesa.

### 6.3 Branches
- `main` é sempre deployável.
- Feature branches: `feat/spec-NNN-slug` ou `fix/slug`.
- Merge via PR local (mesmo trabalhando sozinho) — ajuda a revisar o próprio trabalho.

### 6.4 Nomenclatura no código
- **Back (C#)**: `PascalCase` para tipos/métodos, `camelCase` para locais, `_camelCase` para fields privados.
- **Front (TS)**: `PascalCase` para componentes/tipos, `camelCase` para funções/variáveis, `kebab-case` para arquivos de página e rotas.
- **Nomes refletem o domínio.** Se a spec diz "solicitar reserva", a classe é `RequestReservation`, não `CreateReservation`.

### 6.5 Erros de negócio
- Back: usar `Result<T>` para erros esperados; exceções apenas para o inesperado.
- Front: estados explícitos (`loading | error | success`); nunca engolir erro silenciosamente.

### 6.6 Idioma
- **Código**: inglês (nomes de classes, métodos, variáveis).
- **Specs, planos, tasks, comentários não-triviais, PRs**: português.
- **Mensagens para o comensal (UI)**: português.

---

## 7. Definition of Done (por feature)

Uma feature está pronta quando:

1. A spec correspondente está escrita, revisada e no `main`.
2. O plano técnico derivado está escrito.
3. O domínio tem testes unitários cobrindo as invariantes da spec.
4. O caso de uso tem teste unitário com fakes.
5. O endpoint tem ao menos um teste de integração do caminho feliz.
6. O front consome o endpoint com estados de `loading` e `erro` tratados.
7. O código passa no build e nos testes.
8. Commit atômico com mensagem clara.
9. Nenhum TODO ou `console.log` deixado no código.
10. A `linguagem ubíqua` foi respeitada em todas as camadas.

---

## 8. O que NÃO entra sem spec dedicada

- Nova dependência (lib, pacote NuGet, pacote npm).
- Novo bounded context.
- Mudança de estrutura de pastas acordada.
- Mudança numa invariante de agregado existente.
- Novo endpoint HTTP.

---

## 9. Decisões em aberto

Lista viva. Cada item vira (ou não) uma spec quando ganhar urgência.

- Autenticação do admin (JWT simples × Identity Server × algo managed).
- Deploy — provedor e estratégia.
- Observabilidade — quando adicionar logs estruturados, métricas, tracing.
- i18n — se o site precisará suportar outro idioma além do pt-BR.
- Pagamento/sinal de reserva — se reservas vão exigir caução.

---

## 10. Como evoluir esta spec

- Alterações pontuais: PR com justificativa no corpo.
- Alterações estruturais (ex: trocar Dapper por EF): abrir **SPEC-ADR-NNN** dedicada, decidir, e **só então** atualizar esta.
- Depreciar um princípio: marcar `~~tachado~~` com link para a spec que o substitui, nunca apagar silenciosamente.
