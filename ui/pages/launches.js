class LpsgLaunchesPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.launches = [];
  }

  async connectedCallback() {
    this.slug = this.getAttribute('slug') || 'turbo-lpsg';
    await this.fetchLaunches();
    this.render();
  }

  async fetchLaunches() {
    try {
      const res = await fetch(`/api/plugins/${this.slug}/readonly-data/get_all_launches`);
      if (res.ok) {
        const data = await res.json();
        this.launches = data.rows || [];
      }
    } catch (e) {
      console.error('Error fetching launches:', e);
    }
  }

  async deleteLaunch(id) {
    if (!confirm('Deseja realmente excluir este lançamento? Esta ação não pode ser desfeita.')) return;
    try {
      const res = await fetch(`/api/plugins/${this.slug}/data/plugin_lpsg_lancamentos`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        await this.fetchLaunches();
        this.render();
      } else {
        alert('Erro ao excluir lançamento.');
      }
    } catch (e) {
      console.error(e);
    }
  }

  render() {
    const style = `
      <style>
        :host {
          display: block;
          padding: 24px;
          color: #e6edf3;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          background: #0d1117;
          min-height: 100vh;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          border-bottom: 1px solid #21262d;
          padding-bottom: 16px;
        }
        h1 {
          font-size: 24px;
          font-weight: 600;
          margin: 0;
          color: #f0f6fc;
        }
        .btn {
          background: #238636;
          color: #ffffff;
          border: 1px solid rgba(240,246,252,0.1);
          padding: 8px 16px;
          font-size: 14px;
          font-weight: 500;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.2s;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
        }
        .btn:hover {
          background: #2ea043;
        }
        .btn-danger {
          background: #da3637;
        }
        .btn-danger:hover {
          background: #f85149;
        }
        .btn-secondary {
          background: #21262d;
          color: #c9d1d9;
          border-color: #30363d;
        }
        .btn-secondary:hover {
          background: #30363d;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 20px;
        }
        .card {
          background: #161b22;
          border: 1px solid #30363d;
          border-radius: 8px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .card-title {
          font-size: 18px;
          font-weight: 600;
          margin: 0;
          color: #f0f6fc;
        }
        .card-meta {
          font-size: 12px;
          color: #8b949e;
          font-family: monospace;
        }
        .card-body {
          font-size: 14px;
          color: #c9d1d9;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .progress-bar-container {
          background: #21262d;
          border-radius: 4px;
          height: 8px;
          overflow: hidden;
          margin-top: 4px;
        }
        .progress-bar {
          background: #388bfd;
          height: 100%;
          border-radius: 4px;
        }
        .actions {
          display: flex;
          gap: 8px;
          margin-top: 12px;
        }
        .empty-state {
          text-align: center;
          padding: 48px;
          background: #161b22;
          border: 1px dashed #30363d;
          border-radius: 8px;
          color: #8b949e;
        }
        .empty-state p {
          margin: 0 0 16px 0;
          font-size: 14px;
        }
      </style>
    `;

    const content = this.launches.length === 0
      ? `
        <div class="empty-state">
          <p>Nenhum lançamento configurado ainda.</p>
          <button class="btn" id="btn-create-empty">Configurar Primeiro Lançamento</button>
        </div>
      `
      : `
        <div class="grid">
          ${this.launches.map(l => {
            const config = JSON.parse(l.config_json || '{}');
            const dataInicio = l.data_inicio ? new Date(l.data_inicio).toLocaleDateString('pt-BR') : '—';
            const dataFim = l.data_fim ? new Date(l.data_fim).toLocaleDateString('pt-BR') : '—';
            const publicUrl = `/p/${this.slug}/dash/${l.id}`;
            return `
              <div class="card">
                <div class="card-header">
                  <div>
                    <h3 class="card-title">${l.nome || 'Lançamento Sem Nome'}</h3>
                    <span class="card-meta">ID: ${l.id}</span>
                  </div>
                </div>
                <div class="card-body">
                  <div><strong>Produto Principal:</strong> ${l.produto_principal || '—'}</div>
                  <div><strong>Período:</strong> ${dataInicio} até ${dataFim}</div>
                  <div>
                    <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 2px;">
                      <span>Meta de Inscritos</span>
                      <strong>${l.meta_inscritos || 0}</strong>
                    </div>
                  </div>
                </div>
                <div class="actions">
                  <a href="${publicUrl}" target="_blank" class="btn btn-secondary">Dashboard Público</a>
                  <button class="btn btn-secondary btn-edit" data-id="${l.id}">Editar</button>
                  <button class="btn btn-danger btn-delete" data-id="${l.id}">Excluir</button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;

    this.shadowRoot.innerHTML = `
      ${style}
      <div class="header">
        <h1>Lançamentos</h1>
        <button class="btn" id="btn-create">Novo Lançamento</button>
      </div>
      ${content}
    `;

    // Event listeners
    const btnCreate = this.shadowRoot.getElementById('btn-create');
    if (btnCreate) {
      btnCreate.addEventListener('click', () => {
        window.EvoNexus.navigate(`/plugins-ui/${this.slug}/settings`);
      });
    }
    const btnCreateEmpty = this.shadowRoot.getElementById('btn-create-empty');
    if (btnCreateEmpty) {
      btnCreateEmpty.addEventListener('click', () => {
        window.EvoNexus.navigate(`/plugins-ui/${this.slug}/settings`);
      });
    }

    this.shadowRoot.querySelectorAll('.btn-edit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        window.EvoNexus.navigate(`/plugins-ui/${this.slug}/settings?id=${id}`);
      });
    });

    this.shadowRoot.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        this.deleteLaunch(id);
      });
    });
  }
}

customElements.define('lpsg-launches-page', LpsgLaunchesPage);
