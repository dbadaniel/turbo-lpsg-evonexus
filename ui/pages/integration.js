class LpsgIntegrationPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.slug = this.getAttribute('slug') || 'turbo-lpsg';
    this.render();
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
        .section {
          background: #161b22;
          border: 1px solid #30363d;
          border-radius: 8px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        h2 {
          font-size: 18px;
          font-weight: 600;
          margin-top: 0;
          margin-bottom: 12px;
          color: #f0f6fc;
        }
        p {
          font-size: 14px;
          line-height: 1.5;
          color: #c9d1d9;
          margin-top: 0;
          margin-bottom: 16px;
        }
        code {
          background: #21262d;
          padding: 4px 8px;
          border-radius: 4px;
          font-family: monospace;
          font-size: 13px;
          color: #ff7b72;
        }
        .code-block {
          background: #0d1117;
          border: 1px solid #30363d;
          padding: 16px;
          border-radius: 6px;
          font-family: monospace;
          font-size: 13px;
          overflow-x: auto;
          color: #c9d1d9;
          white-space: pre-wrap;
          margin-bottom: 16px;
        }
        .steps {
          margin: 0;
          padding-left: 20px;
          font-size: 14px;
          color: #c9d1d9;
        }
        .steps li {
          margin-bottom: 12px;
        }
      </style>
    `;

    this.shadowRoot.innerHTML = `
      ${style}
      <div class="header">
        <h1>Integrações</h1>
      </div>
      
      <div class="section">
        <h2>Webhooks do Lançamento</h2>
        <p>Para enviar as vendas das plataformas de checkout (Hotmart, Kiwify, etc.) diretamente para o dashboard do EvoNexus:</p>
        <ol class="steps">
          <li>Cadastre o Webhook na sua plataforma de checkout preferida.</li>
          <li>Utilize a URL do endpoint de Webhooks do EvoNexus para o plugin:</li>
        </ol>
        <div class="code-block">http://SUA_URL_DO_NEXUS/api/plugins/${this.slug}/webhook</div>
        <p>Certifique-se de configurar os eventos para enviar <code>Compra Aprovada</code> e <code>Reembolsada</code>.</p>
      </div>

      <div class="section">
        <h2>n8n Automation Workflows</h2>
        <p>O método LPSG requer os 14 workflows de automação no n8n. Você pode importar os modelos JSON localizados na pasta <code>artifacts/</code> do plugin.</p>
        <ol class="steps">
          <li>Acesse seu painel do n8n.</li>
          <li>Crie um novo workflow e vá em <strong>Import from File</strong>.</li>
          <li>Selecione o arquivo de template correspondente ao estágio do lançamento (ex: captação, recuperação).</li>
          <li>Preencha as variáveis de ambiente com o token e as credenciais correspondentes.</li>
        </ol>
      </div>
    `;
  }
}

customElements.define('lpsg-integration-page', LpsgIntegrationPage);
