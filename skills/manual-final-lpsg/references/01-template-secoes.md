# 01 · Template de seções · conteúdo padrão

> Cada uma das 6 páginas do manual final tem este conteúdo padrão. Personaliza com dados do cadastro.

---

## 1. INÍCIO (`#inicio`)

```html
<section class="hero">
  <span class="hero-tag">Projeto entregue · {DATA_GERACAO}</span>
  <h1>{NOME_PROJETO}<br>está <em>pronto pra rodar</em>.</h1>
  <p class="lead">10 fases concluídas · {EXPERT} · {NOME_EVENTO} · ingresso {TICKET_INGRESSO}</p>

  <div class="stats-bar">
    <div class="stat"><div class="stat-num">10</div><div class="stat-label">fases concluídas</div></div>
    <div class="stat"><div class="stat-num">11</div><div class="stat-label">skills usadas</div></div>
    <div class="stat"><div class="stat-num">{N_ARQUIVOS}</div><div class="stat-label">arquivos gerados</div></div>
    <div class="stat"><div class="stat-num"><em>{N_PENDENCIAS}</em></div><div class="stat-label">ações humanas</div></div>
  </div>
</section>

<!-- Status atual -->
<section class="section">
  <h2>Status atual</h2>
  <div class="status-grid">
    [10 cards · 1 por fase · com check ✓ ou alerta 🚨]
  </div>
</section>

<!-- Próximo passo -->
<section class="cta-card">
  <span class="cta-eyebrow">Próximo passo</span>
  <h3>{ACAO_MAIS_URGENTE}</h3>
  <p>{DESCRICAO_ACAO}</p>
  <button onclick="goto('entregaveis')">Ver detalhes →</button>
</section>
```

---

## 2. ENTREGÁVEIS (`#entregaveis`)

10 sub-seções · uma por estrutura. Padrão de cada uma:

### 2.1 Páginas (`paginas-lpsg`)

```html
<div class="entregavel-card">
  <div class="entregavel-head">
    <span class="num">01</span>
    <div>
      <h3>Páginas de venda + ficha de interesse</h3>
      <p>5 variações de página em Next.js · ficha 11 etapas com lead score</p>
    </div>
  </div>

  <div class="entregavel-body">
    <h4>📁 Onde está</h4>
    <ul>
      <li><code>03-paginas-{SIGLA}/</code> · projeto Next.js completo</li>
      <li><code>03-paginas-{SIGLA}/src/app/(variations)/v1-v5/</code> · 5 variações</li>
      <li><code>03-paginas-{SIGLA}/src/app/ficha-de-interesse/</code> · ficha</li>
    </ul>

    <h4>🎯 O que é</h4>
    <p>Páginas de venda do ingresso ({TICKET_INGRESSO}) com tracking instalado (Pixel · CAPI · GTM · GA4). Ficha de interesse classifica leads em HOT · WARM · COLD automaticamente.</p>

    <h4>✅ O que fazer agora</h4>
    <ol>
      <li>Upload de assets reais (foto profissional · 6 prints · 6 depoimentos)</li>
      <li>Conectar domínio {DOMINIO_LP} no Vercel</li>
      <li>Adicionar variáveis de ambiente reais (Pixel · CAPI · GTM · GA4)</li>
      <li>Validar Lighthouse mobile ≥ 95 em todas as 5 variações</li>
      <li>Testar fluxo de compra com cupom 99% off</li>
    </ol>

    <h4>🚨 Aprovação humana pendente</h4>
    <p class="alert">Upload de foto profissional do {EXPERT} · sem isso a página fica genérica.</p>

    <h4>🔗 Links rápidos</h4>
    <a href="https://vercel.com/dashboard" target="_blank">Vercel Dashboard →</a>
    <a href="https://business.facebook.com/events_manager" target="_blank">Meta Events Manager →</a>

    <h4>📊 Métricas-alvo</h4>
    <table>
      <tr><th>Indicador</th><th>Mínimo</th><th>Ideal</th></tr>
      <tr><td>Conversão página</td><td>5%</td><td>7%+</td></tr>
      <tr><td>LCP mobile</td><td>&lt; 2s</td><td>&lt; 1.5s</td></tr>
      <tr><td>Lighthouse</td><td>90</td><td>95+</td></tr>
    </table>
  </div>
</div>
```

### 2.2 Criativos (`criativos-lpsg`)
Mesma estrutura · adaptada:
- 📁 Pastas com 5 vídeos · 5 estáticos · 5 carrosseis
- 🎯 Ads pra Meta · roteiros prontos
- ✅ Gravar 5 vídeos · designer monta estáticos · subir no Ads Manager
- 🚨 Gravação dos vídeos pelo {EXPERT}
- 🔗 Meta Ads Library · Designer Figma
- 📊 Hook Rate · Hold Rate · Body Rate

### 2.3 Estrutura de aulas (`estrutura-aulas-lpsg`)
- 📁 6 aulas · slides PPTX
- 🎯 Roteiros + slides prontos pra gravar
- ✅ Maratona de gravação Dia 5
- 🚨 Setup técnico (câmera · áudio · cenário)
- 📊 Comparecimento A1 ≥ 30% · retenção A2-A5 ≥ 85%

### 2.4 Oferta (`oferta-lpsg`)
- 📁 Stack de valor · tsunami · garantia · recuperação
- 🎯 Oferta completa do {NOME_PRODUTO} ({TICKET_PRODUTO})
- ✅ Aprovar pelo expert · validar com jurídico (garantia)
- 🚨 Confirmar stack ≥ 1.5x ticket
- 📊 Conv. pitch → compra ≥ 7%

### 2.5 Mensageria (`mensageria-lpsg`)
- 📁 Cap 4+4 · ~19 templates Utility
- 🎯 Templates Meta API + áudios pro expert gravar
- ✅ Submeter na Meta · gravar 4 áudios · configurar fluxos no ManyChat
- 🚨 Aprovação Meta (1-3 dias úteis · começa cedo)
- 🔗 business.facebook.com/wa/manage · ManyChat Dashboard
- 📊 Entrega Utility ≥ 95% · reação 🚀 ≥ 25%

### 2.6 Tráfego (`trafego-lpsg`)
- 📁 Estrutura ASC · pipeline Meta API · engine de análise
- 🎯 Campanha pronta pra subir
- ✅ Configurar no Ads Manager · ativar pixel + CAPI · publicar
- 🚨 Aprovar plano de tráfego antes de gastar
- 🔗 Ads Manager · CAPI Events Manager
- 📊 ROAS ingresso ≥ 1.0 · CPM ≤ R$ 40 · Hook Rate ≥ 20%

### 2.7 Automações (`automacoes-lpsg`)
- 📁 14 workflows n8n (JSONs importáveis)
- 🎯 Captação · evento · tsunami · recuperação automatizados
- ✅ Importar JSONs · configurar credentials · testar com R$ 1
- 🚨 Aprovar antes de ativar webhooks (vão pra produção)
- 🔗 n8n Dashboard · Hotmart Webhooks

### 2.8 Dashboard (`dashboard-lpsg`)
- 📁 Projeto Next.js · 11 módulos · 8 fontes
- 🎯 Acompanhar lançamento ao vivo
- ✅ Conectar {DOMINIO_DASHBOARD} no Vercel · auth · compartilhar com time
- 🔗 Vercel · Google Sheets

### 2.9 Operação (`operacao-lpsg`)
- 📁 RACI · 12 SOPs · 6 rituais · cronograma perpétuo
- 🎯 Time alinhado · cada um sabe sua função
- ✅ Reunião de 1h pra validar RACI · distribuir acessos
- 🚨 Cada papel concorda?
- 📊 SLA SDR ≤ 24h · resposta CS ≤ 4h

### 2.10 CS (`cs-lpsg`)
- 📁 Onboarding D0-D7 · 90 dias · 4 rituais · 8 templates
- 🎯 Pós-venda estruturado (após 1ª venda do produto)
- ✅ Alocar CS Oficial · agendar Lives · gravar boas-vindas
- 🚨 Vídeo de boas-vindas é pessoal · {EXPERT} grava
- 📊 Ativação D7 ≥ 80% · NPS final ≥ 60 · ascensão ≥ 10%

---

## 3. CRONOGRAMA (`#cronograma`)

```html
<section class="hero-mini">
  <h1>Cronograma da <em>1ª edição</em></h1>
  <p>Sua semana de lançamento · Seg → Dom</p>
</section>

<section class="timeline-week">
  [Visualização da semana com cada dia]

  Seg {DATA_AULA_1} 7h00    Aula 1 (Fundamentação)
  Ter +1d 7h00              Aula 2 (Construção)
  Qua +2d 7h00              Aula 3 (Marco 1)
  Qui +3d 7h00              Aula 4 (Pré-pitch + abre ficha)
  Sex +4d 7h00              Aula 5 (Marco 2)
  Sáb {DATA_TIRA_DUVIDAS} 10h  Tira-dúvidas ao vivo
  Dom {DATA_PITCH} 20h         🔥 PITCH (Aula 6 + oferta)
  Seg +8d 7h00              Carrinho ABRE (tsunami começa)
  Sex +12d 23h59            Carrinho FECHA
</section>

<section class="perpetual">
  <h2>Modelo perpétuo</h2>
  <p>A partir de {DATA_AULA_1 + 7d}, novo ciclo todo segundas. Detalhes em `operacao-{SIGLA}/cronograma-perpetuo.md`.</p>
</section>
```

---

## 4. TIME (`#time`)

```html
<section class="hero-mini">
  <h1>Seu <em>time</em></h1>
  <p>{N_PESSOAS} pessoas alinhadas · RACI assinado</p>
</section>

<div class="team-grid">
  <div class="team-card">
    <span class="team-emoji">🎤</span>
    <h3>{NOME_EXPERT}</h3>
    <p class="team-role">Expert · apresenta as aulas</p>
    <p class="team-contact">{EMAIL_EXPERT}</p>
    <p class="team-contact">{WA_EXPERT}</p>
  </div>
  [outros 5 cards: trafego, copy, design, sdr, cs]
</div>

<section class="raci-section">
  <h2>Matriz RACI resumida</h2>
  <table>
    <tr><th>Atividade</th><th>R</th><th>A</th><th>C</th><th>I</th></tr>
    [linhas dinamicamente geradas]
  </table>
  <a href="11-operacao-{SIGLA}/raci-completo.md">Ver matriz completa →</a>
</section>
```

---

## 5. CHECKLIST (`#checklist`)

```html
<section class="hero-mini">
  <h1>Checklist de <em>execução</em></h1>
</section>

<div class="checklist-blocks">
  [3 blocos colapsáveis · pré-edição · durante · pós-edição]
</div>
```

Conteúdo dos checklists vem do `operacao-lpsg` + `lpsg-master/05-checklists.md`.

---

## 6. RECURSOS (`#recursos`)

```html
<div class="tabs">
  [Tabs: Troubleshooting · Contatos · Próxima edição · CS]
</div>

<!-- Tab Troubleshooting -->
[10 problemas comuns com solução · adaptado pro stack do projeto]

<!-- Tab Contatos -->
[Suporte Meta · Hotmart · Vercel · n8n · ManyChat]

<!-- Tab Próxima edição -->
[Como rodar próxima edição · perpétuo · semana ISO]

<!-- Tab CS -->
[Quando abrir · como invocar @cs-turbo · checklist setup CS]
```
