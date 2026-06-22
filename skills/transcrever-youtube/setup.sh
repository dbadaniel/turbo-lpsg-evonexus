#!/usr/bin/env bash
# setup.sh — instala dependências da skill transcrever-youtube (sem Homebrew/sudo)
# Roda uma vez por máquina.

set -e

echo "🔎 Verificando dependências..."

USER_BIN="$(python3 -m site --user-base)/bin"
export PATH="$USER_BIN:$PATH"

# ── pip upgrade silencioso ──
python3 -m pip install --user --upgrade pip >/dev/null 2>&1 || true

# ── yt-dlp (via pip, sem Homebrew) ──
if ! command -v yt-dlp >/dev/null 2>&1; then
  echo "📦 Instalando yt-dlp..."
  python3 -m pip install --user --upgrade yt-dlp
else
  echo "✅ yt-dlp já instalado: $(yt-dlp --version 2>/dev/null || echo '?')"
fi

# ── ffmpeg (via imageio-ffmpeg — binário estático empacotado) ──
if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "📦 Instalando ffmpeg (via imageio-ffmpeg)..."
  python3 -m pip install --user --upgrade imageio-ffmpeg

  # Caminho do binário fornecido pelo imageio-ffmpeg
  FFMPEG_BIN="$(python3 -c 'import imageio_ffmpeg as f; print(f.get_ffmpeg_exe())')"

  # Criar symlink em ~/.local/bin para ficar no PATH
  mkdir -p "$HOME/.local/bin"
  ln -sf "$FFMPEG_BIN" "$HOME/.local/bin/ffmpeg"

  echo "✅ ffmpeg: $HOME/.local/bin/ffmpeg -> $FFMPEG_BIN"
else
  echo "✅ ffmpeg já instalado: $(command -v ffmpeg)"
fi

# ── openai-whisper ──
if ! command -v whisper >/dev/null 2>&1; then
  echo "📦 Instalando openai-whisper (pode levar alguns minutos)..."
  python3 -m pip install --user --upgrade openai-whisper
else
  echo "✅ whisper já instalado"
fi

# ── Instrução de PATH persistente ──
SHELL_RC=""
case "$SHELL" in
  */zsh)  SHELL_RC="$HOME/.zshrc" ;;
  */bash) SHELL_RC="$HOME/.bashrc" ;;
esac

NEEDS_PATH_HINT=false
if [[ -n "$SHELL_RC" ]]; then
  for DIR in "$USER_BIN" "$HOME/.local/bin"; do
    if ! grep -q "$DIR" "$SHELL_RC" 2>/dev/null; then
      NEEDS_PATH_HINT=true
    fi
  done
fi

if $NEEDS_PATH_HINT; then
  echo ""
  echo "⚠️  Adicione esta linha ao seu $SHELL_RC (rode uma vez):"
  echo ""
  echo "    echo 'export PATH=\"$USER_BIN:$HOME/.local/bin:\$PATH\"' >> $SHELL_RC && source $SHELL_RC"
  echo ""
fi

echo ""
echo "✅ Setup completo."
echo ""
echo "Uso:"
echo "  bash ~/.claude/skills/transcrever-youtube/transcrever.sh \"<URL>\" [modelo] [pasta_saida]"
