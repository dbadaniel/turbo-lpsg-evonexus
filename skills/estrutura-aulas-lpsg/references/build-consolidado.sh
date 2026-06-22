#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# build-consolidado.sh · Gera LPSG-Estrutura-Completa-FULL.md
#
# Concatena os arquivos individuais (fonte única) num único arquivo, pra quem
# precisa exportar / colar a estrutura inteira num doc/PDF.
#
# A FONTE DA VERDADE são os arquivos individuais (00..07). Edite SEMPRE eles.
# Este script só monta a versão "tudo num arquivo" on-demand.
# O -FULL.md resultante NÃO deve ser editado à mão.
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail
cd "$(dirname "$0")"

OUT="LPSG-Estrutura-Completa-FULL.md"
PARTS=(
  LPSG-Estrutura-Completa.md   # índice editorial (cabeçalho)
  00-variaveis-globais.md
  07-matriz-de-progressao.md
  01-aula-1-fundamentos.md
  02-aula-2-construcao.md
  03-aula-3-automacao.md
  04-aula-4-pre-pitch.md
  05-aula-5-trafego.md
  06-aula-6-pitch.md
)

{
  echo "<!-- ARQUIVO GERADO por build-consolidado.sh · NÃO EDITAR À MÃO."
  echo "     Edite os arquivos individuais (00..07) e rode o script de novo. -->"
  echo ""
  for p in "${PARTS[@]}"; do
    [[ -f "$p" ]] || { echo "✗ falta: $p" >&2; exit 1; }
    cat "$p"
    echo -e "\n\n---\n"
  done
} > "$OUT"

echo "✅ $OUT gerado ($(wc -l < "$OUT") linhas) a partir de ${#PARTS[@]} arquivos."
