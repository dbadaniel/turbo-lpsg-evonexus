# Como Analisar Reels no Claude Code

## Pré-requisitos

1. **Claude Code instalado** (comando `claude` disponível no terminal)
2. **python-docx instalado**: `pip install python-docx`
3. **Skills instaladas no projeto**: `criador-reels` e `criador-criativos`

---

## Método 1 — Script automatizado (mais rápido)

```bash
# 1. Copiar o script para seu projeto
cp analisar-reels.sh /seu/projeto/

# 2. Rodar com o arquivo de roteiros
./analisar-reels.sh Roteiros_elias.docx "Elias Mamãe"
```

O script:
- Extrai o texto do .docx automaticamente
- Monta o prompt com as instruções de dupla análise
- Roda no Claude Code via `claude -p`
- Salva o relatório .md em `./analises-reels/`

### Para múltiplos creators:

```bash
./analisar-reels.sh Roteiros_elias.docx "Elias Mamãe"
./analisar-reels.sh Roteiros_lili.docx "Dra. Liliana Limongi"
./analisar-reels.sh Roteiros_fernando.docx "Fernando Miranda"
```

Cada um gera um relatório separado.

---

## Método 2 — Direto no Claude Code (mais controle)

Se preferir rodar interativamente dentro do Claude Code:

```bash
# 1. Abrir Claude Code no diretório do projeto
claude

# 2. Dentro do Claude Code, pedir a análise:
```

Cole isso como prompt:

```
Leia as skills criador-criativos (SKILL.md + references/estruturas-invisiveis.md + 
references/anatomia-hook.md + references/anatomia-body.md) e criador-reels 
(SKILL.md + todos os references).

Depois leia o arquivo Roteiros_elias.docx e faça engenharia reversa de cada roteiro 
com duas camadas:

CAMADA 1: Análise estrutural-narrativa (tema, ângulo, hook, aterrissagem, condução, 
frases de renovação, transição, CTA, assinatura)

CAMADA 2: Lente de criativos aplicada ao orgânico (big idea, estrutura invisível, 
invalidação, escada 1.0→2.0, lead associativa, future pacing, momentos de 
personalidade, diagnóstico de otimização como HIPÓTESE não correção)

Ao final: padrões transversais + o que a lente de criativos adiciona.

Salva o relatório como analise_elias.md
```

---

## Método 3 — Comparativo entre creators

Para gerar relatório comparativo entre múltiplos creators de uma vez:

```bash
claude
```

Prompt:

```
Leia as skills criador-criativos e criador-reels (SKILL.md + todos os references 
de ambas).

Leia os arquivos:
- Roteiros_elias.docx
- Roteiros_lili.docx  
- Roteiros_fernando.docx

Faça engenharia reversa com dupla camada (estrutural + criativos) de TODOS os 
roteiros dos 3 creators.

Depois gere uma SEÇÃO COMPARATIVA com tabela triangular cobrindo:
- Tipo de hook dominante
- Fonte de autoridade
- Motor narrativo
- Emoção primária
- Tipo de CTA
- Tom
- "O espectador sai sentindo..."
- Onde cada um é mais forte
- O que cada um poderia testar do outro

Salva como analise_comparativa.md
```

---

## Notas importantes

- **O `claude -p` (pipe mode)** envia o prompt e recebe a resposta em uma tacada.
  Se o roteiro for muito longo, o output pode ser truncado. Nesse caso, use o 
  Método 2 (interativo) onde você pode pedir para continuar.

- **As skills precisam estar instaladas no projeto** para o Claude Code ter acesso.
  Se estiverem em `/mnt/skills/user/`, já funcionam automaticamente.

- **Para arquivos .txt em vez de .docx**, pule a etapa de extração e passe direto:
  ```bash
  cat roteiros.txt | claude -p "Analise esses roteiros..." > relatorio.md
  ```

- **Qualidade do output**: o Claude Code roda o mesmo modelo. A qualidade da 
  análise será equivalente ao que foi feito nesta conversa. A vantagem é 
  automação e reprodutibilidade.
