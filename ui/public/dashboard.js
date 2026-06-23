// public page Web Component for Turbo LPSG Sales Dashboard
class LpsgSalesDashboard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  async connectedCallback() {
    // Get the token from URL path. Route registered by host: /p/turbo-lpsg/dash/:token
    const pathParts = window.location.pathname.split('/');
    const token = pathParts[pathParts.length - 1];

    if (!token) {
      this.shadowRoot.innerHTML = '<div style="color: red; padding: 20px; font-family: sans-serif;">Token não fornecido na URL.</div>';
      return;
    }

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          height: 100vh;
          margin: 0;
          padding: 0;
        }
        iframe {
          width: 100%;
          height: 100%;
          border: none;
          display: block;
        }
      </style>
      <iframe src="/plugins/turbo-lpsg/ui/index.html?token=${encodeURIComponent(token)}"></iframe>
    `;
  }
}

customElements.define('lpsg-sales-dashboard', LpsgSalesDashboard);
