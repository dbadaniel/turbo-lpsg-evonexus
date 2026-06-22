# 04 · Dependências entre estruturas

> Mudou X? Atualiza Y. Não viole essas dependências.

## 🌳 Árvore de dependências

```
                    estrutura-aulas
                          │
                          ↓ (temas alimentam)
┌────────────────► mensageria
│                         │
│ (gancho)                │ (cronograma carrinho)
│                         │
│                  oferta │
│                    │    │
│ (preço · garantia) │    │
│         ↓               │
└──► paginas ◄────────────┘
          │   ↑
          │   │ (criativos validados)
          ↓   │
       trafego ────► criativos
          │
          │ (Meta API)
          ↓
       automacoes ◄──────────┐
          │                  │
          ↓                  │
       dashboard             │
                             │
                          ficha
                       (paginas/08)
                             │
                             ├──► mensageria (FASE 4-B)
                             ├──► automacoes (Fluxo 4)
                             └──► dashboard (Módulo 11)


       compra do produto
              │
              ↓
            cs ──────► mensageria (8 templates)
                       automacoes (onboarding D0)
                       dashboard (Módulo 12)
                       operacao (papéis CS)
```

## 📋 Matriz de impacto · "se eu mudar X, atualizar Y"

| Mudou | Atualizar |
|---|---|
| **Oferta · ticket** | paginas (CTA), mensageria (cronograma), cs (política reembolso) |
| **Oferta · garantia** | paginas (texto da garantia), oferta (recuperação) |
| **Estrutura aulas** | mensageria (temas), criativos (hooks) |
| **Página de ingresso** | trafego (criativos validados pra teste de página) |
| **Ficha de interesse** | mensageria (FASE 4-B), automacoes (Fluxo 4 webhook), dashboard (Módulo 11) |
| **Mensageria** | automacoes (templates Utility na Meta API) |
| **Tráfego (engine análise)** | dashboard (Módulo 10), automacoes (Workflow 09) |
| **CS · onboarding** | mensageria (8 templates), automacoes (workflows D0-D7) |
| **CS · ascensão** | oferta (escada de produtos), paginas (página /proximo-nivel) |
| **Operação · RACI** | todas (quem faz o quê em cada uma) |

## 🚦 Regras de mudança

| Tipo | O quê | Cuidados |
|---|---|---|
| 🟢 **Local** | Renomear criativo, ajustar copy de mensagem | Sem dependência · seguro |
| 🟡 **Lateral** | Mudar headline da página | Re-rodar 5 variações por 5 dias antes de validar |
| 🟠 **Vertical** | Mudar oferta (ticket, garantia) | Atualizar paginas, mensageria, cs simultaneamente |
| 🔴 **Estrutural** | Mudar avatar ou nicho | Auditoria completa · nova rodada da árvore de diagnóstico |
