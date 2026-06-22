---
name: automacoes-lpsg
description: >
  Use esta skill sempre que o usuário quiser construir, configurar, debugar
  ou diagnosticar automações para um lançamento pago semanal (LPSG).
  Trigger para: "automação do lançamento", "n8n LPSG", "ManyChat LPSG",
  "fluxo de captação", "webhook Hotmart", "Meta CAPI server-side",
  "automação WhatsApp Business API", "automatizar lembretes das aulas",
  "tsunami automatizado", "carrinho aberto SLA closer", "recuperação D+1
  D+7 automatizada", "checkout iniciado alerta", "ficha de interesse
  Typeform", "Google Sheets como storage do lançamento", "health check do
  evento", "alerta Slack se workflow caiu", "disaster recovery LPSG",
  "configurar webhook hotmart no n8n", "templates Utility automação".
  Cobre: arquitetura 3 camadas (n8n + ManyChat + Sheets), 13 workflows
  base (captação · evento · tsunami · recuperação), integrações (Hotmart,
  Meta WABA, Meta CAPI, Google Sheets, YouTube Live, ManyChat), motor de
  alertas (Slack/Telegram/SMS), health check, disaster recovery.
---

# Automações LPSG — n8n + ManyChat + Integrações

## Identidade

Você constrói as automações de um lançamento pago semanal **perpétuo**. Stack canônica: **n8n (orquestrador) + ManyChat (chatbot WhatsApp/Insta) + Google Sheets (storage)** + integrações (Hotmart · Meta WABA · Meta CAPI · YouTube · Typeform).

**LPSG é PERPÉTUO** · começa segunda · termina domingo · carrinho abre na segunda seguinte. Toda semana há **2 ciclos em paralelo** (aulas + carrinho) e **captação 24/7** alimentando o próximo ciclo. As automações precisam refletir isso: cron toda semana · transição automática de fases · workflows nunca pausam.

Automação LPSG ≠ "fluxo bonitinho no n8n". É **infra crítica**: se o disparo das 06:50 falhar, R$ 80k em vendas evaporam — e isso acontece TODA SEGUNDA, não 1x por mês. Por isso: **3 camadas independentes**, **health check ativo**, **disaster recovery documentado**, **alerta em ≤5min**.

---

## Quando ativar

Ative esta skill quando o usuário pedir qualquer uma das abaixo:

- Configurar n8n pra um lançamento (workflows + integrações)
- Conectar Hotmart webhook ao n8n
- Configurar Meta WABA Cloud API + templates
- Implementar Meta CAPI (server-side conversions)
- Automatizar disparos das aulas (lembretes · áudios noturnos)
- Implementar tsunami (4 janelas com cron preciso)
- Configurar SLA do closer (≤5min)
- Sequência de recuperação D+1 a D+7 (híbrido bot/humano)
- Health check + alertas Slack/Telegram
- Disaster recovery (plano B do tsunami · WABA secundário)
- Migrar de Make/Zapier pra n8n
- Diagnosticar workflow caído

---

## Stack canônica (FIXA)

```yaml
ORQUESTRADOR:             "n8n (cloud Pro · ou self-hosted Docker)"
CHATBOT_WPP:              "ManyChat (Pro)"
STORAGE:                  "Google Sheets (Service Account)"
INTEGRACOES:              "Hotmart · WABA · CAPI · YouTube · Typeform"
HOSPEDAGEM_N8N:           "n8n.cloud OU VPS R$30/mês"
```

> **Mesma stack que outras estruturas LPSG referenciam.** Consistência total entre estruturas.

---

## Os 13 workflows base + 1 health check + transição de fase

```
01 · Captação anúncio→página         (Pixel + CAPI deduplicado)
02 · Compra de ingresso              (Hotmart webhook)
03 · Onboarding pós-compra           (10min após · ManyChat)
04 · Lembretes pré-aula              (5 crons · 06:45 seg-sex)
05 · Áudios noturnos                 (5 crons · 20h)
06 · Ficha de interesse              (Aula 4 · Typeform)
07 · Aquecimento pré-pitch           (4 disparos sáb-dom)
08 · Tsunami · 4 janelas             (06:50 · 07:00 · 08:00 · 10:00 · 23:00)
09 · Checkout iniciado · SLA closer  (≤5min · Slack/Telegram)
10 · Compra do produto               (Hotmart webhook)
11 · Recuperação D+1 a D+7           (80/20 bot/humano)
12 · Pico ao vivo (YT API)           (cron 5min durante lives)
13 · Vendas ao vivo (Hotmart)        (cron 30s durante carrinho)
14 · Transição de fase (TAG)         (cron 23:50 · move PASSADO→PRESENTE→FUTURO→EX-ALUNO)
99 · Health check                    (cron 5min · monitora tudo)
```

---

## Sistema de tags + 4 fases (CRÍTICO)

Cada lead carrega:

```yaml
TAG_IDENTIDADE:           "LPSG-W{NN}"                # NN = ISO week do ano do evento
                                                      # ex: 12-18 mai 2026 → LPSG-W20

TAG_FASE_ATUAL:           "LPSG-W{NN}-{FASE}"         # transiciona automaticamente
  PASSADO:                "Semana ANTERIOR ao evento (captação · aquecimento)"
  PRESENTE:               "Semana DO evento (segunda a domingo · 5 aulas + pitch)"
  FUTURO:                 "Semana DO carrinho (segunda a sexta · 4 janelas)"
  EX-ALUNO:               "Pós carrinho fechar"

TAG_GLOBAL:               "EX-ALUNO-LPSG"             # adicionada na 1ª transição p/ EX-ALUNO
```

**Mensageria por fase:**
- PASSADO  → captação · onboarding ingresso · aquecimento
- PRESENTE → lembretes de aula · áudios noturnos · ficha (qui)
- FUTURO   → tsunami · 4 janelas · SLA closer · urgência crescente
- EX-ALUNO → recuperação tardia (D+1 a D+7) · cooldown 14d · re-engagement

> Ver `08-sistema-de-tags-e-fases.md` pra workflow de transição automática (cron 23:50).

---

## Princípios de execução

1. **Sempre 3 camadas independentes.** n8n / ManyChat / Sheets desacoplados. Um cair não derruba os outros.
2. **Validar TUDO no webhook.** HOTTOK do Hotmart, X-Hub-Signature da Meta, header secret próprio entre n8n e ManyChat.
3. **80% Utility / 20% Marketing** nos disparos WPP. Economia de R$ 65k/mês.
4. **Sheets é a fonte da verdade.** Todo lead tem 1 row com estado atual. Workflows leem e escrevem aqui.
5. **Tokens em `.env`.** Nunca hardcode. Service Account com permissão mínima.
6. **Hash SHA256 lower-case + trim** pra Meta CAPI (PII obrigatório).
7. **SLA closer ≤5min** com alerta no Slack. Sem isso, recuperação cai pela metade.
8. **Health check 5min ativo** ANTES de qualquer outro workflow.
9. **Disaster recovery documentado.** Plano B do tsunami pré-redigido. WABA secundário configurado.
10. **Alerta em ≤5min** via Slack/Telegram. Crítico extremo via SMS no horário do tsunami.

---

## Métricas de saúde · alvos

```yaml
UPTIME_N8N:               ≥ 99.5%
LATENCIA_WEBHOOK:         < 2s (P95)
TAXA_FALHA_WORKFLOW:      < 0.5%
TEMPO_ALERTA:             ≤ 5 min
TEMPO_RECUPERACAO:        ≤ 30 min
QUALITY_RATING_WABA:      ≥ 90% (GREEN)
TAXA_ENTREGA:             ≥ 95%
MATCH_QUALITY_CAPI:       ≥ 7.0
```

---

## Pergunta antes de gerar

Antes de produzir workflow ou integração, **SEMPRE pergunte**:

1. **Qual camada?**
   - Captação (anúncio · página · onboarding)
   - Evento (lembretes · áudios · ficha)
   - Tsunami (pitch · 4 janelas · SLA closer)
   - Recuperação (D+1 a D+7)
   - Monitoramento (health · alertas · DR)

2. **Qual tool?**
   - n8n.cloud ou self-hosted?
   - ManyChat ou WATI ou outro?
   - Sheets como storage ou já tem CRM?

3. **Já tem integrações ativas ou setup do zero?**

---

## Referências internas

- `00-variaveis-globais.md` — Tokens · webhooks · SLAs · timezone
- `01-arquitetura.md` — 3 camadas · stack · padrão de workflow
- `02-fluxos-de-captacao.md` — 3 fluxos (lead · compra · onboarding)
- `03-fluxos-do-evento.md` — 5 fluxos (lembrete · áudio · reação · ficha · pico)
- `04-fluxos-do-tsunami.md` — 5 fluxos (aquecimento · janelas · checkout · compra · ao vivo)
- `05-fluxos-de-recuperacao.md` — 4 fluxos (abandono · D+N · closer · conversão)
- `06-integracoes.md` — Hotmart · WABA · CAPI · Sheets · YT · ManyChat
- `07-monitoramento.md` — Health · alertas · disaster recovery
- `08-sistema-de-tags-e-fases.md` — Tag por semana ISO · 4 fases · transição automática

---

## Skills relacionadas

- `automacoes-lpsg` — esta skill (constrói automações)
- `mensageria-lpsg` — define textos das mensagens (Utility/Marketing)
- `oferta-lpsg` — horários do tsunami viram crons
- `dashboard-lpsg` — consome dados gravados pelas automações
- `criativos-lpsg` — UTM dos criativos passa via CAPI
- `paginas-lpsg` — disparam Pixel + CAPI

---

**Fonte:** método LPSG do Leo Tabari (Turbo Academy). Validado em 12 meses de operação multi-nicho.

---

## Engine de análise via Meta Ads CLI (NOVO · 2026-04)

A engine de 3 cadências (diária · semanal · mensal) que historicamente usava Marketing API SDK Python pode ser totalmente substituída por shell + [Meta Ads CLI oficial](https://developers.facebook.com/blog/post/2026/04/29/introducing-ads-cli/) (lançada 29/04/2026).

**Substituição direta:**
- Antes · ~80 linhas Python custom (FacebookAdsApi + parsing)
- Depois · 5 linhas shell + jq

**Stop-loss horário (cron 1h):**
```bash
0 * * * * ~/.claude/skills/meta-ads-cli-turbo/scripts/03-stop-loss-horario.sh
```

**Relatório diário 9h (cron):**
```bash
0 9 * * * ~/.claude/skills/meta-ads-cli-turbo/scripts/04-relatorio-diario.sh
```

**Escalonamento de vencedores (manual · semanal):**
```bash
~/.claude/skills/meta-ads-cli-turbo/scripts/05-escalar-vencedores.sh
```

**n8n vs CLI · regra de coexistência:**
- n8n FAZ MELHOR · webhooks Hotmart · ManyChat · multi-fonte (Sheets/Notion/Slack)
- CLI FAZ MELHOR · loops shell · cron jobs simples · stop-loss · relatórios JSON

> Detalhes e comparativo completo em `meta-ads-cli-turbo/references/04-vs-alternativas.md`.
