-- Create schema for turbo-lpsg plugin

CREATE TABLE IF NOT EXISTS turbo_lpsg_lancamentos (
  id TEXT PRIMARY KEY,
  cliente_id TEXT NOT NULL,
  nome TEXT,
  produto_principal TEXT,
  meta_inscritos INTEGER,
  data_inicio TEXT,
  data_fim TEXT,
  config_json TEXT
);

CREATE TABLE IF NOT EXISTS turbo_lpsg_vendas (
  id TEXT PRIMARY KEY,
  lancamento_id TEXT NOT NULL,
  cliente_id TEXT NOT NULL,
  produto TEXT,
  tipo TEXT,
  valor REAL,
  pagamento TEXT,
  status TEXT,
  contact_id TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  first_utm_source TEXT,
  first_utm_medium TEXT,
  first_utm_campaign TEXT,
  lote TEXT,
  etapa TEXT,                -- checkout_iniciado | pix_gerado | boleto_gerado | aprovada | recusada | reembolsada
  dia TEXT,
  criado_em TEXT,
  FOREIGN KEY (lancamento_id) REFERENCES turbo_lpsg_lancamentos(id)
);

CREATE INDEX IF NOT EXISTS idx_turbo_lpsg_vendas_lanc ON turbo_lpsg_vendas(lancamento_id, status);
CREATE INDEX IF NOT EXISTS idx_turbo_lpsg_vendas_criado ON turbo_lpsg_vendas(criado_em);
