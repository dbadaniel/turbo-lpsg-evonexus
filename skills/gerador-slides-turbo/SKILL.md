---
name: gerador-slides-turbo
description: >
  Use this skill to generate premium PPTX slide presentations for paid launch
  lessons (aulas do lançamento pago). Trigger for: "gerar slides", "slides da aula",
  "apresentação", "PPTX", "slides premium", "slides 5+1", "slides do evento",
  "slides de aula". Generates dark-mode, futuristic PPTX via python-pptx with
  the Turbo Academy design system.
---

# Gerador de Slides Turbo — PPTX Premium para Aulas

## Identidade

Você gera slides de aula em PPTX para o lançamento pago semanal da Turbo Academy.
Cada slide tem UMA ideia. Pouco texto. Impacto visual. Dark mode premium.

---

## Design System Turbo

```
BACKGROUND: #0a0a0a (quase preto)
CARDS: Rounded rectangles com glassmorphism
ACCENT LINE: Linha colorida no topo do card

CORES:
- GREEN:  #4ade80 / #22c55e (destaques positivos)
- YELLOW: #facc15 (alertas, números)
- CYAN:   #22d3ee (dados, métricas)
- PURPLE: #a78bfa (conceitos, métodos)
- RED:    #f87171 (problemas, dores)
- MUTED:  #a1a1aa (texto secundário)

FONTES:
- Inter: corpo, títulos, bullets
- JetBrains Mono: números, contadores, dados

FORMATO: 16:9 (13.333 x 7.5 inches)
```

---

## Estrutura Padrão de Aula (40 min)

Uma aula de 40 minutos tem ~30-35 slides:

```
BLOCO 1 — ABERTURA (3-4 slides)
  - Slide título (nome da aula + expert)
  - Reforço do nome da aula
  - "O que você vai aprender hoje"

BLOCO 2 — CONTEÚDO PRINCIPAL (20-25 slides)
  - Section dividers entre blocos
  - 1 ideia por slide
  - Cards com bullets (máx 4 por slide)
  - Slides de quote/destaque
  - Slides de número/dado

BLOCO 3 — RECAP + ENCERRAMENTO (3-5 slides)
  - Recap dos pontos principais
  - "Na próxima aula..." (loop)
  - CTA (se aplicável)
  - Slide de encerramento
```

---

## Tipos de Slide

### 1. Slide de Título
- Background #0a0a0a
- Nome da aula grande (28pt, branco)
- Subtítulo muted (16pt, #a1a1aa)
- Logo ou nome do expert no rodapé
- Accent line colorida

### 2. Section Divider
- Número grande (JetBrains Mono, 72pt, cor do tema)
- Nome da seção (Inter, 24pt, branco)
- Fundo com gradient sutil

### 3. Slide de Conteúdo
- Card rounded com fundo #1a1a2e
- Accent line no topo (cor da seção)
- Título do card (18pt, branco)
- Bullets (14pt, #d1d5db)
- Máximo 4 bullets por card

### 4. Slide de Quote/Destaque
- Aspas grandes decorativas
- Frase em destaque (20pt, branco, bold)
- Atribuição (14pt, muted)

### 5. Slide de Número/Dado
- Número gigante (JetBrains Mono, 60pt, cor accent)
- Label explicativo (14pt, branco)
- Contexto (12pt, muted)

### 6. Slide de Comparação
- 2 cards lado a lado
- ✗ (vermelho) vs ✓ (verde)
- Título de cada lado

---

## Processo de Criação

1. **Receber conteúdo** do @copywriter-turbo (estrutura da aula, pontos de fala)
2. **Mapear slides** — 1 ideia por slide, definir tipo de cada slide
3. **Gerar script Python** usando python-pptx
4. **Executar** e gerar o .pptx
5. **Abrir** automaticamente para revisão

---

## Helpers Python (python-pptx)

```python
from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN

# Dimensões 16:9
prs = Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)

# Cores
BG = RGBColor(0x0a, 0x0a, 0x0a)
WHITE = RGBColor(0xff, 0xff, 0xff)
MUTED = RGBColor(0xa1, 0xa1, 0xaa)
GREEN = RGBColor(0x4a, 0xde, 0x80)
YELLOW = RGBColor(0xfa, 0xcc, 0x15)
CYAN = RGBColor(0x22, 0xd3, 0xee)
PURPLE = RGBColor(0xa7, 0x8b, 0xfa)
RED = RGBColor(0xf8, 0x71, 0x71)
CARD_BG = RGBColor(0x1a, 0x1a, 0x2e)
```

---

## Regras

1. **Máximo 4 bullets por slide** — se tem mais, dividir em 2 slides
2. **Pouco texto** — frase, não parágrafo
3. **Dark mode sempre** — nunca fundo branco
4. **Design system consistente** — mesmas cores e fontes em todas as aulas
5. **Abrir após gerar** — `open` automático no macOS
6. **Acentuação correta** — português sem erros
7. **Nomes na linguagem do avatar** — não do expert

---

## Integração

- Recebe conteúdo de: @copywriter-turbo (estrutura de aula)
- Executado por: @criativo-turbo
- Referência de design: `~/.claude/skills/designer-senior/SKILL.md`
