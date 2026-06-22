#!/usr/bin/env python3
"""
Renderiza analysis.json em HTML standalone com CSS inline (bundle local, sem CDN).

Uso:
  python render_html.py --analysis analysis.json --css ../assets/relatorio.css --out relatorio.html
"""

import argparse
import html
import json
from pathlib import Path


def esc(v):
    if v is None:
        return "&mdash;"
    return html.escape(str(v))


def fmt_num(v, digits=0):
    if v is None or isinstance(v, str):
        return esc(v)
    try:
        f = float(v)
        if digits == 0:
            return f"{f:,.0f}".replace(",", ".")
        return f"{f:,.{digits}f}".replace(",", "X").replace(".", ",").replace("X", ".")
    except Exception:
        return esc(v)


def fmt_pct(v, digits=2):
    if v is None or isinstance(v, str):
        return esc(v)
    try:
        return f"{float(v):.{digits}f}%"
    except Exception:
        return esc(v)


def section_h(n, title, body):
    return f'<section class="r-section"><h2><span class="r-num">{n}</span> {esc(title)}</h2>{body}</section>'


def render_visao_geral(d):
    body = '<dl class="r-dl">'
    body += f'<dt>Janela</dt><dd>{esc(d.get("janela_inicio"))} &rarr; {esc(d.get("janela_fim"))}</dd>'
    body += f'<dt>Publicações no período</dt><dd>{fmt_num(d.get("publicacoes_total"))}</dd>'

    pf = d.get("publicacoes_por_formato") or {}
    if pf:
        body += '<dt>Por formato</dt><dd>' + ", ".join(f"{esc(k)}: <b>{fmt_num(v)}</b>" for k, v in pf.items()) + '</dd>'

    body += f'<dt>Alcance acumulado</dt><dd>{fmt_num(d.get("alcance_acumulado"))}</dd>'
    body += f'<dt>Impressões acumuladas</dt><dd>{fmt_num(d.get("impressoes_acumuladas"))}</dd>'
    body += f'<dt>Variação alcance (vs período anterior)</dt><dd>{fmt_pct(d.get("variacao_alcance_pct"))}</dd>'
    body += f'<dt>Variação impressões (vs período anterior)</dt><dd>{fmt_pct(d.get("variacao_impressoes_pct"))}</dd>'
    body += '</dl>'
    return section_h(1, "Visão geral do período", body)


def render_crescimento(d):
    body = '<dl class="r-dl">'
    body += f'<dt>Seguidores início</dt><dd>{fmt_num(d.get("seguidores_inicio"))}</dd>'
    body += f'<dt>Seguidores fim</dt><dd>{fmt_num(d.get("seguidores_fim"))}</dd>'
    body += f'<dt>Delta</dt><dd>{fmt_num(d.get("delta_seguidores"))}</dd>'
    body += f'<dt>Taxa de crescimento</dt><dd>{fmt_pct(d.get("taxa_crescimento_pct"))}</dd>'
    body += f'<dt>Demografia</dt><dd>{esc(d.get("demografia"))}</dd>'
    body += f'<dt>Tendência</dt><dd>{esc(d.get("tendencia"))}</dd>'
    body += '</dl>'
    return section_h(2, "Métricas de crescimento", body)


def render_engajamento(d):
    body = f'<p class="r-formula"><b>Fórmula usada:</b> <code>{esc(d.get("formula"))}</code></p>'

    g = d.get("global") or {}
    if g:
        body += '<h3>Estatísticas globais</h3>'
        body += '<table class="r-table"><thead><tr><th>n</th><th>Média</th><th>Mediana</th><th>Melhor</th><th>Pior</th></tr></thead><tbody>'
        body += f'<tr><td>{fmt_num(g.get("n"))}</td><td>{fmt_pct((g.get("media") or 0)*100, 2)}</td><td>{fmt_pct((g.get("mediana") or 0)*100, 2)}</td><td>{fmt_pct((g.get("melhor") or 0)*100, 2)}</td><td>{fmt_pct((g.get("pior") or 0)*100, 2)}</td></tr>'
        body += '</tbody></table>'

    pf = d.get("por_formato") or {}
    if pf:
        body += '<h3>Por formato</h3>'
        body += '<table class="r-table"><thead><tr><th>Formato</th><th>n</th><th>Média</th><th>Mediana</th><th>Melhor</th><th>Pior</th><th>Nota</th></tr></thead><tbody>'
        for fmt, s in pf.items():
            if not s:
                continue
            body += '<tr>'
            body += f'<td><b>{esc(fmt)}</b></td>'
            body += f'<td>{fmt_num(s.get("n"))}</td>'
            body += f'<td>{fmt_pct((s.get("media") or 0)*100, 2)}</td>'
            body += f'<td>{fmt_pct((s.get("mediana") or 0)*100, 2)}</td>'
            body += f'<td>{fmt_pct((s.get("melhor") or 0)*100, 2)}</td>'
            body += f'<td>{fmt_pct((s.get("pior") or 0)*100, 2)}</td>'
            body += f'<td class="r-warn">{esc(s.get("aviso") or "")}</td>'
            body += '</tr>'
        body += '</tbody></table>'

    ps = d.get("por_semana") or {}
    if ps:
        body += '<h3>Evolução semana a semana</h3>'
        body += '<table class="r-table"><thead><tr><th>Semana</th><th>n</th><th>Mediana</th></tr></thead><tbody>'
        for wk, s in ps.items():
            if not s:
                continue
            body += f'<tr><td>{esc(wk)}</td><td>{fmt_num(s.get("n"))}</td><td>{fmt_pct((s.get("mediana") or 0)*100, 2)}</td></tr>'
        body += '</tbody></table>'

    return section_h(3, "Performance de engajamento", body)


def render_top(d):
    def render_list(title, items, value_key, value_fmt):
        h = f'<h3>{title}</h3>'
        if not items:
            return h + '<p class="r-empty">sem dados.</p>'
        h += '<table class="r-table"><thead><tr><th>#</th><th>Formato</th><th>Data</th><th>Valor</th><th>Trecho</th><th>Link</th><th>Hipótese</th></tr></thead><tbody>'
        for i, it in enumerate(items, 1):
            val = value_fmt(it.get(value_key))
            h += '<tr>'
            h += f'<td>{i}</td>'
            h += f'<td>{esc(it.get("formato"))}</td>'
            h += f'<td>{esc((it.get("data") or "")[:10])}</td>'
            h += f'<td>{val}</td>'
            h += f'<td class="r-excerpt">{esc(it.get("caption_excerpt"))}</td>'
            link = it.get("link")
            link_cell = f'<a href="{esc(link)}" target="_blank">abrir</a>' if link else '&mdash;'
            h += f'<td>{link_cell}</td>'
            h += f'<td><span class="r-hip">{esc(it.get("hipotese"))}</span><br><small>confiança: {esc(it.get("confianca_hipotese"))}</small></td>'
            h += '</tr>'
        h += '</tbody></table>'
        return h

    body = render_list("Top 5 por alcance", d.get("top5_alcance") or [], "reach", fmt_num)
    body += render_list("Top 5 por engajamento", d.get("top5_engajamento") or [], "engagement_rate",
                        lambda v: fmt_pct((v or 0) * 100, 2))
    return section_h(4, "Top conteúdos", body)


def render_baixo(d):
    body = ''
    if not d:
        return section_h(5, "Conteúdos de baixo desempenho", '<p class="r-empty">sem dados.</p>')
    for fmt, info in d.items():
        body += f'<h3>{esc(fmt)}</h3>'
        if info.get("aviso"):
            body += f'<p class="r-warn">{esc(info["aviso"])}</p>'
            continue
        body += f'<p>Mediana do formato: <b>{fmt_pct((info.get("mediana_formato") or 0)*100, 2)}</b> &middot; '
        body += f'Limiar de baixo: <b>{fmt_pct((info.get("limiar_baixo") or 0)*100, 2)}</b> &middot; '
        body += f'Posts abaixo: <b>{fmt_num(info.get("n_posts_baixos"))}</b></p>'
        body += f'<p><i>Padrões em 3+ posts:</i> {esc(info.get("padroes_em_3_ou_mais"))}</p>'
        posts = info.get("posts") or []
        if posts:
            body += '<table class="r-table"><thead><tr><th>ID</th><th>ER</th><th>Trecho</th><th>Link</th></tr></thead><tbody>'
            for p in posts[:10]:
                body += '<tr>'
                body += f'<td><code>{esc(p.get("id"))}</code></td>'
                body += f'<td>{fmt_pct((p.get("er") or 0)*100, 2)}</td>'
                body += f'<td class="r-excerpt">{esc(p.get("caption_excerpt"))}</td>'
                link = p.get("link")
                link_cell = f'<a href="{esc(link)}" target="_blank">abrir</a>' if link else '&mdash;'
                body += f'<td>{link_cell}</td>'
                body += '</tr>'
            body += '</tbody></table>'
    return section_h(5, "Conteúdos de baixo desempenho", body)


def render_formatos_horarios(d):
    body = f'<p>Formato vencedor por <b>média</b>: <code>{esc(d.get("formato_vencedor_por_media"))}</code></p>'
    body += f'<p>Formato vencedor por <b>mediana</b>: <code>{esc(d.get("formato_vencedor_por_mediana"))}</code></p>'
    hm = d.get("heatmap_dia_hora") or []
    if hm:
        body += '<h3>Heatmap dia × hora</h3>'
        body += '<table class="r-table r-heatmap"><thead><tr><th>Dia</th><th>Hora</th><th>n</th><th>Engajamento médio</th><th>Nota</th></tr></thead><tbody>'
        for c in hm:
            warn = c.get("aviso") or ""
            cls = ' class="r-low-sample"' if warn else ''
            body += f'<tr{cls}><td>{esc(c.get("dia"))}</td><td>{esc(c.get("hora"))}h</td><td>{fmt_num(c.get("n_posts"))}</td><td>{fmt_pct((c.get("engagement_medio") or 0)*100, 2)}</td><td class="r-warn">{esc(warn)}</td></tr>'
        body += '</tbody></table>'
    return section_h(6, "Análise de formatos e horários", body)


def render_diagnostico(d):
    def ul(items):
        return '<ul>' + ''.join(f'<li>{esc(x)}</li>' for x in items) + '</ul>'
    body = '<h3>O que funciona</h3>' + ul(d.get("o_que_funciona") or [])
    body += '<h3>O que trava</h3>' + ul(d.get("o_que_trava") or [])
    body += '<h3>Maior gap</h3>' + ul(d.get("maior_gap") or [])
    return section_h(7, "Diagnóstico geral", body)


def render_recomendacoes(d):
    if not d:
        return section_h(8, "Recomendações prioritárias", '<p class="r-empty">sem recomendações geradas.</p>')
    body = ''
    for r in d:
        body += '<div class="r-rec">'
        body += f'<h3>#{r.get("prioridade")} — {esc(r.get("acao"))}</h3>'
        body += f'<p><b>Dado que sustenta:</b> {esc(r.get("dado_que_sustenta"))}</p>'
        body += f'<p><b>Como medir em 14 dias:</b> {esc(r.get("como_medir_em_14_dias"))}</p>'
        body += '</div>'
    return section_h(8, "Recomendações prioritárias", body)


def render_roteiros(d):
    if not d:
        return section_h(9, "Roteiros baseados nos top vídeos", '<p class="r-empty">sem roteiros — amostra insuficiente.</p>')
    body = ''
    for r in d:
        body += '<div class="r-roteiro">'
        body += f'<h3>Roteiro {r.get("roteiro_n")} — inspirado em <code>{esc(r.get("video_referencia_id"))}</code></h3>'
        ref = r.get("video_referencia_link")
        if ref:
            body += f'<p><a href="{esc(ref)}" target="_blank">Vídeo de referência</a> &middot; engajamento: <b>{fmt_pct((r.get("metrica_referencia") or 0)*100, 2)}</b></p>'
        pr = r.get("padrao_replicado") or {}
        body += '<h4>Padrão replicado</h4><ul>'
        body += f'<li><b>Gancho:</b> {esc(pr.get("gancho"))}</li>'
        body += f'<li><b>Ritmo:</b> {esc(pr.get("ritmo"))}</li>'
        body += f'<li><b>Desenvolvimento:</b> {esc(pr.get("desenvolvimento"))}</li>'
        body += f'<li><b>CTA:</b> {esc(pr.get("cta"))}</li>'
        body += f'<li><b>Por que funcionou:</b> {esc(pr.get("por_que_funcionou"))}</li>'
        body += '</ul>'
        rn = r.get("roteiro_novo") or {}
        body += '<h4>Roteiro novo</h4>'
        body += f'<p><b>0-3s (gancho):</b> {esc(rn.get("0_3s_gancho"))}</p>'
        body += f'<p><b>4-15s (desenvolvimento):</b> {esc(rn.get("4_15s_desenvolvimento"))}</p>'
        body += f'<p><b>16-30s (desenvolvimento):</b> {esc(rn.get("16_30s_desenvolvimento"))}</p>'
        body += f'<p><b>31-45s (fechamento + CTA):</b> {esc(rn.get("31_45s_fechamento_cta"))}</p>'
        body += f'<p><b>Áudio sugerido:</b> {esc(rn.get("audio_sugerido"))}</p>'
        body += f'<p><b>Caption:</b> {esc(rn.get("caption"))}</p>'
        body += '</div>'
    return section_h(9, "Roteiros baseados nos top vídeos", body)


def render_lacunas(d):
    if not d:
        return section_h(10, "Lacunas de dados", '<p class="r-empty">nenhuma lacuna registrada.</p>')
    body = '<table class="r-table"><thead><tr><th>Caminho</th><th>Descrição</th></tr></thead><tbody>'
    for lac in d:
        body += f'<tr><td><code>{esc(lac.get("caminho"))}</code></td><td>{esc(lac.get("descricao"))}</td></tr>'
    body += '</tbody></table>'
    return section_h(10, "Lacunas de dados", body)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--analysis", type=Path, required=True)
    ap.add_argument("--css", type=Path, required=True)
    ap.add_argument("--out", type=Path, required=True)
    ap.add_argument("--title", default="Análise estratégica de Instagram")
    args = ap.parse_args()

    analysis = json.loads(args.analysis.read_text())
    css = args.css.read_text()

    parts = [
        render_visao_geral(analysis.get("1_visao_geral", {})),
        render_crescimento(analysis.get("2_crescimento", {})),
        render_engajamento(analysis.get("3_engajamento", {})),
        render_top(analysis.get("4_top_conteudos", {})),
        render_baixo(analysis.get("5_baixo_desempenho", {})),
        render_formatos_horarios(analysis.get("6_formatos_horarios", {})),
        render_diagnostico(analysis.get("7_diagnostico", {})),
        render_recomendacoes(analysis.get("8_recomendacoes", [])),
        render_roteiros(analysis.get("9_roteiros", [])),
        render_lacunas(analysis.get("10_lacunas_de_dados", [])),
    ]

    gerado = analysis.get("gerado_em", "")

    html_out = f"""<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{esc(args.title)}</title>
<style>
{css}
</style>
</head>
<body>
<main class="r-doc">
  <header class="r-head">
    <p class="r-eyebrow">Relatório de Performance</p>
    <h1>{esc(args.title)}</h1>
    <p class="r-meta">Gerado em {esc(gerado)}</p>
  </header>
  {''.join(parts)}
  <footer class="r-foot">
    <p>Análise produzida pela skill <code>instagram-analise-estrategica</code> &middot; cálculos via Python &middot; nenhum benchmark de mercado inventado.</p>
  </footer>
</main>
</body>
</html>
"""

    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(html_out)
    print(f"escrito: {args.out}")


if __name__ == "__main__":
    main()
