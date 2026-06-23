class LpsgSettingsPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.launchId = null;
    this.formData = {};
  }

  async connectedCallback() {
    this.slug = this.getAttribute('slug') || 'turbo-lpsg';
    const params = new URLSearchParams(window.location.search);
    this.launchId = params.get('id');
    
    if (this.launchId) {
      await this.loadLaunch(this.launchId);
    } else {
      this.formData = this.getDefaultFormData();
    }
    
    this.render();
    this.restoreLocalDraft();
  }

  getDefaultFormData() {
    return {
      nome: '',
      cliente_id: 'default',
      produto_principal: '',
      meta_inscritos: 1000,
      data_inicio: '',
      data_fim: '',
      especialista: { nome: '', bio_curta: '', instagram: '' },
      evento: { nome: '', sigla: '', promessa: '', ticket_ingresso: '62' },
      checkout: { ingresso_url: '', premium_url: '' },
      bonus_tsunami: { onda_1: '', onda_2: '', onda_3: '' },
      design: { cor_primaria: '#FF5C00', cor_secundaria: '#FFB800' }
    };
  }

  async loadLaunch(id) {
    try {
      const res = await fetch(`/api/plugins/${this.slug}/readonly-data/get_lancamento_config?token_val=${encodeURIComponent(id)}`);
      if (res.ok) {
        const data = await res.json();
        const row = data.rows?.[0];
        if (row) {
          this.formData = {
            id: row.id,
            nome: row.nome,
            cliente_id: row.cliente_id,
            produto_principal: row.produto_principal,
            meta_inscritos: row.meta_inscritos,
            data_inicio: row.data_inicio,
            data_fim: row.data_fim,
            ...JSON.parse(row.config_json || '{}')
          };
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  restoreLocalDraft() {
    if (this.launchId) return; // don't restore drafts on edit mode
    try {
      const draft = localStorage.getItem('lpsg_settings_draft');
      if (draft) {
        this.formData = JSON.parse(draft);
        this.fillFormFields();
      }
    } catch (e) {
      console.error(e);
    }
  }

  saveLocalDraft() {
    if (this.launchId) return;
    try {
      localStorage.setItem('lpsg_settings_draft', JSON.stringify(this.getFormDataFromUI()));
    } catch (e) {}
  }

  getFormDataFromUI() {
    const shadow = this.shadowRoot;
    const getValue = (id) => shadow.getElementById(id)?.value || '';
    
    return {
      nome: getValue('nome'),
      cliente_id: 'default',
      produto_principal: getValue('produto_principal'),
      meta_inscritos: parseInt(getValue('meta_inscritos') || '0', 10),
      data_inicio: getValue('data_inicio'),
      data_fim: getValue('data_fim'),
      especialista: {
        nome: getValue('esp_nome'),
        bio_curta: getValue('esp_bio'),
        instagram: getValue('esp_instagram')
      },
      evento: {
        nome: getValue('ev_nome'),
        sigla: getValue('ev_sigla'),
        promessa: getValue('ev_promessa'),
        ticket_ingresso: getValue('ev_ticket')
      },
      checkout: {
        ingresso_url: getValue('chk_ingresso'),
        premium_url: getValue('chk_premium')
      },
      bonus_tsunami: {
        onda_1: getValue('tsu_1'),
        onda_2: getValue('tsu_2'),
        onda_3: getValue('tsu_3')
      },
      design: {
        cor_primaria: getValue('col_primaria'),
        cor_secundaria: getValue('col_secundaria')
      }
    };
  }

  fillFormFields() {
    const shadow = this.shadowRoot;
    const setValue = (id, val) => {
      const el = shadow.getElementById(id);
      if (el) el.value = val || '';
    };

    setValue('nome', this.formData.nome);
    setValue('produto_principal', this.formData.produto_principal);
    setValue('meta_inscritos', this.formData.meta_inscritos);
    setValue('data_inicio', this.formData.data_inicio);
    setValue('data_fim', this.formData.data_fim);
    
    setValue('esp_nome', this.formData.especialista?.nome);
    setValue('esp_bio', this.formData.especialista?.bio_curta);
    setValue('esp_instagram', this.formData.especialista?.instagram);
    
    setValue('ev_nome', this.formData.evento?.nome);
    setValue('ev_sigla', this.formData.evento?.sigla);
    setValue('ev_promessa', this.formData.evento?.promessa);
    setValue('ev_ticket', this.formData.evento?.ticket_ingresso);
    
    setValue('chk_ingresso', this.formData.checkout?.ingresso_url);
    setValue('chk_premium', this.formData.checkout?.premium_url);
    
    setValue('tsu_1', this.formData.bonus_tsunami?.onda_1);
    setValue('tsu_2', this.formData.bonus_tsunami?.onda_2);
    setValue('tsu_3', this.formData.bonus_tsunami?.onda_3);
    
    setValue('col_primaria', this.formData.design?.cor_primaria);
    setValue('col_secundaria', this.formData.design?.cor_secundaria);
  }

  async saveLaunch(e) {
    e.preventDefault();
    const data = this.getFormDataFromUI();
    const isEdit = !!this.launchId;
    const finalId = isEdit ? this.launchId : 'lpsg_' + Math.random().toString(36).substring(2, 11);
    
    // config_json stores metadata that does not map directly to columns
    const payload = {
      id: finalId,
      cliente_id: data.cliente_id,
      nome: data.nome,
      produto_principal: data.produto_principal,
      meta_inscritos: data.meta_inscritos,
      data_inicio: data.data_inicio,
      data_fim: data.data_fim,
      config_json: JSON.stringify({
        especialista: data.especialista,
        evento: data.evento,
        checkout: data.checkout,
        bonus_tsunami: data.bonus_tsunami,
        design: data.design
      })
    };

    try {
      const res = await fetch(`/api/plugins/${this.slug}/data/plugin_lpsg_lancamentos`, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        localStorage.removeItem('lpsg_settings_draft');
        window.EvoNexus.navigate(`/plugins-ui/${this.slug}/launches?id=${finalId}`);
      } else {
        alert('Erro ao salvar lançamento.');
      }
    } catch (e) {
      console.error(e);
      alert('Erro de conexão ao salvar.');
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
          margin-bottom: 24px;
          border-bottom: 1px solid #21262d;
          padding-bottom: 16px;
        }
        h1 {
          font-size: 24px;
          font-weight: 600;
          margin: 0;
          color: #f0f6fc;
        }
        .form {
          max-width: 800px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .block {
          background: #161b22;
          border: 1px solid #30363d;
          border-radius: 8px;
          overflow: hidden;
        }
        .block-header {
          padding: 16px 20px;
          font-weight: 600;
          font-size: 16px;
          background: #21262d;
          border-bottom: 1px solid #30363d;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
        }
        .block-body {
          padding: 20px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .block-body.collapsed {
          display: none;
        }
        .field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .field.full {
          grid-column: span 2;
        }
        label {
          font-size: 13px;
          font-weight: 500;
          color: #8b949e;
        }
        input, textarea, select {
          background: #0d1117;
          border: 1px solid #30363d;
          color: #c9d1d9;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 14px;
        }
        input:focus, textarea:focus, select:focus {
          outline: none;
          border-color: #58a6ff;
          box-shadow: 0 0 0 3px rgba(88,166,255,0.15);
        }
        .btn {
          background: #238636;
          color: #ffffff;
          border: 1px solid rgba(240,246,252,0.1);
          padding: 10px 20px;
          font-size: 14px;
          font-weight: 600;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.2s;
        }
        .btn:hover {
          background: #2ea043;
        }
        .btn-secondary {
          background: #21262d;
          color: #c9d1d9;
          border-color: #30363d;
        }
        .btn-secondary:hover {
          background: #30363d;
        }
        .actions-bar {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 24px;
          border-top: 1px solid #21262d;
          padding-top: 16px;
        }
      </style>
    `;

    this.shadowRoot.innerHTML = `
      ${style}
      <div class="header">
        <h1>${this.launchId ? 'Editar Lançamento' : 'Novo Lançamento'}</h1>
      </div>
      <form class="form" id="settings-form">
        <!-- BLOCO A -->
        <div class="block">
          <div class="block-header" onclick="this.nextElementSibling.classList.toggle('collapsed')">
            <span>Bloco A · Identidade do Lançamento</span>
            <span>▼</span>
          </div>
          <div class="block-body">
            <div class="field full">
              <label>Nome do Lançamento *</label>
              <input type="text" id="nome" required placeholder="Ex: LPSG Leo Tabari">
            </div>
            <div class="field">
              <label>Produto Principal *</label>
              <input type="text" id="produto_principal" required placeholder="Ex: Mentoria Turbo">
            </div>
            <div class="field">
              <label>Meta de Inscritos *</label>
              <input type="number" id="meta_inscritos" required>
            </div>
            <div class="field">
              <label>Data de Início *</label>
              <input type="date" id="data_inicio" required>
            </div>
            <div class="field">
              <label>Data de Fim *</label>
              <input type="date" id="data_fim" required>
            </div>
          </div>
        </div>

        <!-- BLOCO B -->
        <div class="block">
          <div class="block-header" onclick="this.nextElementSibling.classList.toggle('collapsed')">
            <span>Bloco B · Especialista</span>
            <span>▼</span>
          </div>
          <div class="block-body">
            <div class="field">
              <label>Nome do Especialista *</label>
              <input type="text" id="esp_nome" required>
            </div>
            <div class="field">
              <label>Instagram *</label>
              <input type="text" id="esp_instagram" placeholder="@user" required>
            </div>
            <div class="field full">
              <label>Bio Curta *</label>
              <textarea id="esp_bio" rows="3" required></textarea>
            </div>
          </div>
        </div>

        <!-- BLOCO C -->
        <div class="block">
          <div class="block-header" onclick="this.nextElementSibling.classList.toggle('collapsed')">
            <span>Bloco C · Detalhes do Evento</span>
            <span>▼</span>
          </div>
          <div class="block-body">
            <div class="field">
              <label>Nome do Evento *</label>
              <input type="text" id="ev_nome" required placeholder="Ex: Desafio LPSG">
            </div>
            <div class="field">
              <label>Sigla (3 letras) *</label>
              <input type="text" id="ev_sigla" max="3" required placeholder="Ex: LPS">
            </div>
            <div class="field full">
              <label>Promessa do Evento *</label>
              <input type="text" id="ev_promessa" required placeholder="Ex: Construa seu lançamento em 7 dias">
            </div>
            <div class="field">
              <label>Ticket do Ingresso (R$) *</label>
              <input type="text" id="ev_ticket" required value="62">
            </div>
          </div>
        </div>

        <!-- BLOCO D -->
        <div class="block">
          <div class="block-header" onclick="this.nextElementSibling.classList.toggle('collapsed')">
            <span>Bloco D · Links de Checkout</span>
            <span>▼</span>
          </div>
          <div class="block-body">
            <div class="field full">
              <label>URL de Checkout do Ingresso *</label>
              <input type="url" id="chk_ingresso" required placeholder="https://pay.hotmart.com/...">
            </div>
            <div class="field full">
              <label>URL de Checkout do Premium *</label>
              <input type="url" id="chk_premium" required placeholder="https://pay.hotmart.com/...">
            </div>
          </div>
        </div>

        <!-- BLOCO E -->
        <div class="block">
          <div class="block-header" onclick="this.nextElementSibling.classList.toggle('collapsed')">
            <span>Bloco E · Bônus Tsunami</span>
            <span>▼</span>
          </div>
          <div class="block-body">
            <div class="field full">
              <label>Onda 1 (Seg 7:00 a 7:10) *</label>
              <input type="text" id="tsu_1" required placeholder="Ex: Call individual com especialista">
            </div>
            <div class="field full">
              <label>Onda 2 (Seg 7:10 a 8:00) *</label>
              <input type="text" id="tsu_2" required placeholder="Ex: Grupo de WhatsApp VIP">
            </div>
            <div class="field full">
              <label>Onda 3 (Seg 8:00 a 23:59) *</label>
              <input type="text" id="tsu_3" required placeholder="Ex: Templates adicionais">
            </div>
          </div>
        </div>

        <!-- BLOCO F -->
        <div class="block">
          <div class="block-header" onclick="this.nextElementSibling.classList.toggle('collapsed')">
            <span>Bloco F · Design & Identidade Visual</span>
            <span>▼</span>
          </div>
          <div class="block-body">
            <div class="field">
              <label>Cor Primária (Hex) *</label>
              <input type="color" id="col_primaria" value="#FF5C00">
            </div>
            <div class="field">
              <label>Cor Secundária (Hex) *</label>
              <input type="color" id="col_secundaria" value="#FFB800">
            </div>
          </div>
        </div>

        <div class="actions-bar">
          <button type="button" class="btn btn-secondary" id="btn-cancel">Cancelar</button>
          <button type="submit" class="btn">Salvar Lançamento</button>
        </div>
      </form>
    `;

    this.fillFormFields();

    // Auto-save drafts on input change
    this.shadowRoot.querySelectorAll('input, textarea, select').forEach(el => {
      el.addEventListener('input', () => this.saveLocalDraft());
    });

    const form = this.shadowRoot.getElementById('settings-form');
    form.addEventListener('submit', (e) => this.saveLaunch(e));

    const btnCancel = this.shadowRoot.getElementById('btn-cancel');
    btnCancel.addEventListener('click', () => {
      window.EvoNexus.navigate(`/plugins-ui/${this.slug}/launches`);
    });
  }
}

customElements.define('lpsg-settings-page', LpsgSettingsPage);
