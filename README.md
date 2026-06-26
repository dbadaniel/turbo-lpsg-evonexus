# Turbo LPSG for EvoNexus

Este é o plugin de conhecimento e orquestração do método Lançamento Pago Semanal Gravado (LPSG) da Turbo Academy, adaptado especificamente para o ambiente EvoNexus.

## Conteúdo

- 13 agents especialistas, incluindo estrategista, copywriter, trafego e closer.
- Skills do metodo LPSG e ferramentas de producao empacotadas com namespace.
- Estado e recursos persistidos pelo sistema de plugins do EvoNexus.
- Nenhum MCP ou credencial externa configurado nesta primeira versao.

## Instalacao

No painel de plugins do EvoNexus, use:

```text
github:dbadaniel/turbo-lpsg-evonexus@feat/evonexus-plugin
```

Apos instalar, reinicie dashboard, scheduler e Telegram para que todos os
containers reconstruam os recursos do plugin a partir do volume persistente.

## Desenvolvimento

Os ZIPs originais ficam em `artifacts/`. Para reconstruir `agents/` e
`skills/`:

```bash
python scripts/build_evonexus_plugin.py
```

Veja [EVONEXUS.md](EVONEXUS.md) para detalhes de compatibilidade.

## Licenca

Codigo: MIT. Conteudo do metodo: CC BY-NC-SA 4.0, com atribuicao obrigatoria.
Redistribuicao comercial requer autorizacao da Turbo Academy.
