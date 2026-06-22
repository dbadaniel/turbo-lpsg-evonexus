#!/usr/bin/env bash
# transcrever.sh — transcreve vídeo do YouTube em texto corrido PT-BR.
# Estratégia: 1) tenta legendas automáticas (rápido, 99% funciona)
#             2) fallback: baixa áudio e roda Whisper local
#
# Uso: bash transcrever.sh "<URL>" [modelo_whisper] [pasta_saida]

set -e

URL="${1:-}"
MODELO="${2:-medium}"
SAIDA="${3:-$PWD}"

if [[ -z "$URL" ]]; then
  echo "❌ Uso: $0 \"<URL_DO_YOUTUBE>\" [modelo_whisper] [pasta_saida]"
  echo "   Modelos Whisper: tiny, base, small, medium (default), large"
  exit 1
fi

# ── PATH dos binários pip --user ──
USER_BIN="$(python3 -m site --user-base)/bin"
export PATH="$USER_BIN:$HOME/.local/bin:$PATH"

# ── Checa deps mínimas ──
if ! command -v yt-dlp >/dev/null 2>&1; then
  echo "❌ yt-dlp não encontrado. Rode: bash ~/.claude/skills/transcrever-youtube/setup.sh"
  exit 1
fi

BROWSER="${COOKIES_BROWSER:-chrome}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VTT_TO_TXT="$SCRIPT_DIR/vtt_to_txt.py"

mkdir -p "$SAIDA"
TMP_DIR="$(mktemp -d -t transcricao-XXXXXX)"
trap 'rm -rf "$TMP_DIR"' EXIT

echo "🎬 URL: $URL"
echo "📁 Saída: $SAIDA"
echo ""

# ══════════════════════════════════════════════════════════
# ESTRATÉGIA 1 — legendas automáticas (rápido)
# ══════════════════════════════════════════════════════════
echo "📝 [1/2] Tentando legendas automáticas do YouTube..."

if yt-dlp \
    --skip-download \
    --write-auto-sub \
    --sub-lang "pt,pt-BR" \
    --sub-format vtt \
    --cookies-from-browser "$BROWSER" \
    --no-playlist \
    --restrict-filenames \
    -o "$TMP_DIR/%(title)s.%(ext)s" \
    "$URL" 2>&1 | tee "$TMP_DIR/ytdlp.log" | grep -q "Writing video subtitles"; then

  VTT_FILE="$(ls "$TMP_DIR"/*.vtt 2>/dev/null | head -1)"
  if [[ -n "$VTT_FILE" ]]; then
    BASENAME="$(basename "$VTT_FILE")"
    BASENAME="${BASENAME%.pt.vtt}"
    BASENAME="${BASENAME%.pt-BR.vtt}"
    BASENAME="${BASENAME%.vtt}"

    TXT_DEST="$SAIDA/$BASENAME.txt"
    python3 "$VTT_TO_TXT" "$VTT_FILE" "$TXT_DEST"

    echo ""
    echo "✅ Transcrição pronta (via legendas automáticas):"
    echo "   $TXT_DEST"
    exit 0
  fi
fi

# ══════════════════════════════════════════════════════════
# ESTRATÉGIA 2 — fallback: áudio + Whisper local
# ══════════════════════════════════════════════════════════
echo ""
echo "⚠️  Legendas automáticas indisponíveis. Caindo pro Whisper local..."
echo "🤖 Modelo: $MODELO"
echo ""

for cmd in whisper ffmpeg; do
  if ! command -v "$cmd" >/dev/null 2>&1; then
    echo "❌ $cmd não encontrado. Rode: bash ~/.claude/skills/transcrever-youtube/setup.sh"
    exit 1
  fi
done

echo "⬇️  Baixando áudio..."
yt-dlp \
  -x --audio-format m4a \
  --audio-quality 0 \
  -o "$TMP_DIR/%(title)s.%(ext)s" \
  --restrict-filenames \
  --no-playlist \
  --cookies-from-browser "$BROWSER" \
  --retries 5 \
  --fragment-retries 5 \
  "$URL"

AUDIO_FILE="$(ls "$TMP_DIR"/*.m4a 2>/dev/null | head -1)"
if [[ -z "$AUDIO_FILE" ]]; then
  echo "❌ Falha ao baixar áudio."
  exit 1
fi

BASENAME="$(basename "$AUDIO_FILE" .m4a)"
echo "✅ Áudio: $BASENAME.m4a"
echo ""

echo "🧠 Transcrevendo com Whisper ($MODELO)..."
whisper "$AUDIO_FILE" \
  --language Portuguese \
  --model "$MODELO" \
  --output_format txt \
  --output_dir "$TMP_DIR" \
  --verbose False \
  --fp16 False

TXT_SRC="$TMP_DIR/$BASENAME.txt"
if [[ ! -f "$TXT_SRC" ]]; then
  echo "❌ Whisper não gerou o .txt esperado."
  exit 1
fi

TXT_DEST="$SAIDA/$BASENAME.txt"
mv "$TXT_SRC" "$TXT_DEST"

echo ""
echo "✅ Transcrição pronta (via Whisper):"
echo "   $TXT_DEST"
echo "📊 $(wc -w < "$TXT_DEST") palavras"
