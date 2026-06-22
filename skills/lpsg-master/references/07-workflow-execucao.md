# 07 · Workflow de execução · MODO EXECUTOR

> Detalhe técnico do que cada fase faz quando o `lpsg-master` está em modo executor.

---

## ⚡ Visão geral do fluxo

```
[Trigger detectado] → [Validar YAML] → [Executar 10 fases] → [Reporte final]
                                       └── reporte por fase
                                       └── pede confirmação em 4 pontos
```

---

## 🎯 FASE 5 · paginas-lpsg

### Skill referência
`~/.claude/skills/paginas-lpsg/SKILL.md` + `references/`

### Variáveis do YAML usadas
- Bloco A · `especialista.*`, `nicho.*`, `avatar.*`, `big_idea.*`
- Bloco B · `evento.nome`, `evento.ticket`, `produto.nome`, `garantia.texto`
- Bloco D · `dom.raiz`, `dom.lp`, `dom.ficha`, `checkout.*`
- Bloco H · `cor.p`, `cor.s`, `cor.estilo`
- Bloco E · `meta.pixel`, `gtm.id`, `ga4.id`

### O que entrega
1. Projeto Next.js 14 + Tailwind + Vercel
2. 5 variações de página (`/v1` a `/v5`) · cada uma com **arquétipo premium distinto** (Editorial Longform · Bold Magazine Cover · Interativo/Calculadora · Storytelling/Timeline · Manifesto/Contrarian — ver `paginas-lpsg/references/09-arquetipos-premium.md`). Estrutura de blocos é livre por arquétipo · 1ª dobra com data + garantia obrigatórias.
3. Página de ficha de interesse (11 etapas) em `/ficha-de-interesse`
4. API Route `/api/ficha-interesse` com cálculo de tier (HOT/WARM/COLD)
5. Tracking instalado (Pixel + CAPI + GTM + GA4)

### Subagentes a acionar
- **`@designer-senior`** — design das 5 variações (cores · tipografia · layout responsivo)
- **`@copywriter`** — copy de cada variação (5 headlines diferentes · 5 dores · 5 CTAs)

### Output esperado
```
📁 Arquivos:
src/
├── app/
│   ├── (variations)/v1/page.tsx
│   ├── (variations)/v2/page.tsx
│   ├── ... (v3, v4, v5)
│   ├── ficha-de-interesse/page.tsx
│   └── api/ficha-interesse/route.ts
├── components/blocks/ (catálogo · cada arquétipo usa subset)
├── lib/tracking.ts
└── data/variations.ts

📋 Configurações:
- next.config.js
- tailwind.config.js
- .env.example (com placeholders dos tokens)
```

### Ação humana após
- [ ] Upload de foto profissional · 6 prints · 6 depoimentos
- [ ] Conectar domínio `{dom.lp}` no Vercel
- [ ] Adicionar variáveis de ambiente reais
- [ ] Validar Lighthouse mobile ≥ 95

---

## 🎬 FASE 4 · criativos-lpsg

### Skill referência
`~/.claude/skills/criativos-lpsg/SKILL.md`

### Variáveis usadas
- Bloco A · `avatar.*`, `big_idea.*`
- Bloco H · `cor.*`, `criativos.estilo_visual`
- Bloco I · `mensageria.tom_de_voz`

### O que entrega
1. **5 vídeos** · roteiros completos (Hook · Hold · Body) · 30s cada
2. **5 estáticos** · layouts com hierarquia visual definida
3. **5 carrosseis** · estrutura de 5 cards cada
4. Nomenclatura aplicada · `{SIGLA}_{FORMATO}_{HOOK_KEYWORD}_v{N}`
5. Briefing pra designer com todos os assets necessários

### Subagentes a acionar
- **`@copywriter`** — hooks (5 tipos: pergunta · prova · contra-intuitivo · antes/depois · confissão)
- **`@designer-senior`** — composição visual dos estáticos e carrosseis

### Output esperado
```
📁 02-entregaveis-finais/criativos/edicao-{DDMMYY}/
├── videos/
│   ├── v1-pergunta-polemica/roteiro.md
│   ├── v2-prova-numeros/roteiro.md
│   └── ... (v3, v4, v5)
├── estaticos/
│   └── ... (5 PNGs ou briefings)
└── carrosseis/
    └── ... (5 conjuntos de 5 cards)
```

### Ação humana após
- [ ] Expert grava os 5 vídeos (3-4h · setup celular)
- [ ] Designer cria os estáticos finais (Figma → PNG)
- [ ] Aprovar todos antes de subir no Meta

---

## 🎓 FASE 1 · estrutura-aulas-lpsg

### Skill referência
`~/.claude/skills/estrutura-aulas-lpsg/SKILL.md`

### Variáveis usadas
- Bloco C · `aula.a1` a `aula.a6` (títulos + promessas)
- Bloco A · `avatar.*` · `big_idea.*`
- Bloco B · `evento.*`

### O que entrega
1. 6 aulas estruturadas (5 técnicas + 1 pitch)
2. Função estratégica de cada (escada de crenças)
3. Gancho de abertura · ponte · tarefa pro aluno
4. Slides (PPTX premium · skill `gerador-slides-turbo`)

### Subagentes a acionar
- **`@copywriter`** — refinamento dos ganchos e bridges
- **`gerador-slides-turbo`** — geração dos slides PPTX

### Output esperado
```
📁 02-entregaveis-finais/estrutura-aulas/edicao-{DDMMYY}/
├── aula-1-fundamentacao.md
├── aula-2-construcao.md
├── ... (a3, a4, a5)
├── aula-6-pitch.md
└── slides/
    ├── aula-1.pptx
    └── ... (6 PPTX)
```

### Ação humana após
- [ ] Expert revisa cada aula
- [ ] Cronograma de gravação no Calendar
- [ ] Setup técnico (câmera · áudio · cenário)

---

## 💎 FASE 3 · oferta-lpsg

### ⚠️ PONTO DE APROVAÇÃO HUMANA

> **Antes de seguir pra Fase 5, peça confirmação explícita.** A oferta define o ticket, garantia e tsunami · mudanças aqui cascateiam.

### Variáveis usadas
- Bloco B · `produto.*`, `garantia.*`, `tsunami.*`

### O que entrega
1. Stack de valor (6+ itens) · soma ≥ 1.5x o ticket
2. Cronograma do tsunami (Seg 7h00 · 7h10-8h00 · 8h-23h59)
3. Texto da garantia dupla (incondicional + condicional)
4. Plano de recuperação D+1 a D+7

### Output esperado
```
📁 02-entregaveis-finais/oferta/edicao-{DDMMYY}/
├── stack-de-valor.md (calculado · total vs preço)
├── bonus-tsunami.md (3 ondas)
├── garantia-completa.md
└── recuperacao-d1-d7.md
```

### Ação humana após
- [ ] **Aprovar** · stack realista? Bônus entregáveis?
- [ ] Texto da garantia ok pro jurídico
- [ ] Confirmar · stack de valor ≥ 1.5x ticket

---

## 📨 FASE 2 · mensageria-lpsg

### Variáveis usadas
- Bloco I · `mensageria.tom`, `mensageria.pacto`
- Bloco A · `tratamento`, `emoji`
- Bloco B · datas + horários

### O que entrega
1. Cap 4+4 (máx 4 msgs API + 4 grupo/dia) · ~19 templates Utility por evento
2. 8 templates Utility no formato Meta API
3. Áudios chave (roteiros pro expert gravar)
4. Tags ManyChat · sistema de fluxos

### Subagentes a acionar
- **`@copywriter`** — refinamento de copy considerando tom · avatar · cultura

### Output esperado
```
📁 02-entregaveis-finais/mensageria/edicao-{DDMMYY}/
├── fase-1-onboarding.md
├── fase-2-antecipacao.md
├── ... (até fase 8)
└── templates-utility/
    ├── boas_vindas_lpsg_v1.json
    ├── ... (8 templates Meta API)
```

### Ação humana após
- [ ] Submeter os 8 templates Utility na Meta (1-3 dias úteis)
- [ ] Gravar 4 áudios (boas-vindas · tira-dúvidas · pitch · bônus)
- [ ] Configurar fluxos no ManyChat

---

## 🚀 FASE 6 · trafego-lpsg

### ⚠️ PONTO DE APROVAÇÃO HUMANA

> **Vai gastar dinheiro real.** Aprovar antes de Fase 7 (que ativa webhooks que disparam custo).

### Variáveis usadas
- Bloco H · `traf.orca`, `traf.publico.*`
- Bloco E · `meta.ad`, `meta.pixel`, `meta.capi`

### O que entrega
1. Estrutura ASC (1 campanha · 1 conjunto · 15 criativos)
2. Pipeline Meta API (pull diário · normalização)
3. Engine de análise (3 cadências · 20 regras)
4. Briefing de configuração no Ads Manager

### Output esperado
```
📁 02-entregaveis-finais/trafego/edicao-{DDMMYY}/
├── estrutura-campanha.md
├── pipeline-meta-api.md
├── engine-analise-regras.md
└── briefing-ads-manager.md (passo a passo de configuração)
```

### Ação humana após
- [ ] **Aprovar** · plano de tráfego e orçamento
- [ ] Gestor configura no Ads Manager (manual)
- [ ] Testa pixel + CAPI antes de ativar
- [ ] Ativa campanha

---

## ⚙️ FASE 7 · automacoes-lpsg

### ⚠️ PONTO DE APROVAÇÃO HUMANA

> **Webhooks vão pra produção.** Confirmar antes de ativar.

### Variáveis usadas
- Bloco E · todas as integrações
- Bloco D · URLs

### O que entrega
1. 14 workflows n8n (JSON importáveis)
2. Configurações de credentials
3. Sistema de tags ManyChat
4. Webhook Hotmart configurado

### Output esperado
```
📁 02-entregaveis-finais/automacoes/edicao-{DDMMYY}/
├── workflows/
│   ├── 01-pull-meta-diario.json
│   ├── ... (14 workflows)
└── credentials-template.md (instruções de setup)
```

### Ação humana após
- [ ] **Aprovar** · revisar cada workflow antes de ativar
- [ ] Importar JSONs no n8n
- [ ] Configurar credentials reais
- [ ] Testar com 1 compra de R$ 1 (cupom 99% off)

---

## 📊 FASE 8 · dashboard-lpsg

### Variáveis usadas
- Bloco D · `dom.dash`
- Bloco E · todas as fontes (Sheets · Meta · Hotmart)

### O que entrega
1. Projeto Next.js do dashboard
2. 11 módulos (Visão geral · Tráfego · Páginas · Aulas · Mensageria · Tsunami · Recuperação · Operação · Estratégico · Sugestões · Ficha)
3. 8 adapters de fonte de dados
4. Auth básico

### Subagentes a acionar
- **`@designer-senior`** — UI dos 11 módulos · responsive · charts

### Output esperado
```
📁 dashboard-{NOME_PROJETO}/
├── src/app/(modulos)/
│   ├── visao-geral/page.tsx
│   ├── ... (11 módulos)
├── src/lib/adapters/ (8 adapters)
└── src/components/charts/
```

### Ação humana após
- [ ] Conectar `{dom.dash}` no Vercel
- [ ] Configurar auth (senha única ou Google login)
- [ ] Compartilhar acesso com time

---

## 👥 FASE 9 · operacao-lpsg

### Variáveis usadas
- Bloco F · todos os papéis do time

### O que entrega
1. RACI completo (Responsible · Accountable · Consulted · Informed)
2. 9 papéis com responsabilidades claras
3. Cronograma da semana perpétua
4. 12 SOPs operacionais
5. 6 rituais (semanal · diário)

### Output esperado
```
📁 02-entregaveis-finais/operacao/edicao-{DDMMYY}/
├── raci-matrix.md (CSV/MD)
├── papeis-detalhados/ (9 arquivos)
├── cronograma-semana-perpetua.md
├── sops/ (12 procedimentos)
└── rituais/ (6 rituais com pauta)
```

### Ação humana após
- [ ] Reunião com time pra alinhar RACI (1h)
- [ ] Cada papel concorda com responsabilidades?
- [ ] Acessos às ferramentas distribuídos

---

## 🤝 FASE 10 · cs-lpsg

### ⚠️ PONTO DE APROVAÇÃO HUMANA · CONDICIONAL

> **Só execute se já houver vendas do produto principal.** Caso contrário, pula com mensagem:

```
⚠️ FASE 10 (CS) PULADA

CS só faz sentido após primeiras vendas do {produto.nome}.
Quando tiver ≥ 5 alunos ativos, volta aqui e pede:
"@lpsg-master execute fase 10 (cs-lpsg)"
```

### Variáveis usadas
- Bloco G · `cs.*`, `programa_indicacao.*`
- Bloco F · `time.cs.*`

### O que entrega
1. Onboarding D0-D7 (6 mensagens automatizadas)
2. Cronograma de 90 dias (6 marcos)
3. 4 rituais semanais
4. 8 templates Utility (CS)
5. Sistema de prova social (6 tipos)
6. Programa de ascensão + indicação

### Output esperado
```
📁 02-entregaveis-finais/cs/edicao-{DDMMYY}/
├── onboarding-d0-d7.md
├── cronograma-90-dias.md
├── rituais-semanais.md
├── templates-utility-cs/
├── prova-social-tipos.md
└── ascensao-indicacao.md
```

### Ação humana após
- [ ] CS Oficial alocado e treinado
- [ ] Live coletiva agendada (Quartas 19h)
- [ ] Vídeo de boas-vindas gravado pelo expert

---

## 📦 RELATÓRIO FINAL · após Fase 10

```
═══════════════════════════════════════════════
🎉 LPSG · EXECUÇÃO COMPLETA
═══════════════════════════════════════════════

10 fases concluídas em [tempo real]

📊 Resumo do que foi construído:
   ✅ 5 páginas de venda no ar
   ✅ 15 criativos prontos
   ✅ 6 aulas estruturadas
   ✅ Oferta com tsunami
   ✅ 8 templates Utility submetidos
   ✅ Campanha Meta Ads pronta
   ✅ 14 workflows n8n
   ✅ Dashboard 11 módulos
   ✅ Time alinhado · RACI assinado
   ✅ Programa CS configurado (se aplicável)

🚨 Ações humanas pendentes (consolidado):
   [lista priorizada de tudo que precisa de humano]

📅 Próximo passo:
   1. Resolver ações humanas pendentes (~2-3 dias)
   2. 1ª edição: Aula 1 segunda 7h
   3. Acompanhar dashboard ao vivo

🎬 Bora rodar tua primeira edição.
```

---

## 🔄 Modo "continuar de onde parou"

Se o usuário pausa e volta depois:

```
@lpsg-master continue execução do {projeto.nome}.

Estou no Fase {N} · pause anterior em {arquivo}.
```

Resposta:
- Lê estado salvo (sugere pasta `_lpsg_state/{projeto}/state.json`)
- Identifica última fase concluída
- Retoma da próxima

---

## 🚧 Erros comuns durante execução

| Erro | Causa | Solução |
|---|---|---|
| `Pixel ID inválido (não numérico)` | Bloco E malformado | Pede correção no YAML |
| `Subagente @designer-senior falhou 3x` | Brief mal formado | Pause · diagnostica brief · pede ao usuário |
| `Stack de valor < 1.5x ticket` | Anti-padrão LPSG | Pause na Fase 4 · sugere ajuste |
| `Domínio Vercel não validado` | DNS não propagou | Pause Fase 5 final · espera 1h |
| `Templates Meta rejeitados` | Copy promocional em Utility | Reformula Fase 5 · resubmete |

---

## 🎯 Princípio final

> **Execução fiel · não improvisação.**
>
> O método LPSG foi calibrado em 12+ meses · cada fase tem razão de existir.
> Sua função é entregar com precisão · não inventar atalhos.
