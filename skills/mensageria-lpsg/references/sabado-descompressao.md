# Sábado · Tira-Dúvidas (alinhado ao cap 4+4)

> **Padrão canônico 2026.** Sábado = **4 mensagens** (Grupo + API em paralelo · cap 4+4). Sem repescagem · sem troca de nome de grupo · sem ALL CAPS. Horários default: **09:50 · 10:00 · 12:00 · 19:00** (ajustáveis ao horário do tira-dúvidas). Ver SKILL.md (seção SÁBADO).

```
═══════════════════════════════════
SÁBADO · TIRA-DÚVIDAS (10h default)
═══════════════════════════════════
```

> O grupo mantém o **nome original** (sem semáforo de emoji no nome).

---

## Os 4 horários do sábado

```
09:50  · Aviso 10 min antes do tira-dúvidas
10:00  · Link do tira-dúvidas ao vivo
12:00  · Fechamento (sábado não tem replay) + ponte pro pitch de domingo + playlist + ficha
19:00  · Resumo do tira-dúvidas + chamada do pitch de domingo (20h)
```

> Sábado tira-dúvidas é a única aula **sem replay** disponível (regra LPSG). A msg das 12h substitui o "replay" por um fechamento + ponte pro pitch.

---

### 09:50 · Aviso (10 min antes)

**Grupo**
```
🟢 Bom dia, {chamada}!

Em 10 minutos começa o tira-dúvidas ao vivo. Prepara suas perguntas
sobre tudo que vimos na semana. Te vejo às 10h.
```

**API · `lpsg_sabado_aviso` (Utility)**
```
{{1}}, em 10 minutos começa o tira-dúvidas ao vivo do {NOME_EVENTO}.
Separa suas dúvidas da semana.

[BOTÃO: Entrar agora] → link do tira-dúvidas
```

### 10:00 · Link do tira-dúvidas

**Grupo**
```
✅ Tira-dúvidas começou.

{LINK_TIRADUVIDAS}

Entra e tira suas dúvidas.
```

**API · `lpsg_sabado_link` (Utility)**
```
{{1}}, o tira-dúvidas tá ao vivo. Se tem qualquer dúvida sobre a semana,
é agora.

[BOTÃO: Entrar no tira-dúvidas] → link
```

### 12:00 · Fechamento + ponte + playlist + ficha

**Grupo · `lpsg_sabado_fechamento`**
```
📺 Tira-dúvidas encerrado (esse não fica gravado).

Todas as aulas da semana seguem disponíveis:
- Aula 1: {NOME} 👉 {LINK}
- ...
- Aula 5: {NOME} 👉 {LINK}

📋 Ainda não preencheu a ficha de interesse no {NOME_PRODUTO}?
{LINK_FICHA_INTERESSE}

Amanhã, 20h: a aula final, onde eu abro tudo.
```

> A ficha entra aqui (junto da playlist), sem mensagem extra dedicada. Cabe nas 4 do dia.

### 19:00 · Resumo + chamada do pitch

**Grupo · `lpsg_sabado_resumo_chamada_pitch`**
```
🧠 Recap do tira-dúvidas + o que vem amanhã.

Amanhã é a aula mais importante: a Aula Final · {NOME_AULA_6}.
Domingo, 20h, eu junto tudo da semana e abro o jogo completo —
valores, bônus, condições. E segunda quem preencheu a ficha entra
6h50 (10 min antes · bônus único); o carrinho geral abre 7h.

Separa a tua noite de domingo. Te vejo às 20h.
```

---

## Travas (o que NÃO fazer)

| ❌ Padrão antigo (banido) | ✅ Padrão canônico |
|---|---|
| 6 mensagens no sábado | 4 mensagens (cap 4+4) |
| Repescagem "+10min depois" | Sem repescagem |
| Renomear grupo ("🟡 TIRA-DÚVIDAS" / "⏰ Amanhã Aula Final") | Grupo mantém nome ORIGINAL |
| ALL CAPS ("TIRA-DÚVIDAS AO VIVO AGORA") | Tom normal |
| Ficha como bloco/mensagem extra | Ficha embutida na msg das 12h |

---

## Notas

- O tira-dúvidas NÃO é aula de conteúdo. É aplicação e quebra de objeções.
- SEM pesquisa de encerramento no sábado.
- A msg das 19h é a última do sábado · faz a ponte emocional pro pitch de domingo.
