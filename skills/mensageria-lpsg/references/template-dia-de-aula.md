# Template do dia de aula · 4 mensagens API + 4 mensagens grupo

> **Regra inegociável:** **máximo 4 mensagens na API oficial + 4 mensagens no grupo por dia · seg → dom**.
> **Sem repescagem · sem reforço · sem troca de nome de grupo · sem renomear mensagens existentes.**

---

## SEGUNDA → SEXTA · Aulas 1 a 5 · 4 horários canônicos

Cada aula técnica (Seg, Ter, Qua, Qui, Sex às 7h) usa exatamente os 4 horários abaixo. **A mesma mensagem é disparada em paralelo no Grupo e na API oficial** (cada destino tem o seu cap diário de 4).

```
06:50  · Aviso 10 min antes da aula        →  Grupo + API oficial
07:00  · Link da aula                       →  Grupo + API oficial
12:00  · Replay disponível                  →  Grupo + API oficial
19:00  · Resumo da aula da manhã + chamada  →  Grupo + API oficial
        da aula do dia seguinte
```

> Total dia: 4 disparos no Grupo · 4 disparos na API oficial.
> Lead recebe 4 mensagens no WhatsApp pessoal (API) + lê 4 no grupo.

---

### 06:50 · Aviso (10 min antes da aula)

**Grupo · `lpsg_aviso_aula`**

```
🔔 {NOME_EVENTO} · Aula {N} começa em 10 minutos.

Tema da aula: {TEMA_AULA_N}.

Te vejo às 7h.
```

**API oficial · `lpsg_aviso_aula` (Utility)**

Variáveis: `{{1}}` = primeiro nome do lead · `{{2}}` = número da aula · `{{3}}` = tema.

```
{{1}}, em 10 minutos começa a Aula {{2}} do {NOME_EVENTO}.

Tema: {{3}}.

[BOTÃO: Me preparar agora] → link da aula
```

> Mensagem curta. Função: lembrete imediato. Sem bullets. Sem CTA duplo.

---

### 07:00 · Link da aula

**Grupo · `lpsg_link_aula`**

```
✅ Aula {N} começou.

{LINK_AULA}

Te vejo dentro.
```

**API oficial · `lpsg_link_aula` (Utility)**

```
{{1}}, Aula {{2}} acabou de começar.

[BOTÃO: Entrar agora] → link da aula
```

> Mensagem ÚNICA de "agora". Sem repescagem 10/15/20 min depois. Quem perdeu, recebe o replay às 12h.

---

### 12:00 · Replay disponível

**Grupo · `lpsg_replay_aula`**

```
📺 Replay da Aula {N} disponível.

{LINK_REPLAY}

Tempo: {DURACAO_AULA}.
```

**API oficial · `lpsg_replay_aula` (Utility)**

```
{{1}}, o replay da Aula {{2}} está liberado.

[BOTÃO: Assistir o replay] → link do replay
```

> Função: dar acesso pra quem perdeu de manhã. Texto enxuto · sem stack de bônus · sem chamada da próxima aula (isso vem às 19h).

---

### 19:00 · Resumo + chamada da aula seguinte

**Grupo · `lpsg_resumo_chamada`**

```
🧠 Resumo da Aula {N} · {NOME_EVENTO}

{3-4 BULLETS DO QUE FOI ENSINADO HOJE}

▸ Amanhã, 7h: Aula {N+1} · {TEMA_AULA_N+1}.

Te vejo lá.
```

**API oficial · `lpsg_resumo_chamada` (Utility)**

```
{{1}}, recapitulando a Aula {{2}} do {NOME_EVENTO}:

{{3}}  ← bullet 1
{{4}}  ← bullet 2
{{5}}  ← bullet 3

Amanhã 7h tem Aula {{6}}: {{7}}.

[BOTÃO: Entrar no grupo] → link grupo (opcional)
```

> Mensagem mais densa do dia. Aqui o lead consolida o que aprendeu E recebe a teaser da próxima aula. Substitui qualquer "preparação noturna" da estrutura antiga.

---

## SÁBADO · tira-dúvidas (10h por padrão)

```
09:50  · Aviso 10 min antes do tira-dúvidas       →  Grupo + API
10:00  · Link tira-dúvidas                         →  Grupo + API
12:00  · Fechamento (sábado não tem replay) +     →  Grupo + API
        bridge pro pitch de domingo
19:00  · Resumo do tira-dúvidas + chamada do      →  Grupo + API
        pitch de domingo
```

> Sábado tira-dúvidas é a única aula sem replay disponível (regra LPSG). A msg das 12h substitui o "replay" por um fechamento + ponte pro pitch.

---

## DOMINGO · pitch (Aula 6 · 20h)

```
12:00  · Lembrete da aula final · 3-4 bullets do  →  Grupo + API
        que vem
19:50  · Aviso 10 min antes do pitch              →  Grupo + API
20:00  · Link do pitch                             →  Grupo + API
22:00  · Resumo do pitch + chamada da abertura    →  Grupo + API
        de carrinho na segunda
```

> Sem repescagem 20:20. Sem 1h-antes ou 15min-antes. Cap 4+4 corta tudo isso.

---

## D1 (SEGUNDA seguinte) · ABERTURA DE CARRINHO · ÚNICO dia com mensageria

> Exceção controlada ao cap 4+4: **5 horários fixos no D1**. D2-D7 = ZERO disparo.

```
06:50  · Aviso 10 min antes da abertura            →  Grupo + API
07:00  · Link de checkout · carrinho aberto        →  Grupo + API
08:00  · Reforço de chegada · prova de quem entrou →  Grupo + API
10:00  · Status meio-manhã · vagas/contexto        →  Grupo + API
19:00  · Última janela do dia · resumo + bônus     →  Grupo + API
        que ainda valem
```

## D2 → D7 · CARRINHO ABERTO · ZERO mensagem

Sem disparo no grupo · sem disparo na API oficial. O lead interessado volta na página · checkout permanece aberto. Decisão consciente · evita queima de lista. Quem não veio no D1 não vem no D5.

---

## ONBOARDING · pré-evento (ANTES do calendário 4+4)

> Mensageria de onboarding (entre a compra do ingresso e o início da Aula 1) **não conta no cap 4+4** porque é triggered por evento (compra confirmada), não por dia da semana. Detalhamento completo em `references/onboarding.md`.

Estrutura canônica:

```
Trigger: compra do ingresso confirmada (webhook Hotmart)

Mensagem 1 · Boas-vindas + confirmação    →  API oficial (ManyChat)
Mensagem 2 · Link do grupo + agenda       →  API oficial
Mensagem 3 · Pesquisa de matrícula        →  API oficial
Mensagem 4 · Antecipação Aula 1           →  API oficial (D-1 da Aula 1)
```

Sem mensageria de "sábado pré-evento" no grupo (removida 2026-04-30). O grupo só começa a disparar a partir da SEGUNDA da Aula 1, no horário 06:50 canônico.

---

## QUINTA · ficha de interesse (sem mensagem extra)

A ficha de interesse abre na Aula 4 (quinta). Como o cap é 4+4 fixo, **a ficha entra dentro da mensagem das 19h** (resumo + chamada Aula 5):

```
🧠 Resumo da Aula 4 · {NOME_EVENTO}

{3-4 BULLETS DO QUE FOI ENSINADO HOJE}

📋 Ficha de interesse aberta:
{LINK_FICHA}

▸ Amanhã, 7h: Aula 5 · {TEMA_AULA_5}.
```

> Sem bloco isolado pra ficha. Sem mensagem extra. Cabe nas 4 do dia.

---

## SEXTA · Aula 5 · sem reforço de ficha

A msg das 19h da sexta vira "Resumo da Aula 5 + chamada do tira-dúvidas de sábado":

```
🧠 Resumo da Aula 5 · {NOME_EVENTO}

{3-4 BULLETS}

▸ Amanhã, 10h: tira-dúvidas.
```

> Sem mensagem dedicada de "fecha sua ficha hoje". A ficha permanece aberta · operador pode reforçar UMA vez no resumo · não em mensagem nova.

---

## Checklist anti-violação

```
[ ] Total ≤ 4 disparos no GRUPO no dia? (qualquer dia · seg-dom)
[ ] Total ≤ 4 disparos na API OFICIAL no dia?
[ ] Nenhuma mensagem de "10 min depois" / "tô entrando no ar"?
[ ] Nenhuma troca de nome de grupo agendada?
[ ] Nenhum nome de mensagem novo (mantém os 4: aviso · link · replay · resumo_chamada)?
[ ] Sem mensagem de "encerramento de bônus" / "última hora relâmpago"?
[ ] Sábado: 12h é fechamento (não replay) · domingo não tem replay também?
```

> Se algum item falhar · cortar mensagem antes de subir.

---

**Fonte:** método LPSG · regra atualizada em 2026-04-30 (limite 4+4 fixo · seg-dom).
