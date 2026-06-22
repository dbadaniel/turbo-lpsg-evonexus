#!/usr/bin/env python3
"""
Coleta detalhada de posts via Instagram Graph API.

Lê o token de IG_GRAPH_TOKEN. Pagina /me/media (ou /{ig-user-id}/media),
busca insights por post conforme o media_product_type, e salva JSON único.

Uso:
  python fetch_graph.py --ig-user-id 17841400000000000 --posts 60 --out raw/graph.json
  python fetch_graph.py --ig-user-id me --posts 60 --out raw/graph.json
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import time
from pathlib import Path

try:
    import requests
except ImportError:
    sys.exit("requests não instalado. rode: pip install requests")


GRAPH_VERSION = "v21.0"
BASE = f"https://graph.facebook.com/{GRAPH_VERSION}"

MEDIA_FIELDS = ",".join([
    "id",
    "caption",
    "media_type",
    "media_product_type",
    "permalink",
    "timestamp",
    "like_count",
    "comments_count",
    "thumbnail_url",
    "media_url",
])

REELS_INSIGHTS = ",".join([
    "reach",
    "saved",
    "shares",
    "total_interactions",
    "likes",
    "comments",
    "views",
    "ig_reels_video_view_total_time",
    "ig_reels_avg_watch_time",
])

IMAGE_INSIGHTS = ",".join([
    "reach",
    "impressions",
    "saved",
    "shares",
    "total_interactions",
    "likes",
    "comments",
])


def _get(url, params=None, max_retries=4):
    backoff = 2.0
    for attempt in range(max_retries):
        r = requests.get(url, params=params, timeout=30)
        if r.status_code == 200:
            return r.json()
        if r.status_code in (429, 500, 502, 503, 504):
            time.sleep(backoff)
            backoff *= 2
            continue
        # erro de cliente — devolve corpo pra debug
        try:
            return {"_error": r.json(), "_status": r.status_code}
        except Exception:
            return {"_error": r.text, "_status": r.status_code}
    return {"_error": "max_retries_excedido", "_status": None}


def fetch_media(ig_user_id: str, token: str, limit: int) -> list[dict]:
    items: list[dict] = []
    url = f"{BASE}/{ig_user_id}/media"
    params = {"fields": MEDIA_FIELDS, "limit": min(limit, 50), "access_token": token}
    while url and len(items) < limit:
        data = _get(url, params=params)
        if "_error" in data:
            print(f"[graph] erro ao paginar media: {data}", file=sys.stderr)
            break
        items.extend(data.get("data", []))
        params = None
        url = data.get("paging", {}).get("next")
    return items[:limit]


def fetch_insights(media_id: str, media_product_type: str, token: str) -> dict:
    metric_list = REELS_INSIGHTS if media_product_type == "REELS" else IMAGE_INSIGHTS
    url = f"{BASE}/{media_id}/insights"
    params = {"metric": metric_list, "access_token": token}
    data = _get(url, params=params)
    if "_error" in data:
        return {"_error": data["_error"], "_status": data["_status"]}
    out = {}
    for row in data.get("data", []):
        name = row.get("name")
        values = row.get("values", [])
        if values and "value" in values[0]:
            out[name] = values[0]["value"]
    return out


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--ig-user-id", required=True, help="ID do IG user ou 'me'")
    p.add_argument("--posts", type=int, default=60)
    p.add_argument("--out", type=Path, required=True)
    p.add_argument("--token-env", default="IG_GRAPH_TOKEN")
    args = p.parse_args()

    token = os.environ.get(args.token_env)
    if not token:
        sys.exit(f"variável de ambiente {args.token_env} não definida")

    print(f"[graph] coletando até {args.posts} posts de {args.ig_user_id}")
    media = fetch_media(args.ig_user_id, token, args.posts)
    print(f"[graph] obtidos {len(media)} posts; coletando insights...")

    enriched = []
    for i, m in enumerate(media, 1):
        mid = m["id"]
        mpt = m.get("media_product_type", "FEED")
        insights = fetch_insights(mid, mpt, token)
        m["insights"] = insights
        enriched.append(m)
        if i % 10 == 0:
            print(f"[graph] {i}/{len(media)}")

    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps({
        "ig_user_id": args.ig_user_id,
        "fetched_count": len(enriched),
        "items": enriched,
    }, indent=2, ensure_ascii=False))
    print(f"[graph] escrito: {args.out}")


if __name__ == "__main__":
    main()
