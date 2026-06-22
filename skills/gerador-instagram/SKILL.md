---
name: gerador-instagram
description: >
  Gera imagens prontas para Instagram: carrosséis, criativos estáticos e stories com caixinha de pergunta. Recebe copy e gera HTML interativo com painel de controle completo (formato, foto, texto, screenshot, slides, zona segura) e exportação PNG.
  Trigger: "criar carrossel", "montar carrossel", "carrossel Instagram", "gerar imagem Instagram", "criativo estático", "imagem de anúncio", "card Instagram", "slide Instagram", "exportar PNG", "montar imagem do post", "criar imagem do criativo", "carrossel com foto", "carrossel design", "gerar slides", "imagem de feed", "arte Instagram", "layout carrossel", "imagem com copy", "transformar copy em imagem", "story lifestyle", "story com foto", "texto puro", "estilo Doug", "carrossel de texto", "fundo preto", "story com tag", "carrossel dark", "story 9:16", "caixinha de pergunta", "story com caixinha", "resposta de caixinha", "story Q&A", "criativo v2", "criativo individual", "estático com foto". Ative quando o contexto envolve transformar texto em visual para Instagram.
---

# Gerador de Imagens Instagram v4.0 — Template-Based

Você transforma copy em imagens prontas para Instagram. Existem **dois sistemas de templates** conforme o tipo de entrega:

- **Template Universal** (`references/template-universal.html`) — Para carrosséis multi-slide (vários slides num único arquivo). Navegação por dots, exportação em ZIP.
- **Template Criativo V2** (`references/template-criativo-v2.html`) — Para criativos estáticos individuais (1 arquivo HTML = 1 criativo). Design system com badge, divider verde, headline com accent, sub com destaque amarelo, CTA bar fixa, glow effects. Cada criativo é um arquivo independente.

Seu trabalho é identificar qual template usar, distribuir a copy, e injetar no template correto.

---

## Decisão: Qual Template Usar?

| Pedido | Template | Motivo |
|---|---|---|
| Carrossel (múltiplos slides) | `template-universal.html` | Multi-slide com navegação |
| Estático genérico (modelo photo/design) | `template-universal.html` (1 slide) | Usa o sistema de modelos |
| Criativo de anúncio / tráfego pago | `template-criativo-v2.html` | 1 arquivo por criativo, design premium |
| Vários criativos de anúncio | `template-criativo-v2.html` × N | 1 arquivo HTML por criativo |
| Story lifestyle | `template-universal.html` (9:16) | Modelo story-lifestyle |
| Caixinha de pergunta | `references/template-caixinha.html` | Template específico |

Na dúvida entre os dois: se o pedido envolve **criativos de tráfego pago** ou o usuário mencionou **"v2"**, **"estático individual"**, ou **"design do funil8-v2"**, use o Template Criativo V2.

---

## SISTEMA 1: Template Universal (Carrosséis)

### Fluxo de Trabalho

1. **Coletar parâmetros**
   - **Copy** (obrigatório) — texto que vai nos slides
   - **Tipo** — carrossel ou estático (infere pelo volume se não informado)
   - **Modelo visual** — `photo`, `design`, `texto-puro`, `story-lifestyle`, `hybrid`. Default: `photo`
   - **Expert** — nome, handle, cores da marca. Se já existe no projeto, puxa do contexto
   - **Formato** — 4:5, 1:1, 9:16. Default: 4:5 para carrossel, 9:16 para story

2. **Copiar o template**
   ```
   cp references/template-universal.html [destino]/carrossel_[tema].html
   ```

3. **Distribuir a copy nos slides** (regras abaixo)

4. **Injetar no template** — localizar slides placeholder entre `<!-- SLIDES START -->` e `<!-- SLIDES END -->`, substituir pelos slides com copy real

5. **Ajustar detalhes** — cores do expert nas CSS variables, classes de fundo, modelo

6. **Salvar e entregar**

### Regras de Distribuição de Copy

**Para Carrossel:**
1. **Slide 1 — Hook**: A frase mais impactante. Máximo 2 linhas.
2. **Slide 2 — Tensão/Contexto**: Amplia o hook, identifica o problema.
3. **Slides 3-7 — Desenvolvimento**: Um conceito por slide. ~20-40 palavras por slide.
4. **Slide de Prova** (se houver): Screenshot, número, resultado.
5. **Penúltimo — Virada/Insight**: Conclusão, provocação final.
6. **Último — CTA**: Ação clara. "Comenta [KEYWORD]" ou "Link na bio".

**Densidade:** Máximo ~40 palavras por slide (photo/design). ~25 palavras (texto-puro).

**Para Estático (universal):**
- **Headline** no topo, **subheadline** abaixo, **CTA** no rodapé.
- Uma ideia só. Se tem mais de uma, vira carrossel.

**Para Story-Lifestyle:**
- **Tag label**: Categoria/nicho
- **Texto principal**: Frase de impacto (1-3 linhas)
- **CTA** (opcional): "Clica em saiba mais ↓"

### Moldes de Slide (Template Universal)

#### Modelo PHOTO
```html
<div class="slide" data-model="photo" data-name="[NOME_DO_SLIDE]">
  <div class="photo-layer">
    <div class="photo-placeholder"></div>
    <img class="photo-image" src="" alt="">
  </div>
  <div class="transparency-overlay"></div>
  <div class="overlay-darkening"></div>
  <div class="screenshot-layer"><img class="screenshot-image" src="" alt=""></div>
  <div class="text-layer">
    <div class="face-spacer"></div>
    <div class="tag-label" style="display:none;">Tag</div>
    <div class="highlight-box"><p>[TEXTO_DE_CIMA]</p></div>
    <div class="content-box"><p>[TEXTO_DE_BAIXO]</p></div>
  </div>
</div>
```

Variações de box por slide:
- Só highlight-box (impacto): remover content-box
- Só content-box (explicação): remover highlight-box
- Ambos: highlight em cima, content embaixo
- No-box (flutuante): trocar `highlight-box` por `no-box`

#### Modelo PHOTO — Slide CTA (com preço)
```html
<div class="slide" data-model="photo" data-name="CTA">
  <div class="photo-layer">
    <div class="photo-placeholder"></div>
    <img class="photo-image" src="" alt="">
  </div>
  <div class="transparency-overlay"></div>
  <div class="overlay-darkening"></div>
  <div class="screenshot-layer"><img class="screenshot-image" src="" alt=""></div>
  <div class="text-layer">
    <div class="face-spacer"></div>
    <div class="tag-label" style="display:none;"></div>
    <div class="highlight-box"><p>[FRASE_CTA]</p></div>
    <div class="content-box">
      <p>[TEXTO_APOIO]</p>
      <div class="cta-price" style="margin-top:16px;text-align:center;">
        <div class="cta-price-main" style="font-family:var(--heading-font);font-size:42px;font-weight:800;color:#fff;text-shadow:0 2px 12px rgba(0,0,0,0.6);">[PREÇO]</div>
        <div class="cta-price-sub" style="font-family:var(--body-font);font-size:14px;color:rgba(255,255,255,0.8);margin-top:4px;text-shadow:0 1px 4px rgba(0,0,0,0.6);">[PARCELAMENTO]</div>
      </div>
      <div class="cta-button" style="margin-top:16px;background:#fff;color:var(--brand-dark);padding:10px 28px;border-radius:6px;font-family:var(--body-font);font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:1px;text-align:center;">[TEXTO_BOTÃO]</div>
    </div>
  </div>
</div>
```

#### Modelo DESIGN
```html
<div class="slide bg-dark" data-model="design" data-name="[NOME]">
  <div class="slide-content-ds">
    <div class="ds-header"><span class="ds-tag">[TAG_LABEL]</span></div>
    <div class="ds-body">
      <h2>[TÍTULO]</h2>
      <p class="ds-sub">[SUBTEXTO]</p>
    </div>
  </div>
</div>
```
Alternar fundos: `bg-dark` → `bg-light` → `bg-dark` (nunca dois iguais seguidos).

#### Modelo TEXTO-PURO
```html
<div class="slide" data-model="texto-puro" data-name="[NOME]">
  <div class="text-content">
    <p>[FRASE_1]</p>
    <p>[FRASE_2]</p>
    <p>[FRASE_3]</p>
  </div>
</div>
```
Slide CTA texto-puro: adicionar `class="accent"` na frase de destaque.

#### Modelo HYBRID
Combinar slides photo + design no mesmo carrossel. Slide 1 (hook) e último (CTA) sempre photo. Slides de conteúdo podem ser design.

### CTA Bar no Template Universal

Quando um criativo do template universal precisa de CTA bar fixa (barra no rodapé do slide, fora do text-layer), adicionar:

**No HTML de cada slide que precisa:**
```html
<div class="cta-bar">SAIBA MAIS — R$35</div>
```

**No CSS (se não existir):**
```css
.cta-bar {
  position: absolute;
  bottom: 6%;
  left: 50%;
  transform: translateX(-50%);
  width: 82%;
  background: #fff;
  color: var(--brand-dark);
  padding: 10px 0;
  text-align: center;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  border-radius: 4px;
  z-index: 11;
}
```

**No painel, adicionar grupo CTA BAR** (sempre visível, não condicional):
```html
<div class="panel-group" id="ctaGroup" style="display:block;">
  <div class="group-title">CTA BAR</div>
  <div class="panel-row">
    <div class="row-label">Texto</div>
    <input type="text" id="ctaButtonInput" value="SAIBA MAIS — R$35">
  </div>
  <div class="panel-row">
    <div class="row-label">Fonte</div>
    <div class="style-toggle" id="ctaFontToggle">
      <button class="active" data-font="'Inter', sans-serif">Inter</button>
      <button data-font="'DM Sans', sans-serif">DM Sans</button>
      <button data-font="'Playfair Display', serif">Playfair</button>
    </div>
  </div>
  <div class="panel-row">
    <div class="row-label">Peso</div>
    <div class="style-toggle" id="ctaWeightToggle">
      <button data-weight="400">Regular</button>
      <button data-weight="600">Semibold</button>
      <button class="active" data-weight="800">Bold</button>
    </div>
  </div>
  <div class="panel-row">
    <div class="row-label">Fundo</div>
    <div class="style-toggle" id="ctaBgToggle">
      <button class="active" data-bg="#fff" data-fg="#1A1918">Branco</button>
      <button data-bg="rgba(0,0,0,0.92)" data-fg="#fff">Escuro</button>
      <button data-bg="var(--brand-primary)" data-fg="#fff">Dourado</button>
      <button data-bg="transparent" data-fg="#fff" data-noborder="true">Sem fundo</button>
    </div>
  </div>
  <div class="panel-row">
    <div class="row-label">Tamanho</div>
    <div class="slider-row">
      <input type="range" id="ctaSizeSlider" min="9" max="24" value="12">
      <span class="slider-val" id="ctaSizeValue">12px</span>
    </div>
  </div>
</div>
```

**JS necessário para CTA Bar no universal:**
```javascript
function getCtaBar() { return slides[currentIndex].querySelector('.cta-bar'); }

document.getElementById('ctaButtonInput').addEventListener('input', e => {
  const bar = getCtaBar();
  if (bar) { bar.textContent = e.target.value; return; }
  const el = slides[currentIndex].querySelector('.cta-button');
  if (el) el.textContent = e.target.value;
});

document.getElementById('ctaFontToggle').addEventListener('click', e => {
  const btn = e.target.closest('button'); if (!btn) return;
  document.querySelectorAll('#ctaFontToggle button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const bar = getCtaBar(); if (bar) bar.style.fontFamily = btn.dataset.font;
});

document.getElementById('ctaWeightToggle').addEventListener('click', e => {
  const btn = e.target.closest('button'); if (!btn) return;
  document.querySelectorAll('#ctaWeightToggle button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const bar = getCtaBar(); if (bar) bar.style.fontWeight = btn.dataset.weight;
});

document.getElementById('ctaBgToggle').addEventListener('click', e => {
  const btn = e.target.closest('button'); if (!btn) return;
  document.querySelectorAll('#ctaBgToggle button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const bar = getCtaBar(); if (!bar) return;
  bar.style.background = btn.dataset.bg;
  bar.style.color = btn.dataset.fg;
  bar.style.border = btn.dataset.noborder ? 'none' : '';
});

document.getElementById('ctaSizeSlider').addEventListener('input', e => {
  document.getElementById('ctaSizeValue').textContent = e.target.value + 'px';
  const bar = getCtaBar(); if (bar) bar.style.fontSize = e.target.value + 'px';
  updateSliderFill(e.target);
});

// Sync no painel ao mudar slide
const _origSyncPanel = syncPanel;
syncPanel = function() {
  _origSyncPanel();
  const bar = getCtaBar();
  if (bar) document.getElementById('ctaButtonInput').value = bar.textContent.trim();
};
```

---

## SISTEMA 2: Template Criativo V2 (Estáticos Individuais)

### Quando Usar

- Criativos de tráfego pago (anúncios estáticos)
- Quando o usuário pede múltiplos criativos individuais (não carrossel)
- Quando referencia o design "v2", "funil8-v2", ou design com badge + glow + accent verde/amarelo
- Quando pede criativos com foto de fundo pré-carregada

### Design System V2

O V2 tem uma identidade visual específica e diferente do template universal:

**Cores:**
- Fundo: `#0a0a0a` (slide), `#1a1a1a` (body)
- Accent verde: `#4ade80` (headline accent, badge dot, divider, glow)
- Accent amarelo: `#facc15` / `#eab308` (sub strong, CTA bar gradient, glow)
- Texto: `#ffffff` (headline), `#a1a1aa` (sub)
- Badge: `rgba(255,255,255,0.05)` bg, `rgba(255,255,255,0.6)` text

**Tipografia:** Inter exclusivamente (400-900)

**Componentes visuais (de cima pra baixo):**
1. **Badge** — Pill com dot verde + texto uppercase (ex: "APENAS PARA EXPERTS E INFOPRODUTORES")
2. **Divider** — Barra verde 36×3px
3. **Headline** — 28px/900/branco, com `<span class="accent-green">` pra destaques verdes
4. **Sub** — 13px/400/cinza, com `<strong>` pra destaques amarelos
5. **CTA Bar** — Barra fixa no bottom 6%, gradiente amarelo, texto preto, 82% width
6. **Glow Effects** — Radial gradient verde no topo, amarelo no bottom-right

### Fluxo de Trabalho V2

1. **Ler o template** — `references/template-criativo-v2.html`

2. **Para cada criativo, copiar o template e substituir placeholders:**
   - `[NN]` → número do criativo (01, 02, etc.)
   - `[SLUG]` → identificador curto (ex: inversao, psicologia)
   - `[PROJETO]` → nome do projeto (ex: Funil 8)
   - `[BADGE_TEXT]` → texto do badge
   - `[HEADLINE]` → headline com `<span class="accent-green">` nos destaques
   - `[HEADLINE_PLAIN]` → headline sem HTML (pro textarea do painel)
   - `[SUB]` → sub com `<strong>` nos destaques
   - `[SUB_PLAIN]` → sub sem HTML (pro textarea do painel)
   - `[CTA_TEXT]` → texto do CTA bar

3. **Se o usuário pediu foto pré-carregada** — Converter imagem pra base64 e injetar no `src` do `<img class="photo-image">`, e adicionar classe `active`. Ver seção "Foto Base64 Pré-Carregada".

4. **Salvar como** `criativo-[NN]-[SLUG].html` — 1 arquivo por criativo

5. **Entregar todos os arquivos**

### Estrutura HTML do V2

O template V2 completo está em `references/template-criativo-v2.html`. A estrutura do slide é:

```html
<div class="slide" id="slideEl">
  <!-- Photo layer -->
  <div class="photo-layer">
    <img class="photo-image" id="photoImg" src="[BASE64_OU_VAZIO]" alt="">
  </div>
  <div class="transparency-overlay" id="transparencyOverlay"></div>
  <div class="overlay-darkening" id="overlayDarkening"></div>

  <!-- Screenshot layer -->
  <div class="screenshot-layer" id="screenshotLayer">
    <img id="screenshotImage" src="" alt="">
  </div>

  <!-- Glows -->
  <div class="glow-green"></div>
  <div class="glow-yellow"></div>

  <!-- Safe zone -->
  <div class="safe-zone" id="safeZone"></div>

  <!-- Text layer -->
  <div class="text-layer">
    <div class="badge">
      <span class="badge-dot"></span>
      <span>[BADGE_TEXT]</span>
    </div>
    <div class="headline-block">
      <div class="divider"></div>
      <h1 class="headline">[HEADLINE com <span class="accent-green">]</h1>
      <p class="sub">[SUB com <strong>]</p>
    </div>
    <div style="height: 48px;"></div>
  </div>

  <!-- CTA Bar -->
  <div class="cta-bar" id="ctaBar">[CTA_TEXT]</div>
</div>
```

### Painel de Controle V2

O painel V2 tem estas seções (todas presentes em `template-criativo-v2.html`):

| Seção | Controles |
|---|---|
| **Formato** | 1:1 / 4:5 (default) / 9:16 |
| **Zona Segura** | Mostrar/Ocultar |
| **Foto de Fundo** | Upload, transparência, escurecimento, posição X/Y, flip |
| **Screenshot** | Upload, tamanho, posição X/Y, arredondamento |
| **Textos** | Badge (input), Headline (textarea), Destaque verde (input), Sub (textarea), Destaque amarelo (input), Tamanho headline (slider 18-42px), Tamanho sub (slider 10-20px) |
| **CTA Bar** | Texto (input), Fonte (Inter/DM Sans/Playfair), Peso (Regular/Semibold/Bold), Fundo (Amarelo/Branco/Escuro/Verde), Tamanho (slider 8-18px) |
| **Exportar** | Baixar PNG com resolução proporcional |

A seção **Textos** é fundamental: permite editar headline, sub e badge em tempo real, com campos separados pra definir qual trecho fica com accent verde (headline) ou amarelo bold (sub). Isso dá controle total ao usuário sem precisar editar HTML.

A seção **CTA Bar** é sempre visível (não condicional). Permite customizar texto, fonte, peso, cor de fundo e tamanho.

---

## Foto Base64 Pré-Carregada

Quando o usuário pede criativos "já com foto de fundo", converter as imagens pra base64 e embedar diretamente no HTML. Isso elimina a necessidade de upload manual.

### Como fazer (via Python)

```python
from PIL import Image
import base64, io

def photo_to_base64(filepath, max_w=800, quality=75):
    """Redimensiona e converte foto pra base64 (mantém arquivo leve)."""
    img = Image.open(filepath)
    if img.width > max_w:
        ratio = max_w / img.width
        img = img.resize((max_w, int(img.height * ratio)), Image.LANCZOS)
    buf = io.BytesIO()
    img.save(buf, format='JPEG', quality=quality, optimize=True)
    b64 = base64.b64encode(buf.getvalue()).decode()
    return f"data:image/jpeg;base64,{b64}"
```

### Onde injetar

No `<img class="photo-image">`, colocar o base64 no `src` e adicionar classe `active`:

```html
<img class="photo-image active" id="photoImg" src="data:image/jpeg;base64,/9j/4AAQ..." alt="">
```

### Regras importantes

- **max_w=800** e **quality=75** — reduz o tamanho do arquivo HTML significativamente sem perda visível (a exportação é 1080px, o browser faz upscale)
- **Nunca repetir fotos** entre criativos do mesmo lote — se o usuário forneceu um diretório de fotos, selecionar uma diferente pra cada
- Se a foto já está com `.active`, ela aparece automaticamente ao abrir o HTML
- O usuário ainda pode trocar a foto pelo painel (upload zone sobrescreve o base64)

---

## Geração em Lote (Múltiplos Criativos V2)

Quando o pedido envolve gerar N criativos de uma vez (ex: "gere 10 criativos estáticos"), o fluxo mais eficiente é via script Python:

1. Definir array de criativos com `num`, `slug`, `headline`, `sub`, `cta`
2. Ler o template V2 como string
3. Para cada criativo: substituir placeholders, embedar foto base64 (se pedido), salvar arquivo
4. Entregar todos os arquivos

O template V2 usa Python f-strings facilmente — as chaves CSS/JS precisam ser escapadas com `{{` e `}}`.

---

## Comportamento Geral

- Se receber copy sem tipo, pergunte: "Carrossel ou estático?"
- Se copy é longa demais pra estático, sugira carrossel automaticamente
- Se o expert tem identidade visual no projeto, use sem perguntar
- Se pedirem "story" ou "stories", default story-lifestyle (9:16)
- Se pedirem "caixinha de pergunta", usar `references/template-caixinha.html`. Consultar `references/modelo-caixinha-pergunta.md`
- Se pedirem "texto puro" / "estilo Doug" / "fundo preto", usar modelo texto-puro
- Se pedirem "criativo de anúncio" / "estático v2" / criativos individuais de tráfego → Template Criativo V2
- **Nunca invente copy.** Placeholder `[COPY AQUI]` onde falta texto
- **Todos os textos devem ser editáveis no painel** — headline, sub, badge, CTA. O usuário não deveria precisar editar HTML pra mudar qualquer texto visível

---

## Brand Adaptation System

Cada projeto tem sua identidade visual. Em vez de adaptar cores manualmente toda vez, o sistema usa um arquivo `brand-config.json` que centraliza todas as variáveis visuais do projeto. A skill lê esse arquivo e aplica automaticamente nos templates.

### Onde fica o brand-config.json

Busca nesta ordem (para no primeiro que encontrar):
1. `[pasta-do-projeto]/04-criativos/brandbook/brand-config.json`
2. `[pasta-do-projeto]/brandbook/brand-config.json`
3. `[pasta-do-projeto]/brand-config.json`

Se nenhum existir, usa os defaults do template (verde/amarelo do V2, dourado/escuro do Universal).

### Estrutura do brand-config.json

```json
{
  "project": "Nome do Projeto",
  "expert": "Nome do Expert",
  "colors": {
    "primary": "#4ade80",
    "secondary": "#facc15",
    "dark": "#0a0a0a",
    "text_main": "#ffffff",
    "text_sub": "#a1a1aa"
  },
  "fonts": {
    "heading": "Inter",
    "body": "Inter"
  },
  "cta": {
    "bg_type": "gradient",
    "bg_value": "linear-gradient(135deg, #facc15, #eab308)",
    "text_color": "#000000"
  },
  "glow": {
    "top": "rgba(74, 222, 128, 0.08)",
    "bottom": "rgba(250, 204, 21, 0.06)"
  }
}
```

Campos mínimos obrigatórios: `colors.primary` e `colors.secondary`. Tudo que faltar usa o default do template.

### Mapeamento: brand-config → Template V2

O V2 tem cores hardcoded no CSS. O script de geração faz find-and-replace nestas propriedades:

| brand-config | Seletor CSS no V2 | Propriedade | Default |
|---|---|---|---|
| `colors.primary` | `.accent-green` | `color` | `#4ade80` |
| `colors.primary` | `.badge-dot` | `background` | `#4ade80` |
| `colors.primary` | `.divider` | `background` | `#4ade80` |
| `colors.dark` | `.slide` | `background` | `#0a0a0a` |
| `colors.text_main` | `.headline` | `color` | `#ffffff` |
| `colors.text_sub` | `.sub` | `color` | `#a1a1aa` |
| `colors.secondary` | `.sub strong` | `color` | `#facc15` |
| `cta.bg_value` | `.cta-bar` | `background` | `linear-gradient(135deg, #facc15, #eab308)` |
| `cta.text_color` | `.cta-bar` | `color` | `#000` |
| `glow.top` | `.glow-green` | `background` (radial) | `rgba(74,222,128,0.08)` |
| `glow.bottom` | `.glow-yellow` | `background` (radial) | `rgba(250,204,21,0.06)` |
| `fonts.heading` | `.headline` | `font-family` | `Inter` |

### Mapeamento: brand-config → Template Universal

O Universal usa CSS variables no `:root`. Mais direto:

| brand-config | CSS Variable | Default |
|---|---|---|
| `colors.primary` | `--brand-primary` | `#C5A55A` |
| `colors.dark` | `--brand-dark` | `#1A1918` |
| `fonts.heading` | `--heading-font` | `Playfair Display` |
| `fonts.body` | `--body-font` | `Inter` |

### Aplicação automática via Python

Quando gerar criativos em lote, carregar o brand-config antes de processar os templates:

```python
import json, os

def load_brand(project_path):
    """Busca brand-config.json no projeto. Retorna dict ou {} se não encontrar."""
    search = [
        os.path.join(project_path, "04-criativos", "brandbook", "brand-config.json"),
        os.path.join(project_path, "brandbook", "brand-config.json"),
        os.path.join(project_path, "brand-config.json"),
    ]
    for p in search:
        if os.path.exists(p):
            with open(p) as f:
                return json.load(f)
    return {}

def apply_brand_v2(html, brand):
    """Aplica brand-config no HTML do template V2 via find-and-replace."""
    if not brand:
        return html
    colors = brand.get("colors", {})
    cta = brand.get("cta", {})
    glow = brand.get("glow", {})
    fonts = brand.get("fonts", {})

    replacements = []
    if "primary" in colors:
        replacements.append(("#4ade80", colors["primary"]))
    if "secondary" in colors:
        replacements.append(("#facc15", colors["secondary"]))
        replacements.append(("#eab308", colors["secondary"]))
    if "dark" in colors:
        replacements.append(("background:#0a0a0a", f"background:{colors['dark']}"))
    if "text_sub" in colors:
        replacements.append(("#a1a1aa", colors["text_sub"]))
    if cta.get("bg_value"):
        replacements.append((
            "linear-gradient(135deg, #facc15, #eab308)",
            cta["bg_value"]
        ))
    if cta.get("text_color"):
        replacements.append(("color:#000", f"color:{cta['text_color']}"))
    if glow.get("top"):
        replacements.append(("rgba(74, 222, 128, 0.08)", glow["top"]))
    if glow.get("bottom"):
        replacements.append(("rgba(250, 204, 21, 0.06)", glow["bottom"]))

    for old, new in replacements:
        html = html.replace(old, new)
    return html

def apply_brand_universal(html, brand):
    """Aplica brand-config no HTML do template Universal via CSS variables."""
    if not brand:
        return html
    colors = brand.get("colors", {})
    fonts = brand.get("fonts", {})

    if "primary" in colors:
        html = html.replace("--brand-primary: #C5A55A", f"--brand-primary: {colors['primary']}")
    if "dark" in colors:
        html = html.replace("--brand-dark: #1A1918", f"--brand-dark: {colors['dark']}")
    if "heading" in fonts:
        html = html.replace("--heading-font: 'Playfair Display'", f"--heading-font: '{fonts['heading']}'")
    if "body" in fonts:
        html = html.replace("--body-font: 'Inter'", f"--body-font: '{fonts['body']}'")
    return html
```

### Fluxo de Geração Atualizado

1. **Receber pedido** (copy + tipo + expert)
2. **Buscar brand-config.json** no projeto com `load_brand()`
3. **Ler template** (V2 ou Universal)
4. **Aplicar brand** com `apply_brand_v2()` ou `apply_brand_universal()`
5. **Substituir placeholders** de copy (headline, sub, badge, CTA)
6. **Salvar e entregar**

Se o projeto não tem brand-config.json, pular o passo 4 — os defaults do template funcionam.

### Criando brand-config.json para um novo projeto

Quando iniciar um projeto novo e o expert tem referências visuais (brandbook, paleta, página existente):

1. Extrair as cores dominantes da identidade visual existente
2. Mapear: qual é o accent principal? Qual é a cor de CTA? Fundo claro ou escuro?
3. Criar o JSON na pasta `04-criativos/brandbook/brand-config.json`
4. Testar gerando 1 criativo V2 e 1 slide universal pra validar que as cores batem

Se o expert NÃO tem identidade visual definida, usar os defaults do template e anotar no projeto que a identidade visual precisa ser criada.

---

## O Que os Templates Já Incluem (NÃO precisa gerar)

### Template Universal
- Painel de controle (formato, navegação, foto, screenshot, tag, textos, CTA, cantos, export)
- CSS de todos os modelos (photo, design, texto-puro, story-lifestyle)
- JavaScript de todos os controles
- Engine de exportação (html2canvas + JSZip)
- Zona segura, nav dots, keyboard nav

### Template V2
- Painel de controle (formato, zona segura, foto, screenshot, textos editáveis, CTA bar, export)
- CSS completo do design system (glows, badge, divider, accents)
- JavaScript de todos os controles (incluindo texto editável com accent dinâmico)
- Engine de exportação (html2canvas + fixObjectFitForExport)

**NÃO reimplemente nenhum desses itens. Eles já existem nos templates.**

---

## Regras Técnicas

1. Transparência via overlay preto — NUNCA opacity na foto
2. Sliders com fill via JS — NUNCA accent-color
3. Upload zones: bordas brancas — NUNCA cor de marca
4. Botões ativos: branco + preto — NUNCA cor de marca
5. Painel: fundo #111 — NUNCA cor de marca
6. Fundo preto escuro: rgba(0,0,0,0.92) — NUNCA menor que 0.85
7. No universal: texto mapeado por posição DOM — NUNCA por classe
8. O primeiro `.slide.active` no HTML é o que aparece ao abrir (universal)
9. No V2: `<img class="photo-image active">` mostra a foto pré-carregada
10. No V2: CTA Bar é componente independente (não dentro do text-layer), z-index: 11
11. No V2: spacer `<div style="height: 48px;">` no final do text-layer evita texto sobrepor o CTA bar
