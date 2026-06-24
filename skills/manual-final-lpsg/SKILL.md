---
name: manual-final-lpsg
description: >
  Gera o MANUAL DE EXECUÇÃO PERSONALIZADO ao final do projeto LPSG, em
  formato HTML standalone (estilo site), navegável por sidebar, com
  ações práticas pra cada entregável. Use quando o usuário pedir:
  "gerar manual final", "manual de execução do projeto", "documentação
  final do LPSG", "manual personalizado do projeto", "consolidar
  tudo num site", "guia operacional do lançamento", "manual de
  uso pós-execução". Esta skill é invocada AUTOMATICAMENTE pelo
  @lpsg-master na Fase 11 (final), após as 10 fases de execução.
  Cobre: 10 seções correspondentes às 10 estruturas LPSG, índice
  com tudo que foi gerado, links pros arquivos, próximos passos,
  cronograma da 1ª edição, contatos do time, responsabilidades RACI.
  HTML self-contained · funciona offline · imprimível · responsivo.
---

# Manual Final LPSG · Gerador de Documentação Personalizada

---

## 🎯 IDENTIDADE

Você gera o **manual de execução personalizado** ao final de um projeto LPSG. É um HTML standalone (sem dependências) que consolida:

1. Tudo que foi entregue nas 10 fases
2. Onde encontrar cada arquivo
3. O que fazer com cada entregável
4. Cronograma da 1ª edição
5. Próximos passos pendentes
6. Time + RACI

**Estilo visual:** mesmo do manual inicial (`04-manual-de-uso/manual.html`) — sidebar, hero, cards, tipografia editorial.

**Diferencial:** este manual é **personalizado** com os dados reais do projeto que foi executado.

---

## ⚡ Quando ativar

### Modo automático
O orquestrador `@lpsg-master` invoca esta skill na **Fase 11 (final)** após as 10 fases de execução estarem completas.

### Modo manual
Usuário pode invocar diretamente:

```
@manual-final-lpsg gera o manual do projeto {NOME_PROJETO}
```

Ou referência direta:
```
Use a skill manual-final-lpsg para gerar o manual de execução
deste projeto. Cole no path: {projeto_root}/manual-execucao.html
```

---

## 📋 Como gerar

### 1. Coletar dados do projeto

Antes de gerar, leia:

- **Cadastro YAML** (do PASSO 1 do orquestrador) → personalização
- **`workspace/lancamentos/{slug}/00-fundacao/`** (gerado pelo @pesquisador-turbo) → voz · avatar · oferta
- **`workspace/lancamentos/{slug}/02-mercado/`** (gerado pelo @pesquisador-mercado-turbo) → benchmarks
- **Outputs das 10 fases** → arquivos gerados em cada estrutura

### 2. Estrutura do manual final

O HTML tem **6 páginas SPA navegáveis**:

```
1. INÍCIO         → Hero personalizado · status · próximos passos
2. ENTREGÁVEIS    → 10 seções (1 por estrutura) com arquivos + ações
3. CRONOGRAMA     → 1ª edição semana-a-semana · perpétuo
4. TIME           → RACI · responsáveis · contatos
5. CHECKLIST      → Pré-edição · edição · pós-edição
6. RECURSOS       → Troubleshooting · contatos · próximas edições
```

### 3. Conteúdo por seção

#### **1. INÍCIO**
- Hero com nome do projeto · expert · data de criação
- Stats (10 fases · 11 skills · X arquivos gerados)
- Status atual do projeto
- Botão "Próximo passo" → leva pro item mais urgente

#### **2. ENTREGÁVEIS** (uma seção por estrutura)
Cada uma das 10 estruturas vira uma página interna com:
- 📁 **Onde está** (path completo dos arquivos)
- 🎯 **O que é** (resumo do que foi entregue)
- ✅ **O que fazer agora** (ações práticas pra ativar)
- 🚨 **Aprovação humana pendente** (se aplicável)
- 🔗 **Links externos** (Vercel · Hotmart · n8n · etc)
- 📊 **Métricas-alvo** (KPIs específicos da estrutura)

#### **3. CRONOGRAMA**
- Timeline visual da 1ª edição (Seg → Dom)
- Aulas com horários
- Tira-dúvidas · pitch · carrinho
- Após 1ª edição · operação perpétua

#### **4. TIME**
- Cards do time (foto · nome · papel · contato)
- Matriz RACI pequena
- SLAs por papel

#### **5. CHECKLIST**
- Pré-edição (sexta antes da Aula 1)
- Durante a edição (Seg-Dom)
- Pós-edição (sábado seguinte)
- Mensal (auditoria)

#### **6. RECURSOS**
- Troubleshooting do projeto específico
- Contatos de emergência (suporte Meta · Hotmart · Vercel)
- Como rodar próxima edição
- Quando abrir CS (Fase 10)

### 4. Salvar arquivo

```
{projeto_root}/manual-execucao.html
```

Standalone · 1 arquivo · sem dependências externas.

---

## 🎨 Padrão visual (mesmo do manual inicial)

> Não reinvente o design · use o mesmo CSS do `04-manual-de-uso/manual.html`.

### Cores
- BG cream (`#FBFAF7`) · accent laranja (`#FF5C00`)
- Sidebar dark · contraste alto

### Tipografia
- **Headings:** Instrument Serif (italics editoriais)
- **Body:** Inter
- **Code:** JetBrains Mono

### Componentes reusáveis
- Hero com gradient + glow laranja
- Cards de feature com hover lift
- Timeline visual (dots + linhas)
- Action rows (ações práticas)
- Modal pra detalhes
- Sidebar fixa esquerda + topbar mobile

### Estrutura de arquivo
```
manual-execucao.html  · self-contained
├── <head>             · meta + Google Fonts (Inter · Instrument Serif · JetBrains Mono)
├── <style>            · CSS embutido (~30 KB)
├── <body>
│   ├── topbar mobile
│   ├── sidebar (6 abas)
│   ├── pages (6 SPA)
│   │   ├── #inicio
│   │   ├── #entregaveis
│   │   ├── #cronograma
│   │   ├── #time
│   │   ├── #checklist
│   │   └── #recursos
│   └── footer
└── <script>           · JS de navegação + microinterações
```

---

## 🧩 Variáveis de personalização

Ao gerar, substitua TUDO que estiver entre `{}` pelos dados reais do cadastro:

```yaml
# Identidade do projeto
{NOME_PROJETO}              ← projeto.nome
{NOME_EXPERT}               ← especialista.nome
{TRATAMENTO_PLURAL}         ← especialista.tratamento
{EMOJI}                     ← especialista.emoji
{COR_PRIMARIA}              ← cor.p (usar como --accent)

# Evento
{NOME_EVENTO}               ← evento.nome
{SIGLA}                     ← evento.sigla
{TICKET_INGRESSO}           ← evento.ticket
{DATA_AULA_1}               ← evento.data_a1
{DATA_PITCH}                ← evento.data_pitch

# Produto
{NOME_PRODUTO}              ← produto.nome
{TICKET_PRODUTO}            ← produto.ticket

# Domínios
{DOMINIO_LP}                ← dom.lp
{DOMINIO_FICHA}             ← dom.ficha
{DOMINIO_DASHBOARD}         ← dom.dash

# Time
{NOME_GESTOR_TRAFEGO}       ← time.trafego.nome
{NOME_DESIGNER}             ← time.design.nome
{NOME_COPY}                 ← time.copy.nome
{NOME_SDR}                  ← time.sdr.nome
{NOME_CS}                   ← time.cs.nome

# Metas
{META_INSCRITOS}            ← meta_edicao.insc_min
{META_VENDAS_PREMIUM}       ← meta_edicao.vd_min
{META_FATURAMENTO}          ← meta_edicao.fat
```

> Aplica a cor primária do cadastro como variável CSS `--accent`. Se o expert escolheu azul, todo o manual fica azul.

---

## 📝 Exemplo de output

Ver `references/exemplo-output.html` para um manual completo gerado.

Ver `references/template-secoes.md` para o conteúdo específico de cada seção.

Ver `references/css-base.md` para o CSS reusado do manual inicial.

---

## 🚦 Princípios não-negociáveis

| # | Princípio | Por quê |
|---|---|---|
| 1 | **HTML self-contained** | Funciona offline · sem servidor · pode mandar por email |
| 2 | **Sem CDN externo** (exceto Google Fonts) | Carrega em qualquer ambiente |
| 3 | **6 páginas SPA** · não scroll infinito | UX · cliente acha o que precisa rápido |
| 4 | **Cor primária do projeto** | Personalização visual · pertencimento |
| 5 | **Toda ação acionável** · não só descritiva | "Faça X em Y" · não "X foi feito" |
| 6 | **Links pros entregáveis reais** | Cliente clica e abre arquivo/URL |
| 7 | **Mobile responsive** + print-friendly | Cliente lê no celular ou imprime |
| 8 | **Toggle de modo escuro** (opcional) | Acessibilidade |

---

## 📂 References disponíveis

```
references/
├── README.md                     ← visão geral
├── 01-template-secoes.md         ← conteúdo padrão de cada seção
├── 02-css-base.md                ← CSS reusado do manual inicial
├── 03-personalizacao.md          ← variáveis YAML → HTML
└── 04-checklist-qa.md            ← validação antes de entregar
```

---

## 🎬 Exemplo de invocação automática (pelo @lpsg-master)

Após Fase 10 do orquestrador, ele chama:

```
@manual-final-lpsg

Projeto concluído: {NOME_PROJETO}
Cadastro original em: _private/cadastro-{NOME_PROJETO}.yaml
Outputs gerados em:
- workspace/lancamentos/{slug}/00-fundacao/
- workspace/lancamentos/{slug}/02-mercado/
- 03-paginas-{SIGLA}/
- 04-criativos-{SIGLA}/
- 05-aulas-{SIGLA}/
- 06-oferta-{SIGLA}/
- 07-mensageria-{SIGLA}/
- 08-trafego-{SIGLA}/
- 09-automacoes-{SIGLA}/
- 10-dashboard-{SIGLA}/
- 11-operacao-{SIGLA}/

Gere manual-execucao.html na raiz do projeto consolidando tudo.
Personaliza com a cor primária ({COR_PRIMARIA}) e tom do {EXPERT}.
```

---

## 🚧 Erros comuns

| Erro | Solução |
|---|---|
| HTML > 500 KB | Otimize CSS · remova duplicações |
| Links quebrados (paths inválidos) | Use sempre paths relativos do project root |
| Cor primária não aplicada | Verificar substituição de `{COR_PRIMARIA}` no `--accent` |
| Mobile não responde | Garantir media queries em todas as larguras |
| Não imprime bem | `@media print` removendo sidebar/topbar |

---

**Princípio final:** o manual de execução é o **legado entregável** do projeto. É o que sobra depois que a IA "vai embora". Precisa ser **autônomo · navegável · acionável**.
