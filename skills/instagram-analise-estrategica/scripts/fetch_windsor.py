#!/usr/bin/env python3
"""
Wrapper de orquestração pros dados do Windsor.ai (connector Instagram).

Windsor é consumido via MCP (chamadas feitas por Claude). Este script:
- Calcula a janela de comparação anterior dado um preset.
- Normaliza a resposta bruta do MCP num schema único que `analyze.py` consome.

Uso:
  python fetch_windsor.py --compute-prior-window --preset last_30d
  python fetch_windsor.py --normalize --raw raw/windsor_curr.json \
                          --raw-prior raw/windsor_prev.json --out windsor_normalized.json
"""

from __future__ import annotations

import argparse
import json
import sys
from datetime import date, datetime, timedelta
from pathlib import Path


PRESET_DAYS = {
    "last_7d": 7,
    "last_14d": 14,
    "last_30d": 30,
    "last_60d": 60,
    "last_90d": 90,
}


def compute_prior_window(preset: str, anchor: date | None = None) -> dict:
    if preset not in PRESET_DAYS:
        raise SystemExit(f"preset desconhecido: {preset}. opções: {list(PRESET_DAYS)}")
    days = PRESET_DAYS[preset]
    end = (anchor or date.today()) - timedelta(days=days)
    start = end - timedelta(days=days - 1)
    return {
        "preset": preset,
        "days": days,
        "date_from": start.isoformat(),
        "date_to": end.isoformat(),
    }


def _safe_float(v):
    try:
        return float(v)
    except (TypeError, ValueError):
        return 0.0


def _sum_field(rows, field):
    total = 0.0
    seen = False
    for r in rows:
        if field in r and r[field] is not None:
            total += _safe_float(r[field])
            seen = True
    return total if seen else None


def _rows_of(p):
    """Extrai lista de rows de qualquer wrapper Windsor (data/result/list)."""
    if not p:
        return []
    if isinstance(p, list):
        return p
    if isinstance(p, dict):
        if "data" in p and isinstance(p["data"], list):
            return p["data"]
        if "result" in p:
            return _rows_of(p["result"])
    return []


def _last_non_null(rows, field):
    for r in reversed(rows):
        if r.get(field) is not None:
            return r[field]
    return None


def _agg_windsor_instagram(rows: list) -> dict:
    """Agregação específica do connector Instagram do Windsor.

    Campos reais (não os genéricos):
    - reach: somar `reach` (diário)
    - engagement: somar `total_interactions` (campo agregado real do Windsor)
    - views: somar `views`
    - followers_end: snapshot `followers_count` (vem só na última row, today)
    - followers_delta_periodo: somar `follower_count_1d` (deltas diários)
    """
    return {
        "rows": len(rows),
        "reach": _sum_field(rows, "reach"),
        "impressions": _sum_field(rows, "impressions"),  # deprecated no connector
        "engagement": _sum_field(rows, "total_interactions"),
        "views_acumuladas": _sum_field(rows, "views"),
        "likes": _sum_field(rows, "likes"),
        "comments": _sum_field(rows, "comments"),
        "saves": _sum_field(rows, "saves"),
        "shares": _sum_field(rows, "shares"),
        "accounts_engaged": _sum_field(rows, "accounts_engaged"),
        "profile_views": _sum_field(rows, "profile_views"),
        "website_clicks": _sum_field(rows, "website_clicks"),
        "profile_links_taps": _sum_field(rows, "profile_links_taps"),
        "followers_end_snapshot": _last_non_null(rows, "followers_count"),
        "followers_delta_periodo": _sum_field(rows, "follower_count_1d"),
    }


def normalize(raw_curr: dict, raw_prev: dict,
              raw_demo_gender_age: dict | None = None,
              raw_demo_country: dict | None = None) -> dict:
    """Normaliza payloads brutos do Windsor MCP num schema único.

    Aceita 2 ou 4 inputs: agregados (curr+prev) + opcionalmente demografia
    (gender_age + country, que vêm em queries SEPARADAS porque Windsor não
    aceita 2 breakdowns no mesmo request).

    Lógica de followers (campos reais do connector):
    - current.followers_end: vem do snapshot `followers_count` (today)
    - prior.followers_end: derivado de current.followers_end - sum(follower_count_1d)
      no período atual. Se faltar dado, marca lacuna.
    """
    curr = _rows_of(raw_curr)
    prev = _rows_of(raw_prev)

    c_agg = _agg_windsor_instagram(curr)
    p_agg = _agg_windsor_instagram(prev)

    f_end = c_agg["followers_end_snapshot"]
    f_delta = c_agg["followers_delta_periodo"]
    f_start = (f_end - f_delta) if (f_end is not None and f_delta is not None) else None

    c_agg["followers_end"] = f_end
    p_agg["followers_end"] = f_start

    out = {
        "source": "windsor.ai",
        "connector": "instagram",
        "generated_at": datetime.utcnow().isoformat() + "Z",
        "current": c_agg,
        "prior": p_agg,
    }

    if raw_demo_gender_age:
        rows = _rows_of(raw_demo_gender_age)
        ga = [{"name": r.get("audience_gender_age_name"),
               "size": int(r.get("audience_gender_age_size") or 0)} for r in rows]
        out["demografia_gender_age"] = ga

    if raw_demo_country:
        rows = _rows_of(raw_demo_country)
        co = [{"name": r.get("audience_country_name"),
               "size": int(r.get("audience_country_size") or 0)} for r in rows]
        out["demografia_country_top10"] = sorted(co, key=lambda r: -r["size"])[:10]

    return out


def posts_to_graph_schema(raw_posts: dict, ig_user_id: str = "") -> dict:
    """Converte resposta Windsor de per-post (media_insights) pro schema
    que `analyze.py` consome (mesmo formato da Graph API direta)."""
    items = []
    for p in _rows_of(raw_posts):
        mpt = (p.get("media_product_type") or "").upper()
        is_reel = mpt == "REELS"
        insights = {
            "reach": p.get("media_reach"),
            "likes": p.get("media_like_count"),
            "comments": p.get("media_comments_count"),
            "saved": p.get("media_saved"),
            "shares": p.get("media_shares"),
        }
        if is_reel:
            insights["views"] = p.get("media_views")
            insights["ig_reels_video_view_total_time"] = p.get("media_reel_total_watch_time")
            insights["ig_reels_avg_watch_time"] = p.get("media_reel_avg_watch_time")
            insights["total_interactions"] = p.get("media_reel_total_interactions")
        else:
            insights["impressions"] = p.get("media_views")
            insights["total_interactions"] = p.get("media_engagement")

        items.append({
            "id": p.get("media_id"),
            "caption": p.get("media_caption"),
            "media_type": p.get("media_type"),
            "media_product_type": mpt or "FEED",
            "permalink": p.get("media_permalink"),
            "timestamp": p.get("timestamp"),
            "like_count": p.get("media_like_count"),
            "comments_count": p.get("media_comments_count"),
            "insights": insights,
        })

    return {
        "ig_user_id": ig_user_id,
        "fetched_count": len(items),
        "items": items,
        "source_note": "Reconstruído a partir do Windsor.ai (media_insights). Equivalente ao schema /insights da Graph API.",
    }


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--compute-prior-window", action="store_true")
    p.add_argument("--preset", default="last_30d")
    p.add_argument("--normalize", action="store_true")
    p.add_argument("--raw", type=Path, help="Raw Windsor agregados (período atual)")
    p.add_argument("--raw-prior", type=Path, help="Raw Windsor agregados (período anterior)")
    p.add_argument("--raw-demo-gender-age", type=Path, help="Raw Windsor breakdown gender_age (opcional)")
    p.add_argument("--raw-demo-country", type=Path, help="Raw Windsor breakdown country (opcional)")
    p.add_argument("--posts-to-graph", action="store_true",
                   help="Converte resposta Windsor de per-post (media_insights) pro schema graph.json")
    p.add_argument("--raw-posts", type=Path, help="Raw Windsor per-post (com --posts-to-graph)")
    p.add_argument("--ig-user-id", default="", help="Anotação no graph.json")
    p.add_argument("--out", type=Path)
    args = p.parse_args()

    if args.compute_prior_window:
        print(json.dumps(compute_prior_window(args.preset), indent=2))
        return

    if args.normalize:
        if not args.raw or not args.raw_prior or not args.out:
            sys.exit("--normalize requer --raw, --raw-prior e --out")
        raw_curr = json.loads(args.raw.read_text())
        raw_prev = json.loads(args.raw_prior.read_text())
        raw_ga = json.loads(args.raw_demo_gender_age.read_text()) if args.raw_demo_gender_age else None
        raw_co = json.loads(args.raw_demo_country.read_text()) if args.raw_demo_country else None
        out = normalize(raw_curr, raw_prev, raw_ga, raw_co)
        args.out.write_text(json.dumps(out, indent=2, ensure_ascii=False))
        print(f"escrito: {args.out}")
        return

    if args.posts_to_graph:
        if not args.raw_posts or not args.out:
            sys.exit("--posts-to-graph requer --raw-posts e --out")
        raw_posts = json.loads(args.raw_posts.read_text())
        out = posts_to_graph_schema(raw_posts, args.ig_user_id)
        args.out.write_text(json.dumps(out, indent=2, ensure_ascii=False))
        print(f"escrito: {args.out} ({out['fetched_count']} posts)")
        return

    p.print_help()


if __name__ == "__main__":
    main()
