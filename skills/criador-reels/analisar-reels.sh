#!/bin/bash

# ============================================================
# ANALISADOR DE REELS — Dupla análise (estrutural + criativos)
# ============================================================
# USO:
#   ./analisar-reels.sh arquivo_roteiros.docx "Nome do Creator"
#
# EXEMPLOS:
#   ./analisar-reels.sh Roteiros_elias.docx "Elias Mamãe"
#   ./analisar-reels.sh Roteiros_lili.docx "Dra. Liliana Limongi"
#   ./analisar-reels.sh Roteiros_fernando.docx "Fernando Miranda"
#
# PRÉ-REQUISITOS:
#   - Claude Code CLI instalado (comando 'claude' disponível)
#   - python3 com python-docx instalado (pip install python-docx)
#   - Skill criador-reels instalada no projeto
#   - Skill criador-criativos instalada no projeto
#
# O QUE FAZ:
#   1. Extrai texto do .docx
#   2. Injeta no prompt de análise
#   3. Roda no Claude Code com acesso às skills
#   4. Gera relatório .md com as duas camadas
# ============================================================

set -e

# --- Validação de argumentos ---
if [ $# -lt 1 ]; then
    echo "❌ Uso: ./analisar-reels.sh <arquivo.docx> [nome_do_creator]"
    echo ""
    echo "Exemplos:"
    echo "  ./analisar-reels.sh Roteiros_elias.docx \"Elias Mamãe\""
    echo "  ./analisar-reels.sh Roteiros_lili.docx \"Dra. Liliana\""
    exit 1
fi

ARQUIVO_DOCX="$1"
NOME_CREATOR="${2:-Creator}"

# --- Validação do arquivo ---
if [ ! -f "$ARQUIVO_DOCX" ]; then
    echo "❌ Arquivo não encontrado: $ARQUIVO_DOCX"
    exit 1
fi

# --- Diretório de trabalho ---
WORK_DIR="$(pwd)/analises-reels"
mkdir -p "$WORK_DIR"

# --- Timestamp para nome do arquivo ---
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
NOME_LIMPO=$(echo "$NOME_CREATOR" | tr ' ' '_' | tr '[:upper:]' '[:lower:]')
OUTPUT_FILE="$WORK_DIR/analise_${NOME_LIMPO}_${TIMESTAMP}.md"

echo "🎬 Analisador de Reels — Dupla Camada"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📄 Arquivo: $ARQUIVO_DOCX"
echo "👤 Creator: $NOME_CREATOR"
echo "📁 Output:  $OUTPUT_FILE"
echo ""

# --- Passo 1: Extrair texto do .docx ---
echo "📖 Extraindo texto do .docx..."

TEXTO_EXTRAIDO="$WORK_DIR/roteiros_extraidos.txt"

python3 -c "
from docx import Document
import sys

doc = Document('$ARQUIVO_DOCX')
textos = []
for p in doc.paragraphs:
    if p.text.strip():
        textos.append(p.text)

# Separar roteiros por quebras duplas de linha
conteudo = '\n\n'.join(textos)
with open('$TEXTO_EXTRAIDO', 'w', encoding='utf-8') as f:
    f.write(conteudo)

# Contar roteiros aproximados (heurística: contar CTAs ou assinaturas)
n_roteiros = conteudo.lower().count('meu nome é') + conteudo.lower().count('minha missão')
n_roteiros = max(n_roteiros, conteudo.count('me segue') + conteudo.count('se inscreve'))
print(f'Extraído: {len(textos)} parágrafos, ~{max(n_roteiros//2, 1)} roteiros estimados')
"

if [ $? -ne 0 ]; then
    echo "❌ Erro ao extrair texto. Verifique se python-docx está instalado:"
    echo "   pip install python-docx"
    exit 1
fi

echo "✅ Texto extraído"
echo ""

# --- Passo 2: Montar o prompt completo ---
echo "🔧 Montando prompt de análise..."

PROMPT_BASE="$(cat <<'PROMPT_DELIM'
Você é um analista de conteúdo orgânico com dupla formação: estrategista de criativos pagos (ads) e especialista em conteúdo orgânico de alta retenção (reels/short-form).

CONTEXTO IMPORTANTE:
- Você tem acesso à skill "criador-criativos" que contém frameworks de análise de ads escalados (estruturas invisíveis, hooks, body, bullets, disparos de dopamina, invalidação redundante, escada de solução 1.0→2.0, lead associativa, future pacing)
- Você tem acesso à skill "criador-reels" que contém frameworks de análise de conteúdo orgânico (4 estruturas de condução, 6 tipos de hook para orgânico, momentos de personalidade, gerador de temas, fechamento/CTA/assinatura)
- ANTES de analisar, leia os dois SKILL.md e os references relevantes: estruturas-invisiveis.md, anatomia-hook.md, anatomia-body.md da skill de criativos, E hook-e-aterrissagem.md, estruturas-conducao.md, retencao-e-personalidade.md, fechamento-cta-assinatura.md da skill de reels
- Use o conhecimento das duas skills para fazer uma análise com duas camadas

Sua tarefa: fazer engenharia reversa dos roteiros abaixo. São conteúdos de reels orgânicos que tiveram mais de 700 mil visualizações.

Produza UM relatório em Markdown (.md) com DUAS CAMADAS para cada roteiro:

## CAMADA 1 — ANÁLISE ESTRUTURAL-NARRATIVA

Para cada roteiro:
- TEMA (1 frase)
- ÂNGULO (abordagem emocional/estratégica)
- HOOK: transcrição exata + lógica + tipo
- FRASE DE ATERRISSAGEM: transcrição + função
- CONDUÇÃO NARRATIVA: qual estrutura + mapa dos blocos com função de cada um
- FRASES DE RENOVAÇÃO DE ATENÇÃO: listar + classificar cada uma
- TRANSIÇÃO PARA POSICIONAMENTO: como conecta tema ao expert
- CTA: transcrição + tipo + objetivo de funil
- ASSINATURA: fixa? avatar nomeado? resultado prometido?

## CAMADA 2 — LENTE DE CRIATIVOS (aplicada ao orgânico)

IMPORTANTE: lente de criativos pagos para ENRIQUECER a análise de orgânico. Não para tratar como ad. Orgânico tem regras próprias.

Para cada roteiro:
- BIG IDEA (nome chiclete em 2-4 palavras)
- ESTRUTURA INVISÍVEL (micro-movimentos psicológicos)
- INVALIDAÇÃO DE SOLUÇÕES (quantas vezes, em que momentos)
- ESCADA DE SOLUÇÃO 1.0 → 2.0 (presente ou ausente)
- LEAD ASSOCIATIVA (presente ou ausente + oportunidade)
- FUTURE PACING (presente ou ausente + oportunidade)
- MOMENTOS DE PERSONALIDADE (mapear + posição + autenticidade)
- DIAGNÓSTICO DE OTIMIZAÇÃO (forte + hipóteses de teste, NÃO correções)

## SEÇÃO FINAL — Após todos os roteiros:
- PADRÕES TRANSVERSAIS (estrutura universal do creator)
- O QUE A LENTE DE CRIATIVOS ADICIONA (3-5 descobertas que a análise estrutural sozinha não pega)

REGRAS:
1. Roteiro por roteiro, na ordem
2. Transcrever frases exatas, não parafrasear
3. Não inventar dados
4. Sugestões são HIPÓTESES, não correções
5. Português brasileiro
6. Direto, sem floreios. Profundidade com clareza.

PROMPT_DELIM
)"

# Adicionar os roteiros ao prompt
ROTEIROS=$(cat "$TEXTO_EXTRAIDO")

PROMPT_COMPLETO="$PROMPT_BASE

---

CREATOR: $NOME_CREATOR

ROTEIROS PARA ANÁLISE:

$ROTEIROS"

# Salvar prompt completo para referência
PROMPT_FILE="$WORK_DIR/prompt_${NOME_LIMPO}_${TIMESTAMP}.txt"
echo "$PROMPT_COMPLETO" > "$PROMPT_FILE"

echo "✅ Prompt montado ($(wc -w < "$PROMPT_FILE") palavras)"
echo ""

# --- Passo 3: Rodar no Claude Code ---
echo "🤖 Rodando análise no Claude Code..."
echo "   (isso pode levar alguns minutos dependendo do tamanho)"
echo ""

# Rodar com claude -p (pipe mode)
# --max-turns 1 garante resposta única completa
echo "$PROMPT_COMPLETO" | claude -p --max-turns 1 --output-format text > "$OUTPUT_FILE" 2>/dev/null

if [ $? -ne 0 ]; then
    echo "❌ Erro ao rodar Claude Code."
    echo "   Verifique se o CLI está instalado e autenticado."
    echo "   Alternativa: copie o prompt de $PROMPT_FILE e cole no Claude."
    exit 1
fi

# --- Passo 4: Validar output ---
LINHAS=$(wc -l < "$OUTPUT_FILE")
PALAVRAS=$(wc -w < "$OUTPUT_FILE")

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Análise concluída!"
echo ""
echo "📊 Relatório: $OUTPUT_FILE"
echo "   $LINHAS linhas / $PALAVRAS palavras"
echo ""
echo "Para ver o relatório:"
echo "   cat $OUTPUT_FILE"
echo ""
echo "Para abrir no VS Code:"
echo "   code $OUTPUT_FILE"
echo ""
