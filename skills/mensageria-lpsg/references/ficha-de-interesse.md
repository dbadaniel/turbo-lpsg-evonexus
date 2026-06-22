# Ficha de Interesse · Fluxo da Aula 4 (alinhado ao cap 4+4)

> **Padrão canônico 2026 · cap 4+4.** A ficha **NÃO gera mensagem extra**. Ela entra **dentro da mensagem das 19h** (`lpsg_resumo_chamada`) da quinta. Sem repescagem · sem renomear o grupo · sem mensagem/template dedicado. Ver SKILL.md (seção QUINTA) e `template-dia-de-aula.md`.

---

## Como a ficha entra na Aula 4 (quinta)

A quinta segue os 4 horários canônicos normais (06:50 · 07:00 · 12:00 · 19:00). A **mensagem das 19h muda de função**: além do resumo da Aula 4 + chamada da Aula 5, ela carrega os **3 elementos obrigatórios do pré-pitch**:

1. Chamada pra preencher a **ficha de interesse**
2. Aviso: **segunda · quem preencheu a ficha entra 6h50 (janela exclusiva · bônus único) · carrinho geral 7h**
3. Aviso: **domingo 20h tem a revelação de preço e bônus**

**Sem preço · sem bônus na quinta.**

### Mensagem das 19h (grupo) · quinta · `lpsg_resumo_chamada`

```
🧠 Resumo da Aula 4 · {NOME_EVENTO}

{3-4 bullets do que foi ensinado hoje}

📋 Ficha de interesse aberta:
{LINK_FICHA_INTERESSE}

Quem preenche entra na lista de prioridade: segunda você entra 6h50
(10 min antes de todo mundo, com bônus único). Carrinho geral abre 7h.
Domingo, 20h, eu abro tudo: valores, bônus, condições.

▸ Amanhã, 7h: Aula 5 · {TEMA_AULA_5}.
```

> A versão API (Utility) da mesma mensagem está em `utility-templates-meta.md`. Sem bloco isolado pra ficha · cabe nas 4 do dia.

---

## Reforço na Aula 5 (sexta) · LEMBRETE CURTO

A Aula 5 **NÃO é pré-pitch nem repitch** · **não reapresenta o produto nem a ficha como bloco**. A mensagem das 19h da sexta carrega só um **lembrete curto** pra quem ainda não preencheu, dentro do resumo técnico:

```
🧠 Resumo da Aula 5 · {NOME_EVENTO}

{3-4 bullets técnicos}

Quem ainda não preencheu a ficha, ainda dá tempo: {LINK_FICHA_INTERESSE}
Domingo 20h eu abro tudo · segunda 6h50 a ficha entra / 7h o carrinho geral.

▸ Amanhã, 10h: tira-dúvidas.
```

> Sem "preenche AGORA" (sem ALL CAPS). Sem reapresentar o produto. Sem link/vídeo dedicado de ficha.

---

## Travas (o que NÃO fazer na Aula 4/5)

| ❌ Padrão antigo (banido) | ✅ Padrão canônico |
|---|---|
| Mensagem extra só pra ficha (estoura cap 4+4) | Ficha embutida na msg das 19h |
| Mensagem API dedicada pra ficha | Vai junto da `lpsg_resumo_chamada` das 19h |
| Repescagem na Aula 4 | Sem repescagem (cap 4+4) |
| Renomear o grupo pra "Aula 4 + Ficha..." | Grupo mantém o nome ORIGINAL todos os 7 dias |
| Reapresentar a ficha como bloco na Aula 5 | Lembrete curto dentro do resumo |
| "Preenche AGORA" (ALL CAPS) | Tom normal, sem caps |

---

## Notas

- O vídeo da ficha (se houver) é mostrado DENTRO da Aula 4 ao vivo, não vira mensagem extra no grupo.
- A ficha contém a pergunta de qualificação/ancoragem: "Se eu garantir [resultado] no [tempo], você consideraria [Valor Ancorado]?" (pergunta hipotética · NÃO revela o preço da oferta).
- Quem preenche entra 6h50 na segunda (10 min antes do carrinho geral), com bônus único dessa janela.
- A ficha é o filtro de ouro · cria a lista de insiders que abre primeiro.
