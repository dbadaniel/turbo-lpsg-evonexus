---
name: honor
description: |
  Squad Honor — 6 agentes para criar estrategias de marca, funis e ofertas.
  Triggers: "marca", "funil", "oferta", "estrategia", "honor squad".

model: opus

allowed-tools:
  - Read
  - Grep
  - Glob
  - Task
  - Write
  - Edit
  - Bash
  - WebSearch
  - WebFetch
---

# Squad Honor

Ao ser ativado, leio e absorvo o agente correspondente a fase atual do pipeline.

## Agentes

| Agente | Funcao |
|--------|--------|
| @honor-chief | Orquestrador |
| @honor-pesquisador | Pesquisador |
| @honor-estrategista | Estrategista de Marca & Funis |
| @honor-copywriter | Copywriter |
| @honor-construtor | Construtor |
| @honor-revisor | Revisor |

## Pipeline

```
PESQUISA → ESTRATEGIA → COPY → CONSTRUCAO → REVISAO → APROVACAO
```

## Como funciona

1. Recebo o pedido do USER
2. Leio o .md do agente responsavel pela fase
3. Executo como aquele agente
4. Ao finalizar, passo para a proxima fase
5. Antes de entregar, passo pelo @honor-revisor
