# Windsor.ai — Conector Instagram (referência de campos)

O Windsor é consumido via **MCP** dentro do Claude Code. Sequência obrigatória:

1. `get_fields(connector="instagram", account_id=<id>)` — Windsor **exige** esta call antes de qualquer `get_data`. Sem isso, os campos não aparecem no descritor da conta.
2. `get_data(connector="instagram", account_id=<id>, fields=[...], date_preset="last_30d")` — período atual.
3. `get_data(connector="instagram", account_id=<id>, fields=[...], date_from="YYYY-MM-DD", date_to="YYYY-MM-DD")` — período de comparação. Datas calculadas via `python scripts/fetch_windsor.py --compute-prior-window --preset last_30d`.

---

## Campos típicos do connector Instagram

Os nomes variam ligeiramente entre versões do conector — `get_fields` é a fonte da verdade. Os abaixo são os mais comuns que sustentam o relatório:

### Identificação / dimensão
- `date` — granularidade diária quando agrupado.
- `account_id`
- `account_name` / `username`

### Crescimento (cuidado com restrições)
- `followers_count` — total de seguidores **HOJE** (snapshot, sem histórico). Vem só na última row da resposta. Use pra `followers_end`.
- `follower_count_1d` — **DELTA** diário de novos seguidores. **SÓ FUNCIONA NOS ÚLTIMOS 30 DIAS** (excluindo today). Tentar usar em `date_from/date_to` fora dessa janela retorna erro 400. Use `sum(follower_count_1d)` no período atual pra derivar `followers_start = followers_end - sum`.
- `follows_and_unfollows` — breakdown follow/unfollow (quando disponível, requer permissão extra).
- `profile_views_1d` — **DEPRECATED**. Use `views` (total_value) ou `profile_links_taps`.
- `website_clicks_1d` — **DEPRECATED**.

### Alcance / impressões
- `reach` (alias `reach_1d`) — funciona.
- `impressions` / `impressions_1d` — **DEPRECATED** no connector Instagram. Não pedir; marca lacuna no relatório. Pra ter impressões reais, usar Graph API direta (`/{media-id}/insights?metric=impressions` em IMAGE/CAROUSEL).

### Engajamento agregado (campos REAIS)
- `total_interactions` — soma de likes + comments + saves + shares (USE ESSE como "engagement").
- `accounts_engaged` — contas únicas que interagiram.
- `likes`
- `comments`
- `saves`
- `shares`
- `views` — total de plays/exibições de Reels/posts/stories.
- `reposts` — quando disponível.
- `replies` — para stories.
- `profile_links_taps`

> ⚠️ NÃO USE `engagement` (campo genérico inexistente no connector). O campo real é `total_interactions`.

### Per-post (media_insights — substitui Graph API)

O connector Instagram do Windsor entrega TODAS as métricas por post que a Graph API entrega. Use esses campos no lugar de chamadas Graph direta:

- `media_id`, `media_caption`, `media_type`, `media_product_type`, `media_permalink`, `timestamp`
- `media_reach`
- `media_engagement` (likes + comments + saves + shares para feed)
- `media_views`
- `media_like_count`, `media_comments_count`
- `media_saved`, `media_shares`
- **Reels-only:** `media_reel_total_interactions`, `media_reel_total_watch_time` (ms), `media_reel_avg_watch_time` (ms)
- **Carousel-only:** `carousel_album_reach`, `carousel_album_engagement`, `carousel_album_saved`

> A função `posts_to_graph_schema` em `fetch_windsor.py` converte essas rows pro mesmo schema que `analyze.py` espera (com `insights` nested).

### Demografia (REGRA CRÍTICA: 1 breakdown por request)

- `audience_gender_age_name` + `audience_gender_age_size` — bucket M/F/U × faixa etária. Ex: `M.35-44 = 16114`.
- `audience_country_name` + `audience_country_size` — código ISO + tamanho. Ex: `BR = 83662`.
- `audience_city_size` — disponível mas raramente útil sem cidade.
- `audience_age_*` / `audience_gender_*` — versões agregadas (sem cruzamento).

> ⚠️ **Windsor recusa 2 breakdowns no mesmo request.** Tentar `[audience_gender_age_name, audience_country_name]` no mesmo `get_data` retorna erro 400: `"You can use only one breakdown per request"`. Sempre **2 queries separadas** (gender_age + country). O `fetch_windsor.py --normalize` aceita os 2 raw files via `--raw-demo-gender-age` e `--raw-demo-country`.

---

## Boas práticas (lições do teste real)

- **Pedir só os campos que você vai usar.** Reduz custo de query e ruído na resposta.
- **Não confiar em `date_preset` para o período de comparação.** Windsor não expõe um `previous_period` padrão confiável — sempre passar `date_from`/`date_to` explícitos.
- **Não pedir `follower_count_1d` fora dos últimos 30 dias** — erro 400. Pedir só na query do período atual.
- **Não pedir `followers_count` em query histórica** — é snapshot today. Vem como `null` em datas passadas.
- **Não combinar 2 breakdowns demográficos** no mesmo request — separar em queries.
- **Validar timezone.** O connector retorna em UTC por padrão. Se cliente operar em BRT, ajustar agrupamento no `analyze.py` (já é feito por `local = ts.astimezone(tz=None)`).
- **Versionar o connector.** Se o Windsor atualizar nomes de campos, ajustar `fetch_windsor.py` — é o ponto único de coupling.

---

## Estrutura da resposta crua (esperada após MCP `get_data`)

O MCP Windsor envelopa como `{"result": [...]}`. O helper `_rows_of` em `fetch_windsor.py` lida com isso (e também com `{"data": [...]}` ou lista pura).

**Agregados diários (período atual):**
```json
{
  "result": [
    {
      "date": "2026-05-01",
      "reach": 26090,
      "accounts_engaged": 123,
      "total_interactions": 171,
      "likes": 102,
      "comments": 6,
      "saves": 15,
      "shares": 24,
      "views": 39355,
      "follower_count_1d": 46,
      "followers_count": null,
      "profile_links_taps": 0
    },
    {"date": "2026-05-25", "...": "...", "followers_count": 86656}
  ]
}
```

Note que `followers_count` vem só na última row (today snapshot).

**Per-post:**
```json
{
  "result": [
    {
      "media_id": "18074001269270169",
      "media_caption": "Você acha justo esse novo modelo da Meta?",
      "media_type": "REELS",
      "media_product_type": "REELS",
      "media_permalink": "https://www.instagram.com/reel/...",
      "timestamp": "2026-05-14T14:43:39+0000",
      "media_reach": 4991,
      "media_engagement": 485,
      "media_saved": 57,
      "media_shares": 109,
      "media_views": 8315,
      "media_like_count": 263,
      "media_comments_count": 53,
      "media_reel_total_interactions": 485,
      "media_reel_total_watch_time": 189469859,
      "media_reel_avg_watch_time": 38076
    }
  ]
}
```

**Demografia gender_age:**
```json
{"result": [{"audience_gender_age_name": "M.35-44", "audience_gender_age_size": 16114}, ...]}
```
