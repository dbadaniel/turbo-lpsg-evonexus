# 02 · CSS base · reusado do manual inicial

> Use o mesmo CSS do `04-manual-de-uso/manual.html` do projeto LPSG (manual inicial). Garante consistência visual entre os 2 manuais.

## Variáveis CSS principais

```css
:root {
  /* Cor accent vem do cadastro · personalizada por projeto */
  --accent: {COR_PRIMARIA};         /* default: #FF5C00 */
  --accent-hover: {COR_PRIMARIA_DARK};
  --accent-soft: {COR_PRIMARIA_LIGHT};
  --accent-glow: rgba({COR_PRIMARIA_RGB}, 0.18);

  /* Resto fixo */
  --bg: #FBFAF7;
  --bg-card: #FFFFFF;
  --bg-sidebar: #0F0F10;
  --text: #0A0A0A;
  --text-soft: #3A3A3A;
  --text-muted: #6B6B6B;
  --border: #ECEAE3;
  --shadow-sm: 0 2px 8px rgba(0,0,0,0.04);
  --shadow-md: 0 8px 24px rgba(0,0,0,0.06);
  --shadow-lg: 0 24px 48px rgba(0,0,0,0.08);
  --radius: 12px;
  --radius-lg: 20px;
  --transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
```

## Como obter cores derivadas

Se cor primária é `#FF5C00`:
- **dark (hover):** `#E04E00` (escurecer 15%)
- **light (soft):** `#FFEDE0` (clarear 80%)
- **rgb (glow):** `255, 92, 0`

Use uma função util tipo:

```javascript
function deriveColors(hex) {
  const rgb = hexToRgb(hex);
  return {
    primary: hex,
    dark: darken(hex, 0.15),
    light: lighten(hex, 0.85),
    rgb: `${rgb.r}, ${rgb.g}, ${rgb.b}`
  };
}
```

## Tipografia

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

```css
body { font-family: 'Inter', -apple-system, sans-serif; font-size: 16px; line-height: 1.6; }
h1, h2, h3 { font-family: 'Instrument Serif', Georgia, serif; font-weight: 400; letter-spacing: -0.02em; }
h1 em, h2 em, h3 em { font-style: italic; color: var(--accent); }
code, pre { font-family: 'JetBrains Mono', monospace; }
```

## Componentes principais

### Hero
```html
<section class="hero">
  <span class="hero-tag">{TAG}</span>
  <h1>{TITLE} <em>{HIGHLIGHT}</em></h1>
  <p class="lead">{SUB}</p>
</section>
```

### Stats bar (4 stats)
```html
<div class="stats-bar">
  <div class="stat"><div class="stat-num">{N}</div><div class="stat-label">{LABEL}</div></div>
  ...
</div>
```

### Sidebar
```html
<aside class="sidebar">
  <div class="sidebar-header">
    <h1>{NOME_PROJETO}</h1>
    <div class="subtitle">Manual de execução</div>
  </div>
  <nav>
    <a class="nav-link" data-page="inicio">📍 Início</a>
    <a class="nav-link" data-page="entregaveis">📦 Entregáveis</a>
    <a class="nav-link" data-page="cronograma">📅 Cronograma</a>
    <a class="nav-link" data-page="time">👥 Time</a>
    <a class="nav-link" data-page="checklist">✅ Checklist</a>
    <a class="nav-link" data-page="recursos">🆘 Recursos</a>
  </nav>
</aside>
```

### Action row
```html
<div class="action-row">
  <div class="action-row-text">
    <strong>{TITULO_ACAO}</strong>
    <span>{DESCRICAO}</span>
  </div>
  <span class="action-row-time">{TEMPO}</span>
</div>
```

### Status card (com check ou alerta)
```html
<div class="status-card status-ok">
  <span class="status-icon">✓</span>
  <div>
    <strong>{TITULO}</strong>
    <span>{DESCRICAO}</span>
  </div>
</div>

<div class="status-card status-pending">
  <span class="status-icon">🚨</span>
  <div>...</div>
</div>
```

## Pegar CSS completo

> Em vez de copiar, **referencie o CSS do manual inicial** lendo o arquivo `04-manual-de-uso/manual.html` e extraindo a tag `<style>...</style>` inteira. Aplique apenas as variáveis personalizadas.

```python
# pseudo-código
import re
css_match = re.search(r'<style>(.*?)</style>', open('04-manual-de-uso/manual.html').read(), re.DOTALL)
css_base = css_match.group(1)

# Substitui as variáveis
css_base = css_base.replace('#FF5C00', cadastro['cor']['p'])
css_base = css_base.replace('#FFEDE0', light_version)
# ... etc
```

Output: HTML self-contained com CSS personalizado embutido.
