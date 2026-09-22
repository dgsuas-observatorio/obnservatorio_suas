# Observatório SUAS — Porto Velho

Site estático (HTML, CSS e JavaScript puro, **sem dependências, sem build**) que reúne
os painéis públicos do Power BI do Sistema Único de Assistência Social de Porto Velho.

Realização: **DGSUAS** — Diretoria de Gestão do SUAS e **DPEI** — Departamento de
Pesquisa, Estatística e Indicadores, da **SEMIAS** (Secretaria Municipal de Inclusão e
Assistência Social) / Prefeitura de Porto Velho.

Feito para o **GitHub Pages**: não precisa de servidor nem banco de dados.

---

## Estrutura

```
.
├── index.html               # Página única (barra + temas + área do painel)
├── 404.html                 # Página de erro do GitHub Pages
├── site.webmanifest         # Ícones e cores quando o site é "instalado" no celular
├── robots.txt
├── .nojekyll                # Publica os arquivos como estão
└── assets/
    ├── css/styles.css       # Todo o visual (tokens de cor no início do arquivo)
    ├── js/catalogo.js       # ⭐ LISTA DE PAINÉIS — o único arquivo do dia a dia
    ├── js/app.js            # Menu, busca, rotas, carregamento dos painéis
    ├── fonts/               # Fonte Inter, hospedada no próprio site (48 KB)
    └── img/                 # Brasão, símbolo, logo SEMIAS, favicons e imagem de compartilhamento
```

## Como incluir, trocar ou remover um painel

1. No Power BI Service: **Arquivo › Inserir relatório › Publicar na Web (público)**.
2. Copie o **link** (`https://app.powerbi.com/view?r=...`). Pode colar o `<iframe>`
   inteiro — o site extrai o endereço sozinho.
3. Abra `assets/js/catalogo.js` e cole no campo `url` do painel:

```js
{ titulo: "Programa Bolsa Família", url: "https://app.powerbi.com/view?r=..." },
```

A ordem no arquivo é a ordem no site. Menu, cartões, abas, busca e links são gerados
automaticamente. Para criar um tema novo, copie um bloco
`{ titulo, icone, eixo, cor, descricao, paineis: [...] }`.

> **Painel sem `url`** aparece normalmente no menu e abre uma tela avisando
> *"Painel ainda não publicado"*. Isso permite montar toda a estrutura do
> Observatório antes de os relatórios ficarem prontos.

Ícones disponíveis (listados também no topo do `catalogo.js`):
`i-radar`, `i-casa-coracao`, `i-escudo-pessoas`, `i-identidade`, `i-mao-moeda`,
`i-grupo`, `i-cesta`, `i-rede`, `i-mapa`, `i-grafico`, `i-capacitacao`,
`i-carteira`, `i-balanca`, `i-predio`, `i-lupa-dados`, `i-escudo-ok`.

Cores dos cartões: `"azul"`, `"verde"` ou `"amarelo"` — os três tons do brasão.

## Links compartilháveis

Cada painel tem endereço próprio:

```
https://SEU-USUARIO.github.io/SEU-REPOSITORIO/#/cadastro-unico/perfil-socioeconomico
https://SEU-USUARIO.github.io/SEU-REPOSITORIO/#/protecao-social-basica/cras-unidades-e-territorio
https://SEU-USUARIO.github.io/SEU-REPOSITORIO/#/territorio-e-vulnerabilidade
```

O endereço vem dos títulos, sem acentos. Abrir `#/tema` leva ao primeiro painel do tema.
**Renomear um painel no `catalogo.js` muda o link dele.**

## Navegação e atalhos

| Ação | Como |
|---|---|
| Abrir a busca | `Ctrl` + `K`, `⌘` + `K` ou `/` |
| Navegar nos resultados | `↑` `↓` · `Enter` abre · `Esc` fecha |
| Ver todos os temas | Botão **Temas** na barra superior (mega-menu) |
| Trocar de painel no mesmo tema | Abas logo abaixo do título |
| Tela cheia | Botão **Tela cheia** (ou `Esc` para sair) |
| Compartilhar | Botão **Copiar link** |

No celular e no tablet o menu vira uma gaveta, acionada pelo botão ☰.

## Publicar no GitHub Pages

1. Crie um repositório (ex.: `observatorio-suas`) e envie **todo o conteúdo desta pasta**
   para a raiz dele — inclusive o arquivo oculto `.nojekyll`.
   ```bash
   git init && git add . && git commit -m "Observatório SUAS"
   git branch -M main
   git remote add origin https://github.com/SEU-USUARIO/observatorio-suas.git
   git push -u origin main
   ```
2. **Settings › Pages › Source: Deploy from a branch**, branch `main`, pasta `/ (root)` › **Save**.
3. Em 1 a 2 minutos o site estará em `https://SEU-USUARIO.github.io/observatorio-suas/`.
4. (Opcional) Domínio próprio, como `observatoriosuas.portovelho.ro.gov.br`:
   *Settings › Pages › Custom domain*, com um registro CNAME no DNS da Prefeitura
   apontando para `SEU-USUARIO.github.io`. Marque **Enforce HTTPS**.

Depois de publicar, vale completar no `index.html` as tags `og:url` e `canonical`
com o endereço final.

## Testar no computador antes de publicar

Abrir o `index.html` com dois cliques já mostra o site (apenas a fonte Inter é trocada
pela do sistema, porque o navegador bloqueia fontes em arquivos locais). Para ver
exatamente como ficará publicado:

```bash
python -m http.server 8000
# acesse http://localhost:8000
```

## Identidade visual

| Elemento | Decisão |
|---|---|
| Paleta | Azul `#1c4b9e`/`#2358b8`, verde `#5cb85a` e amarelo `#ffd200`, extraídos do brasão da Prefeitura. |
| Fundo | Branco com cinza espacial (`#eceff5`), auroras suaves nas três cores da marca e malha técnica discreta. |
| Superfícies | *Glassmorphism*: vidro translúcido com `backdrop-filter`, reflexo superior, borda clara e sombra difusa. Tokens no início do `styles.css`. |
| Ícones | Sprite SVG próprio, traço 1,65, geometria simples e consistente — sem biblioteca externa. |
| Tipografia | Inter variável, hospedada no próprio site. |

Para mudar qualquer cor, edite apenas o bloco `:root` no início de `assets/css/styles.css`.

## Decisões técnicas

| Tema | Como foi feito |
|---|---|
| Menu | Barra superior de vidro com mega-menu de temas, abas por painel dentro do tema e paleta de comandos com busca — no lugar do antigo menu lateral com dropdowns. |
| Desempenho | Sem frameworks nem CDNs; fonte própria; conexão antecipada com o Power BI; até 3 painéis ficam em memória para troca instantânea (`MAX_PAINEIS_EM_CACHE` no `app.js`). |
| Histórico | Cada painel é um iframe próprio, então o botão **Voltar** do navegador volta ao painel anterior em vez de ficar preso dentro do Power BI. |
| Segurança | `Content-Security-Policy` só permite scripts e estilos do próprio site e iframes de `app.powerbi.com`; o catálogo rejeita links de outros domínios. Para liberar outro domínio, atualize `frame-src` no `index.html` **e** `HOSTS_PERMITIDOS` no `app.js`. |
| Acessibilidade | HTML semântico, "Pular para o conteúdo", `aria-expanded`/`aria-current`, foco visível, navegação completa por teclado, anúncio da troca de painel para leitores de tela, respeito a "reduzir movimento", "reduzir transparência" e alto contraste do Windows. Auditado com axe-core (WCAG 2.1 AA): **0 violações** na página inicial, no painel, no mega-menu e na busca. |
| Responsivo | Barra compacta, gaveta no lugar do mega-menu e botões só com ícone em telas pequenas; nada rola na horizontal. |
| Privacidade | Nenhum rastreador ou fonte externa; o único serviço de terceiros é o próprio Power BI. |

## Observação sobre o "Publicar na Web"

Painéis publicados com *Publicar na Web* ficam **públicos para qualquer pessoa na
internet**. Publique apenas dados agregados, sem dados pessoais, conforme a LGPD.
