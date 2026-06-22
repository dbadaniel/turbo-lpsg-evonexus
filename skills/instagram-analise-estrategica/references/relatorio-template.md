# Estrutura textual padrão — 10 seções

Esta é a ESTRUTURA do `analysis.json` e do HTML/Google Doc renderizados. A ordem é fixa. Cada seção tem regras de preenchimento.

---

## 1. Visão geral do período

**Conteúdo obrigatório:**
- Janela exata (data de início → data de fim no formato `YYYY-MM-DD`)
- Total de publicações no período + breakdown por formato (REEL / CARROSSEL / IMAGEM)
- Alcance acumulado (Windsor)
- Impressões acumuladas (Windsor)
- Variação % vs período anterior (alcance e impressões)

**Regras:**
- Variação mostrada sempre com 2 casas (`+8,24%` / `-3,17%`).
- Se Windsor não trouxer impressões, marcar lacuna.

---

## 2. Métricas de crescimento

**Conteúdo obrigatório:**
- Seguidores início / fim / delta absoluto / taxa de crescimento (%)
- Demografia (se disponível: gênero × idade, top 3 cidades, top 3 países)
- Tendência (acelerando / estável / desacelerando) com justificativa numérica

**Regras:**
- Tendência precisa comparar AO MENOS 2 deltas consecutivos. Se só tem 1 delta, dizer literalmente "[lacuna: comparativo do delta vs período anterior do delta requer 3 períodos]".
- Demografia faltando = `[lacuna: campo audience_gender_age não disponível na fonte windsor]`.

---

## 3. Performance de engajamento

**Conteúdo obrigatório:**
- Fórmula visível: `engajamento = (curtidas + comentários + salvamentos + compartilhamentos) / alcance`
- Estatísticas globais: n, média, mediana, melhor, pior
- Tabela por formato com as mesmas estatísticas + aviso se n < 4
- Evolução semana a semana (4 semanas) com mediana por semana

**Regras:**
- Engajamento mostrado em % com 2 casas.
- Avisar amostra abaixo do mínimo (`n < 4`).

---

## 4. Top conteúdos

**Conteúdo obrigatório:**
- Top 5 por alcance: rank, formato, data, alcance, link, trecho da caption (200 chars), hipótese rotulada, confiança
- Top 5 por engajamento: rank, formato, data, engagement rate, link, trecho, hipótese, confiança

**Regras:**
- Hipótese DEVE começar com `[hipótese]`.
- Confiança: alto / médio / baixo, baseado em quantos outros posts replicam o mesmo padrão observável.
- Sem hipótese inventada — se não dá pra deduzir do dado, deixar "hipótese requer inspeção visual do criativo".

---

## 5. Conteúdos de baixo desempenho

**Critério:** posts com engagement rate < 50% da mediana do formato.

**Conteúdo obrigatório por formato:**
- Mediana do formato
- Limiar de "baixo" (50% da mediana)
- N posts abaixo do limiar
- Tabela dos posts (até 10): id, ER, trecho, link
- Padrões em comum aparecendo em 3+ posts (se < 3, dizer "amostra insuficiente para padrão")

**Regras:**
- Se formato tem n < 4, não calcular mediana — apenas avisar.
- Padrões só são listados se 3+ posts os exibem.

---

## 6. Análise de formatos e horários

**Conteúdo obrigatório:**
- Formato vencedor por **MÉDIA**
- Formato vencedor por **MEDIANA** (separar — média é mascarada por outlier)
- Heatmap dia da semana × hora (n posts e engajamento médio por célula)
- Células com n < 5 marcadas como "amostra insuficiente"

**Regras:**
- Só elege formato vencedor com n ≥ 4 no formato.
- Heatmap em horário local do cliente (default BRT).

---

## 7. Diagnóstico geral

**Conteúdo obrigatório:**
- O que funciona (lista de 1-3 itens, cada um com número-âncora)
- O que trava (lista de 1-3 itens, cada um com número-âncora)
- Maior gap entre potencial e resultado (1-2 itens, com razão melhor/mediana ou similar)

**Regras:**
- Cada item tem ao menos 1 número visível.
- Se não há sinal estatístico, dizer literalmente "[lacuna: sem padrão estatisticamente sustentado nesta amostra]".

---

## 8. Recomendações prioritárias

**3 a 5 ações. Cada uma com:**
- Prioridade (1, 2, 3, ...)
- O que fazer (frase imperativa)
- Dado que sustenta (número-âncora visível)
- Como medir em 14 dias (métrica concreta + meta numérica)

**Regras:**
- Nada genérico ("postar mais", "engajar melhor"). Ação precisa ser específica e mensurável.
- Toda recomendação ancorada em um dado já presente em alguma das seções anteriores.

---

## 9. Roteiros baseados nos top vídeos

**3 roteiros — um por Reel do top 3 de engajamento.**

**Estrutura de cada roteiro:**

```
ROTEIRO N — Inspirado em [ID + link do post de referência] (engajamento: X,XX%)

PADRÃO REPLICADO
- Gancho: [observado no vídeo de referência]
- Ritmo: [cortes, cadência]
- Desenvolvimento: [arco]
- CTA: [tipo usado]
- Por que esse padrão funcionou: [explicação ligada aos números — saves, retenção, shares]

ROTEIRO NOVO
0-3s (gancho): [texto literal pra falar]
4-15s (desenvolvimento bloco 1): [texto + ação]
16-30s (desenvolvimento bloco 2): [texto + ação]
31-45s (fechamento + CTA): [texto literal]
Áudio sugerido: [tipo de trilha ou nome se referência identificável]
Caption: [3-5 linhas, hook + linha de quebra + CTA + 3-5 hashtags]
```

**Regras:**
- O agente preenche os blocos `[a completar — inspecionar X]` que vêm do `analyze.py` com inspeção visual real do vídeo de referência (abrir o `permalink`).
- Sem áudio sugerido genérico ("trilha viral") — ou identifica o áudio do referência, ou diz `[lacuna: identificação de áudio requer acesso ao app do Instagram]`.

---

## 10. Lacunas de dados

**Lista todas as ocorrências de `[lacuna: ...]` que apareceram nas seções anteriores.**

**Estrutura:**
- Caminho onde a lacuna apareceu (ex.: `2_crescimento.demografia`)
- Descrição da lacuna
- O que precisaria ser ativado pra cobrir (permissão do connector, ferramenta extra, etc.)

**Regra:** se a lista está vazia, escrever explicitamente "nenhuma lacuna registrada neste relatório".
