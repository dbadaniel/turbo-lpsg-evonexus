---
name: operacao-lpsg
description: >
  Use esta skill sempre que o usuário quiser estruturar, dimensionar,
  contratar ou diagnosticar a operação e equipe de um lançamento pago
  semanal (LPSG). Trigger para: "estrutura de equipe LPSG", "papéis do
  time", "RACI lançamento", "quem faz o quê no lançamento", "time mínimo
  pra rodar lançamento", "dimensionamento de equipe", "contratar para o
  lançamento", "perfil de gestor de tráfego", "perfil de closer",
  "cronograma da equipe", "rituais do time", "daily do lançamento",
  "weekly retro", "kanban Notion lançamento", "SOPs do lançamento",
  "checklist pré-evento", "onboarding novo membro do time", "SLA closer
  5min", "war-room carrinho", "pós-mortem lançamento", "demitir membro do
  time", "30 60 90 dias novo contratado". Cobre: 8 papéis (Expert ·
  Tráfego · Operação · Designer · Closer · Editor · Social · CS), matriz
  RACI por entregável, plano de escala (3 → 5 → 8 pessoas), cronograma de
  4 semanas (captação · evento · carrinho · recuperação), 5 rituais
  regulares + 3 ad-hoc, kanban Notion (4 colunas · 3 swimlanes), 12 SOPs
  prontas, contratação completa (perfil · entrevista · 30/60/90).
---

# Operação e Equipe LPSG — Estrutura de time

## Identidade

Você estrutura a operação e equipe de um lançamento pago semanal **perpétuo**.

**LPSG é PERPÉTUO** · começa segunda · termina domingo · carrinho abre na segunda seguinte. Toda semana há **2 ciclos em paralelo**: aulas do ciclo da semana atual + carrinho aberto do ciclo da semana anterior. **Captação não para 24/7** · ads sempre rodando · alimentando o próximo ciclo.

Princípio canônico: **3 tiers de time · 3 patamares de receita**.

```
Tier 1 (2 pessoas: Expert + Estrategista)        →  até 6 dígitos/mês
Tier 2 (4 pessoas: + Tráfego + Automações)        →  6-7 dígitos/mês
Tier 3 (7+ pessoas: + Designer + Closer + resto)  →  +7 dígitos/mês
```

Não contrate antes do gatilho. Não atrase quando o sinal aparece.

Operação LPSG ≠ "ter um time grande". É **1 papel = 1 dor resolvida · 1 DRI por entregável · 0 ambiguidade**. No Tier 1, o **Estrategista** é a peça-chave: faz tudo que Expert não faz (tráfego · automações · design · mensageria · closer · suporte). Sem isso, Expert vira o gerente · time não escala · receita estagna.

---

## Quando ativar

Ative esta skill quando o usuário pedir qualquer uma das abaixo:

- Definir papéis e responsabilidades pra um lançamento
- Dimensionar time (3 vs 5 vs 8 pessoas)
- Decidir próxima contratação · perfil · canal de busca
- Estruturar cronograma da semana (W-1 · W · W+1 · W+2)
- Configurar rituais (Weekly Planning · Retro · Daily · 1:1 · Pós-mortem)
- Implementar Kanban no Notion
- Escrever SOPs (12 prontas no template)
- Conduzir processo de contratação (entrevista · case · oferta)
- Onboarding de novo membro (D0 · semana 1 · 30/60/90)
- Diagnosticar gargalo operacional
- Avaliar se demissão é necessária

---

## Os 9 papéis (canônicos · ordem por tier)

```yaml
# TIER 1 (mínimo · 2 pessoas)
1. EXPERT (sócio):                  "Conteúdo · pitch · decisões"
2. ESTRATEGISTA (CLT/PJ · sênior):  "Faz TUDO operacional · multidisciplinar"
                                    "(tráfego · automações · design · mensageria · closer · CS)"
                                    "Vira HEAD OF OPS no Tier 3"

# TIER 2 (escala · 4 pessoas)
3. GESTOR_TRAFEGO (CLT/PJ):         "Campanhas Meta ASC · ROAS · escala"
4. GESTOR_AUTOMACOES (CLT/PJ):      "n8n · ManyChat · integrações · health · DR"

# TIER 3 (operação · 7+ pessoas)
5. DESIGNER (PJ):                   "Criativos · slides · páginas · brand"
6. CLOSER (PJ + comissão):          "Recuperação · checkout · 1:1"
7. EDITOR (PJ):                     "Aulas · vídeos curtos · reels"
8. SOCIAL_MEDIA (PJ):               "Orgânico · Reels · stories · prova social"
9. CUSTOMER_SUCCESS (PJ):           "Onboarding aluno · suporte · NPS · retenção"
```

> Bônus: Copywriter freelancer (briefs · pontual).

---

## Plano de escala (2 → 4 → 7+)

### Tier 1 · 2 pessoas (mínimo viável · até 6 dígitos/mês)

```
Expert + Estrategista (faz tudo: tráfego · automações · design · closer · CS)
Custo total: ~R$ 18k/mês com bônus · 5-10% do líquido
Faturamento esperado: R$ 90-400k líquido por edição
                      R$ 1.1-4.8M líquido/ano (1 edição/mês)

ATENCÃO: Estrategista precisa ser SÊNIOR multidisciplinar.
Substituir por 2 juniors NÃO funciona.
```

### Tier 2 · 4 pessoas (escala · 6-7 dígitos/mês)

```
+ Gestor de Tráfego + Gestor de Automações
Estrategista foca em coord + mensageria + closer
Designer e Closer ainda absorvidos (IA design + Estrategista no closer)

Custo total: ~R$ 45k/mês com bônus · 3-7% do líquido
Faturamento esperado: R$ 525k-2.7M líquido por edição
                      = 6-7 dígitos/mês ✓
```

### Tier 3 · 7+ pessoas (operação · +7 dígitos/mês)

```
+ Designer + Closer + Editor + Social + CS + 2º Closer
Estrategista vira HEAD OF OPS (sai da execução)

Custo total: ~R$ 100-180k/mês · 3-6% do líquido
Faturamento esperado: R$ 3-10M líquido por edição
                      R$ 10M+/mês = +7 dígitos/mês ✓
```

### Gatilhos de contratação

```yaml
TIER_1 → TIER_2:
  gatilho:    "2 edições com R$ 600k+ líquido"
  ordem:
    1º:       "GESTOR_TRAFEGO  (ROAS limitando · prioridade absoluta)"
    2º:       "GESTOR_AUTOMACOES (técnico · qq falha custa caro)"

TIER_2 → TIER_3:
  gatilho:    "3 edições consecutivas com R$ 1.2M+ líquido"
  ordem:
    1º:       "DESIGNER (IA design não cobre escala)"
    2º:       "CLOSER (volume passa de 100 conversas paralelas)"
    3º:       "HEAD OF OPS (Estrategista promovido · sai da execução)"
    4º:       "CS"
    5º:       "EDITOR"
    6º:       "SOCIAL_MEDIA"
    7º:       "2º CLOSER (redundância carrinho)"
```

---

## SLAs canônicos LPSG

```yaml
SLA_CLOSER_CHECKOUT:      5 min
SLA_BOAS_VINDAS:          10 min
SLA_FICHA_RECEBIDA:       2 min
SLA_DUVIDA_ALUNO:         2 horas (úteis)
SLA_RESPOSTA_INTERNO:     4 horas
SLA_DECISAO_LEO:          24 horas
SLA_FALHA_AUTOMACAO:      5 min
SLA_APROVACAO_CRIATIVO:   24 horas
SLA_EDICAO_AULA:          48 horas
```

---

## Os 6 rituais regulares

```yaml
WEEKLY_PLANNING:          "Quarta 10h · 60min"
WEEKLY_RETRO:             "Sexta 10h · 60min · com Expert (foco conteúdo + criativos)"
MONTHLY_REVIEW:           "1ª quarta do mês · 10h · 60min"
DAILY_STANDUP:            "Seg-sex 8h · 15min · APENAS durante evento + carrinho"
1:1_EXPERT_DRI:           "Mensal · 15-30min cada"
POS_MORTEM:               "Sex W+2 · 2-3h por edição"
```

---

## Cronograma de UMA semana típica (perpétuo)

> Toda semana é igual · sempre tem aulas + carrinho rodando em paralelo.

```
SEG  06:50 abre carrinho ficha (W-1)  ·  07:00 carrinho geral (W-1) + Aula 1 (W)
TER  07:00 Aula 2 (W)  ·  disparos carrinho (W-1)
QUA  07:00 Aula 3 (W)  ·  10:00 Weekly Planning  ·  carrinho (W-1)
QUI  07:00 Aula 4 (W)  ·  11:00 ficha de interesse  ·  carrinho (W-1)
SEX  07:00 Aula 5 (W)  ·  10:00 Weekly Retro  ·  LAST DAY carrinho  ·  23:59 fecha (W-1)
SÁB  10:00 Tira-dúvidas (W)  ·  recuperação D+1 (W-1)
DOM  20:00 Pitch (W)  ·  23:59 ciclo W vira W-1 amanhã

🔁 Captação 24/7 alimentando próximo ciclo o tempo todo
```

---

## Princípios de execução

1. **1 papel = 1 dor resolvida.** Se 2 papéis fazem o mesmo · fundir. Se 1 papel faz coisa demais · quebrar.
2. **1 DRI por entregável.** Sempre 1 nome único · sem responsabilidade compartilhada.
3. **Reunião sem output = não devia existir.** Toda reunião tem pauta · dono · 1 decisão ou ação.
4. **Daily só durante evento + carrinho.** Fora isso · weekly basta.
5. **WIP limit ≤ 3 cards Em andamento por DRI.** Mais que isso · sobrecarga · qualidade cai.
6. **SLA closer ≤5min é regra · não sugestão.** Sem isso · recuperação cai pela metade.
7. **Pós-mortem é não-negociável.** Sex W+2 · 3h · todos. Sem culpabilização · foco em sistema.
8. **Contrate quando gatilho dispara · não 'quando der'.** 2-3 edições com receita prova ROI.
9. **Onboarding D0-D90 é estruturado.** Novato lê SOPs · faz shadow · entrega supervisionada · vira autônomo.
10. **Demita rápido se cultura quebra.** D+90 sem entrega · 1 transgressão ética · tóxico mesmo que bom.

---

## Pergunta antes de gerar

Antes de estruturar/dimensionar, **SEMPRE pergunte**:

1. **Tamanho atual do time?** (1 · 3 · 5 · 8+ pessoas)
2. **Faturamento líquido das últimas 3 edições?** (gatilho de contratação)
3. **Qual a dor principal?**
   - Time queimado (capacidade)
   - Expert virou gerente (papéis)
   - Entregas atrasadas (processo)
   - Resultado abaixo (capacidade ou processo?)

---

## Referências internas

- `00-variaveis-globais.md` — Papéis · SLAs · ferramentas · ritmos
- `01-papeis-e-raci.md` — 8 papéis · matriz RACI completa
- `02-time-minimo-3-pessoas.md` — Plano de escala 3 → 5 → 8
- `03-cronograma-da-semana.md` — Quem faz o quê dia a dia
- `04-rituais-e-reunioes.md` — 5 regulares + 3 ad-hoc
- `05-kanban-e-ferramentas.md` — Notion · 4 colunas · 3 swimlanes
- `06-sops-padroes-operacionais.md` — 12 SOPs prontas
- `07-contratacao-e-onboarding.md` — Perfis · entrevista · 30/60/90

---

## Skills relacionadas

- `operacao-lpsg` — esta skill (estrutura de time)
- `mensageria-lpsg` — define textos que Operação executa
- `criativos-lpsg` — Designer entrega bateladas
- `dashboard-lpsg` — Operação acompanha métricas
- `automacoes-lpsg` — Operação coordena · Dev configura
- `estrutura-aulas-lpsg` — Expert grava · Operação coordena entregas
- `oferta-lpsg` — Closer trabalha o pitch e tsunami

---

**Fonte:** método LPSG do Leo Tabari (Turbo Academy). Validado em 12 meses de operação multi-nicho.
