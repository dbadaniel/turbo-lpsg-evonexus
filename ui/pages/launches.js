class LpsgLaunchesPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.launches = [];
    this.selectedLaunchId = null;
    this.activeTab = 'milestones'; // 'milestones', 'roadmap', or 'dashboard'
  }

  async connectedCallback() {
    this.slug = this.getAttribute('slug') || 'turbo-lpsg';
    await this.fetchLaunches();

    // Parse URL params
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (id && this.launches.some(l => l.id === id)) {
      this.selectedLaunchId = id;
      this.activeTab = 'milestones';
    }

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
        this.selectedLaunchId = null;
        await this.fetchLaunches();
        this.render();
      } else {
        alert('Erro ao excluir lançamento.');
      }
    } catch (e) {
      console.error(e);
    }
  }

  async toggleStep(launch, stepIndex, checked) {
    const config = JSON.parse(launch.config_json || '{}');
    config.completed_steps = config.completed_steps || [];
    
    if (checked) {
      if (!config.completed_steps.includes(stepIndex)) {
        config.completed_steps.push(stepIndex);
      }
    } else {
      config.completed_steps = config.completed_steps.filter(s => s !== stepIndex);
    }

    const payload = {
      id: launch.id,
      cliente_id: launch.cliente_id,
      nome: launch.nome,
      produto_principal: launch.produto_principal,
      meta_inscritos: launch.meta_inscritos,
      data_inicio: launch.data_inicio,
      data_fim: launch.data_fim,
      config_json: JSON.stringify(config)
    };

    try {
      const res = await fetch(`/api/plugins/${this.slug}/data/plugin_lpsg_lancamentos`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        await this.fetchLaunches();
        // Keep UI updated
        const updatedLaunch = this.launches.find(l => l.id === launch.id);
        if (updatedLaunch && this.activeTab === 'milestones') {
          this.render();
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  calculateStatusAndCta(launch, config, completedSteps) {
    const blocks = {
      identidade: !!(launch.nome && launch.produto_principal && launch.meta_inscritos && launch.data_inicio && launch.data_fim),
      especialista: !!(config.especialista?.nome && config.especialista?.bio_curta && config.especialista?.instagram),
      evento: !!(config.evento?.nome && config.evento?.sigla && config.evento?.promessa && config.evento?.ticket_ingresso),
      checkout: !!(config.checkout?.ingresso_url && config.checkout?.premium_url),
      tsunami: !!(config.bonus_tsunami?.onda_1 && config.bonus_tsunami?.onda_2 && config.bonus_tsunami?.onda_3),
      design: !!(config.design?.cor_primaria && config.design?.cor_secundaria)
    };
    
    const filledCount = Object.values(blocks).filter(Boolean).length;
    const configPercent = Math.round((filledCount / 6) * 100);
    const configComplete = filledCount === 6;
    
    let status = 'Rascunho';
    let statusColor = '#e3b341'; // yellow
    let cta = 'Preencha todas as seções do formulário na aba "Editar Configurações" para habilitar a inteligência do Estrategista Turbo.';
    
    if (configComplete) {
      if (!completedSteps.includes(0)) {
        status = 'Pronto para I.A.';
        statusColor = '#58a6ff'; // blue
        cta = 'O cadastro está completo! Vá para a aba "Roteiro de Execução", copie o prompt do Gate Inicial e envie para o @estrategista-turbo.';
      } else if (!completedSteps.includes(1) || !completedSteps.includes(2) || !completedSteps.includes(3) || !completedSteps.includes(4) || !completedSteps.includes(5)) {
        status = 'Pesquisa Concluída';
        statusColor = '#a371f7'; // purple
        cta = 'Siga o Roadmap: execute a criação de Aulas, Mensageria, Ofertas e Criativos chamando o @estrategista-turbo.';
      } else if (!completedSteps.includes(6) || !completedSteps.includes(7)) {
        status = 'Funil de Vendas Pronto';
        statusColor = '#34d399'; // green
        cta = 'Seu funil estratégico está pronto. Próximo passo: ativar campanhas de tráfego e automações do n8n (Fases 6 e 7).';
      } else if (!completedSteps.includes(8) || !completedSteps.includes(9)) {
        status = 'Tráfego & Vendas Ativas';
        statusColor = '#00ffa7'; // neon green
        cta = 'O lançamento está no ar! Acompanhe as métricas de vendas no Dashboard e realize os debriefings diários.';
      } else {
        status = 'Pós-Venda';
        statusColor = '#22d3ee'; // cyan
        cta = 'Edição concluída com sucesso. Ative a Fase 10 (CS & Pós-Venda) para acompanhamento e fidelização dos alunos.';
      }
    }
    
    return { blocks, configPercent, configComplete, status, statusColor, cta };
  }

  slugify(text) {
    return (text || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9_-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  generateYamlConfig(launch, config) {
    const slug = this.slugify(launch.nome);
    return `slug: "${slug}"
id: "${launch.id || ''}"
nome: "${launch.nome || ''}"
produto_principal: "${launch.produto_principal || ''}"
meta_inscritos: ${launch.meta_inscritos || 0}
data_inicio: "${launch.data_inicio || ''}"
data_fim: "${launch.data_fim || ''}"
especialista:
  nome: "${config.especialista?.nome || ''}"
  bio_curta: "${config.especialista?.bio_curta || ''}"
  instagram: "${config.especialista?.instagram || ''}"
evento:
  nome: "${config.evento?.nome || ''}"
  sigla: "${config.evento?.sigla || ''}"
  promessa: "${config.evento?.promessa || ''}"
  ticket_ingresso: "${config.evento?.ticket_ingresso || '62'}"
checkout:
  ingresso_url: "${config.checkout?.ingresso_url || ''}"
  premium_url: "${config.checkout?.premium_url || ''}"
bonus_tsunami:
  onda_1: "${config.bonus_tsunami?.onda_1 || ''}"
  onda_2: "${config.bonus_tsunami?.onda_2 || ''}"
  onda_3: "${config.bonus_tsunami?.onda_3 || ''}"
design:
  cor_primaria: "${config.design?.cor_primaria || '#FF5C00'}"
  cor_secundaria: "${config.design?.cor_secundaria || '#FFB800'}"`;
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
          gap: 6px;
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
        .btn-primary {
          background: #1f6feb;
        }
        .btn-primary:hover {
          background: #388bfd;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
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
          cursor: pointer;
          transition: border-color 0.2s, transform 0.2s;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .card:hover {
          border-color: #388bfd;
          transform: translateY(-2px);
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
        .tabs {
          display: flex;
          gap: 8px;
          border-bottom: 1px solid #21262d;
          margin-bottom: 24px;
          padding-bottom: 8px;
        }
        .tab {
          background: none;
          border: none;
          color: #8b949e;
          font-size: 15px;
          font-weight: 500;
          padding: 8px 16px;
          cursor: pointer;
          border-radius: 6px;
        }
        .tab.active {
          color: #58a6ff;
          background: #1f242c;
        }
        .step-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .step-item {
          background: #161b22;
          border: 1px solid #30363d;
          border-radius: 8px;
          padding: 16px 20px;
        }
        .step-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
        }
        .step-title {
          font-weight: 600;
          font-size: 16px;
          color: #f0f6fc;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .step-num {
          background: #388bfd;
          color: white;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: bold;
        }
        .step-num.completed {
          background: #238636;
        }
        .step-body {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid #21262d;
          font-size: 14px;
          color: #c9d1d9;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .step-body.collapsed {
          display: none;
        }
        .code-cmd {
          background: #0d1117;
          border: 1px solid #30363d;
          padding: 10px 14px;
          border-radius: 6px;
          font-family: monospace;
          color: #79c0ff;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
        }
        .code-cmd:hover {
          border-color: #58a6ff;
        }
        .iframe-container {
          width: 100%;
          height: calc(100vh - 180px);
          border: none;
          background: #0d1117;
          border-radius: 8px;
          overflow: hidden;
        }
        .iframe-container iframe {
          width: 100%;
          height: 100%;
          border: none;
        }
        
        /* Milestones Styling */
        .milestones-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        @media(max-width: 900px) {
          .milestones-layout {
            grid-template-columns: 1fr;
          }
        }
        .milestones-card {
          background: #161b22;
          border: 1px solid #30363d;
          border-radius: 8px;
          padding: 20px;
        }
        .milestones-title {
          font-size: 18px;
          font-weight: 600;
          margin: 0 0 16px 0;
          color: #f0f6fc;
          border-bottom: 1px solid #21262d;
          padding-bottom: 10px;
        }
        .progress-bar-container {
          background: #21262d;
          border-radius: 10px;
          height: 16px;
          width: 100%;
          overflow: hidden;
          margin-bottom: 16px;
        }
        .progress-bar {
          background: linear-gradient(90deg, #FF5C00 0%, #388bfd 100%);
          height: 100%;
          transition: width 0.3s ease;
        }
        .milestone-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 14px;
        }
        .milestone-dot {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #21262d;
          border: 2px solid #30363d;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          color: #8b949e;
          font-weight: bold;
          margin-top: 2px;
        }
        .milestone-dot.active {
          background: #1f6feb;
          border-color: #388bfd;
          color: white;
        }
        .milestone-dot.completed {
          background: #238636;
          border-color: #2ea043;
          color: white;
        }
        .status-badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: bold;
          text-transform: uppercase;
        }
        .setup-block-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .setup-block-item {
          background: #0d1117;
          border: 1px solid #21262d;
          border-radius: 6px;
          padding: 10px 14px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
        }
        .status-indicator {
          font-weight: bold;
        }
        .status-indicator.complete {
          color: #238636;
        }
        .status-indicator.pending {
          color: #da3637;
        }
      </style>
    `;

    if (this.selectedLaunchId) {
      const launch = this.launches.find(l => l.id === this.selectedLaunchId);
      if (!launch) {
        this.selectedLaunchId = null;
        this.render();
        return;
      }
      
      const config = JSON.parse(launch.config_json || '{}');
      const completedSteps = config.completed_steps || [];

      // Calculate status metrics
      const { blocks, configPercent, configComplete, status, statusColor, cta } = this.calculateStatusAndCta(launch, config, completedSteps);

      // Define Milestones
      const milestones = [
        { name: 'Fundação & Briefing', desc: 'Gate 0 concluído', active: configComplete, completed: completedSteps.includes(0) },
        { name: 'Conteúdo & Aulas', desc: 'Roteiros e slides da Fase 1 prontos', active: completedSteps.includes(0), completed: completedSteps.includes(1) },
        { name: 'Funil de Vendas estruturado', desc: 'Fases 2 a 5 executadas', active: completedSteps.includes(1), completed: ['2','3','4','5'].every(idx => completedSteps.includes(parseInt(idx, 10))) },
        { name: 'Campanha Meta ASC no ar', desc: 'Tráfego da Fase 6 ativo', active: completedSteps.includes(5), completed: completedSteps.includes(6) },
        { name: 'Operação perpétua iniciada', desc: 'Automações n8n e SOPs (Fases 7-9)', active: completedSteps.includes(6), completed: ['7','8','9'].every(idx => completedSteps.includes(parseInt(idx, 10))) },
        { name: 'Pós-Venda & Suporte', desc: 'Fase 10 (CS) ativada pós-vendas', active: completedSteps.includes(9), completed: completedSteps.includes(10) }
      ];

      const steps = [
        {
          num: '0',
          title: 'Gate Inicial Obrigatório · Briefing & Pesquisa',
          aiTitle: 'O que o Estrategista Turbo faz:',
          aiDesc: 'Extrai os 6 dossiês internos da fundação (Avatar, Voz, Inventário, etc. via @pesquisador-turbo), analisa concorrência e benchmarks em 8 frentes externas (via @pesquisador-mercado-turbo) e consolida o briefing narrativo (.docx + Google Drive) para o Expert aprovar.',
          humanTitle: 'O que você (Humano) faz:',
          humanDesc: 'Revisa o briefing no Google Drive e digita no chat: "Briefing aprovado, pode seguir para a Fase 1".',
          cmd: `@estrategista-turbo crie meu LPSG.

Aqui está meu cadastro do projeto:

${this.generateYamlConfig(launch, config)}

Quero que você:
1. RODA O GATE INICIAL · pesquisa + briefing pra eu aprovar
2. PAUSA · aguarda minha aprovação do briefing`,
          checklist: ['@pesquisador-turbo extraiu fundação (00-fundacao/)', '@pesquisador-mercado-turbo extraiu mercado (02-mercado/)', 'Briefing aprovado e assinado pelo expert']
        },
        {
          num: '1',
          title: 'Fase 1 · Estrutura das Aulas (5+1)',
          aiTitle: 'O que o Estrategista Turbo faz:',
          aiDesc: 'Invoca a skill estrutura-aulas-lpsg, coordenando o @copywriter-turbo e o gerador-slides-turbo para desenhar a escada de crenças das 6 aulas e slides.',
          humanTitle: 'O que você (Humano) faz:',
          humanDesc: 'Revisa os roteiros de slides gerados e grava as aulas (padrão: pré-gravar seg-sex).',
          cmd: '@estrategista-turbo crie meu LPSG. Use a skill estrutura-aulas-lpsg.',
          checklist: ['Escada de crenças das 6 aulas estruturada', 'Slides PPTX finalizados', 'Aulas pré-gravadas']
        },
        {
          num: '2',
          title: 'Fase 2 · Mensageria (WhatsApp & ManyChat)',
          aiTitle: 'O que o Estrategista Turbo faz:',
          aiDesc: 'Invoca a skill mensageria-lpsg, gerando copies e 19 templates Utility para WhatsApp Meta respeitando o cap diário 4+4.',
          humanTitle: 'O que você (Humano) faz:',
          humanDesc: 'Submete os 19 templates no WhatsApp Business Manager da Meta e grava os 4 áudios de aquecimento.',
          cmd: '@estrategista-turbo crie meu LPSG. Use a skill mensageria-lpsg.',
          checklist: ['19 templates submetidos e aprovados na Meta API', '4 áudios de aquecimento gravados pelo expert', 'ManyChat conectado']
        },
        {
          num: '3',
          title: 'Fase 3 · Oferta Irrecusável',
          aiTitle: 'O que o Estrategista Turbo faz:',
          aiDesc: 'Invoca a skill oferta-lpsg, estruturando o empilhamento de bônus (Stack de Valor >= 1.5x o ticket), condições do Tsunami (segunda-feira) e garantias.',
          humanTitle: 'O que você (Humano) faz:',
          humanDesc: 'Valida a oferta e configura os checkouts de ingresso e premium na Hotmart.',
          cmd: '@estrategista-turbo crie meu LPSG. Use a skill oferta-lpsg.',
          checklist: ['Bônus do tsunami configurados', 'Garantias validadas', 'Checkouts ativos na Hotmart']
        },
        {
          num: '4',
          title: 'Fase 4 · Criativos de Alta Conversão',
          aiTitle: 'O que o Estrategista Turbo faz:',
          aiDesc: 'Invoca a skill criativos-lpsg, orquestrando roteiros para 15 anúncios (5 vídeos, 5 estáticos, 5 carrosséis) sob direção de @diretor-criativo-turbo.',
          humanTitle: 'O que você (Humano) faz:',
          humanDesc: 'Expert grava os 5 vídeos (9:16 vertical) e o designer monta os criativos estáticos/carrosséis.',
          cmd: '@estrategista-turbo crie meu LPSG. Use a skill criativos-lpsg.',
          checklist: ['5 anúncios em vídeo gravados', '5 criativos estáticos prontos', '5 carrosséis finalizados']
        },
        {
          num: '5',
          title: 'Fase 5 · Landing Pages & Ficha de Interesse',
          aiTitle: 'O que o Estrategista Turbo faz:',
          aiDesc: 'Invoca a skill paginas-lpsg, gerando o projeto Next.js 14, 5 variações de páginas e a página de qualificação de 11 etapas.',
          humanTitle: 'O que você (Humano) faz:',
          humanDesc: 'Sobe o código na Vercel e conecta o domínio principal (`lp.seudominio.com`).',
          cmd: '@estrategista-turbo crie meu LPSG. Use a skill paginas-lpsg.',
          checklist: ['Next.js 14 hospedado na Vercel', 'Página /ficha-de-interesse no ar', 'Tags Pixel/GTM validadas']
        },
        {
          num: '6',
          title: 'Fase 6 · Campanhas de Tráfego',
          aiTitle: 'O que o Estrategista Turbo faz:',
          aiDesc: 'Invoca a skill trafego-lpsg, montando a campanha Advantage+ Shopping (ASC) com R$100/dia e configurando a engine analítica diária.',
          humanTitle: 'O que você (Humano) faz:',
          humanDesc: 'Cria a campanha no Ads Manager, vincula os criativos e ativa.',
          cmd: '@estrategista-turbo crie meu LPSG. Use a skill trafego-lpsg.',
          checklist: ['Campanha ASC configurada', 'CAPI e Pixel disparando', 'Campanha de tráfego ativa']
        },
        {
          num: '7',
          title: 'Fase 7 · Automações & Webhooks',
          aiTitle: 'O que o Estrategista Turbo faz:',
          aiDesc: 'Invoca a skill automacoes-lpsg, estruturando os JSONs dos 14 workflows para n8n.',
          humanTitle: 'O que você (Humano) faz:',
          humanDesc: 'Importa os JSONs no n8n, configura conexões e executa uma compra teste de R$1.',
          cmd: '@estrategista-turbo crie meu LPSG. Use a skill automacoes-lpsg.',
          checklist: ['14 workflows importados e ativos', 'Tokens e ManyChat integrados', 'Webhook da Hotmart testado']
        },
        {
          num: '8',
          title: 'Fase 8 · Dashboard de Métricas',
          aiTitle: 'O que o Estrategista Turbo faz:',
          aiDesc: 'Invoca a skill dashboard-lpsg, gerando a estrutura de acompanhamento de KPIs de 11 módulos.',
          humanTitle: 'O que você (Humano) faz:',
          humanDesc: 'Hospeda o painel na Vercel, configura chaves de API do Sheets/Meta/Hotmart.',
          checklist: ['Dashboard online na Vercel', 'Gráficos lendo fontes de dados em tempo real']
        },
        {
          num: '9',
          title: 'Fase 9 · Operação Semanal (RACI/SOPs)',
          aiTitle: 'O que o Estrategista Turbo faz:',
          aiDesc: 'Invoca a skill operacao-lpsg, descrevendo a matriz RACI de responsabilidades, agenda semanal e 12 SOPs.',
          humanTitle: 'O que você (Humano) faz:',
          humanDesc: 'Alinha as obrigações operacionais e ferramentas de comunicação (Slack/Telegram) com a equipe.',
          checklist: ['Papéis do time definidos no RACI', 'SOPs lidos e delegados', 'Canal de comunicação criado']
        },
        {
          num: '10',
          title: 'Fase 10 · CS & Pós-Venda',
          aiTitle: 'O que o Estrategista Turbo faz:',
          aiDesc: 'Invoca a skill cs-lpsg, modelando o programa de fidelização de 90 dias, onboarding D0-D7 e pesquisas de NPS.',
          humanTitle: 'O que você (Humano) faz:',
          humanDesc: 'Aloca o suporte de CS para as mensagens de onboarding e agenda as transmissões de tirar dúvidas.',
          cmd: '@estrategista-turbo crie meu LPSG. Use a skill cs-lpsg.',
          checklist: ['Fluxos de onboarding ativos', 'Planilha de CS atualizada', 'Live de CS agendada']
        }
      ];

      const milestonesHtml = `
        <div class="milestones-layout">
          <!-- Left Column: Status and Config Progress -->
          <div style="display: flex; flex-direction: column; gap: 20px;">
            <div class="milestones-card">
              <h2 class="milestones-title">Estado do Lançamento</h2>
              <div style="margin-bottom: 16px;">
                <span class="status-badge" style="background: ${statusColor}22; color: ${statusColor}; border: 1px solid ${statusColor}44;">
                  ${status}
                </span>
              </div>
              <p style="font-size: 14px; line-height: 1.5; color: #8b949e; margin: 0;">
                <strong>Próximo Passo Recomendado:</strong><br>
                ${cta}
              </p>
            </div>
            
            <div class="milestones-card">
              <h2 class="milestones-title">Progresso do Cadastro (${configPercent}%)</h2>
              <div class="progress-bar-container">
                <div class="progress-bar" style="width: ${configPercent}%;"></div>
              </div>
              <div class="setup-block-grid">
                <div class="setup-block-item">
                  <span>Bloco A: Identidade</span>
                  <span class="status-indicator ${blocks.identidade ? 'complete' : 'pending'}">${blocks.identidade ? 'Preenchido' : 'Pendente'}</span>
                </div>
                <div class="setup-block-item">
                  <span>Bloco B: Especialista</span>
                  <span class="status-indicator ${blocks.especialista ? 'complete' : 'pending'}">${blocks.especialista ? 'Preenchido' : 'Pendente'}</span>
                </div>
                <div class="setup-block-item">
                  <span>Bloco C: Evento</span>
                  <span class="status-indicator ${blocks.evento ? 'complete' : 'pending'}">${blocks.evento ? 'Preenchido' : 'Pendente'}</span>
                </div>
                <div class="setup-block-item">
                  <span>Bloco D: Checkouts</span>
                  <span class="status-indicator ${blocks.checkout ? 'complete' : 'pending'}">${blocks.checkout ? 'Preenchido' : 'Pendente'}</span>
                </div>
                <div class="setup-block-item">
                  <span>Bloco E: Bônus Tsunami</span>
                  <span class="status-indicator ${blocks.tsunami ? 'complete' : 'pending'}">${blocks.tsunami ? 'Preenchido' : 'Pendente'}</span>
                </div>
                <div class="setup-block-item">
                  <span>Bloco F: Cores</span>
                  <span class="status-indicator ${blocks.design ? 'complete' : 'pending'}">${blocks.design ? 'Preenchido' : 'Pendente'}</span>
                </div>
              </div>
              ${!configComplete ? `
                <div style="margin-top: 16px; text-align: right;">
                  <button class="btn btn-primary" id="btn-complete-setup">Completar Cadastro</button>
                </div>
              ` : ''}
            </div>
          </div>
          
          <!-- Right Column: Timeline / Milestones -->
          <div class="milestones-card">
            <h2 class="milestones-title">Marcos Alcançados</h2>
            <div style="display: flex; flex-direction: column; gap: 10px;">
              ${milestones.map((m, idx) => `
                <div class="milestone-item">
                  <div class="milestone-dot ${m.completed ? 'completed' : m.active ? 'active' : ''}">
                    ${m.completed ? '✓' : idx + 1}
                  </div>
                  <div>
                    <strong style="color: ${m.completed ? '#f0f6fc' : '#8b949e'}; font-size: 14px;">${m.name}</strong>
                    <div style="font-size: 12px; color: #667085;">${m.desc}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;

      const roadmapHtml = `
        <div class="step-list">
          ${steps.map((s, idx) => {
            const isCompleted = completedSteps.includes(idx);
            return `
              <div class="step-item" id="step-card-${idx}">
                <div class="step-header">
                  <div class="step-title">
                    <span class="step-num ${isCompleted ? 'completed' : ''}">${isCompleted ? '✓' : s.num}</span>
                    <span>${s.title}</span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <label style="display: flex; align-items: center; gap: 6px; cursor: pointer;">
                      <input type="checkbox" class="chk-completed" data-idx="${idx}" ${isCompleted ? 'checked' : ''}>
                      <span>Concluído</span>
                    </label>
                    <span class="toggle-arrow" style="cursor: pointer;">▼</span>
                  </div>
                </div>
                <div class="step-body collapsed">
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 12px; background: #0d1117; padding: 12px; border-radius: 6px; border: 1px solid #21262d;">
                    <div>
                      <strong style="color: #58a6ff; font-size: 13px; display: block; margin-bottom: 4px;">${s.aiTitle}</strong>
                      <p style="font-size: 12px; line-height: 1.4; color: #8b949e; margin: 0;">${s.aiDesc}</p>
                    </div>
                    <div>
                      <strong style="color: #ff9800; font-size: 13px; display: block; margin-bottom: 4px;">${s.humanTitle}</strong>
                      <p style="font-size: 12px; line-height: 1.4; color: #8b949e; margin: 0;">${s.humanDesc}</p>
                    </div>
                  </div>
                  
                  ${s.cmd ? `
                    <div style="margin-top: 16px; background: #0d1117; border: 1px solid #388bfd33; padding: 16px; border-radius: 8px; display: flex; flex-direction: column; gap: 12px; align-items: flex-start;">
                      <div>
                        <strong style="color: #f0f6fc; font-size: 14px; display: block; margin-bottom: 4px;">🚀 Pronto para iniciar esta fase com a I.A.?</strong>
                        <p style="font-size: 12.5px; line-height: 1.4; color: #8b949e; margin: 0;">
                          Ao clicar no botão abaixo, a mensagem com as configurações deste lançamento será copiada automaticamente para a sua área de transferência e você será levado diretamente para o chat com o <strong>@estrategista-turbo</strong>. Basta colar a mensagem lá para iniciar o trabalho!
                        </p>
                      </div>
                      <button class="btn btn-primary btn-run-agent" data-cmd="${s.cmd.replace(/"/g, '&quot;')}" style="gap: 8px; font-size: 13px; padding: 8px 16px;">
                        <span>Iniciar Fase no Estrategista</span>
                      </button>
                    </div>
                  ` : ''}
                  <div style="margin-top: 12px;">
                    <label style="font-size: 12px; font-weight: bold; display: block; margin-bottom: 6px;">Checklist da Fase:</label>
                    ${s.checklist.map(item => `
                      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px; font-size: 13px;">
                        <input type="checkbox" disabled checked>
                        <span style="color: #8b949e;">${item}</span>
                      </div>
                    `).join('')}
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;

      const dashboardHtml = `
        <div class="iframe-container">
          <iframe src="/plugins/turbo-lpsg/ui/index.html?token=${encodeURIComponent(this.selectedLaunchId)}"></iframe>
        </div>
      `;

      const integrationHtml = `
        <div style="display: flex; flex-direction: column; gap: 20px;">
          <div class="milestones-card">
            <h2 class="milestones-title">Webhooks do Lançamento</h2>
            <p style="font-size: 14px; line-height: 1.5; color: #c9d1d9; margin-top: 0; margin-bottom: 16px;">
              Para enviar as vendas das plataformas de checkout (Hotmart, Kiwify, etc.) diretamente para o dashboard do EvoNexus:
            </p>
            <ol style="margin: 0; padding-left: 20px; font-size: 14px; color: #c9d1d9;">
              <li style="margin-bottom: 12px;">Cadastre o Webhook na sua plataforma de checkout preferida.</li>
              <li style="margin-bottom: 12px;">Utilize a URL do endpoint de Webhooks do EvoNexus para o lançamento atual:</li>
            </ol>
            <div style="background: #0d1117; border: 1px solid #30363d; padding: 16px; border-radius: 6px; font-family: monospace; font-size: 13px; overflow-x: auto; color: #ff7b72; white-space: pre-wrap; margin-bottom: 16px;">
              http://${window.location.host}/api/plugins/${this.slug}/webhook
            </div>
            <p style="font-size: 13px; color: #8b949e; margin: 0;">
              Certifique-se de configurar os eventos para enviar <code>Compra Aprovada</code> e <code>Reembolsada</code>.
            </p>
          </div>

          <div class="milestones-card">
            <h2 class="milestones-title">Automações no n8n (14 Workflows)</h2>
            <p style="font-size: 14px; line-height: 1.5; color: #c9d1d9; margin-top: 0; margin-bottom: 16px;">
              O método LPSG requer os 14 workflows de automação no n8n. Você pode importar os modelos JSON localizados na pasta <code>artifacts/</code> do plugin.
            </p>
            <ol style="margin: 0; padding-left: 20px; font-size: 14px; color: #c9d1d9;">
              <li style="margin-bottom: 12px;">Acesse seu painel do n8n.</li>
              <li style="margin-bottom: 12px;">Crie um novo workflow e vá em <strong>Import from File</strong>.</li>
              <li style="margin-bottom: 12px;">Selecione o arquivo de template correspondente ao estágio do lançamento (ex: captação, recuperação).</li>
              <li style="margin-bottom: 12px;">Preencha as variáveis de ambiente com o token e as credenciais correspondentes.</li>
            </ol>
          </div>
        </div>
      `;

      this.shadowRoot.innerHTML = `
        ${style}
        <div class="header">
          <div style="display: flex; align-items: center; gap: 12px;">
            <button class="btn btn-secondary" id="btn-back">← Voltar</button>
            <h1>Lançamento: ${launch.nome}</h1>
          </div>
        </div>
        <div class="tabs">
          <button class="tab ${this.activeTab === 'milestones' ? 'active' : ''}" id="tab-milestones">Visão Geral & Marcos</button>
          <button class="tab ${this.activeTab === 'roadmap' ? 'active' : ''}" id="tab-roadmap">Roteiro de Execução (Roadmap)</button>
          <button class="tab ${this.activeTab === 'integration' ? 'active' : ''}" id="tab-integration">Integração</button>
          <button class="tab ${this.activeTab === 'dashboard' ? 'active' : ''}" id="tab-dashboard">Dashboard de Métricas</button>
        </div>
        ${this.activeTab === 'milestones' ? milestonesHtml : this.activeTab === 'roadmap' ? roadmapHtml : this.activeTab === 'integration' ? integrationHtml : dashboardHtml}
      `;

      // Detail events
      this.shadowRoot.getElementById('btn-back').addEventListener('click', () => {
        this.selectedLaunchId = null;
        this.render();
      });

      this.shadowRoot.getElementById('tab-milestones').addEventListener('click', () => {
        this.activeTab = 'milestones';
        this.render();
      });

      this.shadowRoot.getElementById('tab-roadmap').addEventListener('click', () => {
        this.activeTab = 'roadmap';
        this.render();
      });

      this.shadowRoot.getElementById('tab-integration')?.addEventListener('click', () => {
        this.activeTab = 'integration';
        this.render();
      });

      this.shadowRoot.getElementById('tab-dashboard').addEventListener('click', () => {
        this.activeTab = 'dashboard';
        this.render();
      });

      // Complete setup button event
      const btnCompleteSetup = this.shadowRoot.getElementById('btn-complete-setup');
      if (btnCompleteSetup) {
        btnCompleteSetup.addEventListener('click', () => {
          window.EvoNexus.navigate(`/plugins-ui/${this.slug}/settings?id=${this.selectedLaunchId}`);
        });
      }

      this.shadowRoot.querySelectorAll('.step-header').forEach((el, index) => {
        el.querySelector('.step-title').addEventListener('click', () => {
          const body = el.nextElementSibling;
          body.classList.toggle('collapsed');
        });
        el.querySelector('.toggle-arrow').addEventListener('click', () => {
          const body = el.nextElementSibling;
          body.classList.toggle('collapsed');
        });
      });

      this.shadowRoot.querySelectorAll('.chk-completed').forEach(el => {
        el.addEventListener('change', (e) => {
          const idx = parseInt(e.target.getAttribute('data-idx'), 10);
          this.toggleStep(launch, idx, e.target.checked);
          
          // Visual feedback
          const numSpan = this.shadowRoot.querySelector(`#step-card-${idx} .step-num`);
          if (e.target.checked) {
            numSpan.classList.add('completed');
            numSpan.textContent = '✓';
          } else {
            numSpan.classList.remove('completed');
            numSpan.textContent = idx.toString();
          }
        });
      });

      this.shadowRoot.querySelectorAll('.btn-run-agent').forEach(el => {
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          const cmd = el.getAttribute('data-cmd');
          const originalContent = el.innerHTML;
          
          navigator.clipboard.writeText(cmd).then(() => {
            el.style.backgroundColor = '#238636';
            el.style.borderColor = '#2ea043';
            el.innerHTML = '<span>✓ Copiado! Redirecionando...</span>';
            
            setTimeout(() => {
              el.innerHTML = originalContent;
              el.style.backgroundColor = '';
              el.style.borderColor = '';
              
              // Robust redirect with fallback
              window.EvoNexus.navigate('/agents/plugin-turbo-lpsg-estrategista-turbo');
              setTimeout(() => {
                if (window.location.pathname !== '/agents/plugin-turbo-lpsg-estrategista-turbo') {
                  window.location.href = '/agents/plugin-turbo-lpsg-estrategista-turbo';
                }
              }, 150);
            }, 1000);
          }).catch(err => {
            console.error('Failed to copy: ', err);
            window.EvoNexus.navigate('/agents/plugin-turbo-lpsg-estrategista-turbo');
            setTimeout(() => {
              if (window.location.pathname !== '/agents/plugin-turbo-lpsg-estrategista-turbo') {
                window.location.href = '/agents/plugin-turbo-lpsg-estrategista-turbo';
              }
            }, 150);
          });
        });
      });

      return;
    }

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
            const dataInicio = l.data_inicio ? new Date(l.data_inicio).toLocaleDateString('pt-BR') : '—';
            const dataFim = l.data_fim ? new Date(l.data_fim).toLocaleDateString('pt-BR') : '—';
            return `
              <div class="card" data-id="${l.id}">
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
                <div class="actions" style="margin-top: 12px; display: flex; gap: 8px;">
                  <button class="btn btn-secondary btn-edit" data-id="${l.id}">Editar Configurações</button>
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

    // List events
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

    this.shadowRoot.querySelectorAll('.card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.actions')) return;
        const id = card.getAttribute('data-id');
        this.selectedLaunchId = id;
        this.activeTab = 'milestones';
        this.render();
      });
    });

    this.shadowRoot.querySelectorAll('.btn-edit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        window.EvoNexus.navigate(`/plugins-ui/${this.slug}/settings?id=${id}`);
      });
    });

    this.shadowRoot.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        this.deleteLaunch(id);
      });
    });
  }
}

customElements.define('lpsg-launches-page', LpsgLaunchesPage);
