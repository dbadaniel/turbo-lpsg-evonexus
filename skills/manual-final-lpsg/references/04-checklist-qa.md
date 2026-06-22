# 04 · Checklist QA · validação antes de entregar

> Antes de declarar "manual final pronto", valide TUDO neste checklist.

## ✅ Conteúdo

- [ ] Nome do projeto correto em `<title>`, sidebar header, hero h1
- [ ] Nome do expert correto em todos os lugares
- [ ] Cor primária aplicada como `--accent`
- [ ] Cor primária derivada (dark, light, glow) calculada corretamente
- [ ] Datas formatadas em pt-BR (ex: "Segunda, 11 de maio")
- [ ] Tratamento plural ("mães", "tubos", etc) consistente
- [ ] Emoji de identidade aparece nos lugares certos (não pode ser genérico)
- [ ] Tom de voz do projeto refletido nos textos (formal/informal)

## ✅ Navegação

- [ ] 6 abas no sidebar todas funcionando
- [ ] Hash navigation (`#inicio`, `#entregaveis`, etc) abre página correta
- [ ] Active link na sidebar atualiza ao trocar de página
- [ ] Mobile · sidebar abre/fecha com toggle
- [ ] Botões "Próximo passo" levam à página correta

## ✅ Entregáveis

- [ ] 10 cards (1 por estrutura) presentes
- [ ] Cada card tem: 📁 onde · 🎯 o que é · ✅ o que fazer · 🚨 pendências (se houver) · 🔗 links · 📊 métricas
- [ ] Paths de arquivos REAIS (testar abrindo no terminal)
- [ ] Links externos abrem em nova aba (`target="_blank"`)
- [ ] Tabelas de métricas com valores numéricos corretos pro nicho

## ✅ Responsividade

- [ ] Desktop · 1280x800 sem layout quebrado
- [ ] Tablet · 768x1024 sidebar vira drawer
- [ ] Mobile · 375x667 grids viram coluna única
- [ ] Texto sem overflow horizontal em nenhuma largura

## ✅ Print-friendly

- [ ] Cmd+P · Print Preview limpo
- [ ] Sidebar e topbar escondidas em print
- [ ] Cores adaptadas pra impressão (se quiser tons claros)
- [ ] Cada seção em página separada (`page-break-after: always`)

## ✅ Performance

- [ ] HTML < 200 KB (idealmente)
- [ ] CSS embutido (sem CDN exceto Google Fonts)
- [ ] JS embutido
- [ ] Sem 404 em assets (imagens · fontes)

## ✅ Acessibilidade básica

- [ ] Headings hierárquicos (h1 > h2 > h3)
- [ ] Imagens com `alt` (mesmo se for emoji decorativo · `alt=""`)
- [ ] Contraste de cores ≥ AA (texto vs fundo)
- [ ] Foco visível em links e botões (outline laranja)
- [ ] `lang="pt-BR"` na tag `<html>`

## ✅ Funcionalidades

- [ ] Click nos cards de feature (na home) leva pra entregáveis correto
- [ ] Tabs em "Recursos" alternam corretamente
- [ ] Animações de scroll suaves
- [ ] Toast aparece e some ao copiar/baixar (se aplicável)

## ✅ Conteúdo personalizado vs genérico

> Critério: se 5 projetos diferentes gerarem o manual final, **eles devem parecer 5 projetos diferentes**, não 5 cópias com nome trocado.

- [ ] Avatar real do projeto (não "infoprodutor genérico")
- [ ] Big idea no hero (não slogan padrão)
- [ ] Cores que combinam com identidade
- [ ] Datas reais do projeto · não "DD/MM"
- [ ] Time real · não "Equipe X"
- [ ] Métricas-alvo calibradas pro nicho (não LPSG genérico)

## ✅ Self-contained

- [ ] Abre offline em qualquer browser
- [ ] Funciona em path local (`file://...`)
- [ ] Pode ser anexado em email
- [ ] Pode ser hospedado no Vercel/Netlify sem build

## ✅ Última validação · usabilidade

> Mostre o manual gerado pra **3 pessoas que não conhecem o projeto**. Pergunta:
>
> 1. "O que é esse projeto?" (deve responder em 30s)
> 2. "Onde estão os entregáveis?" (deve achar em 1 clique)
> 3. "Qual é o próximo passo?" (deve estar visível na home)
>
> Se 2 das 3 não souber responder · revisa.

---

## 🚀 Comando de validação automatizada

```bash
# Validação básica
test -f manual-execucao.html && echo "✅ existe"
size_kb=$(stat -f%z manual-execucao.html | awk '{print $1/1024}')
echo "Tamanho: $size_kb KB"
[ ${size_kb%.*} -lt 500 ] && echo "✅ < 500 KB"

# Testa abertura
open manual-execucao.html

# Imprime preview
# Cmd+P no browser
```

---

**Princípio final:** o manual final é **a coisa que sobra** do projeto. Se ele for ruim · todo o trabalho foi pra nada. Se for bom · cliente abre 6 meses depois e ainda consegue rodar nova edição.
