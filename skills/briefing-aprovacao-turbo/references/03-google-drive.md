# 03 · Upload Google Drive · auth e workflow

> Como subir o briefing.docx pra pasta do cliente no Drive · usando o MCP Google Drive já conectado.

---

## MCP disponível

A sessão Claude tem acesso ao MCP Google Drive (configurado pelo usuário) com 6 tools:

```yaml
mcp__google-drive__create_file              # Cria arquivo (binário ou Google native)
mcp__google-drive__copy_file                # Duplica arquivo existente
mcp__google-drive__download_file_content    # Baixa conteúdo (base64)
mcp__google-drive__get_file_metadata        # Metadata de 1 arquivo
mcp__google-drive__get_file_permissions     # Permissões
mcp__google-drive__list_recent_files        # Lista arquivos recentes
mcp__google-drive__read_file_content        # Lê conteúdo (text/markdown)
mcp__google-drive__search_files             # Busca por query
```

**Tool a usar pra upload do briefing.docx:** `mcp__google-drive__create_file`

---

## Workflow completo

### 1. Localizar pasta do cliente

```python
# Pasta do cliente vem do cadastro YAML (Bloco D)
parent_folder_id = cadastro['dom']['drive_folder_id']

# Se não existir no cadastro · pesquisar
# Pasta deve seguir convenção: "LPSG · {Nome Expert} · {Sigla}"
```

Tool MCP:
```
mcp__google-drive__search_files(
    query="title contains 'LPSG · Marina Costa · MPR' and mimeType='application/vnd.google-apps.folder'"
)
```

### 2. Ler o .docx local em base64

```python
import base64
docx_path = "03-revisoes/Briefing-Aprovacao-MPR-120526.docx"
with open(docx_path, "rb") as f:
    content_b64 = base64.b64encode(f.read()).decode("utf-8")
```

### 3. Upload via MCP

Via tool `mcp__google-drive__create_file`:
```yaml
title: "Briefing-Aprovacao-MPR-120526.docx"
mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
content: "<base64 do passo 2>"
parentId: "<drive_folder_id da pasta do cliente>"
disableConversionToGoogleType: false   # default · converte pra Google Docs
                                        # SET TRUE se quiser manter como .docx puro
```

> **Decisão importante:** converter pra Google Docs (.gdoc) ou manter como .docx?
>
> - **Converter (recomendado)** · expert pode marcar revisões direto no Docs · sem baixar/subir · histórico de versões automático
> - **Manter .docx** · expert prefere Word desktop · marca revisões offline · faz upload manual depois

### 4. Permissões

Por padrão, arquivo herda permissões da pasta. Se a pasta já está compartilhada com o expert · ele já vê.

Se precisar dar acesso explícito:
```
mcp__google-drive__get_file_permissions(fileId="<id-criado>")
```

> Skill **NÃO modifica permissões** automaticamente (regra de segurança). Se precisar compartilhar com email novo · skill avisa o usuário · ele compartilha manualmente.

### 5. Retornar link para o usuário

```python
file_id = response['id']
view_link = f"https://docs.google.com/document/d/{file_id}/edit"
```

---

## Output esperado da skill

```
✅ Upload Drive concluído

📁 Local:    03-revisoes/Briefing-Aprovacao-MPR-120526.docx
🔗 Drive:    https://docs.google.com/document/d/1abc...XYZ/edit
📂 Pasta:    LPSG · Marina Costa · MPR (drive_folder_id: 1xyz...)
👤 Compartilhado com: marina@marinacosta.com.br (herdado da pasta)

Próximos passos:
1. Marina abre o link
2. Marca alterações em modo de revisão (Sugerir)
3. Marca caixa de aprovação no rodapé
4. Avisa squad: "Briefing aprovado · pode seguir Fase 1"
```

---

## Erros comuns

| Erro | Causa | Fix |
|---|---|---|
| `parentId not found` | drive_folder_id errado/expirado | Buscar pasta via `search_files` |
| `Insufficient permissions` | Conta MCP sem write na pasta | Compartilhar pasta com email da conta MCP |
| `Quota exceeded` | Drive cheio | Limpar lixeira ou usar conta corporativa |
| `File too large` | .docx > 5MB | Compactar imagens · simplificar template |

---

## Versionamento (v1, v2, v3)

Se o expert pediu ajustes e o briefing foi regenerado:

```yaml
NOMEACAO_VERSIONADA:
  v1:  "Briefing-Aprovacao-MPR-120526.docx"
  v2:  "Briefing-Aprovacao-MPR-120526-v2.docx"   # após ajustes da Marina
  v3:  "Briefing-Aprovacao-MPR-120526-v3.docx"   # após 2ª rodada
```

NUNCA sobrescrever o anterior · histórico fica preservado em `03-revisoes/`.

No Drive · cada versão é arquivo separado · expert acompanha o que mudou via Histórico de Revisões nativo do Google Docs.
