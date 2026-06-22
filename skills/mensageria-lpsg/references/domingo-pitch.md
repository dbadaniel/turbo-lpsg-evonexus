# Domingo · Pitch (Aula Final · 20h) — alinhado ao cap 4+4

> **Padrão canônico 2026.** Domingo = **4 mensagens** (Grupo + API em paralelo · cap 4+4). Pitch às **20h** (modelo LPSG). Sem repescagem · sem troca de nome de grupo · sem ALL CAPS. Horários: **12:00 · 19:50 · 20:00 · 22:00**. Ver SKILL.md (seção DOMINGO).

```
═══════════════════════════════════
DOMINGO · AULA FINAL (PITCH) · 20h
{Nome da Aula 6}
═══════════════════════════════════
```

> O grupo mantém o **nome original** (sem semáforo de emoji no nome).

---

## Os 4 horários do domingo

```
12:00  · Lembrete da aula final · 3-4 bullets do que vem (sem revelar preço/bônus)
19:50  · Aviso 10 min antes do pitch
20:00  · Link do pitch ao vivo
22:00  · Resumo do pitch + chamada da abertura de carrinho na segunda
```

> Sem repescagem 20:20. Sem 1h-antes, sem 15min-antes separado. O cap 4+4 corta tudo isso. O peso da aula final dispensa stack de lembretes.

---

### 12:00 · Lembrete da aula final

**Grupo · `lpsg_pitch_lembrete`**
```
{Chamada}, hoje às 20h é a aula mais importante da semana: {NOME_AULA_6}.

O que vem hoje:
- {bullet 1 do que será mostrado}
- {bullet 2}
- {bullet 3}

Separa 1h30 a 2h na agenda. Hoje eu junto tudo da semana.
```

**API · `lpsg_pitch_lembrete` (Utility)**
```
{{1}}, hoje 20h é a Aula Final do {NOME_EVENTO}. {{2}} (teaser do que vem).
Separa a noite.

[BOTÃO: Ver detalhes] → link
```

### 19:50 · Aviso 10 min antes

**Grupo · `lpsg_pitch_aviso`**
```
Em 10 minutos começa a Aula Final. Às 20h em ponto.

Essa semana inteira foi pra chegar aqui. Te vejo lá.
```

### 20:00 · Link do pitch

**Grupo · `lpsg_pitch_link`**
```
✅ Aula Final começou.

{LINK_AULA_6}

Entra. Hoje tudo se conecta.
```

**API · `lpsg_pitch_link` (Utility)**
```
{{1}}, a Aula Final tá ao vivo. Tudo que vimos na semana se conecta hoje.

[BOTÃO: Entrar agora] → link da aula
```

### 22:00 · Resumo + chamada da abertura

**Grupo · `lpsg_resumo_carrinho`**
```
🧠 Foi a aula que juntou tudo.

Amanhã abre o {NOME_PRODUTO}: quem preencheu a ficha entra 6h50
(10 min antes · bônus único). O carrinho geral abre 7h.

Quem ainda não preencheu a ficha: {LINK_FICHA_INTERESSE}

Te vejo amanhã 6h50/7h.
```

> Aqui a abertura do carrinho é anunciada uma vez. Sem despertador. Sem repescagem.

---

## Travas (o que NÃO fazer)

| ❌ Padrão antigo (banido) | ✅ Padrão canônico |
|---|---|
| 7-8 mensagens no domingo | 4 mensagens (cap 4+4) |
| Repescagem "20h20 depois" | Sem repescagem |
| Renomear grupo ("🏆 Hoje 20h" / "🔴 AO VIVO" / "⏰ Amanhã Abertura") | Grupo mantém nome ORIGINAL |
| ALL CAPS ("AO VIVO AGORA") | Tom normal |
| "Modelo manhã 7h" | LPSG usa pitch domingo 20h (aulas seg-sex 7h) |

---

## Notas

- O peso da aula final substitui a lista de lembretes — por isso só 4 msgs.
- A msg das 22h é a ponte pro carrinho: anuncia 6h50 (ficha) / 7h (geral) uma vez.
- Roteiro do vídeo de chamada (se houver, dentro da msg das 12h) em `references/roteiros-audio-video.md`.
