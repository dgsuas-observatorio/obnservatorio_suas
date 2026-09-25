# Observatório SUAS — Porto Velho

Site estático (HTML, CSS e JavaScript puro, **sem dependências, sem build**) que reúne
os painéis públicos do Sistema Único de Assistência Social de Porto Velho, publicados
em **Tableau**.

- **Coleta, mineração e tratamento dos dados:** DGSUAS — Diretoria de Gestão do SUAS.
- **Armazenamento e estruturação, pipeline de dados, criação e publicação dos dashboards
  e manutenção deste site:** DPEI — Departamento de Pesquisa, Estatística e Indicadores.

Ambos na SEMIAS — Secretaria Municipal de Inclusão e Assistência Social.

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
    ├── css/styles.css       # Todo o visual (tokens no início do arquivo)
    ├── js/catalogo.js       # ⭐ CONFIGURAÇÃO E LISTA DE PAINÉIS — o arquivo do dia a dia
    ├── js/app.js            # Menu, busca, rotas, carregamento dos painéis
    ├── fonts/               # Fonte Inter, hospedada no próprio site (48 KB)
    └── img/                 # Brasão, símbolo, logo SEMIAS, favicons e imagem de compartilhamento
```

## Configuração rápida

No topo de `assets/js/catalogo.js`:

```js
window.OBSERVATORIO = {
  atualizadoEm: "setembro de 2026",          // vira o selo "Atualizado em …"
  contato: "dpei@portovelho.ro.gov.br"       // aparece no rodapé; deixe "" para ocultar
};
```

## Como publicar um painel do Tableau

1. No **Tableau Public**, abra a viz e clique em **Compartilhar** (ícone de seta no rodapé).
2. Copie o **Link** ou o código **Incorporar**.
3. Cole no campo `url` do painel em `assets/js/catalogo.js`:

```js
{ titulo: "Programa Bolsa Família", url: "https://public.tableau.com/app/profile/SEU.PERFIL/viz/Pasta/Folha" },
```

Os três formatos abaixo funcionam — o site converte sozinho para o endereço que abre
embutido, e o botão **Nova aba** usa a versão sem os parâmetros de incorporação:

```
https://public.tableau.com/app/profile/SEU.PERFIL/viz/Pasta/Folha
https://public.tableau.com/views/Pasta/Folha?:language=pt-BR
<iframe src="https://public.tableau.com/views/Pasta/Folha?:embed=true"></iframe>
```

**Tableau Cloud / Server** (`*.tableau.com`) também é aceito, desde que a viz seja
pública — painéis que exigem login não abrem para o cidadão.

Link de outro domínio é recusado por segurança, e o motivo aparece no console do
navegador. Para liberar um domínio novo, atualize `frame-src` no `index.html` **e**
`hostPermitido()` no `app.js`.

> **Painel sem `url`** continua no menu e abre a tela *"Painel ainda não publicado"*.
> Isso permite montar toda a estrutura antes de os relatórios ficarem prontos.

Ícones disponíveis (listados também no topo do `catalogo.js`):
`i-radar`, `i-casa`, `i-escudo`, `i-identidade`, `i-moeda`, `i-grupo`, `i-cesta`,
`i-rede`, `i-mapa`, `i-grafico`, `i-capacitacao`, `i-carteira`, `i-balanca`,
`i-predio`, `i-lupa-dados`, `i-banco`, `i-painel`, `i-funil`, `i-coleta`.

Cores dos cartões: `"azul"`, `"verde"` ou `"amarelo"` — os três tons do brasão.

## Links compartilháveis

Cada painel tem endereço próprio:

```
.../#/cadastro-unico/perfil-socioeconomico
.../#/protecao-social-basica/cras-unidades-e-territorio
.../#/territorio-e-vulnerabilidade
```

O endereço vem dos títulos, sem acentos. Abrir `#/tema` leva ao primeiro painel do tema.
**Renomear um painel no `catalogo.js` muda o link dele.**

## Navegação e atalhos

| Ação | Como |
|---|---|
| Abrir a busca | `Ctrl` + `K`, `⌘` + `K` ou `/` |
| Navegar nos resultados | `↑` `↓` · `Enter` abre · `Esc` fecha |
| Ver todos os temas | Botão **Temas** na barra superior |
| Trocar de painel no mesmo tema | Abas abaixo do título |
| Tela cheia | Botão **Tela cheia** (`Esc` sai) |
| Compartilhar | Botão **Copiar link** |

No celular e no tablet o menu vira uma gaveta, acionada pelo botão ☰.

## Publicar no GitHub Pages

1. Envie **todo o conteúdo desta pasta** para a raiz do repositório — inclusive o
   arquivo oculto `.nojekyll`.
2. **Settings › Pages › Source: Deploy from a branch**, branch `main`, pasta `/ (root)`.
3. O site fica em `https://SEU-USUARIO.github.io/SEU-REPOSITORIO/`.
4. Repositório privado não publica no plano gratuito: torne-o público em
   *Settings › General › Danger Zone › Change repository visibility*.

Se o endereço final mudar, atualize `<link rel="canonical">` e `og:url` no `index.html`.

### Limpeza do repositório

A versão publicada anteriormente tinha um arquivo solto chamado **`lll`** na raiz,
criado por engano. Pode apagar: no GitHub, abra o arquivo › ícone de lixeira ›
*Commit changes*.

### Se alguma imagem aparecer quebrada

Os logos da página não dependem mais de arquivos — estão embutidos no CSS. Se ainda
assim algo não carregar, confira se a pasta `assets/` subiu inteira: abra
`https://SEU-USUARIO.github.io/SEU-REPOSITORIO/assets/img/og-image.png` no navegador.
Se der 404, o envio pelo site do GitHub deixou arquivos para trás — refaça o upload
dessa pasta (*Add file › Upload files*, arrastando a pasta `assets` inteira) ou use
o terminal com `git add . && git commit && git push`, que nunca perde arquivo.

## Testar no computador antes de publicar

Abrir o `index.html` com dois cliques já mostra o site (apenas a fonte Inter é
substituída pela do sistema, porque o navegador bloqueia fontes em arquivos locais).
Para ver exatamente como ficará publicado:

```bash
python -m http.server 8000
# acesse http://localhost:8000
```

## Identidade visual

| Elemento | Decisão |
|---|---|
| Paleta | Azul `#1a4488`/`#2358b8`, verde `#5cb85a` e amarelo `#ffd200`, extraídos do brasão da Prefeitura. |
| Fundo | Branco com cinza espacial (`#e3e9f3`) e manchas de luz nas três cores da marca — é o que o vidro refrata. |
| Vidro | *Liquid glass* em quatro camadas: refração (`backdrop-filter`), lente na borda (desfoque extra com máscara radial), brilho especular e aro de 1px em gradiente com `mask-composite`. Técnica aberta, igual à usada pelas bibliotecas de liquid glass do 21st.dev (MIT). |
| Ícones | Conjunto linear (outline) próprio: grade de 24 px, traço 1,5, terminações arredondadas, sem preenchimento e sem biblioteca externa. |
| Tipografia | Inter variável, hospedada no próprio site. |
| Logos | Brasão, símbolo e marca da SEMIAS ficam **embutidos em base64** no início do `styles.css` (variáveis `--logo-simbolo`, `--logo-brasao`, `--logo-semias`). Assim nunca aparecem quebrados se um arquivo deixar de subir. Os PNGs continuam em `assets/img/` como referência. |
| Textura | Grão fino em SVG sobre o fundo, para as superfícies grandes não ficarem "chapadas". |

Para mudar qualquer cor ou a intensidade do vidro, edite apenas o bloco `:root` no
início de `assets/css/styles.css`.

## Decisões técnicas

| Tema | Como foi feito |
|---|---|
| Menu | Barra superior de vidro com mega-menu de temas, abas por painel dentro do tema e paleta de comandos com busca. |
| Desempenho | Sem frameworks nem CDNs; fonte própria; conexão antecipada com o Tableau; até 3 painéis ficam em memória para troca instantânea (`MAX_PAINEIS_EM_CACHE` no `app.js`). |
| Histórico | Cada painel é um iframe próprio, então **Voltar** volta ao painel anterior em vez de ficar preso dentro do Tableau. |
| Segurança | `Content-Security-Policy` só permite scripts e estilos do próprio site e iframes de `public.tableau.com` e `*.tableau.com`; o catálogo recusa links de outros domínios. |
| Acessibilidade | HTML semântico, "Pular para o conteúdo", `aria-expanded`/`aria-current`, foco visível e preso dentro dos diálogos, navegação completa por teclado, anúncio da troca de painel para leitores de tela, respeito a "reduzir movimento", "reduzir transparência" e alto contraste do Windows. Auditado com axe-core (WCAG 2.1 AA): **0 violações** na página inicial, no painel, no mega-menu e na busca. |
| Responsivo | Barra compacta, gaveta no lugar do mega-menu e botões só com ícone em telas pequenas; nada rola na horizontal. |
| Privacidade | Nenhum rastreador ou fonte externa; o único serviço de terceiros é o próprio Tableau. |

## Observação sobre painéis públicos

Uma viz publicada no Tableau Public fica **aberta para qualquer pessoa na internet**.
Publique apenas dados agregados, sem dados pessoais, conforme a LGPD.
