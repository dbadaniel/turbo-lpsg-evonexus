#!/usr/bin/env python3
"""
vtt_to_txt.py — converte legendas VTT (inclusive auto-generated do YouTube)
em texto corrido sem timestamps nem duplicações.

Uso: python3 vtt_to_txt.py <arquivo.vtt> [arquivo-saida.txt]
"""
import re
import sys
from pathlib import Path


def clean_vtt(vtt_path: Path) -> str:
    raw = vtt_path.read_text(encoding="utf-8", errors="ignore")

    # Remove header WEBVTT e metadados
    raw = re.sub(r"^WEBVTT.*?\n\n", "", raw, flags=re.DOTALL)

    # Remove blocos de Kind:/Language:
    raw = re.sub(r"^(Kind|Language):.*\n", "", raw, flags=re.MULTILINE)

    # Remove timestamp lines (00:00:00.000 --> 00:00:00.000 ...)
    raw = re.sub(
        r"\d{2}:\d{2}:\d{2}\.\d{3}\s*-->\s*\d{2}:\d{2}:\d{2}\.\d{3}.*\n",
        "",
        raw,
    )

    # Remove inline timestamps <00:00:02.639> e tags <c>, </c>
    raw = re.sub(r"<\d{2}:\d{2}:\d{2}\.\d{3}>", "", raw)
    raw = re.sub(r"</?c[^>]*>", "", raw)

    # Remove caracteres HTML escapados
    raw = raw.replace("&gt;&gt;", "").replace("&nbsp;", " ")
    raw = raw.replace("&amp;", "&").replace("&lt;", "<").replace("&gt;", ">")

    # Quebra em linhas, remove vazias e duplicatas consecutivas
    seen_last = None
    out_lines = []
    for line in raw.splitlines():
        stripped = line.strip()
        if not stripped:
            continue
        if stripped == seen_last:
            continue
        # Rolling captions: cada nova linha contém a anterior + mais palavras.
        # Se a linha anterior é prefixo da atual, só mantém a mais completa.
        if seen_last and stripped.startswith(seen_last):
            out_lines[-1] = stripped
        elif seen_last and stripped in seen_last:
            # Linha atual já contida na anterior — pula
            continue
        else:
            out_lines.append(stripped)
        seen_last = stripped

    # Junta tudo num parágrafo único separado por espaço
    text = " ".join(out_lines)

    # Normaliza espaços múltiplos
    text = re.sub(r"\s+", " ", text).strip()

    return text


def main() -> None:
    if len(sys.argv) < 2:
        sys.exit("Uso: python3 vtt_to_txt.py <arquivo.vtt> [saida.txt]")

    vtt = Path(sys.argv[1])
    if not vtt.exists():
        sys.exit(f"Arquivo não encontrado: {vtt}")

    out = Path(sys.argv[2]) if len(sys.argv) >= 3 else vtt.with_suffix(".txt")

    text = clean_vtt(vtt)
    out.write_text(text, encoding="utf-8")

    words = len(text.split())
    print(f"✅ {out}")
    print(f"   {words} palavras · {len(text)} caracteres")


if __name__ == "__main__":
    main()
