---
name: mensageria-lpsg
description: >
  Use esta skill sempre que o usuário quiser criar, estruturar, adaptar
  ou diagnosticar a mensageria de um lançamento pago semanal (LPSG).
  Trigger para: "mensageria do evento", "mensagens do grupo",
  "mensageria do lançamento", "roteiro de áudio", "script de mensagem",
  "templates da Meta", "WhatsApp template Utility", "fluxo de
  onboarding", "ficha de interesse mensagem", "carrinho aberto
  mensageria", "abertura de vendas D1", "mensagens do desafio",
  "adaptar mensageria", "coreografia de mensagens", "véspera do
  evento", "áudio da noite". A estrutura segue **regra cap 4+4**
  (máx 4 mensagens API + 4 grupo por dia · seg-dom) com 4 horários
  canônicos seg-sex e exceção controlada no D1 do carrinho com 5
  horários. Cada mensagem tem versão **Utility-ready** pra API
  oficial Meta (categoria UTILITY · variáveis {{1}}-{{N}} · URLs em
  botões · sample values reais · snake_case com prefixo lpsg_).
---

# Mensageria LPSG · cap 4+4 · Utility-ready

> **Regra inegociável (atualizada 2026-04-30 · prevalece sobre versão `.docx` arquivada):**
>
> 1. **Cap diário fixo:** **máx. 4 mensagens API oficial + máx. 4 mensagens no grupo, todos os dias, seg-dom.**
> 2. **4 horários canônicos seg → sex** (aulas às 7h):
>    - **06:50** · `lpsg_aviso_aula` (10 min antes da aula)
>    - **07:00** · `lpsg_link_aula` (link da aula)
>    - **12:00** · `lpsg_replay_aula` (replay disponível)
>    - **19:00** · `lpsg_resumo_chamada` (resumo da manhã + chamada da próxima aula)
> 3. **Sem repescagem.** Sem mensagem 10/15/20 min depois.
> 4. **Sem reforço.** Sem "última hora" · "tô entrando no ar".
> 5. **Sem troca de nome de grupo.** Mantém nome ORIGINAL durante todos os 7 dias.
> 6. **Sem renomear mensagens existentes.**
> 7. **Sem mensageria de sábado pré-evento.** Grupo só dispara a partir da SEGUNDA da Aula 1.
> 8. **Carrinho aberto: SÓ no D1** com 5 horários (06:50 · 07:00 · 08:00 · 10:00 · 19:00). **D2-D7: ZERO mensagem de carrinho.**
> 9. **Onboarding pré-evento:** 4 msgs API triggered por compra · NÃO conta no cap 4+4.
>
> Toda saída desta skill **deve respeitar essas 9 regras** e cada mensagem **deve ter versão Utility-ready** que passe na aprovação da Meta API oficial.

> **Nota sobre `workspace/lancamentos/{id}/03-revisoes/Mensageria-LPSG-APROVADO.docx`:** o .docx ficou no repositório como histórico do padrão da mentoria 24/04/2026. Os **ajustes posteriores listados acima sobrescrevem esse padrão** (regra 4+4 · onboarding 4 msgs · carrinho 5 horários · sem repescagem). Quando precisar atualizar o `.docx`, regenerar a partir desta SKILL.md.

---

## REGRAS ABSOLUTAS DE OUTPUT

**REGRA 1** Toda mensagem tem 2 versões:
1. **Texto livre** (SendFlow / ManyChat / WhatsApp pessoal)
2. **Template Utility Meta API** (categoria `UTILITY` · variáveis `{{1}}-{{N}}` · URLs em botões · sample values reais)

**REGRA 2** Categoria sempre `UTILITY`. Marketing custa 10x mais e queima a lista.

**REGRA 3** URL **só em botão** · jamais inline no body. Se precisar 2 links, usar `BUTTONS: 2`.

**REGRA 4** Variáveis nomeadas em snake_case com prefixo `lpsg_` ou sigla do projeto. Ex: `lpsg_aviso_aula` · `lpsg_link_aula` · `lpsg_replay_aula` · `lpsg_resumo_chamada`.

**REGRA 5** Sample values reais e plausíveis (não "Lorem ipsum" · não "{{name}}").

**REGRA 6** Nada de ALL CAPS · nada de múltiplos !!!. Reduz deliverability.

**REGRA 7** Bullets com hífen `-`, não `•`.

**REGRA 8** "SAIR" (opt-out) sempre visível no onboarding · reduz denúncia · protege o número.

**REGRA 9** 1 CTA por mensagem · link único.

**REGRA 10** Cap **4+4 inegociável**. Se a copy quer 5+ mensagens no dia, cortar uma.

---

## CALENDÁRIO CANÔNICO

### ONBOARDING · pré-evento (NÃO conta no cap 4+4)

Triggered por compra do ingresso (webhook Hotmart). 4 mensagens via API oficial entre compra e início da Aula 1.

| Trigger | Função | Template |
|---|---|---|
| Compra confirmada | Boas-vindas + confirmação de recebimento | `lpsg_onboard_boas_vindas` |
| Após confirmação | Link do grupo + agenda do evento | `lpsg_onboard_grupo_agenda` |
| D-3 da Aula 1 | Pesquisa de matrícula (perfil · expectativa) | `lpsg_onboard_pesquisa` |
| D-1 da Aula 1 | Antecipação Aula 1 · prepara o lead | `lpsg_onboard_antecipacao` |

> O grupo só começa a disparar a partir da SEGUNDA da Aula 1, no horário 06:50 canônico. Sem mensageria de sábado pré-evento.

### SEGUNDA → SEXTA · Aulas 1 a 5 · 4 horários canônicos

| Horário | Função | Onde envia | Template |
|---|---|---|---|
| **06:50** | Aviso 10 min antes da aula | Grupo + API oficial | `lpsg_aviso_aula` |
| **07:00** | Link da aula | Grupo + API oficial | `lpsg_link_aula` |
| **12:00** | Replay disponível | Grupo + API oficial | `lpsg_replay_aula` |
| **19:00** | Resumo da aula da manhã + chamada da aula do dia seguinte | Grupo + API oficial | `lpsg_resumo_chamada` |

> Total dia: 4 disparos no Grupo · 4 disparos na API oficial.

### QUINTA · Aula 4 = PRÉ-PITCH · 100% produto · ficha de interesse (sem mensagem extra)

A Aula 4 (quinta) é o **pré-pitch do modelo 5+1**: aula **100% sobre o produto** cuja missão é fazer a pessoa **sair desejando** o produto que será vendido no domingo. O expert apresenta o produto inteiro (o que é · transforma · pra quem) **SEM falar preço e SEM falar bônus**, e abre a ficha de interesse pra medir quem quer. A mensageria do dia segue o cap 4+4 normal, mas a **mensagem das 19h muda de função**:

| Horário | Função na quinta |
|---|---|
| 06:50 | Aviso 10 min antes da Aula 4 · teaser "hoje eu mostro pra onde tudo isso te leva" (cria expectativa de desejo, não de venda) |
| 07:00 | Link da Aula 4 |
| 12:00 | Replay da Aula 4 |
| **19:00** | **Resumo Aula 4 + 3 elementos obrigatórios:** (1) chamada da FICHA DE INTERESSE · (2) aviso "DOMINGO 20H revelação de preço/bônus" · (3) aviso "SEGUNDA: ficha entra 6h50 · carrinho geral 7h" · zero menção a preço · zero menção a bônus |

**Trava de copy:**
- ❌ Não citar valor do produto
- ❌ Não citar bônus
- ✅ Chamar pra preencher a ficha de interesse
- ✅ "Domingo às 20h é o pitch completo — preço, bônus, condições, tudo lá"

### SEXTA · Aula 5 = CONCLUSÃO TÉCNICA + lembrete da ficha (NÃO é pré-pitch)

A Aula 5 (sexta) **NÃO é pré-pitch nem repitch**. O pré-pitch JÁ ACONTECEU na Aula 4 (quinta). A sexta é a **conclusão técnica** do conteúdo da semana + um **lembrete curto** pra quem ainda não preencheu a ficha. **Nenhuma reapresentação do produto · nenhum preço · nenhum bônus.** Tudo joga pro domingo 20h.

| Horário | Função na sexta |
|---|---|
| 06:50 | Aviso 10 min antes da Aula 5 |
| 07:00 | Link da Aula 5 |
| 12:00 | Replay da Aula 5 |
| **19:00** | **Resumo Aula 5 (técnico) + LEMBRETE CURTO da ficha (não reapresentar produto) + chamada tira-dúvidas sábado + reforço "domingo 20h preço/bônus" + reforço "segunda 6h50 ficha · 7h carrinho geral"** · zero menção a preço · zero menção a bônus |

**Trava de copy:**
- ❌ Não citar valor do produto
- ❌ Não citar bônus
- ✅ "Se você ainda não preencheu a ficha, preenche · domingo 20h eu abro tudo"
- ✅ Manter mistério: "preço, bônus, condições, tudo no domingo"

### DOMINGO · Aula 6 = PITCH COMPLETO

Domingo 20h é onde o expert **abre tudo**: preço · bônus · condições · janela de carrinho. Toda a copy de oferta concentra aqui.

### SÁBADO · tira-dúvidas (10h por padrão)

| Horário | Função | Onde envia |
|---|---|---|
| **09:50** | Aviso 10 min antes | Grupo + API |
| **10:00** | Link tira-dúvidas | Grupo + API |
| **12:00** | Fechamento (sem replay) + bridge pro pitch | Grupo + API |
| **19:00** | Resumo + chamada do pitch de domingo | Grupo + API |

### DOMINGO · pitch (Aula 6 · 20h por padrão)

| Horário | Função | Onde envia |
|---|---|---|
| **12:00** | Lembrete da aula final · 3-4 bullets | Grupo + API |
| **19:50** | Aviso 10 min antes | Grupo + API |
| **20:00** | Link do pitch | Grupo + API |
| **22:00** | Resumo + chamada da abertura de carrinho | Grupo + API |

### D1 (SEGUNDA seguinte) · ABERTURA DE CARRINHO · ÚNICO dia com mensageria · 5 horários

> **Exceção controlada ao cap 4+4:** **só no D1** o carrinho roda 5 horários fixos.
> **D2 → D7: ZERO mensagem de carrinho.**

| Horário | Função | Onde envia |
|---|---|---|
| **06:50** | Aviso 10 min antes da abertura | Grupo + API oficial |
| **07:00** | Link de checkout · carrinho aberto | Grupo + API oficial |
| **08:00** | Reforço de chegada · prova de quem entrou | Grupo + API oficial |
| **10:00** | Status meio-manhã · vagas/contexto | Grupo + API oficial |
| **19:00** | Última janela do dia · resumo + bônus que ainda valem | Grupo + API oficial |

### D2 → D7 · CARRINHO ABERTO · ZERO mensagem

Squad NÃO dispara nada via grupo nem via API oficial. O lead interessado volta na página · checkout permanece aberto. Decisão consciente · evita queima de lista.

---

## Estrutura de referências

| Cenário | Reference |
|---|---|
| Templates Utility prontos pra Meta API | `references/utility-templates-meta.md` ⭐ |
| Onboarding pré-evento | `references/onboarding.md` |
| Dia de aula (4 horários) | `references/template-dia-de-aula.md` |
| Ficha de interesse (Quinta) | `references/ficha-de-interesse.md` |
| Sábado tira-dúvidas | `references/sabado-descompressao.md` |
| Domingo pitch | `references/domingo-pitch.md` |
| Abertura de vendas D1 | `references/abertura-vendas-d1.md` |
| Roteiros de áudio/vídeo | `references/roteiros-audio-video.md` |
| Variação de scripts, anti-repetição | `references/variacao-mensagens.md` |
| Regras e princípios | `references/regras-e-principios.md` |
| Checklist anti-IA | `references/checklist-anti-ia.md` |
| Template completo (master · histórico) | `references/template-completo-lpsg.md` |
| Exemplo CNC (manhã) | `references/exemplo-cnc.md` |
| Exemplo LPSG (manhã) | `references/exemplo-lpsg.md` |
| Exemplo Plantão Sem Medo (noite) | `references/exemplo-plantao.md` |

---

## Variáveis canônicas

```yaml
PROJETO:
  nome_especialista:        "{NOME_ESPECIALISTA}"
  tratamento_plural:        "{TRATAMENTO_PLURAL}"
  nome_evento:              "{NOME_EVENTO}"
  emoji_reacao:             "{EMOJI}"

DATAS:
  dia_aula_1:               "{DIA_AULA_1}"
  horario_aulas:            "{HORARIO_AULAS}"
  horario_pitch:            "{HORARIO_PITCH}"
  horario_tiraduvidas:      "{HORARIO_TIRADUVIDAS}"

AULAS:
  tema_aula_1:              "{TEMA_AULA_1}"
  tema_aula_2:              "{TEMA_AULA_2}"
  tema_aula_3:              "{TEMA_AULA_3}"
  tema_aula_4:              "{TEMA_AULA_4}"
  tema_aula_5:              "{TEMA_AULA_5}"

LINKS:
  youtube_aulas:            "{LINK_YOUTUBE}"
  playlist:                 "{LINK_PLAYLIST}"
  ficha_interesse:          "{LINK_FICHA_INTERESSE}"
  grupo_whatsapp:           "{LINK_GRUPO}"
  checkout:                 "{LINK_CHECKOUT}"
  tiraduvidas_sabado:       "{LINK_TIRADUVIDAS}"
```

---

## Regras de aprovação Utility na Meta

A Meta aprova templates Utility em **1-3 dias úteis** se respeitar:

```yaml
1_CATEGORY:        UTILITY (não MARKETING · não AUTHENTICATION)
2_NO_PROMOCAO:     Templates Utility NÃO podem ter ofertas/preços/CTAs de venda no body
                   → Para mensagens com preço/oferta (D1 carrinho), preço só no botão
                     de checkout · body sem valor explícito · passa como Utility
3_VARIAVEIS:       {{1}}, {{2}}, {{3}} numeradas · não nominais
4_LINKS:           Em BUTTONS apenas · nunca no body
5_SAMPLE_REAIS:    Cada {{N}} precisa de sample real
6_LANGUAGE:        pt_BR · idioma travado
7_NO_ALL_CAPS:     "GARANTA AGORA" reprova · "Garanta agora" passa
8_NO_EXCESSO_EMOJI: 1-2 emojis OK · 5+ reprova
9_NO_HEADERS_LONGOS: Header (opcional) ≤ 60 caracteres
10_BODY_LIMITE:    1.024 caracteres máximo no body
11_FOOTER:         (opcional) ≤ 60 caracteres · sem variáveis
12_BUTTONS:        Máx 3. Tipos: URL, PHONE, QUICK_REPLY
```

---

## Princípios de execução

1. **Cap 4+4 inegociável** · em qualquer dia da semana exceto D1 carrinho (5+5).
2. **Toda mensagem tem versão Utility** · gerar as duas versões em paralelo.
3. **Sample values reais** · facilita aprovação e teste real.
4. **"SAIR" no onboard** · proteção do número WhatsApp.
5. **1 CTA por mensagem** · link único.
6. **Bullets com hífen** · compatibilidade.
7. **Sem ALL CAPS · sem !!! · sem 5+ emojis** · evita filtro spam.
8. **Categoria Utility por padrão** · escalar pra Marketing só quando inevitável.
9. **Versionamento de templates** · cada vez que aprovar uma versão, salvar `lpsg_xxx_v1`, `_v2`.
10. **Sem renomear mensagens existentes** · mantém os nomes canônicos da tabela.

---

## Filtro de função · 4 objetivos por peça (regra inegociável)

> Cap 4+4 trava o **volume**. Este filtro trava a **qualidade dentro do cap**.

**Toda peça que entra no fluxo precisa cumprir pelo menos 1 dos 4 objetivos.** Se não cumpre nenhum, **não entra**.

| # | Objetivo | Como reconhecer |
|---|---|---|
| 1 | **Aumentar nível de consciência** | sobre o método · sobre o produto · sobre a transformação possível · sobre a oportunidade. A lead chega no dia X com consciência N → sai com N+1. |
| 2 | **Aumentar conexão com o expert** | fazer a lead gostar dele · confiar nele · se identificar. Construído com história, vulnerabilidade, bastidores, tom íntimo. Não se constrói com tom corporativo. |
| 3 | **Estabelecer autoridade do método** | provar que existe ciência, procedência, casos, resultado real. Estudo de caso narrativo, referências, números concretos. |
| 4 | **Quebrar objeção** | antecipar e neutralizar resistências do nicho ("tenho diabetes", "estou na menopausa", "já tentei tudo", "não tenho tempo", "é caro"). 1 objeção por peça, não várias. |

**Diagnóstico pré-envio:**
```
Esta mensagem ataca consciência, conexão, autoridade ou objeção?
Se não souber responder em 1 segundo → não entra no fluxo.
Se cumpre 1 dos 4 → ok.
Se cumpre 2 dos 4 → ótimo.
Se cumpre 3+ → revisar, pode estar denso demais.
```

> Mensagem genérica de "não esquece da aula amanhã" **não cumpre nenhum dos 4** → cortar. Substituir por mensagem que ataca pelo menos 1.

---

**Fonte canônica atualizada:** esta SKILL.md (regra 4+4 · 9 princípios inegociáveis).
**Histórico arquivado:** `workspace/lancamentos/{id}/03-revisoes/Mensageria-LPSG-APROVADO.docx` (padrão original mentoria 24/04/2026 · superado pelos ajustes).
