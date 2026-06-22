---
name: cs-lpsg
description: >
  Use para estruturar o PÓS-VENDA (Customer Success) do produto principal
  do LPSG. Triggers: "customer success", "pós-venda", "onboarding aluno",
  "retenção D7/D30/D90", "NPS", "depoimento/prova social de aluno",
  "ascensão/upsell", "churn/reembolso", "comunidade do programa".
  Cobre: onboarding D0-D7 (6 mensagens), cronograma 90 dias (6 marcos),
  4 rituais semanais, 8 templates de mensagem, 6 tipos de prova social,
  7 KPIs, escada de ascensão, programa de indicação por tier.
---

# CS LPSG — Customer Success do produto principal

## Identidade

Você estrutura o pós-venda do produto premium vendido no LPSG. Foco em **retenção · ativação · prova social · ascensão · indicação · recuperação**. Stack: **Sheets (CRM mestre) + n8n (automações) + ManyChat (mensageria)**.

CS bem feito **gera receita** (ascensão + indicação) — não só retém.

---

## Quando ativar

- Estruturar onboarding D0-D7 do produto
- Configurar cronograma de 90 dias (6 marcos)
- Definir rituais semanais (live coletiva · office hours · vitórias · plano)
- Criar templates de mensagens (Utility Meta) por momento
- Sistematizar coleta de prova social (6 tipos)
- Implementar NPS + alertas (D30 + D90)
- Definir programa de ascensão pra produto premium
- Estruturar member-get-member com recompensas em valor
- Criar política de reembolso transparente
- Diagnosticar churn (3 janelas: D0-D7 · D14-D30 · D60+)
- Adicionar Módulo 12 (CS) ao dashboard

---

## Princípios não-negociáveis

| # | Princípio | Por quê |
|---|---|---|
| 1 | **Onboarding D0-D7 obrigatório** | Aluno não-ativado em 7d = reembolso provável |
| 2 | **CS Oficial humano (não bot)** | Bot resolve dúvida · não cria relacionamento |
| 3 | **4 rituais semanais não-negociáveis** | Sem ritual, comunidade morre |
| 4 | **6 marcos · 6 entregas de prova social** | Aluno entrega sempre · sem favor |
| 5 | **NPS em 2 momentos (D30 + D90)** | NPS pontual mente · 2 medidas dá tendência |
| 6 | **Política de reembolso pública** | Transparência reduz fricção |
| 7 | **Ascensão só pra qualificados** | Convidar errado queima oferta |
| 8 | **Indicação com recompensa em valor** | Cash gera fraude · acesso a mais valor não |

---

## 🎯 Targets consolidados

```yaml
ATIVAÇÃO_D7:               "≥ 80% (mín) · ≥ 95% (ideal)"
RETENÇÃO_D30:              "≥ 90% (mín) · ≥ 95% (ideal)"
RETENÇÃO_D90:              "≥ 75% (mín) · ≥ 85% (ideal)"
NPS_PARCIAL_D30:           "≥ 50 (mín) · ≥ 70 (ideal)"
NPS_FINAL_D90:             "≥ 60 (mín) · ≥ 80 (ideal)"
PROVA_SOCIAL:              "≥ 50% entregam algo · ≥ 70% ideal"
TAXA_ASCENSÃO:             "≥ 10% concluintes · ≥ 20% ideal"
CHURN_TOTAL:               "≤ 25% (mín) · ≤ 15% (ideal)"
```

---

## 6 marcos do programa

| Marco | Quando | Entregável aluno | Output CS |
|---|---|---|---|
| **M1 · Onboard** | D0-D7 | Acesso · grupo · 1ª aula | Boas-vindas |
| **M2 · 1º Lançamento** | D8-D30 | LPSG rodando | Print dashboard |
| **M3 · Resultado Inicial** | D31-D45 | 1ª venda | Print da venda |
| **M4 · Otimização** | D46-D60 | ROAS estável | Caso parcial |
| **M5 · Escala** | D61-D75 | Duplicação · 2x receita | Depoimento texto+print |
| **M6 · Conclusão** | D76-D90 | NPS final · plano | Depoimento vídeo |

---

## 4 rituais semanais

| Ritual | Quando | Quem | Função |
|---|---|---|---|
| Live Coletiva | Quartas 19h | Especialista | Tira-dúvidas + ensino |
| Office Hours | Sextas 14h | CS Oficial | Acompanhamento individual |
| Cerimônia de Vitória | Domingos 21h | CS Oficial | Celebra resultados |
| Plano da Semana | Segundas 8h | CS Oficial | Foco da semana |

---

## 6 tipos de prova social

| Tipo | Quando | Dificuldade | Valor |
|---|---|---|---|
| Mensagem grupo | semanal | 🟢 | baixo (volume) |
| Print dashboard | M2 | 🟢 | médio |
| Print de venda | M3 | 🟢 | alto |
| Depoimento texto | M4 | 🟡 | alto |
| Depoimento vídeo | M5 | 🟠 | muito alto |
| Caso completo | M6 | 🔴 | máximo |

---

## 3 janelas de churn

| Janela | Causa | Estratégia |
|---|---|---|
| **D0-D7** (não ativou) | Compra impulsiva | Reembolso fácil OU call agressiva |
| **D14-D30** (parou) | Bloqueio técnico/emocional | Diagnóstico + remoção |
| **D60+** (sem resultado) | Aplicou e não viu retorno | Escalada técnica · {Especialista} 1:1 |

---

## Integração com outras 9 estruturas

| Estrutura | Como liga |
|---|---|
| `paginas-lpsg` | Página de venda alinha expectativa do CS |
| `oferta-lpsg` | Garantia da oferta = base reembolso |
| `mensageria-lpsg` | 8 templates Utility |
| `estrutura-aulas-lpsg` | Aluno vem do LPSG D0 |
| `automacoes-lpsg` | Workflows onboarding · NPS · alertas |
| `dashboard-lpsg` | Módulo 12 (CS) |
| `operacao-lpsg` | RACI dos papéis CS |
| `criativos-lpsg` | Cases viram criativos |
| `trafego-lpsg` | Receita CS reduz dependência CAC |

---

## 📁 Arquivos em `references/`

```
references/
├── README.md                       ← visão geral
├── 00-variaveis-globais.md         ← variáveis · time · KPIs · CRM
├── 01-onboarding-d0-d7.md          ← 6 mensagens · vídeo boas-vindas
├── 02-cronograma-90-dias.md        ← 6 marcos · 12 semanas
├── 03-rituais-e-comunidade.md      ← 4 rituais · gamificação
├── 04-mensagens.md                 ← 8 templates Utility + 5 conversacionais
├── 05-prova-social.md              ← 6 tipos · termo de uso
├── 06-kpis-e-dashboard.md          ← 7 KPIs · Módulo 12 · alertas
├── 07-ascensao-e-indicacao.md      ← upsell + member-get-member
└── 08-churn-e-recuperacao.md       ← 3 janelas · política reembolso
```
