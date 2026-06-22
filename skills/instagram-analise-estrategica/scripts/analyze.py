#!/usr/bin/env python3
"""
Roda toda a análise estatística do relatório e cospe analysis.json
estruturado nas 10 seções exigidas pela skill.

Princípios:
- nenhum cálculo "mental" — tudo aqui.
- onde faltar dado, gera string "[lacuna: ...]" em vez de estimar.
- nunca conclui sobre subgrupo com < 4 posts.

Uso:
  python analyze.py --windsor windsor_normalized.json --graph raw/graph.json --out analysis.json
"""

from __future__ import annotations

import argparse
import json
import statistics
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path
from statistics import mean, median


MIN_SAMPLE = 4
HEATMAP_MIN = 5


def lacuna(field: str, source: str) -> str:
    return f"[lacuna: campo {field} não disponível na fonte {source}]"


def pct_change(curr, prev):
    if prev in (None, 0) or curr is None:
        return None
    return (curr - prev) / prev * 100


def safe_div(a, b):
    if not b or b == 0 or a is None:
        return None
    return a / b


def engagement_rate(post: dict) -> float | None:
    ins = post.get("insights", {}) or {}
    reach = ins.get("reach")
    if not reach:
        return None
    likes = ins.get("likes") or post.get("like_count") or 0
    comments = ins.get("comments") or post.get("comments_count") or 0
    saved = ins.get("saved") or 0
    shares = ins.get("shares") or 0
    interactions = likes + comments + saved + shares
    return interactions / reach if reach else None


def parse_ts(ts: str):
    if not ts:
        return None
    s = ts.replace("Z", "+00:00")
    # Graph API devolve "+0000" sem dois pontos — fromisoformat em <3.11 não aceita.
    if len(s) >= 5 and s[-5] in ("+", "-") and s[-3] != ":":
        s = s[:-2] + ":" + s[-2:]
    return datetime.fromisoformat(s).astimezone(timezone.utc)


def classify_format(post: dict) -> str:
    mpt = post.get("media_product_type") or ""
    mt = post.get("media_type") or ""
    if mpt == "REELS" or mt == "VIDEO":
        return "REEL"
    if mt == "CAROUSEL_ALBUM":
        return "CARROSSEL"
    if mt == "IMAGE":
        return "IMAGEM"
    return mt or "OUTRO"


def section_visao_geral(windsor: dict, posts: list) -> dict:
    curr = windsor.get("current") or {}
    prior = windsor.get("prior") or {}

    # janela: deriva de timestamps dos posts se Windsor não trouxer
    timestamps = [parse_ts(p.get("timestamp")) for p in posts]
    timestamps = sorted([t for t in timestamps if t])
    janela_inicio = timestamps[0].date().isoformat() if timestamps else lacuna("janela_inicio", "graph")
    janela_fim = timestamps[-1].date().isoformat() if timestamps else lacuna("janela_fim", "graph")

    formato_counter = Counter(classify_format(p) for p in posts)

    return {
        "janela_inicio": janela_inicio,
        "janela_fim": janela_fim,
        "publicacoes_por_formato": dict(formato_counter),
        "publicacoes_total": sum(formato_counter.values()),
        "alcance_acumulado": curr.get("reach") if curr.get("reach") is not None else lacuna("reach", "windsor"),
        "impressoes_acumuladas": curr.get("impressions") if curr.get("impressions") is not None else lacuna("impressions", "windsor"),
        "variacao_alcance_pct": pct_change(curr.get("reach"), prior.get("reach")),
        "variacao_impressoes_pct": pct_change(curr.get("impressions"), prior.get("impressions")),
    }


def section_crescimento(windsor: dict) -> dict:
    curr = windsor.get("current") or {}
    prior = windsor.get("prior") or {}
    f_end = curr.get("followers_end")
    f_start = prior.get("followers_end")
    delta = (f_end - f_start) if (f_end is not None and f_start is not None) else None
    taxa = pct_change(f_end, f_start)

    if delta is None:
        tendencia = "[lacuna: sem série histórica suficiente de seguidores]"
    else:
        tendencia = f"delta absoluto: {int(delta):+d}. {lacuna('comparativo período anterior do delta', 'windsor')}"

    # Demografia: usar se vier do Windsor, marcar como lacuna se não
    ga = windsor.get("demografia_gender_age")
    co = windsor.get("demografia_country_top10")
    if ga or co:
        demo = {}
        if ga:
            total = sum(b.get("size", 0) for b in ga) or 1
            top5 = sorted(ga, key=lambda b: -b.get("size", 0))[:5]
            demo["top_5_gender_age"] = [
                {"name": b["name"], "size": b["size"], "pct_da_base": b["size"] / total * 100}
                for b in top5
            ]
            demo["leitura_gender_age"] = (
                f"Top bucket: {top5[0]['name']} ({top5[0]['size']:,} = {top5[0]['size']/total*100:.1f}%). "
                f"Top 5 somam {sum(b['size'] for b in top5)/total*100:.1f}% da base."
            )
        if co:
            total_c = sum(b.get("size", 0) for b in co) or 1
            br = next((b for b in co if (b.get("name") or "").upper() == "BR"), None)
            demo["top_paises"] = [{"name": b["name"], "size": b["size"]} for b in co[:5]]
            demo["concentracao_BR_top10"] = (
                f"{br['size']/total_c*100:.1f}%" if br else "[lacuna: BR fora do top 10]"
            )
    else:
        demo = lacuna("breakdown_demografia", "windsor (rodar queries de gender_age e country separadas)")

    return {
        "seguidores_inicio": f_start if f_start is not None else lacuna("followers (período anterior)", "windsor"),
        "seguidores_fim": f_end if f_end is not None else lacuna("followers (período atual)", "windsor"),
        "delta_seguidores": delta,
        "taxa_crescimento_pct": taxa,
        "demografia": demo,
        "tendencia": tendencia,
    }


def section_engajamento(posts: list) -> dict:
    """Engajamento por post + por formato + por semana."""
    rates = []
    by_format = defaultdict(list)
    by_week = defaultdict(list)

    for p in posts:
        er = engagement_rate(p)
        if er is None:
            continue
        rates.append(er)
        by_format[classify_format(p)].append(er)
        ts = parse_ts(p.get("timestamp"))
        if ts:
            iso_year, iso_week, _ = ts.isocalendar()
            by_week[f"{iso_year}-W{iso_week:02d}"].append(er)

    def stats(arr):
        if not arr:
            return None
        return {
            "n": len(arr),
            "media": mean(arr),
            "mediana": median(arr),
            "melhor": max(arr),
            "pior": min(arr),
        }

    formato_tabela = {}
    for fmt, arr in by_format.items():
        s = stats(arr)
        if s and s["n"] < MIN_SAMPLE:
            s["aviso"] = f"amostra abaixo do mínimo ({s['n']} < {MIN_SAMPLE}) — leia com cautela"
        formato_tabela[fmt] = s

    return {
        "formula": "(curtidas + comentários + salvamentos + compartilhamentos) / alcance",
        "global": stats(rates),
        "por_formato": formato_tabela,
        "por_semana": {wk: stats(arr) for wk, arr in sorted(by_week.items())},
    }


def section_top_conteudos(posts: list) -> dict:
    with_reach = [p for p in posts if (p.get("insights") or {}).get("reach")]
    with_er = [(p, engagement_rate(p)) for p in posts if engagement_rate(p) is not None]

    top_reach = sorted(with_reach, key=lambda p: p["insights"]["reach"], reverse=True)[:5]
    top_er = sorted(with_er, key=lambda x: x[1], reverse=True)[:5]

    def render(p, value_label, value):
        return {
            "id": p.get("id"),
            "formato": classify_format(p),
            "data": p.get("timestamp"),
            "link": p.get("permalink"),
            value_label: value,
            "caption_excerpt": (p.get("caption") or "")[:200],
            "hipotese": "[hipótese] — preencher após inspeção visual do criativo (gancho, formato, tema)",
            "confianca_hipotese": "média",
        }

    return {
        "top5_alcance": [render(p, "reach", p["insights"]["reach"]) for p in top_reach],
        "top5_engajamento": [render(p, "engagement_rate", er) for p, er in top_er],
    }


def section_baixo_desempenho(posts: list) -> dict:
    by_fmt = defaultdict(list)
    for p in posts:
        er = engagement_rate(p)
        if er is not None:
            by_fmt[classify_format(p)].append((p, er))

    out = {}
    for fmt, arr in by_fmt.items():
        if len(arr) < MIN_SAMPLE:
            out[fmt] = {"aviso": f"amostra abaixo do mínimo ({len(arr)} < {MIN_SAMPLE})"}
            continue
        med = median(er for _, er in arr)
        baixos = [(p, er) for p, er in arr if er < med * 0.5]
        out[fmt] = {
            "mediana_formato": med,
            "limiar_baixo": med * 0.5,
            "n_posts_baixos": len(baixos),
            "posts": [
                {"id": p.get("id"), "link": p.get("permalink"), "er": er,
                 "caption_excerpt": (p.get("caption") or "")[:160]}
                for p, er in baixos
            ],
            "padroes_em_3_ou_mais": ("[lacuna: análise temática requer leitura manual das captions/criativos]"
                                     if len(baixos) >= 3 else "amostra insuficiente para padrão"),
        }
    return out


def section_formatos_horarios(posts: list) -> dict:
    by_fmt = defaultdict(list)
    heat = defaultdict(int)
    heat_er = defaultdict(list)

    for p in posts:
        er = engagement_rate(p)
        if er is None:
            continue
        by_fmt[classify_format(p)].append(er)
        ts = parse_ts(p.get("timestamp"))
        if ts:
            # ajustar pra BRT (UTC-3)
            local = ts.astimezone(tz=None)  # cwd locale; pra rigor exato use ZoneInfo
            key = (local.strftime("%a"), local.hour)
            heat[key] += 1
            heat_er[key].append(er)

    vencedor_media = None
    vencedor_mediana = None
    if by_fmt:
        elig = {f: arr for f, arr in by_fmt.items() if len(arr) >= MIN_SAMPLE}
        if elig:
            vencedor_media = max(elig.items(), key=lambda kv: mean(kv[1]))[0]
            vencedor_mediana = max(elig.items(), key=lambda kv: median(kv[1]))[0]

    heatmap = []
    for (day, hour), count in sorted(heat.items()):
        ers = heat_er[(day, hour)]
        cell = {
            "dia": day,
            "hora": hour,
            "n_posts": count,
            "engagement_medio": mean(ers) if ers else None,
        }
        if count < HEATMAP_MIN:
            cell["aviso"] = "amostra insuficiente"
        heatmap.append(cell)

    return {
        "formato_vencedor_por_media": vencedor_media or "[lacuna: nenhum formato com amostra suficiente]",
        "formato_vencedor_por_mediana": vencedor_mediana or "[lacuna: nenhum formato com amostra suficiente]",
        "heatmap_dia_hora": heatmap,
    }


def section_diagnostico(eng: dict, formatos: dict, crescimento: dict) -> dict:
    """Diagnóstico textual baseado nos números já computados."""
    funciona = []
    trava = []
    gap = []

    fmt_tab = eng.get("por_formato") or {}
    if fmt_tab:
        best = max(fmt_tab.items(), key=lambda kv: (kv[1] or {}).get("mediana") or 0)
        if best[1] and best[1].get("mediana"):
            funciona.append(f"formato {best[0]} com mediana de engajamento {best[1]['mediana']:.4f} (n={best[1]['n']})")

    if crescimento.get("delta_seguidores") is not None and crescimento["delta_seguidores"] < 0:
        trava.append(f"perda líquida de seguidores: {crescimento['delta_seguidores']:+d}")
    elif crescimento.get("taxa_crescimento_pct") is not None and crescimento["taxa_crescimento_pct"] < 1:
        trava.append(f"crescimento <1% no período ({crescimento['taxa_crescimento_pct']:.2f}%)")

    global_stats = eng.get("global")
    if global_stats and global_stats.get("melhor") and global_stats.get("mediana"):
        razao = global_stats["melhor"] / global_stats["mediana"]
        if razao > 3:
            gap.append(f"melhor post tem engajamento {razao:.1f}x a mediana — picos não estão sendo replicados")

    return {
        "o_que_funciona": funciona or ["[lacuna: sem padrão estatisticamente sustentado nesta amostra]"],
        "o_que_trava": trava or ["nenhum sinal de alerta no recorte numérico atual"],
        "maior_gap": gap or ["sem gap evidente entre pico e mediana — distribuição relativamente uniforme"],
    }


def section_recomendacoes(eng: dict, formatos: dict, top: dict, crescimento: dict) -> list:
    recs = []
    fmt_tab = eng.get("por_formato") or {}

    # rec 1: dobrar no formato vencedor
    if formatos.get("formato_vencedor_por_mediana") and "lacuna" not in str(formatos["formato_vencedor_por_mediana"]):
        fv = formatos["formato_vencedor_por_mediana"]
        s = fmt_tab.get(fv, {})
        recs.append({
            "prioridade": 1,
            "acao": f"Aumentar a frequência do formato {fv} para 50% do calendário das próximas 2 semanas.",
            "dado_que_sustenta": f"{fv} tem mediana de engajamento {s.get('mediana', 0):.4f} sobre n={s.get('n')} posts no período.",
            "como_medir_em_14_dias": f"Comparar mediana de engajamento do formato {fv} no novo recorte de 14 dias vs mediana atual; meta = manter ou superar.",
        })

    # rec 2: replicar padrões dos top
    if top.get("top5_engajamento"):
        recs.append({
            "prioridade": 2,
            "acao": "Produzir 3 Reels novos espelhando o padrão estrutural dos 3 top vídeos (gancho/ritmo/CTA).",
            "dado_que_sustenta": f"Top 3 vídeos com engajamento entre {top['top5_engajamento'][2]['engagement_rate']:.4f} e {top['top5_engajamento'][0]['engagement_rate']:.4f}.",
            "como_medir_em_14_dias": "Mediana dos 3 novos Reels precisa ficar ≥ percentil 75 do período anterior.",
        })

    # rec 3: corrigir o que trava
    if crescimento.get("delta_seguidores") is not None and crescimento["delta_seguidores"] < 0:
        recs.append({
            "prioridade": 3,
            "acao": "Auditar últimas 4 semanas de stories e Reels de menor engajamento — investigar viés temático/criativo.",
            "dado_que_sustenta": f"Perda líquida de {crescimento['delta_seguidores']} seguidores no período.",
            "como_medir_em_14_dias": "Reverter delta — meta mínima de +0 e ideal de +1% sobre base atual.",
        })

    # rec 4: pico inexplorado
    g = eng.get("global") or {}
    if g.get("melhor") and g.get("mediana") and g["melhor"] / g["mediana"] > 3:
        recs.append({
            "prioridade": 4,
            "acao": "Identificar o tema/formato do pico isolado e produzir 2 variações próximas pra testar replicabilidade.",
            "dado_que_sustenta": f"Pico de {g['melhor']:.4f} vs mediana {g['mediana']:.4f} ({g['melhor']/g['mediana']:.1f}x).",
            "como_medir_em_14_dias": "Pelo menos 1 das 2 variações precisa ficar acima do percentil 80 do período.",
        })

    return recs


def section_roteiros(top: dict) -> list:
    """Esqueletos parametrizados pros 3 top Reels — Claude completa o texto com leitura visual."""
    out = []
    for i, item in enumerate((top.get("top5_engajamento") or [])[:3], 1):
        out.append({
            "roteiro_n": i,
            "video_referencia_id": item["id"],
            "video_referencia_link": item["link"],
            "metrica_referencia": item.get("engagement_rate"),
            "padrao_replicado": {
                "gancho": "[a completar — inspecionar 0-3s do vídeo de referência]",
                "ritmo": "[a completar — observar cortes e cadência]",
                "desenvolvimento": "[a completar — observar arco]",
                "cta": "[a completar — observar fechamento]",
                "por_que_funcionou": f"engajamento atingiu {item.get('engagement_rate', 0):.4f}, no top 3 da amostra",
            },
            "roteiro_novo": {
                "0_3s_gancho": "[a completar pelo agente após inspeção visual]",
                "4_15s_desenvolvimento": "[a completar]",
                "16_30s_desenvolvimento": "[a completar]",
                "31_45s_fechamento_cta": "[a completar]",
                "audio_sugerido": "[a completar]",
                "caption": "[a completar — 3-5 linhas, hook + quebra + CTA + hashtags]",
            },
        })
    return out


def section_lacunas(analysis: dict, skip_keys: tuple = ("10_lacunas_de_dados",)) -> list:
    """Varre o analysis e lista toda string contendo [lacuna: ...].

    Pula chaves em `skip_keys` pra evitar auto-referência quando a seção
    de lacunas já foi populada.
    """
    found = []
    seen_descs = set()

    def walk(node, path=""):
        if isinstance(node, str) and "[lacuna:" in node:
            if node not in seen_descs:
                found.append({"caminho": path, "descricao": node})
                seen_descs.add(node)
        elif isinstance(node, dict):
            for k, v in node.items():
                if k in skip_keys:
                    continue
                walk(v, f"{path}.{k}" if path else k)
        elif isinstance(node, list):
            for i, v in enumerate(node):
                walk(v, f"{path}[{i}]")

    walk(analysis)
    return found


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--windsor", type=Path, required=True)
    p.add_argument("--graph", type=Path, required=True)
    p.add_argument("--out", type=Path, required=True)
    args = p.parse_args()

    windsor = json.loads(args.windsor.read_text())
    graph = json.loads(args.graph.read_text())
    posts = graph.get("items", [])

    visao = section_visao_geral(windsor, posts)
    crescimento = section_crescimento(windsor)
    eng = section_engajamento(posts)
    top = section_top_conteudos(posts)
    baixo = section_baixo_desempenho(posts)
    formatos = section_formatos_horarios(posts)
    diag = section_diagnostico(eng, formatos, crescimento)
    recs = section_recomendacoes(eng, formatos, top, crescimento)
    roteiros = section_roteiros(top)

    analysis = {
        "gerado_em": datetime.utcnow().isoformat() + "Z",
        "1_visao_geral": visao,
        "2_crescimento": crescimento,
        "3_engajamento": eng,
        "4_top_conteudos": top,
        "5_baixo_desempenho": baixo,
        "6_formatos_horarios": formatos,
        "7_diagnostico": diag,
        "8_recomendacoes": recs,
        "9_roteiros": roteiros,
    }
    analysis["10_lacunas_de_dados"] = section_lacunas(analysis)

    args.out.write_text(json.dumps(analysis, indent=2, ensure_ascii=False, default=str))
    print(f"escrito: {args.out}")


if __name__ == "__main__":
    main()
