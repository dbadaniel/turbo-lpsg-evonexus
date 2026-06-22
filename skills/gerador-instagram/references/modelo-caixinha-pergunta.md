# Modelo Caixinha de Pergunta — Referência Técnica

Story 9:16 com foto de fundo, caixinha de pergunta do Instagram no topo e conteúdo com sistema de 3 cores selecionáveis. Fonte única Inter em todo o conteúdo — só muda cor via seleção de texto no editor contenteditable.

---

## Quando Usar

- Stories com formato "caixinha de pergunta" do Instagram
- Quando o usuário pedir: "caixinha de pergunta", "story com caixinha", "resposta de caixinha", "story pergunta e resposta"
- Conteúdo denso em texto com destaques coloridos (amarelo/vermelho)
- Respostas a perguntas de seguidores em formato visual

---

## Estrutura do Slide

```html
<div class="slide" id="slide">
  <!-- Camada 1: Foto de fundo -->
  <div class="photo-layer">
    <img class="photo-image" id="photoImage" alt="">
  </div>

  <!-- Camada 2: Overlay de transparência (preto) -->
  <div id="transparencyOverlay"></div>

  <!-- Camada 3: Overlay de escurecimento (gradiente) -->
  <div class="overlay-darkening" id="overlayDarkening"></div>

  <!-- Camada 4: Caixinha de pergunta -->
  <div class="question-box" id="questionBox">
    <div class="qb-header">Faça uma pergunta</div>
    <div class="qb-text" id="qbText">Texto da pergunta aqui</div>
  </div>

  <!-- Camada 5: Conteúdo (espelhado do editor) -->
  <div class="content-area" id="contentArea"></div>

  <!-- Camada 6: Zona segura -->
  <div class="safe-zone" id="safeZone">
    <div class="safe-zone-top"></div>
    <div class="safe-zone-bottom"></div>
  </div>
</div>
```

### Z-Index das Camadas

| Camada | Z-Index | Função |
|--------|---------|--------|
| .photo-layer | 1 | Foto de fundo |
| #transparencyOverlay | 4 | Overlay preto — controla fade pra preto |
| .overlay-darkening | 6 | Gradiente escuro — legibilidade |
| .question-box | 10 | Caixinha de pergunta do Instagram |
| .content-area | 10 | Conteúdo com cores |
| .safe-zone | 50 | Indicador de zona segura |

---

## CSS do Modelo

### Dimensões

```
Preview: 420×747px (9:16)
Export: 1080×1920px (scale ×2.571)
```

### Foto + Overlays

Mesma estrutura do modelo story-lifestyle. Ver `references/modelo-story-lifestyle.md`.

```css
.photo-layer { position: absolute; top: 0; left: 0; right: 0; bottom: 0; overflow: hidden; z-index: 1; }
.photo-image { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity .3s ease; }
.photo-image.active { opacity: 1; z-index: 3; }

#transparencyOverlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: #000; opacity: 0; z-index: 4; pointer-events: none; }
.overlay-darkening { position: absolute; top: 0; left: 0; right: 0; bottom: 0; z-index: 6; pointer-events: none; }
```

**Gradiente de escurecimento (default 40%):**
```javascript
function applyDarkening(v) {
  overlayDarkening.style.background = `linear-gradient(180deg, rgba(0,0,0,${v*0.75}) 0%, rgba(0,0,0,${v*0.2}) 30%, rgba(0,0,0,${v*0.8}) 70%, rgba(0,0,0,${v}) 100%)`;
}
```

### Caixinha de Pergunta (VALORES APROVADOS — NÃO MUDAR)

```css
.question-box {
  position: absolute;
  z-index: 10;
  top: 3%;                           /* Controlável por slider (0-40%) */
  left: 50%;
  transform: translateX(-50%);
  width: 78%;
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 2px 16px rgba(0,0,0,0.2);
}

.qb-header {
  padding: 7px 10px;
  text-align: center;
  font-size: 11px;
  color: #fff;                       /* Texto branco — APROVADO */
  font-weight: 500;
  background: #26282d;              /* Cinza escuro — APROVADO */
  border-bottom: 1px solid #1e2025;
}

.qb-text {
  padding: 12px 16px 14px;
  text-align: center;
  font-size: 14px;                   /* Controlável por slider (10-20px) */
  color: #1a1a1a;
  font-weight: 400;                  /* Sem bold — APROVADO */
  line-height: 1.35;
  word-spacing: -1px;                /* Espaçamento reduzido — APROVADO */
}
```

### Conteúdo

```css
.content-area {
  position: absolute;
  z-index: 10;
  top: 22%;                          /* Controlável por slider (5-60%) */
  left: 24px;
  right: 24px;
  bottom: 4%;
  color: #fff;
  font-family: 'Inter', sans-serif;  /* Fonte ÚNICA — nunca muda */
  font-weight: 700;                  /* Controlável por toggle (500-800) */
  font-size: 15px;                   /* Controlável por slider (10-24px) */
  line-height: 1.45;                 /* Controlável por slider (1.0-2.6) */
  overflow: hidden;
  pointer-events: none;
  word-break: break-word;
}
```

---

## Sistema de Cores (3 cores selecionáveis)

O usuário seleciona texto no editor contenteditable e clica numa cor:

| Cor | Default Hex | Uso |
|-----|-------------|-----|
| Branco | #FFFFFF | Texto principal/body |
| Amarelo | #F5C518 | Destaques, ênfase, palavras-chave |
| Vermelho | #E53E3E | Frases de impacto, CTA |

As cores amarelo e vermelho são **customizáveis** via input color no painel.

### Implementação

Usa `document.execCommand('foreColor')` no contenteditable. Os botões de cor usam `onmousedown="event.preventDefault()"` pra não perder a seleção do editor.

```javascript
let savedRange = null;

function saveSelection() {
  const sel = window.getSelection();
  if (sel.rangeCount > 0 && editor.contains(sel.anchorNode)) {
    savedRange = sel.getRangeAt(0).cloneRange();
  }
}

editor.addEventListener('mouseup', saveSelection);
editor.addEventListener('keyup', saveSelection);

document.querySelectorAll('.color-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    if (!savedRange) return;
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(savedRange);
    if (!sel.isCollapsed) {
      document.execCommand('foreColor', false, btn.dataset.color);
    }
    syncToSlide();
    saveSelection();
  });
});
```

### Sync Editor → Slide

```javascript
function syncToSlide() { contentArea.innerHTML = editor.innerHTML; }
editor.addEventListener('input', syncToSlide);
```

---

## Tipografia

**Fonte única: Inter.** Este modelo NÃO tem font-toggle.

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

### Pesos (weight toggle)

| Opção | Peso | Default |
|-------|------|---------|
| Medium | 500 | |
| Semibold | 600 | |
| **Bold** | **700** | **✓** |
| Extra Bold | 800 | |

---

## Painel de Controle

```
┌─ Painel (320px) ──────────────────────────┐
│ [Header] Caixinha de Pergunta             │
│          Story Creator • 1080×1920px      │
├───────────────────────────────────────────┤
│ FOTO                                      │
│   Upload drag & drop + Limpar foto        │
│   Transparência slider (0-100, def 100)   │
│   Escurecimento slider (0-100, def 40)    │
│   Posição vertical slider (0-100, def 50) │
├───────────────────────────────────────────┤
│ CAIXINHA DE PERGUNTA                      │
│   Texto da pergunta (textarea)            │
│   Posição vertical slider (0-40%, def 3)  │
│   Tamanho da fonte slider (10-20, def 14) │
│   Checkbox: Mostrar caixinha              │
├───────────────────────────────────────────┤
│ CONTEÚDO                                  │
│   Color buttons [Branco|Amarelo|Vermelho] │
│   Editor contenteditable                  │
│   Tamanho da fonte slider (10-24, def 15) │
│   Peso toggle [Medium|Semibold|Bold|ExBold]│
│   Espaçamento linhas slider(100-260,def145)│
│   Posição vertical slider (5-60%, def 22) │
├───────────────────────────────────────────┤
│ CORES PERSONALIZADAS                      │
│   Amarelo: input color + hex (#F5C518)    │
│   Vermelho: input color + hex (#E53E3E)   │
├───────────────────────────────────────────┤
│ ZONA SEGURA — Checkbox                    │
├───────────────────────────────────────────┤
│ EXPORTAR — [Baixar Imagem (PNG)]          │
└───────────────────────────────────────────┘
```

### O que NÃO tem (vs outros modelos)

- Sem font-toggle — fonte única Inter
- Sem style-toggle — texto sempre flutuante com cor
- Sem screenshot — não suporta prints sobrepostos
- Sem navegação/slides — imagem única
- Sem seletor de formato — fixo 9:16

---

## Export — Fix Obrigatório

O html2canvas NÃO renderiza `transform: translateX(-50%)`. Antes de capturar, converter a caixinha pra posição absoluta em pixels:

```javascript
const qbClone = clone.querySelector('.question-box');
if (qbClone) {
  const origQb = document.getElementById('questionBox');
  const origRect = origQb.getBoundingClientRect();
  const slideRect = slide.getBoundingClientRect();
  const relLeft = origRect.left - slideRect.left;
  qbClone.style.left = relLeft + 'px';
  qbClone.style.transform = 'none';
  qbClone.style.width = origRect.width + 'px';
}
```

**Este fix é NON-NEGOTIABLE.** Sem ele a caixinha sai cortada no PNG.

Ver `references/export-engine.md` para código completo de export. A diferença deste modelo: usar html2canvas direto (sem JSZip), 420×747 preview, scale 2.571, 1080×1920 final.

---

## Regras Invioláveis

1. **Transparência via overlay preto** — NUNCA reduzir opacity da foto
2. **Header caixinha: #26282d com texto #fff** — APROVADO, não mudar
3. **Texto pergunta: weight 400, word-spacing -1px** — APROVADO, não mudar
4. **Fonte única Inter** — NUNCA adicionar font-toggle neste modelo
5. **Sliders SEM accent-color** — usar JS `updateSliderFill()`
6. **Export: fix transform da question-box** — SEMPRE converter translateX(-50%) pra left em px
7. **Color buttons com onmousedown preventDefault** — manter focus no editor
8. **Cores customizáveis** — amarelo e vermelho via input color, branco fixo
9. **Painel width: 320px**

---

## Arquivo Base

HTML completo aprovado: `Turbo/caixinha_pergunta_story.html`

Usar como referência de implementação. Trocar apenas conteúdo inicial e pergunta ao gerar novo story.
