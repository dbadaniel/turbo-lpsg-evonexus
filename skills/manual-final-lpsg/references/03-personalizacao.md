# 03 · Personalização · YAML → HTML

> Como extrair dados do cadastro YAML e injetar no HTML do manual final.

## Mapeamento completo

| YAML path | HTML location | Exemplo |
|---|---|---|
| `projeto.nome` | `<title>`, hero h1, sidebar header | "LPSG Marina Costa" |
| `especialista.nome` | "Expert" em todos os lugares | "Marina Costa" |
| `especialista.tratamento` | tratamento plural usado | "mães" |
| `especialista.emoji` | emoji decorativo de identidade | "✨" |
| `especialista.foto_url` | avatar no card do time | URL ou placeholder |
| `nicho.principal` | descrição do projeto | "Empreendedorismo feminino" |
| `evento.nome` | nome do evento em todos lugares | "Desafio Mãe Produtiva" |
| `evento.sigla` | identifica pastas dos entregáveis | "MPR" |
| `evento.ticket` | "ingresso de R$ X" | "R$ 47" |
| `evento.data_a1` | cronograma · primeira aula | "2026-05-11" |
| `evento.data_pitch` | cronograma · pitch | "2026-05-17" |
| `produto.nome` | nome do produto principal | "Mãe Produtiva Acelerador" |
| `produto.ticket` | ticket do produto | "R$ 4.997" |
| `produto.prazo` | prazo do programa | "3 meses" |
| `dom.lp` | URL pra clicar/abrir | "lp.marinacosta.com.br" |
| `dom.ficha` | URL ficha | "mpr.marinacosta.com.br" |
| `dom.dash` | URL dashboard | "dashboard.marinacosta.com.br" |
| `time.expert.nome` | card do expert | "Marina Costa" |
| `time.trafego.nome` + email + wa | card de tráfego | ... |
| `time.copy.nome` | card de copy | ... |
| `time.design.nome` | card de design | ... |
| `time.sdr.nome` | card de SDR | ... |
| `time.cs.nome` | card de CS | ... |
| `cor.p` | `--accent` no CSS root | "#FF5C00" |
| `cor.estilo` | tom da estética | "Editorial · sofisticado" |
| `meta_edicao.insc_min` | meta inscritos no hero | "300" |
| `meta_edicao.vd_min` | meta vendas | "5" |
| `meta_edicao.fat` | meta faturamento | "R$ 75.000" |

## Pseudocódigo de geração

```python
import yaml
import re
from pathlib import Path

def gerar_manual_final(cadastro_path, project_root, output_path):
    # 1. Lê o cadastro
    cadastro = yaml.safe_load(open(cadastro_path).read())

    # 2. Lê o template HTML base (do manual inicial)
    template = open(Path(project_root) / '04-manual-de-uso/manual.html').read()

    # 3. Aplica substituições
    replacements = {
        '{NOME_PROJETO}': cadastro['projeto']['nome'],
        '{EXPERT}': cadastro['especialista']['nome'],
        '{TRATAMENTO}': cadastro['especialista']['tratamento'],
        '{EMOJI}': cadastro['especialista']['emoji'],
        '{NOME_EVENTO}': cadastro['evento']['nome'],
        '{SIGLA}': cadastro['evento']['sigla'],
        '{TICKET_INGRESSO}': cadastro['evento']['ticket'],
        '{DATA_AULA_1}': format_date(cadastro['evento']['data_a1']),
        '{DATA_PITCH}': format_date(cadastro['evento']['data_pitch']),
        '{NOME_PRODUTO}': cadastro['produto']['nome'],
        '{TICKET_PRODUTO}': cadastro['produto']['ticket'],
        '{COR_PRIMARIA}': cadastro['cor']['p'],
        # ... etc
    }

    # 4. Aplica cor primária derivada
    primary = cadastro['cor']['p']
    replacements.update(derive_colors(primary))

    # 5. Faz substituições
    for key, value in replacements.items():
        template = template.replace(key, str(value))

    # 6. Conta arquivos gerados
    n_arquivos = count_generated_files(project_root)
    template = template.replace('{N_ARQUIVOS}', str(n_arquivos))

    # 7. Lista pendências humanas
    pendencias = extract_pending_actions(project_root)
    template = template.replace('{N_PENDENCIAS}', str(len(pendencias)))

    # 8. Salva
    Path(output_path).write_text(template)
    print(f'✅ Manual gerado: {output_path}')

def derive_colors(hex_color):
    """Converte cor primária em variações."""
    # ... implementa darken, lighten, hex_to_rgb
    return {
        '#FF5C00': hex_color,           # primary
        '#E04E00': darken(hex_color, 0.15),
        '#FFEDE0': lighten(hex_color, 0.85),
        '255, 92, 0': hex_to_rgb(hex_color),
    }
```

## Renderização condicional

Algumas seções dependem de campos opcionais do cadastro:

| Campo opcional | Comportamento se ausente |
|---|---|
| `especialista.foto_url` | Mostrar placeholder cinza com inicial |
| `especialista.youtube` | Esconder card de YouTube |
| `time.cs.nome` | Esconder seção CS · adicionar nota "definir após primeira venda" |
| `tsunami.o2/o3` | Mostrar só ondas preenchidas |
| `cs.ativo: false` | Pintar Fase 10 como "futura" no status |

## Datas formatadas

```python
from datetime import datetime

def format_date(iso_date):
    """2026-05-11 → 'Segunda, 11 de maio'"""
    d = datetime.strptime(iso_date, '%Y-%m-%d')
    months_pt = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
                 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']
    days_pt = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo']
    return f'{days_pt[d.weekday()]}, {d.day} de {months_pt[d.month-1]}'

format_date('2026-05-11')
# → 'Segunda, 11 de maio'
```

## Preencher arquivos gerados (paths reais)

Após a execução das 10 fases, escaneie o project root e liste arquivos por estrutura:

```python
def list_files_per_structure(project_root, sigla):
    structures = {
        'paginas': f'03-paginas-{sigla}/',
        'criativos': f'04-criativos-{sigla}/',
        'aulas': f'05-aulas-{sigla}/',
        'oferta': f'06-oferta-{sigla}/',
        'mensageria': f'07-mensageria-{sigla}/',
        'trafego': f'08-trafego-{sigla}/',
        'automacoes': f'09-automacoes-{sigla}/',
        'dashboard': f'10-dashboard-{sigla}/',
        'operacao': f'11-operacao-{sigla}/',
        'cs': f'12-cs-{sigla}/',
    }
    files = {}
    for name, path in structures.items():
        full_path = Path(project_root) / path
        if full_path.exists():
            files[name] = list(full_path.rglob('*.md')) + list(full_path.rglob('*.json'))
        else:
            files[name] = []
    return files
```

Cada arquivo vira um `<li>` na seção "📁 Onde está" do entregável.
