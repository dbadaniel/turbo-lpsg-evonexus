# Graph API — Endpoints e Métricas Usadas

Versão alvo: **v21.0** (atualizar quando o Meta deprecar).
Token: `IG_GRAPH_TOKEN` (env). Precisa de permissões `instagram_basic`, `instagram_manage_insights`, `pages_show_list`, `pages_read_engagement` no token de longa duração da Page conectada.

---

## 1. Listar mídias do usuário

```
GET /{ig-user-id}/media
  ?fields=id,caption,media_type,media_product_type,permalink,timestamp,like_count,comments_count,thumbnail_url,media_url
  &limit=50
  &access_token=...
```

Paginação via `paging.next` (URL pré-pronta). Coletar até 60 posts no padrão.

**Exemplo de resposta (1 item):**

```json
{
  "id": "17912345678901234",
  "caption": "Texto da legenda...",
  "media_type": "VIDEO",
  "media_product_type": "REELS",
  "permalink": "https://www.instagram.com/reel/Cxxx/",
  "timestamp": "2026-05-20T18:32:11+0000",
  "like_count": 1843,
  "comments_count": 92,
  "thumbnail_url": "https://...",
  "media_url": "https://..."
}
```

---

## 2. Insights por mídia

```
GET /{media-id}/insights
  ?metric=<lista por tipo>
  &access_token=...
```

### REELS (media_product_type = "REELS")

Métricas suportadas:
- `reach`
- `saved`
- `shares`
- `total_interactions`
- `likes`
- `comments`
- `views` (substituiu `plays` em mudanças recentes)
- `ig_reels_video_view_total_time` (ms acumulados)
- `ig_reels_avg_watch_time` (ms médios)

### IMAGE / CAROUSEL_ALBUM (feed)

- `reach`
- `impressions`
- `saved`
- `shares`
- `total_interactions`
- `likes`
- `comments`

### STORY (não usamos por padrão)

Stories expiram em 24h. Pra incluir, requer captura quase em tempo real e métricas: `reach`, `impressions`, `replies`, `taps_forward`, `taps_back`, `exits`. Fora do escopo da análise mensal padrão.

---

## 3. Erros comuns

| Código | Causa | Tratamento |
|--------|-------|------------|
| 4 / 17 / 32 | rate limit | recuo exponencial (já implementado em `fetch_graph.py`) |
| 100 | métrica não suportada para o tipo de mídia | pular silenciosamente, registrar como lacuna |
| 190 | token inválido ou expirado | parar e pedir refresh do `IG_GRAPH_TOKEN` |
| 200 | falta permissão | revisar escopos do token |

---

## 4. Obtenção do ig-user-id

Caso o usuário não saiba o ID numérico:

```
GET /me/accounts?access_token=...
```

Pega `id` da Page → depois:

```
GET /{page-id}?fields=instagram_business_account&access_token=...
```

Retorna `instagram_business_account.id` — esse é o `ig-user-id`.

---

## 5. Limites práticos

- ~200 calls/hora por usuário em janelas de rate limit padrão.
- Para 60 posts: 1 `/media` (paginado em 2 calls) + 60 `/insights` = ~62 calls. Folga confortável.
- Se aumentar pra 200+ posts, considerar batch requests (`/?batch=...`) ou rodar com intervalo.
