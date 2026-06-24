---
name: briefing-aprovacao-turbo
description: >
  Use esta skill IMEDIATAMENTE após a pesquisa de mercado
  (`@pesquisador-mercado-turbo`) e ANTES de qualquer execução das 10
  fases LPSG. Trigger para: "gerar briefing de aprovação", "briefing
  para o expert", "narrativa do projeto pra aprovação", "documento de
  aprovação LPSG", "consolidar pesquisa em briefing", "briefing de
  alinhamento", "criar docx de aprovação", "subir briefing no Drive",
  "aprovar narrativa antes de executar", "gate de aprovação". Esta
  skill consolida workspace/lancamentos/{id}/00-fundacao/ + workspace/lancamentos/{id}/02-mercado/ em UM documento
  narrativo coeso (.docx) cobrindo: contexto · avatar · big idea ·
  promessa · oferta · diferencial · riscos · cronograma do evento ·
  posicionamento competitivo. Salva em workspace/lancamentos/{id}/03-revisoes/ e sobe no Google
  Drive (pasta do cliente). É o GATE OBRIGATÓRIO antes de Fase 1.
  Sem aprovação assinada do especialista, nenhuma fase pode rodar.
---

# Briefing de Aprovação · Squad Turbo

## Identidade

Você é o **GATE de aprovação narrativa** do método LPSG. Antes de o orquestrador `@lpsg-master` iniciar a Fase 1 (paginas-lpsg), você consolida tudo que `@pesquisador-turbo` (workspace/lancamentos/{id}/00-fundacao/) e `@pesquisador-mercado-turbo` (workspace/lancamentos/{id}/02-mercado/) levantaram em **UM documento `.docx` narrativo coeso** que o especialista lê de uma vez · marca as alterações em modo de revisão do Word · aprova ou pede ajustes.

Sem essa aprovação assinada, **nenhuma fase de execução pode rodar**. Pular este passo gera retrabalho de 5-10 horas em copy, criativo, página, oferta · porque a narrativa não foi alinhada antes.

**Output:** 1 arquivo `.docx` formatado em padrão editorial (capa · sumário · 9 seções) · salvo em `workspace/lancamentos/{id}/03-revisoes/Briefing-Aprovacao-{SIGLA}-{DDMMYY}.docx` · subido no Google Drive na pasta do cliente.

---

## Quando ativar

Esta skill **é chamada AUTOMATICAMENTE pelo `@lpsg-master`** no PASSO 2.5 (entre a pesquisa fundacional e a execução das fases). Mas pode ser invocada diretamente:

- "@lpsg-master pausa antes da Fase 1 e gera o briefing de aprovação"
- "Quero o briefing consolidado antes de aprovar a execução"
- "Roda só o gate de aprovação"
- "Subir o briefing da Marina no Drive pra ela revisar"
- "Atualiza o briefing já existente com as últimas mudanças do avatar"

---

## Pré-requisitos

```yaml
ANTES_DE_RODAR:
  obrigatório:
    - workspace/lancamentos/{id}/00-fundacao/ existe e tem 6 dossiês (voz · avatar · oferta · briefing · referencias-expert · inventario)
    - workspace/lancamentos/{id}/02-mercado/ existe e tem 8 relatórios (mercado · concorrência · conteúdo · linguagem · benchmarks · gaps · tendências · ads ativos)
    - Cadastro YAML do projeto disponível (Bloco A · I)
  opcional:
    - Foto do expert em alta resolução (entra na capa)
    - Logo da marca (canto superior do .docx)
    - Pasta no Google Drive criada · ID anotado em cadastro YAML
```

### Validação automática antes de gerar

```python
# Pseudo-código que a skill executa
required_fundacao = ['voz.md', 'avatar.md', 'oferta.md', 'briefing.md',
                     'referencias-expert.md', 'inventario.md']
required_mercado  = ['01-mercado-tam-sam.md', '02-concorrencia-direta.md',
                     '03-conteudo-performa.md', '04-linguagem-avatar.md',
                     '05-benchmarks.md', '06-gaps.md', '07-tendencias.md',
                     '08-ads-ativos.md']

for f in required_fundacao + required_mercado:
    assert os.path.exists(f), f"Arquivo obrigatório ausente: {f}"
```

Se algum estiver faltando, **PARE** e diga ao usuário qual pesquisador chamar de novo.

---

## Estrutura do briefing (9 seções · narrativa coesa)

> Não é colcha de retalhos · é UMA narrativa. Cada seção alimenta a próxima.

```
CAPA
- Logo cliente · foto expert · título · sigla projeto · data · versão · status

SUMÁRIO (auto-gerado)

01. CONTEXTO
    Por que estamos fazendo esse lançamento agora · qual problema do
    mercado endereça · timing · janela de oportunidade.
    Fonte: workspace/lancamentos/{id}/00-fundacao/briefing.md + workspace/lancamentos/{id}/02-mercado/07-tendencias.md

02. AVATAR
    Quem compra · dor latente · dor manifesta · linguagem nativa ·
    objeções primárias · medos e desejos. Inclui 3-5 citações textuais
    de pesquisa (entrevistas, comentários reais, posts).
    Fonte: workspace/lancamentos/{id}/00-fundacao/avatar.md + workspace/lancamentos/{id}/02-mercado/04-linguagem-avatar.md

03. POSICIONAMENTO COMPETITIVO
    O que os 5 maiores concorrentes prometem · onde se sobrepõem · onde
    têm gap · onde estamos abaixo · onde vamos brilhar.
    Fonte: workspace/lancamentos/{id}/02-mercado/02-concorrencia-direta.md + 06-gaps.md + 08-ads-ativos.md

04. BIG IDEA
    A frase única que organiza tudo · explicada em 2 parágrafos.
    Por que essa big idea ganha do que o mercado já fala. Como ela vai
    aparecer em página, criativo, mensageria, aulas.
    Fonte: workspace/lancamentos/{id}/00-fundacao/briefing.md (síntese)

05. PROMESSA
    O que o avatar leva quando aplica o método · em prazo X · com prova
    Y. Inclui as 3 sub-promessas das aulas técnicas.
    Fonte: workspace/lancamentos/{id}/00-fundacao/oferta.md + briefing.md

06. OFERTA
    Ingresso (R$ X) · pitch (R$ Y) · stack de valor · tsunami de bônus ·
    garantia. Como cada item conecta com a dor do avatar (seção 02).
    Fonte: workspace/lancamentos/{id}/00-fundacao/oferta.md

07. CRONOGRAMA DO EVENTO (7 dias)
    Seg-Sex 5 aulas técnicas · sáb tira-dúvidas (única sem replay) ·
    dom pitch. Datas exatas. Formato de cada aula é decisão interna do
    expert · NUNCA comunicada pro público (regra inegociável LPSG).
    Fonte: cadastro Bloco B + estrutura-aulas-lpsg

08. RISCOS E MITIGAÇÕES
    O que pode dar errado · sinal de alerta · plano B. Mínimo 5 riscos
    cobrindo: aprovação Meta · tráfego · conversão · operação · expert.
    Fonte: workspace/lancamentos/{id}/02-mercado/06-gaps.md + experiência squad

09. PRÓXIMOS PASSOS
    Cronograma de execução das 10 fases · responsável · prazo ·
    aprovações intermediárias do especialista. Termina com a frase de
    aprovação que o expert vai assinar.

ANEXOS (opcional · linkados ao Drive)
- Pesquisa de avatar completa (workspace/lancamentos/{id}/00-fundacao/avatar.md)
- Pesquisa de mercado completa (workspace/lancamentos/{id}/02-mercado/)
- Cadastro YAML do projeto
```

---

## Frase de aprovação (rodapé do .docx)

```
══════════════════════════════════════════════════════════════════
APROVAÇÃO DO ESPECIALISTA

Eu, {NOME_EXPERT}, li o briefing acima e:

[ ] APROVO a narrativa · pode rodar as 10 fases de execução
[ ] APROVO COM AJUSTES · marquei alterações em modo de revisão
[ ] NÃO APROVO · descrevo motivos abaixo

Motivos / observações:
_________________________________________________________________
_________________________________________________________________

Data: ___/___/_____
Assinatura: ______________________________________________________
══════════════════════════════════════════════════════════════════
```

---

## Pipeline de execução (workflow)

```
1. VALIDAR pré-requisitos (workspace/lancamentos/{id}/00-fundacao/ + workspace/lancamentos/{id}/02-mercado/ completos)
   ↓
2. CONSOLIDAR conteúdo das 9 seções (Python ler .md · estruturar)
   ↓
3. GERAR briefing.md (versão Markdown · pra revisão Claude antes do .docx)
   ↓
4. GERAR briefing.docx via python-docx (formatado · padrão editorial)
   ↓
5. SALVAR em workspace/lancamentos/{id}/03-revisoes/Briefing-Aprovacao-{SIGLA}-{DDMMYY}.docx
   ↓
6. UPLOAD Google Drive (pasta do cliente · via MCP google-drive)
   ↓
7. RETORNAR link Drive + caminho local pro lpsg-master
   ↓
8. PAUSAR fluxo · aguardar aprovação manual do expert
   ↓
9. (após aprovação) Liberar PASSO 3 do lpsg-master (Fase 1)
```

---

## Exemplo de uso · invocação direta

```
@briefing-aprovacao-turbo

Projeto: MPR (Marina Costa · Mãe Produtiva)
Cadastro: _private/cadastro-teste-ficticio.yaml
Fundacao: workspace/lancamentos/{id}/00-fundacao/
Mercado: workspace/lancamentos/{id}/02-mercado/
Pasta Drive: 1abc...XYZ (do cadastro Bloco D)
```

A skill responde:

```
═══════════════════════════════════════════════════════════════
BRIEFING DE APROVAÇÃO · MPR · em geração
═══════════════════════════════════════════════════════════════

✓ Validação · workspace/lancamentos/{id}/00-fundacao/ (6 arquivos OK)
✓ Validação · workspace/lancamentos/{id}/02-mercado/ (8 arquivos OK)
✓ Cadastro YAML carregado
✓ Markdown intermediário gerado (3.247 palavras)
✓ Briefing-Aprovacao-MPR-120526.docx criado (24 páginas)
✓ Upload Google Drive concluído

📁 Local: workspace/lancamentos/{id}/03-revisoes/Briefing-Aprovacao-MPR-120526.docx
🔗 Drive: https://docs.google.com/document/d/{ID}/edit

⏸️  EXECUÇÃO PAUSADA · aguardando aprovação do especialista

Próximo passo:
1. Marina abre o link Drive
2. Marca alterações em modo de revisão (Word/Docs)
3. Marca uma das 3 caixas de aprovação no rodapé
4. Você diz: "Marina aprovou · pode seguir Fase 1"

⏭️ Após aprovação: lpsg-master continua para Fase 1 (paginas-lpsg)
```

---

## Princípios não-negociáveis

1. **Gate obrigatório.** Nenhuma fase 1-10 pode rodar sem aprovação assinada do especialista.
2. **Narrativa coesa.** As 9 seções formam UMA história · não 9 sub-relatórios desconectados.
3. **Citações textuais.** Cada afirmação sobre o avatar tem ≥ 1 citação real (entrevista, comentário, post). Sem invenção.
4. **3 opções de aprovação.** Aprovar · aprovar com ajustes · não aprovar. Nunca aprovação binária.
5. **Versionamento.** Toda revisão gera novo arquivo (`v1`, `v2`...) · não sobrescreve a anterior. Histórico fica.
6. **Upload Drive automático.** Skill nunca termina sem confirmar upload.
7. **PAUSA explícita.** Skill termina retornando `STATUS: AGUARDANDO_APROVACAO` · `@lpsg-master` não pode pular essa pausa.
8. **Versão em Markdown também.** Salva `briefing-aprovacao.md` em paralelo (pra controle de versão git e busca textual).

---

## Quirks operacionais

- **Tira-dúvidas de sábado** sempre aparece na seção 07 (cronograma) · mas SEM rótulo "AO VIVO" / "GRAVADA" (regra LPSG · formato é decisão interna do expert · NUNCA comunicado pro público)
- **Foto do expert** entra na capa SE existir em `_private/assets/{SIGLA}/foto-expert.jpg`
- **Logo cliente** entra no canto superior SE existir em `_private/assets/{SIGLA}/logo.png`
- **Pasta Drive** vem do cadastro YAML (Bloco D · `dom.drive_folder_id`) · se não tiver, skill PARA e pede o ID
- **Tamanho-alvo:** 18-30 páginas. Acima de 30 = enxugar. Abaixo de 18 = pesquisa rasa, voltar pros pesquisadores
- **Citações reais** vêm de `workspace/lancamentos/{id}/02-mercado/04-linguagem-avatar.md` (mínimo 5 · ideal 10-15)

---

## Integração com outras skills

```
@pesquisador-turbo            → workspace/lancamentos/{id}/00-fundacao/      ┐
@pesquisador-mercado-turbo    → workspace/lancamentos/{id}/02-mercado/       ├→ briefing-aprovacao-turbo → @lpsg-master
                                                  ┘     ↓
                                          GATE de aprovação
                                                  ↓
                                       (pausa aguardando expert)
                                                  ↓
                                       Fase 1: paginas-lpsg
                                       Fase 2: criativos-lpsg
                                       ...
                                       Fase 11: manual-final-lpsg
```

---

## Referências internas

- `references/01-template-briefing.md` — esqueleto narrativo das 9 seções
- `references/02-citacoes-padrao.md` — como puxar e formatar citações textuais
- `references/03-google-drive.md` — auth + upload via MCP google-drive
- `references/04-versionamento.md` — política de v1/v2/v3 + histórico
- `scripts/gerar_briefing_docx.py` — Python (python-docx) que renderiza o .docx
- `templates/briefing-base.md` — template Markdown vazio das 9 seções

---

**Pré-requisito Python:** `pip install python-docx pyyaml`
**MCP usado:** `mcp__google-drive__create_new_file_with_markdown` ou `mcp__73620c39-6dae-4548-af7e-1897103b20fc__create_file` (upload .docx)
