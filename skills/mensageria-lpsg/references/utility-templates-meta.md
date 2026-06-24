# Templates Utility · cap 4+4 · prontos pra Meta API oficial

> Cada template em **2 versões**: `BODY` para Meta API (UTILITY) + `TEXTO LIVRE` (SendFlow / ManyChat).
>
> **Regra:** cap 4+4 mensagens/dia (seg-dom) · onboarding fora do cap · D1 carrinho com 5 horários.
>
> **Categoria padrão:** `UTILITY`. Variáveis `{{1}}-{{N}}` numeradas com sample values reais.
>
> **Idioma:** `pt_BR`. **Body:** ≤ 1.024 chars. **Header opcional:** ≤ 60. **Footer opcional:** ≤ 60.

---

## ONBOARDING · 4 mensagens API · NÃO conta no cap 4+4

### `lpsg_onboard_boas_vindas` · UTILITY

**Quando:** webhook Hotmart compra confirmada.

**BODY:**
```
{{1}}, sua compra do {{2}} foi confirmada.

Você está dentro. O evento começa {{3}}, às {{4}}.

Agora me ajuda com 3 passos rápidos pra garantir que você não perca nada. Vou te mandar um por vez.
```

**Sample values:**
- `{{1}}` = `João`
- `{{2}}` = `Desafio LPSG`
- `{{3}}` = `segunda, 12 de maio`
- `{{4}}` = `7h da manhã`

---

### `lpsg_onboard_grupo_agenda` · UTILITY

**Quando:** após msg 1 (~30s).

**BODY:**
```
Primeiro passo, {{1}}: entra no grupo do WhatsApp.

É lá que vai cair link da aula, replay, áudio do dia. Sem o grupo, você fica de fora.

E lembra: se quiser parar de receber, manda "SAIR" que eu paro na hora.
```

**BUTTONS:** 1 (URL)
- `Entrar no grupo` → `{{2}}` (sample: `https://chat.whatsapp.com/abc123xyz`)

**Sample values:**
- `{{1}}` = `João`
- `{{2}}` = `https://chat.whatsapp.com/abc123xyz`

---

### `lpsg_onboard_pesquisa` · UTILITY

**Quando:** D-3 da Aula 1.

**BODY:**
```
{{1}}, falta pouco pro {{2}}.

Antes de começar, me conta um pouco mais sobre você (2 minutos): assim eu adapto a aula pro seu contexto e te mando os materiais certos no dia.
```

**BUTTONS:** 1 (URL)
- `Responder pesquisa` → `{{3}}` (sample: `https://lpsg.example.com/pesquisa-matricula`)

**Sample values:**
- `{{1}}` = `João`
- `{{2}}` = `Desafio LPSG`
- `{{3}}` = `https://lpsg.example.com/pesquisa-matricula`

---

### `lpsg_onboard_antecipacao` · UTILITY

**Quando:** D-1 da Aula 1 (domingo 19h).

**BODY:**
```
{{1}}, amanhã a gente começa.

{{2}}, {{3}}: Aula 1 do {{4}}.

Tema: {{5}}.

Te vejo lá. {{6}}
```

**BUTTONS:** 1 (URL)
- `Ver agenda completa` → `{{7}}` (sample: `https://lpsg.example.com/agenda`)

**Sample values:**
- `{{1}}` = `João`
- `{{2}}` = `Segunda, 12 de maio`
- `{{3}}` = `7h`
- `{{4}}` = `Desafio LPSG`
- `{{5}}` = `Fundamentos do método`
- `{{6}}` = `🚀`
- `{{7}}` = `https://lpsg.example.com/agenda`

---

## SEGUNDA → SEXTA · 4 mensagens canônicas (paralelas grupo + API)

### `lpsg_aviso_aula` · UTILITY (06:50)

**BODY:**
```
{{1}}, em 10 minutos começa a Aula {{2}} do {{3}}.

Tema de hoje: {{4}}.
```

**BUTTONS:** 1 (URL)
- `Me preparar agora` → `{{5}}` (sample: `https://youtube.com/live/abc123`)

**Sample values:**
- `{{1}}` = `João`
- `{{2}}` = `1`
- `{{3}}` = `Desafio LPSG`
- `{{4}}` = `Fundamentos do método`
- `{{5}}` = `https://youtube.com/live/abc123`

---

### `lpsg_link_aula` · UTILITY (07:00)

**BODY:**
```
{{1}}, Aula {{2}} acabou de começar.
```

**BUTTONS:** 1 (URL)
- `Entrar agora` → `{{3}}` (sample: `https://youtube.com/live/abc123`)

**Sample values:**
- `{{1}}` = `João`
- `{{2}}` = `1`
- `{{3}}` = `https://youtube.com/live/abc123`

---

### `lpsg_replay_aula` · UTILITY (12:00)

**BODY:**
```
{{1}}, o replay da Aula {{2}} está liberado.

Tempo: {{3}}.
```

**BUTTONS:** 1 (URL)
- `Assistir o replay` → `{{4}}` (sample: `https://youtube.com/playlist?list=PLxxx`)

**Sample values:**
- `{{1}}` = `João`
- `{{2}}` = `1`
- `{{3}}` = `40 minutos`
- `{{4}}` = `https://youtube.com/playlist?list=PLxxx`

---

### `lpsg_resumo_chamada` · UTILITY (19:00)

**BODY:**
```
{{1}}, recapitulando a Aula {{2}} de hoje:

{{3}}
{{4}}
{{5}}

Amanhã, {{6}}: Aula {{7}}, tema {{8}}.
```

**BUTTONS:** 1 (URL)
- `Ver agenda` → `{{9}}` (sample: `https://lpsg.example.com/agenda`)

**Sample values:**
- `{{1}}` = `João`
- `{{2}}` = `1`
- `{{3}}` = `O método 5+1 separa inscrição de presença ao vivo`
- `{{4}}` = `Tráfego pago paga a captação · zero CPL queimado`
- `{{5}}` = `Operação enxuta vence operação grande sempre`
- `{{6}}` = `7h`
- `{{7}}` = `2`
- `{{8}}` = `Construção da máquina`
- `{{9}}` = `https://lpsg.example.com/agenda`

> **Quinta-feira:** a ficha de interesse entra DENTRO desta msg (acrescenta linha "Ficha de interesse aberta: {{LINK_FICHA}}" antes da chamada da Aula 5). Cabe nas 4 do dia · sem template extra.

---

## SÁBADO · tira-dúvidas (10h padrão)

### `lpsg_sabado_aviso` · UTILITY (09:50)

**BODY:**
```
{{1}}, em 10 minutos começa o tira-dúvidas do {{2}}.

Se você mandou pergunta, pode cair a sua.
```

**BUTTONS:** 1 (URL) → `{{3}}` (sample: `https://zoom.us/j/abc123`)

---

### `lpsg_sabado_link` · UTILITY (10:00)

**BODY:**
```
{{1}}, o tira-dúvidas começou.
```

**BUTTONS:** 1 (URL) → `{{2}}` (sample: `https://zoom.us/j/abc123`)

---

### `lpsg_sabado_fechamento` · UTILITY (12:00)

**BODY:**
```
{{1}}, o tira-dúvidas encerrou. Sem replay disponível.

Amanhã, {{2}}: pitch do {{3}}.

Tema: {{4}}.
```

**BUTTONS:** 1 (URL)
- `Ver agenda do domingo` → `{{5}}` (sample: `https://lpsg.example.com/agenda`)

**Sample values:**
- `{{1}}` = `João`
- `{{2}}` = `20h`
- `{{3}}` = `Desafio LPSG`
- `{{4}}` = `Apresentação do Acelerador`
- `{{5}}` = `https://lpsg.example.com/agenda`

---

### `lpsg_sabado_resumo_chamada_pitch` · UTILITY (19:00)

**BODY:**
```
{{1}}, amanhã às {{2}} é o pitch do {{3}}.

Lembrete:
{{4}}
{{5}}
```

**BUTTONS:** 1 (URL) → `{{6}}` (sample: `https://lpsg.example.com/agenda`)

---

## DOMINGO · pitch (Aula 6 · 20h padrão)

### `lpsg_pitch_lembrete` · UTILITY (12:00)

**BODY:**
```
{{1}}, hoje às {{2}} é o pitch do {{3}}.

Eu vou te mostrar:
{{4}}
{{5}}
{{6}}

Separa {{7}} sem distração. Vai valer.
```

**BUTTONS:** 1 (URL) → `{{8}}` (sample: `https://lpsg.example.com/agenda`)

---

### `lpsg_pitch_aviso` · UTILITY (19:50)

**BODY:**
```
{{1}}, em 10 minutos começa o pitch do {{2}}.
```

**BUTTONS:** 1 (URL) → `{{3}}` (sample: `https://youtube.com/live/pitch-abc`)

---

### `lpsg_pitch_link` · UTILITY (20:00)

**BODY:**
```
{{1}}, o pitch começou.
```

**BUTTONS:** 1 (URL) → `{{2}}` (sample: `https://youtube.com/live/pitch-abc`)

---

### `lpsg_pitch_resumo_carrinho` · UTILITY (22:00)

**BODY:**
```
{{1}}, o pitch foi.

Amanhã, segunda às {{2}}, abre o carrinho do {{3}}.

Quem preencheu a ficha entra primeiro às {{4}}.
```

**BUTTONS:** 1 (URL)
- `Ver detalhes` → `{{5}}` (sample: `https://lpsg.example.com/agenda`)

---

## D1 SEGUNDA · ABERTURA DE CARRINHO · 5 horários (exceção controlada)

> ⚠️ **Atenção Meta:** msgs com preço/desconto explícito no body podem reprovar como UTILITY. Estratégia: texto Utility-friendly + preço só na página de destino (no botão).

### `lpsg_carrinho_aviso` · UTILITY (06:50)

**BODY:**
```
{{1}}, em 10 minutos abre o carrinho do {{2}}.

Quem preencheu a ficha de interesse tem acesso antecipado.
```

---

### `lpsg_carrinho_link` · UTILITY (07:00)

**BODY:**
```
{{1}}, o carrinho do {{2}} está aberto.

Bônus de primeira hora rodando agora.
```

**BUTTONS:** 1 (URL)
- `Entrar agora` → `{{3}}` (sample: `https://pay.hotmart.com/xxx`)

---

### `lpsg_carrinho_reforco_chegada` · UTILITY (08:00)

**BODY:**
```
{{1}}, primeira hora do {{2}}.

Já tem gente entrando. Se faz sentido pra você, é a hora.
```

**BUTTONS:** 1 (URL)
- `Garantir o meu` → `{{3}}` (sample: `https://pay.hotmart.com/xxx`)

---

### `lpsg_carrinho_status` · UTILITY (10:00)

**BODY:**
```
{{1}}, status do carrinho do {{2}}:

Quem entrar até {{3}} ainda leva o bônus de chegada.

Depois disso, segue só com o produto.
```

**BUTTONS:** 1 (URL)
- `Ver oferta` → `{{4}}` (sample: `https://pay.hotmart.com/xxx`)

**Sample values:**
- `{{1}}` = `João`
- `{{2}}` = `Acelerador Turbo`
- `{{3}}` = `12h`
- `{{4}}` = `https://pay.hotmart.com/xxx`

---

### `lpsg_carrinho_ultima_janela` · UTILITY (19:00)

**BODY:**
```
{{1}}, em 4 horas o bônus de primeiro dia encerra.

Depois disso o valor sobe.

Se faz sentido pra você, é agora.
```

**BUTTONS:** 1 (URL)
- `Ver oferta completa` → `{{2}}` (sample: `https://pay.hotmart.com/xxx`)

> **D2 → D7: ZERO mensagem de carrinho.** Sem disparo no grupo · sem disparo na API.

---

## Workflow de aprovação Meta

```
1. Acessar Business Manager → Templates de Mensagem
2. Para cada template:
   - Name: lpsg_xxx (snake_case · prefixo)
   - Category: UTILITY
   - Language: Portuguese (Brazil) → pt_BR
   - Header: opcional
   - Body: copiar do template acima · com {{N}}
   - Footer: opcional
   - Buttons: copiar do template acima
3. Adicionar SAMPLE VALUES (cada {{N}} precisa de sample real)
4. Submeter · Meta retorna em 1-3 dias úteis
5. Status:
   - APPROVED: pronto pra disparar
   - PENDING: aguardando review
   - REJECTED: ajustar e ressubmeter
```

### Erros comuns de reprovação

| Motivo | Fix |
|---|---|
| `Body contains promotional content` | Tirar preço/desconto/oferta do body |
| `Variable parameters not properly used` | Cada {{N}} precisa de contexto |
| `Missing sample values` | Preencher TODOS os samples |
| `Excessive use of emojis` | Reduzir pra 1-2 emojis |
| `URL in body` | Mover URL pra BUTTONS |
| `ALL CAPS detected` | Trocar pra Title Case ou minúsculas |

---

## Checklist antes de submeter cada template

```
[ ] Categoria UTILITY (default · MARKETING só se inevitável)
[ ] Variáveis {{N}} numeradas · todas com sample value real
[ ] Idioma = pt_BR
[ ] URL apenas em BUTTONS
[ ] Body ≤ 1.024 caracteres
[ ] Header (se houver) ≤ 60 caracteres
[ ] Footer (se houver) ≤ 60 caracteres · sem variáveis
[ ] Sem ALL CAPS · sem !!! · sem 5+ emojis
[ ] Bullets com hífen "-" se houver
[ ] Snake_case com prefixo "lpsg_" no name
[ ] Versionamento: lpsg_xxx_v1, _v2 etc · não sobrescrever aprovados
```

---

## Inventário · 19 templates totais

| Fase | # templates | Nomes |
|---|---|---|
| Onboarding | 4 | `lpsg_onboard_boas_vindas` · `_grupo_agenda` · `_pesquisa` · `_antecipacao` |
| Seg-Sex aulas | 4 | `lpsg_aviso_aula` · `_link_aula` · `_replay_aula` · `_resumo_chamada` |
| Sábado | 4 | `lpsg_sabado_aviso` · `_link` · `_fechamento` · `_resumo_chamada_pitch` |
| Domingo | 4 | `lpsg_pitch_lembrete` · `_aviso` · `_link` · `_resumo_carrinho` |
| D1 carrinho | 5 | `lpsg_carrinho_aviso` · `_link` · `_reforco_chegada` · `_status` · `_ultima_janela` |
| **Total** | **19** | (D2-D7 carrinho: zero · onboarding fora do cap 4+4) |

---

**Fonte canônica:** `~/.claude/skills/mensageria-lpsg/SKILL.md` (regra 4+4 atualizada 2026-04-30).
**Histórico arquivado:** `workspace/lancamentos/{slug}/03-revisoes/Mensageria-LPSG-APROVADO.docx` (padrão original mentoria 24/04/2026 · superado pelos ajustes).
